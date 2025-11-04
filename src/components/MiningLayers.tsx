import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CartoLayer, MAP_TYPES } from "@deck.gl/carto/typed";
import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";
import { useCartoLayerProps } from "@carto/react-api";
import { addLayer, addSource, removeLayer } from "@carto/react-redux";
import { MINING_DATA_SOURCES, LAYER_STYLES } from "../config/miningDataConfig";

export const useMiningLayers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clean up function to remove layers when component unmounts
    return () => {
      dispatch(removeLayer("ghanaGoldConcessionsLayer"));
      dispatch(removeLayer("ghanaGoldMinesLayer"));
      dispatch(removeLayer("ghanaGoldTransactionsLayer"));
      dispatch(removeLayer("ghanaGoldHeatmapLayer"));
    };
  }, [dispatch]);

  // 1. Gold Mining Concessions Layer (Polygons)
  const concessionsSource = {
    id: MINING_DATA_SOURCES.concessions.id,
    type: MAP_TYPES.TABLE,
    connection: MINING_DATA_SOURCES.concessions.connection,
    data: MINING_DATA_SOURCES.concessions.data,
  };
  dispatch(addSource(concessionsSource));

  const concessionsLayerProps = useCartoLayerProps({
    source: concessionsSource,
  });

  // @ts-expect-error - CARTO layer type definitions have credential type conflicts that don't affect runtime
  const concessionsLayer = new CartoLayer({
    id: "ghanaGoldConcessionsLayer",
    ...concessionsLayerProps,
    getFillColor: LAYER_STYLES.concessions.fillColor,
    getLineColor: LAYER_STYLES.concessions.lineColor,
    lineWidthMinPixels: LAYER_STYLES.concessions.lineWidthMinPixels,
    pickable: true,
    autoHighlight: true,
    // Filter to Ghana bounds - will be replaced with your Goldbod data
    uniqueIdProperty: "cartodb_id",
  });

  // 2. Active Gold Mines Layer (Points)
  const minesSource = {
    id: MINING_DATA_SOURCES.mines.id,
    type: MAP_TYPES.TABLE,
    connection: MINING_DATA_SOURCES.mines.connection,
    data: MINING_DATA_SOURCES.mines.data,
  };
  dispatch(addSource(minesSource));

  const minesLayerProps = useCartoLayerProps({
    source: minesSource,
  });

  // @ts-expect-error - CARTO layer type definitions have credential type conflicts that don't affect runtime
  const minesLayer = new CartoLayer({
    id: "ghanaGoldMinesLayer",
    ...minesLayerProps,
    pointRadiusMinPixels: LAYER_STYLES.mines.pointRadiusMinPixels,
    pointRadiusMaxPixels: LAYER_STYLES.mines.pointRadiusMaxPixels,
    // All gold mines shown in gold color
    getFillColor: LAYER_STYLES.mines.activeColor,
    getLineColor: [0, 0, 0, 255],
    lineWidthMinPixels: 1,
    pickable: true,
    autoHighlight: true,
    uniqueIdProperty: "cartodb_id",
  });

  // 3. Gold Transactions Layer (Points)
  const transactionsSource = {
    id: MINING_DATA_SOURCES.transactions.id,
    type: MAP_TYPES.TABLE,
    connection: MINING_DATA_SOURCES.transactions.connection,
    data: MINING_DATA_SOURCES.transactions.data,
  };
  dispatch(addSource(transactionsSource));

  const transactionsLayerProps = useCartoLayerProps({
    source: transactionsSource,
  });

  // @ts-expect-error - CARTO layer type definitions have credential type conflicts that don't affect runtime
  const transactionsLayer = new CartoLayer({
    id: "ghanaGoldTransactionsLayer",
    ...transactionsLayerProps,
    pointRadiusMinPixels: LAYER_STYLES.transactions.pointRadiusMinPixels,
    getFillColor: LAYER_STYLES.transactions.fillColor,
    getLineColor: LAYER_STYLES.transactions.lineColor,
    lineWidthMinPixels: 1,
    pickable: true,
    autoHighlight: true,
    visible: false, // Hidden by default, can be toggled
    filter: `the_geom && ST_Intersects(the_geom, ST_GeomFromText('POLYGON((-2.0 4.0, 2.0 4.0, 2.0 12.0, -2.0 12.0, -2.0 4.0))'))`,
    uniqueIdProperty: "cartodb_id",
  });

  // 4. Heatmap data - aggregated gold mining activity
  const heatmapSource = {
    id: MINING_DATA_SOURCES.heatmapData.id,
    type: MAP_TYPES.TABLE,
    connection: MINING_DATA_SOURCES.heatmapData.connection,
    data: MINING_DATA_SOURCES.heatmapData.data,
  };
  dispatch(addSource(heatmapSource));

  const heatmapLayerProps = useCartoLayerProps({
    source: heatmapSource,
  });

  const heatmapLayer = new HeatmapLayer({
    id: "ghanaGoldHeatmapLayer",
    data: [], // Initialize with empty data, will be populated by CARTO
    radiusPixels: LAYER_STYLES.heatmap.radiusPixels,
    intensity: LAYER_STYLES.heatmap.intensity,
    threshold: LAYER_STYLES.heatmap.threshold,
    // @ts-ignore - deck.gl HeatmapLayer colorRange type expects typed arrays but accepts number arrays at runtime
    colorRange: LAYER_STYLES.heatmap.colorRange,
    getPosition: (d: any) => d.coordinates || [0, 0],
    getWeight: (d: any) => d.properties?.activity_intensity || 1,
    aggregation: "SUM",
  });

  // Add layers to Redux store
  dispatch(addLayer(heatmapLayer));
  dispatch(addLayer(concessionsLayer));
  dispatch(addLayer(minesLayer));
  dispatch(addLayer(transactionsLayer));

  const layers = [concessionsLayer, minesLayer, transactionsLayer, heatmapLayer];

  return { layers };
};

export default useMiningLayers;
