# Ghana Mining Analytics - Setup Guide

## Overview
This application is configured for geospatial mining analysis in West Africa, with a primary focus on Ghana. It visualizes mining concessions, active mines, transactions, and activity heatmaps using Goldbod data points.

## Features
- **Heatmaps**: Mining activity density visualization
- **Concessions**: Mining lease areas and boundaries
- **Mines**: Active and inactive mining sites
- **Transactions**: Mining transaction data points
- **Ghana-Centered View**: Map initially centered on Ghana (7.9465°N, 1.0232°W)

## Data Configuration

### Required Data Tables
The application expects the following data tables in your CARTO account. Update the table names in `src/config/miningDataConfig.ts`:

#### 1. Mining Concessions
```sql
-- Table: mining_concessions_ghana
-- Required columns:
--   - geom (GEOGRAPHY): Polygon geometries of concession areas
--   - concession_id (STRING): Unique identifier
--   - status (STRING): active, pending, suspended, or expired
--   - mineral_type (STRING): gold, diamond, bauxite, etc.
--   - area_hectares (FLOAT64): Area in hectares
--   - company_name (STRING): Operating company
```

#### 2. Mining Sites
```sql
-- Table: mining_sites_ghana
-- Required columns:
--   - geom (GEOGRAPHY): Point geometries of mine locations
--   - mine_id (STRING): Unique identifier
--   - mine_name (STRING): Name of the mine
--   - status (STRING): active or inactive
--   - mineral_type (STRING): Primary mineral being mined
--   - production_volume (FLOAT64): Annual production volume
--   - operator (STRING): Mining operator
```

#### 3. Mining Transactions
```sql
-- Table: mining_transactions_ghana
-- Required columns:
--   - geom (GEOGRAPHY): Point geometries
--   - transaction_id (STRING): Unique identifier
--   - transaction_date (DATE): Transaction date
--   - transaction_type (STRING): Type of transaction
--   - volume (FLOAT64): Transaction volume
--   - value (FLOAT64): Transaction value
```

#### 4. Activity Heatmap
```sql
-- Table: mining_activity_aggregated
-- Required columns:
--   - geom (GEOGRAPHY): Point geometries
--   - country (STRING): Country name (filter for 'Ghana')
--   - activity_intensity (FLOAT64): Intensity metric
--   - production_volume (FLOAT64): Aggregated production
--   - transaction_count (INTEGER): Number of transactions
```

## CARTO Account Setup

### 1. Access Token
Update your CARTO access token in `src/App.tsx`:
```typescript
const credentials = {
  apiVersion: API_VERSIONS.V3,
  accessToken: "YOUR_ACCESS_TOKEN_HERE",
  apiBaseUrl: "https://gcp-us-east1.api.carto.com", // Or your region
};
```

### 2. Data Connection
The application uses the `carto_dw` connection. Ensure your data tables are accessible via this connection.

## Layer Configuration

### Current Layers
1. **Heatmap Layer** (bottom)
   - Shows mining activity density
   - Color: Yellow to red gradient
   - Configurable in `LAYER_STYLES.heatmap`

2. **Concessions Layer**
   - Polygons showing mining lease areas
   - Color: Amber/Orange with transparency
   - Configurable in `LAYER_STYLES.concessions`

3. **Mines Layer**
   - Points showing mine locations
   - Color: Green (active), Grey (inactive)
   - Configurable in `LAYER_STYLES.mines`

4. **Transactions Layer**
   - Points showing transaction locations
   - Color: Blue
   - Hidden by default (toggle to show)
   - Configurable in `LAYER_STYLES.transactions`

## Customization

### Update Data Sources
Edit `src/config/miningDataConfig.ts`:
```typescript
export const MINING_DATA_SOURCES = {
  concessions: {
    id: "ghana_concessions",
    type: "TABLE" as const,
    connection: "carto_dw",
    data: "your_project.your_dataset.your_concessions_table",
  },
  // ... update other sources
};
```

### Modify Map Center
To focus on a different region in West Africa:
```typescript
export const GHANA_CENTER = {
  latitude: 7.9465,  // Update latitude
  longitude: -1.0232, // Update longitude
  zoom: 7,           // Adjust zoom level
  pitch: 0,
  bearing: 0,
};
```

### Customize Layer Styles
Edit colors, sizes, and opacity in `LAYER_STYLES`:
```typescript
export const LAYER_STYLES = {
  concessions: {
    fillColor: [255, 193, 7, 80], // [R, G, B, A]
    lineColor: [255, 152, 0, 255],
    lineWidthMinPixels: 2,
  },
  // ... customize other layers
};
```

## Goldbod Data Integration

### Expected Data Format
Ensure your Goldbod data exports match the schema requirements above. Common fields:
- Geometric data in WGS84 (EPSG:4326)
- Standardized status codes
- Consistent mineral type classifications

### Data Import Steps
1. Export data from Goldbod system
2. Transform to match the schema
3. Upload to CARTO using CARTO CLI or web interface:
   ```bash
   carto import your_data.geojson --connection carto_dw
   ```

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Widgets

The application includes mining-specific widgets:
- **Active Concessions**: Count of licensed areas
- **Active Mines**: Currently operational mines
- **Transactions**: Monthly transaction count
- **Mineral Types**: Filter by gold, diamond, bauxite, etc.
- **Layer Controls**: Toggle visibility of map layers

To connect widgets to real data, uncomment the CARTO widget components in `src/components/MiningWidgets.tsx`.

## Expanding to Other West African Countries

To add more countries:

1. **Add country configuration** in `miningDataConfig.ts`:
```typescript
export const NIGERIA_CENTER = {
  latitude: 9.0820,
  longitude: 8.6753,
  zoom: 6,
};
```

2. **Update data queries** to filter by country:
```sql
WHERE country IN ('Ghana', 'Nigeria', 'Sierra Leone')
```

3. **Add country selector** in the UI widgets

## Troubleshooting

### No Data Showing
1. Check CARTO credentials and access token
2. Verify table names in `miningDataConfig.ts`
3. Ensure data tables have geometry columns
4. Check browser console for API errors

### Performance Issues
1. Reduce heatmap `radiusPixels` in `LAYER_STYLES`
2. Add spatial filters to queries
3. Use aggregated tables for large datasets

### TypeScript Errors
The application may show some TypeScript type warnings related to CARTO/deck.gl type definitions. These are library-level type conflicts and do not affect runtime functionality.

## Support
For CARTO-specific issues, consult:
- CARTO Documentation: https://docs.carto.com/
- deck.gl Documentation: https://deck.gl/

## License
This application template is based on CARTO React Vite starter.
