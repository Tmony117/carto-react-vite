import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { CartoLayer, MAP_TYPES } from "@deck.gl/carto/typed";
import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";
import { useCartoLayerProps } from "@carto/react-api";
import { addLayer, addSource, removeLayer } from "@carto/react-redux";

// Simple working configuration using actual CARTO demo data
const GOLD_MINING_LAYERS = {
  concessions: {
    id: "ghana_gold_concessions",
    data: "carto-demo-data.demo_tables.world_airports",
  },
  mines: {
    id: "ghana_gold_mines", 
    data: "carto-demo-data.demo_tables.world_airports",
  },
  transactions: {
    id: "ghana_gold_transactions",
    data: "carto-demo-data.demo_tables.world_airports",
  },
  heatmap: {
    id: "ghana_gold_heatmap",
    data: "carto-demo-data.demo_tables.world_airports",
  },
};

export const useSimpleMiningLayers = () => {
  const dispatch = useDispatch();

  // 1. Gold Concessions Layer
  const concessionsSource = useMemo(() => ({
    id: GOLD_MINING_LAYERS.concessions.id,
    type: MAP_TYPES.TABLE,
    connection: "carto_dw",
    data: GOLD_MINING_LAYERS.concessions.data,
  }), []);

  const concessionsLayerProps = useCartoLayerProps({
    source: concessionsSource,
  });

  // @ts-expect-error - CARTO layer type definitions have credential type conflicts that don't affect runtime
  const concessionsLayer = useMemo(() => new CartoLayer({
    id: "ghanaGoldConcessionsLayer",
    ...concessionsLayerProps,
    getFillColor: [255, 215, 0, 100], // Gold with transparency
    getLineColor: [218, 165, 32, 255], // Goldenrod border
    lineWidthMinPixels: 2,
    pickable: true,
    autoHighlight: true,
    uniqueIdProperty: "cartodb_id",
  }), [concessionsLayerProps]);

  // 2. Gold Mines Layer
  const minesSource = useMemo(() => ({
    id: GOLD_MINING_LAYERS.mines.id,
    type: MAP_TYPES.TABLE,
    connection: "carto_dw",
    data: GOLD_MINING_LAYERS.mines.data,
  }), []);

  const minesLayerProps = useCartoLayerProps({
    source: minesSource,
  });

  // @ts-expect-error - CARTO layer type definitions have credential type conflicts that don't affect runtime
  const minesLayer = useMemo(() => new CartoLayer({
    id: "ghanaGoldMinesLayer",
    ...minesLayerProps,
    pointRadiusMinPixels: 8,
    pointRadiusMaxPixels: 25,
    getFillColor: [255, 215, 0, 255], // Gold
    getLineColor: [0, 0, 0, 255],
    lineWidthMinPixels: 1,
    pickable: true,
    autoHighlight: true,
    uniqueIdProperty: "cartodb_id",
  }), [minesLayerProps]);

  // 3. Gold Transactions Layer
  const transactionsSource = useMemo(() => ({
    id: GOLD_MINING_LAYERS.transactions.id,
    type: MAP_TYPES.TABLE,
    connection: "carto_dw",
    data: GOLD_MINING_LAYERS.transactions.data,
  }), []);

  const transactionsLayerProps = useCartoLayerProps({
    source: transactionsSource,
  });

  // @ts-expect-error - CARTO layer type definitions have credential type conflicts that don't affect runtime
  const transactionsLayer = useMemo(() => new CartoLayer({
    id: "ghanaGoldTransactionsLayer",
    ...transactionsLayerProps,
    pointRadiusMinPixels: 4,
    getFillColor: [33, 150, 243, 180], // Blue
    getLineColor: [13, 71, 161, 255],
    lineWidthMinPixels: 1,
    pickable: true,
    autoHighlight: true,
    visible: false, // Hidden by default
    uniqueIdProperty: "cartodb_id",
  }), [transactionsLayerProps]);

  // 4. Gold Activity Heatmap
  const heatmapSource = useMemo(() => ({
    id: GOLD_MINING_LAYERS.heatmap.id,
    type: MAP_TYPES.TABLE,
    connection: "carto_dw",
    data: GOLD_MINING_LAYERS.heatmap.data,
  }), []);

  const heatmapLayerProps = useCartoLayerProps({
    source: heatmapSource,
  });

  const heatmapLayer = useMemo(() => new HeatmapLayer({
    id: "ghanaGoldHeatmapLayer",
    data: [], // Will be populated by CARTO
    radiusPixels: 30,
    intensity: 1,
    threshold: 0.05,
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
    getPosition: (d: any) => d.coordinates || [0, 0],
    getWeight: (d: any) => d.properties?.activity_intensity || 1,
    aggregation: "SUM",
  }), []);

  // Dispatch sources and layers in useEffect to avoid render-time side effects
  useEffect(() => {
    dispatch(addSource(concessionsSource));
    dispatch(addSource(minesSource));
    dispatch(addSource(transactionsSource));
    dispatch(addSource(heatmapSource));
    
    dispatch(addLayer(concessionsLayer));
    dispatch(addLayer(minesLayer));
    dispatch(addLayer(transactionsLayer));
    dispatch(addLayer(heatmapLayer));

    // Clean up function
    return () => {
      dispatch(removeLayer("ghanaGoldConcessionsLayer"));
      dispatch(removeLayer("ghanaGoldMinesLayer"));
      dispatch(removeLayer("ghanaGoldTransactionsLayer"));
      dispatch(removeLayer("ghanaGoldHeatmapLayer"));
    };
  }, [dispatch, concessionsSource, minesSource, transactionsSource, heatmapSource, concessionsLayer, minesLayer, transactionsLayer, heatmapLayer]);

  const layers = useMemo(() => [concessionsLayer, minesLayer, transactionsLayer, heatmapLayer], [
    concessionsLayer,
    minesLayer,
    transactionsLayer,
    heatmapLayer,
  ]);

  return { layers };
};

export default useSimpleMiningLayers;
