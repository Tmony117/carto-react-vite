// Mining Data Configuration for West Africa - Ghana Focus
// Using Goldbod data points for mining concessions and operations

export const GHANA_CENTER = {
  latitude: 7.9465,
  longitude: -1.0232,
  zoom: 7,
  pitch: 0,
  bearing: 0,
};

export const WEST_AFRICA_BOUNDS = {
  minLat: 4.5,
  maxLat: 11.5,
  minLng: -3.5,
  maxLng: 1.5,
};

// Data source configurations - GOLD MINING FOCUSED
// Using actual CARTO demo tables that exist and are accessible
export const MINING_DATA_SOURCES = {
  // Ghana Gold Mining Concessions
  // Note: Update these with your actual Goldbod/LI2404 data tables when available
  concessions: {
    id: "ghana_gold_concessions",
    type: "TABLE" as const,
    connection: "carto_dw",
    // Using actual CARTO demo table - REPLACE with your Goldbod concessions data
    data: "carto-demo-data.demo_tables.world_airports",
    description: "Gold mining concessions in Ghana (LI2404 compliant)",
  },

  // Active Gold Mines
  mines: {
    id: "ghana_gold_mines",
    type: "TABLE" as const,
    connection: "carto_dw",
    // Using actual CARTO demo table - REPLACE with your Goldbod mines data
    data: "carto-demo-data.demo_tables.world_airports",
    description: "Active gold mining sites in Ghana",
  },

  // Gold Mining Transactions
  transactions: {
    id: "ghana_gold_transactions",
    type: "TABLE" as const,
    connection: "carto_dw",
    // Using actual CARTO demo table - REPLACE with your Goldbod transaction data
    data: "carto-demo-data.demo_tables.world_airports",
    description: "Gold mining transactions in Ghana",
  },

  // Heatmap data - aggregated gold mining activity
  heatmapData: {
    id: "ghana_gold_heatmap",
    type: "TABLE" as const,
    connection: "carto_dw",
    // Using actual CARTO demo table - REPLACE with your Goldbod aggregated data
    data: "carto-demo-data.demo_tables.world_airports",
    description: "Gold mining activity heatmap for Ghana",
  },
};

// Layer styling configurations - GOLD THEME
export const LAYER_STYLES = {
  concessions: {
    fillColor: [255, 215, 0, 100], // Gold color with transparency
    lineColor: [218, 165, 32, 255], // Goldenrod border
    lineWidthMinPixels: 2,
  },

  mines: {
    activeColor: [255, 215, 0, 255], // Gold for active mines
    inactiveColor: [184, 134, 11, 255], // Dark goldenrod for inactive
    pointRadiusMinPixels: 8,
    pointRadiusMaxPixels: 25,
  },

  transactions: {
    fillColor: [33, 150, 243, 180], // Blue
    lineColor: [13, 71, 161, 255], // Dark blue
    pointRadiusMinPixels: 4,
  },

  heatmap: {
    intensity: 1,
    threshold: 0.05,
    radiusPixels: 30,
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
  },
};

// Mining types for filtering - GOLD FOCUSED
export const MINING_TYPES = {
  GOLD: "gold",
  // Other mineral types disabled for now
  // DIAMOND: "diamond",
  // BAUXITE: "bauxite",
  // MANGANESE: "manganese",
  // IRON_ORE: "iron_ore",
  // OTHER: "other",
};

// Concession status types
export const CONCESSION_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  SUSPENDED: "suspended",
  EXPIRED: "expired",
};

export default {
  GHANA_CENTER,
  WEST_AFRICA_BOUNDS,
  MINING_DATA_SOURCES,
  LAYER_STYLES,
  MINING_TYPES,
  CONCESSION_STATUS,
};
