import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScatterplotLayer, PolygonLayer } from "@deck.gl/layers/typed";
import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";
import { addLayer, removeLayer, updateLayer } from "@carto/react-redux";

// Helper function to create polygon coordinates around a center point
const createPolygonFromCenter = (centerLng: number, centerLat: number, sizeKm: number = 5, sides: number = 6) => {
  const radius = sizeKm / 111; // Approximate km to degrees
  const coordinates: [number, number][] = [];
  
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides;
    const lng = centerLng + radius * Math.cos(angle);
    const lat = centerLat + radius * Math.sin(angle);
    coordinates.push([lng, lat]);
  }
  // Close the polygon
  coordinates.push(coordinates[0]);
  
  return coordinates;
};

// West Africa gold mining regions data generator
const generateWestAfricaMockData = () => {
  // Ghana regions
  const ghanaRegions = [
    { name: "Obuasi", lat: 6.2, lng: -1.68, city: "Obuasi", region: "Ashanti", country: "Ghana" },
    { name: "Tarkwa", lat: 5.3, lng: -2.0, city: "Tarkwa", region: "Western", country: "Ghana" },
    { name: "Prestea", lat: 5.43, lng: -2.15, city: "Prestea", region: "Western", country: "Ghana" },
    { name: "Akyem", lat: 6.1, lng: -0.8, city: "Akyem", region: "Eastern", country: "Ghana" },
    { name: "Kibi", lat: 6.17, lng: -0.55, city: "Kibi", region: "Eastern", country: "Ghana" },
    { name: "Dunkwa", lat: 5.97, lng: -1.78, city: "Dunkwa", region: "Central", country: "Ghana" },
    { name: "Kenyasi", lat: 7.0, lng: -2.3, city: "Kenyasi", region: "Ahafo", country: "Ghana" },
    { name: "Konongo", lat: 6.62, lng: -1.22, city: "Konongo", region: "Ashanti", country: "Ghana" },
  ];

  // Côte d'Ivoire (Ivory Coast) regions
  const coteIvoireRegions = [
    { name: "Tongon", lat: 9.5, lng: -5.0, city: "Tongon", region: "Savanes", country: "Côte d'Ivoire" },
    { name: "Ity", lat: 7.0, lng: -7.5, city: "Ity", region: "Montagnes", country: "Côte d'Ivoire" },
    { name: "Agbaou", lat: 6.5, lng: -5.2, city: "Agbaou", region: "Lacs", country: "Côte d'Ivoire" },
  ];

  // Burkina Faso regions
  const burkinaFasoRegions = [
    { name: "Essakane", lat: 14.5, lng: -0.5, city: "Essakane", region: "Sahel", country: "Burkina Faso" },
    { name: "Mana", lat: 11.0, lng: -4.0, city: "Mana", region: "Hauts-Bassins", country: "Burkina Faso" },
  ];

  // Mali regions
  const maliRegions = [
    { name: "Sadiola", lat: 13.5, lng: -11.0, city: "Sadiola", region: "Kayes", country: "Mali" },
    { name: "Yatela", lat: 13.3, lng: -11.0, city: "Yatela", region: "Kayes", country: "Mali" },
  ];

  // Senegal regions
  const senegalRegions = [
    { name: "Sabodala", lat: 13.0, lng: -12.0, city: "Sabodala", region: "Kédougou", country: "Senegal" },
  ];

  const allRegions = [...ghanaRegions, ...coteIvoireRegions, ...burkinaFasoRegions, ...maliRegions, ...senegalRegions];

  const concessions: any[] = [];
  const mines: any[] = [];
  const transactions: any[] = [];
  const heatmap: any[] = [];

  // Generate data points per region, clustered around major mining areas
  allRegions.forEach((region, idx) => {
    const baseConcessions = 2 + Math.floor(Math.random() * 3);
    const baseMines = 1 + Math.floor(Math.random() * 2);
    const baseTransactions = 3 + Math.floor(Math.random() * 4);

    // Concessions (polygon areas) - create actual polygon coordinates
    for (let i = 0; i < baseConcessions; i++) {
      const offsetLng = (Math.random() - 0.5) * 0.3;
      const offsetLat = (Math.random() - 0.5) * 0.3;
      const centerLng = region.lng + offsetLng;
      const centerLat = region.lat + offsetLat;
      const polygonSize = 3 + Math.random() * 4; // 3-7 km polygons
      const polygonCoords = createPolygonFromCenter(centerLng, centerLat, polygonSize, 6 + Math.floor(Math.random() * 4));
      
      concessions.push({
        cartodb_id: `conc_${idx}_${i}`,
        name: `${region.name} Gold Concession ${i + 1}`,
        city: region.city,
        country: region.country,
        region: region.region,
        latitude: centerLat,
        longitude: centerLng,
        coordinates: polygonCoords,
        polygon: polygonCoords,
        geometry: {
          type: "Polygon",
          coordinates: [polygonCoords],
        },
        activity_intensity: 0.8 + Math.random() * 0.2,
      });
    }

    // Mines (specific locations)
    for (let i = 0; i < baseMines; i++) {
      const offset = (Math.random() - 0.5) * 0.15;
      mines.push({
        cartodb_id: `mine_${idx}_${i}`,
        name: `${region.name} Gold Mine ${i + 1}`,
        city: region.city,
        country: region.country,
        region: region.region,
        latitude: region.lat + offset,
        longitude: region.lng + offset,
        coordinates: [region.lng + offset, region.lat + offset],
        geometry: {
          type: "Point",
          coordinates: [region.lng + offset, region.lat + offset],
        },
        status: "active",
      });
    }

    // Transactions (more scattered)
    for (let i = 0; i < baseTransactions; i++) {
      const offset = (Math.random() - 0.5) * 0.2;
      transactions.push({
        cartodb_id: `trans_${idx}_${i}`,
        name: `${region.name} Transaction ${i + 1}`,
        city: region.city,
        country: region.country,
        region: region.region,
        latitude: region.lat + offset,
        longitude: region.lng + offset,
        coordinates: [region.lng + offset, region.lat + offset],
        geometry: {
          type: "Point",
          coordinates: [region.lng + offset, region.lat + offset],
        },
      });
    }

    // Heatmap data (same points as mines/concessions)
    [...concessions.slice(-baseConcessions), ...mines.slice(-baseMines)].forEach((point) => {
      heatmap.push({
        ...point,
        activity_intensity: 0.5 + Math.random() * 0.5,
      });
    });
  });

  return { concessions, mines, transactions, heatmap };
};

// Generate mock data once
const MOCK_DATA = generateWestAfricaMockData();

// Export function to get mock data stats
export const getMockDataStats = () => ({
  concessions: MOCK_DATA.concessions.length,
  mines: MOCK_DATA.mines.length,
  transactions: MOCK_DATA.transactions.length,
  heatmap: MOCK_DATA.heatmap.length,
});

export const useSimpleMiningLayers = () => {
  const dispatch = useDispatch();
  
  // Extract only visibility values to avoid recreating layers unnecessarily
  const concessionsVisible = useSelector((state: any) => 
    state.carto?.layers?.ghanaGoldConcessionsLayer?.visible !== false
  );
  const minesVisible = useSelector((state: any) => 
    state.carto?.layers?.ghanaGoldMinesLayer?.visible !== false
  );
  const transactionsVisible = useSelector((state: any) => 
    state.carto?.layers?.ghanaGoldTransactionsLayer?.visible ?? false
  );
  const heatmapVisible = useSelector((state: any) => 
    state.carto?.layers?.ghanaGoldHeatmapLayer?.visible !== false
  );

  // 1. Gold Concessions Layer (using mock data - actual polygons)
  const concessionsLayer = useMemo(() => {
    return new PolygonLayer({
      id: "ghanaGoldConcessionsLayer",
      data: MOCK_DATA.concessions,
      getPolygon: (d: any) => d.polygon || d.coordinates || d.geometry?.coordinates?.[0],
      getFillColor: [255, 215, 0, 120], // Gold with transparency
      getLineColor: [218, 165, 32, 255], // Goldenrod border
      lineWidthMinPixels: 2,
      pickable: true,
      autoHighlight: true,
      visible: concessionsVisible,
      stroked: true,
      filled: true,
      extruded: false,
      wireframe: false,
    });
  }, [concessionsVisible]);

  // 2. Gold Mines Layer (Points - using mock data)
  const minesLayer = useMemo(() => {
    return new ScatterplotLayer({
      id: "ghanaGoldMinesLayer",
      data: MOCK_DATA.mines,
      getPosition: (d: any) => d.coordinates || [d.longitude, d.latitude],
      getRadius: 8,
      radiusMinPixels: 8,
      radiusMaxPixels: 25,
      getFillColor: [255, 215, 0, 255], // Gold
      getLineColor: [0, 0, 0, 255],
      lineWidthMinPixels: 1,
      pickable: true,
      autoHighlight: true,
      visible: minesVisible,
      stroked: true,
      filled: true,
      radiusUnits: "pixels",
    });
  }, [minesVisible]);

  // 3. Gold Transactions Layer (Points - using mock data)
  const transactionsLayer = useMemo(() => {
    return new ScatterplotLayer({
      id: "ghanaGoldTransactionsLayer",
      data: MOCK_DATA.transactions,
      getPosition: (d: any) => d.coordinates || [d.longitude, d.latitude],
      getRadius: 4,
      radiusMinPixels: 4,
      getFillColor: [33, 150, 243, 180], // Blue
      getLineColor: [13, 71, 161, 255],
      lineWidthMinPixels: 1,
      pickable: true,
      autoHighlight: true,
      visible: transactionsVisible,
      stroked: true,
      filled: true,
      radiusUnits: "pixels",
    });
  }, [transactionsVisible]);

  // 4. Gold Activity Heatmap (using mock data)
  const heatmapLayer = useMemo(() => {
    return new HeatmapLayer({
      id: "ghanaGoldHeatmapLayer",
      data: MOCK_DATA.heatmap,
      radiusPixels: 50,
      intensity: 1.5,
      threshold: 0.03,
      // @ts-ignore - deck.gl colorRange type issue
      colorRange: [
        [255, 255, 204],
        [255, 237, 160],
        [254, 217, 118],
        [254, 178, 76],
        [253, 141, 60],
        [252, 78, 42],
        [227, 26, 28],
        [189, 0, 38],
        [128, 0, 38],
      ],
      getPosition: (d: any) => {
        if (d.coordinates) return d.coordinates;
        if (d.geometry?.coordinates) return d.geometry.coordinates;
        if (d.longitude !== undefined && d.latitude !== undefined) return [d.longitude, d.latitude];
        return [0, 0];
      },
      getWeight: (d: any) => d.activity_intensity || 1,
      aggregation: "SUM",
      pickable: true,
      visible: heatmapVisible,
    });
  }, [heatmapVisible]);

  // Track initial layer dispatch
  const layersInitialized = useRef(false);

  // Dispatch layers when they change (layers are recreated when visibility changes)
  useEffect(() => {
    dispatch(addLayer(concessionsLayer));
    dispatch(addLayer(minesLayer));
    dispatch(addLayer(transactionsLayer));
    dispatch(addLayer(heatmapLayer));
    layersInitialized.current = true;
  }, [dispatch, concessionsLayer, minesLayer, transactionsLayer, heatmapLayer]);

  // Ensure layers are in Redux store for toggling
  // The layers themselves already have visibility set via useMemo dependencies
  // This ensures Redux store is updated when visibility changes
  useEffect(() => {
    if (layersInitialized.current) {
      // Update layers in Redux to reflect current visibility state
      dispatch(updateLayer({
        id: "ghanaGoldConcessionsLayer",
        layerAttributes: { visible: concessionsVisible },
      }));
      dispatch(updateLayer({
        id: "ghanaGoldMinesLayer",
        layerAttributes: { visible: minesVisible },
      }));
      dispatch(updateLayer({
        id: "ghanaGoldTransactionsLayer",
        layerAttributes: { visible: transactionsVisible },
      }));
      dispatch(updateLayer({
        id: "ghanaGoldHeatmapLayer",
        layerAttributes: { visible: heatmapVisible },
      }));
    }
  }, [dispatch, concessionsVisible, minesVisible, transactionsVisible, heatmapVisible]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(removeLayer("ghanaGoldConcessionsLayer"));
      dispatch(removeLayer("ghanaGoldMinesLayer"));
      dispatch(removeLayer("ghanaGoldTransactionsLayer"));
      dispatch(removeLayer("ghanaGoldHeatmapLayer"));
    };
  }, [dispatch]);

  const layersArray = useMemo(() => [concessionsLayer, minesLayer, transactionsLayer, heatmapLayer], [
    concessionsLayer,
    minesLayer,
    transactionsLayer,
    heatmapLayer,
  ]);

  // Create tooltip function for DeckGL
  const getTooltip = useMemo(() => (info: any) => {
    if (!info || !info.object) return null;
    
    const obj = info.object;
    // Get layer ID from layer object or fallback to checking which layer it belongs to
    const layerId = info.layer?.id || info.layer?.props?.id;
    
    if (!layerId) return null;
    
    let tooltipContent = '';
    
    if (layerId === "ghanaGoldConcessionsLayer") {
      tooltipContent = `
        <div style="padding: 8px; background-color: #FFD700; color: #000; border-radius: 4px; font-size: 12px; font-family: Arial, sans-serif;">
          <strong>🥇 Gold Concession</strong><br/>
          ${obj.name || 'Mining Concession'}<br/>
          ${obj.city ? `City: ${obj.city}<br/>` : ''}
          ${obj.region ? `Region: ${obj.region}<br/>` : ''}
          ${obj.country ? `Country: ${obj.country}` : ''}
        </div>
      `;
    } else if (layerId === "ghanaGoldMinesLayer") {
      tooltipContent = `
        <div style="padding: 8px; background-color: #FFD700; color: #000; border-radius: 4px; font-size: 12px; font-family: Arial, sans-serif;">
          <strong>⛏️ Gold Mine</strong><br/>
          ${obj.name || 'Active Gold Mine'}<br/>
          ${obj.city ? `Location: ${obj.city}<br/>` : ''}
          ${obj.region ? `Region: ${obj.region}<br/>` : ''}
          ${obj.country ? `Country: ${obj.country}<br/>` : ''}
          ${obj.status ? `Status: ${obj.status}` : 'Status: Active'}
        </div>
      `;
    } else if (layerId === "ghanaGoldTransactionsLayer") {
      tooltipContent = `
        <div style="padding: 8px; background-color: #2196F3; color: #fff; border-radius: 4px; font-size: 12px; font-family: Arial, sans-serif;">
          <strong>💰 Gold Transaction</strong><br/>
          ${obj.name || 'Transaction Location'}<br/>
          ${obj.city ? `Location: ${obj.city}<br/>` : ''}
          ${obj.region ? `Region: ${obj.region}<br/>` : ''}
          ${obj.country ? `Country: ${obj.country}<br/>` : ''}
          Transaction Type: Gold Mining
        </div>
      `;
    } else if (layerId === "ghanaGoldHeatmapLayer") {
      tooltipContent = `
        <div style="padding: 8px; background-color: #FF6B35; color: #fff; border-radius: 4px; font-size: 12px; font-family: Arial, sans-serif;">
          <strong>🔥 Mining Activity</strong><br/>
          Activity Intensity: ${obj.activity_intensity ? (obj.activity_intensity * 100).toFixed(0) + '%' : 'High'}<br/>
          Gold Mining Hotspot
        </div>
      `;
    }
    
    return tooltipContent ? { html: tooltipContent } : null;
  }, []);

  return { layers: layersArray, getTooltip };
};

export default useSimpleMiningLayers;
