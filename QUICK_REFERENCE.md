# Quick Reference - Ghana Mining Analytics

## Application Overview
**Purpose**: Geospatial analysis of mining operations in Ghana and West Africa  
**Data Source**: Goldbod mining database  
**Primary Region**: Ghana (7.9465°N, 1.0232°W)

## Map Layers

| Layer | Type | Color | Status | Description |
|-------|------|-------|--------|-------------|
| **Heatmap** | Density | Yellow→Red | Always on | Mining activity intensity |
| **Concessions** | Polygons | Amber/Orange | Always on | Licensed mining areas |
| **Mines** | Points | Green/Grey | Always on | Active/inactive mines |
| **Transactions** | Points | Blue | Hidden by default | Transaction locations |

## Layer Styling Colors

```typescript
// Concessions (Polygons)
Fill: [255, 193, 7, 80]     // Amber with transparency
Line: [255, 152, 0, 255]    // Orange border

// Active Mines (Points)
Fill: [76, 175, 80, 255]    // Green

// Inactive Mines (Points)
Fill: [158, 158, 158, 255]  // Grey

// Transactions (Points)
Fill: [33, 150, 243, 180]   // Blue
Line: [13, 71, 161, 255]    // Dark blue

// Heatmap Gradient
[255,255,204] → [255,237,160] → [254,217,118] → 
[254,178,76] → [253,141,60] → [252,78,42] → 
[227,26,28] → [189,0,38] → [128,0,38]
```

## Mineral Types

| Code | Description |
|------|-------------|
| `gold` | Gold mining operations |
| `diamond` | Diamond mining |
| `bauxite` | Bauxite extraction |
| `manganese` | Manganese mining |
| `iron_ore` | Iron ore mining |
| `other` | Other mineral types |

## Concession Status Codes

| Status | Description |
|--------|-------------|
| `active` | Currently operational concession |
| `pending` | Awaiting approval |
| `suspended` | Temporarily suspended |
| `expired` | License expired |

## Key Configuration Files

```
src/config/miningDataConfig.ts    - Data sources, layer styles, constants
src/components/MiningLayers.tsx   - Layer definitions and logic
src/components/MiningWidgets.tsx  - Sidebar analytics widgets
src/App.tsx                       - Main app, credentials, map setup
src/Redux.tsx                     - Initial view state (Ghana center)
```

## Common Tasks

### Change Map Center
**File**: `src/config/miningDataConfig.ts`
```typescript
export const GHANA_CENTER = {
  latitude: 7.9465,   // Update
  longitude: -1.0232, // Update
  zoom: 7,
};
```

### Update Data Source
**File**: `src/config/miningDataConfig.ts`
```typescript
concessions: {
  data: "your-project.dataset.table_name", // Update
}
```

### Change Layer Colors
**File**: `src/config/miningDataConfig.ts`
```typescript
export const LAYER_STYLES = {
  concessions: {
    fillColor: [R, G, B, Alpha], // Update
  }
}
```

### Update CARTO Credentials
**File**: `src/App.tsx`
```typescript
const credentials = {
  apiVersion: API_VERSIONS.V3,
  accessToken: "YOUR_TOKEN", // Update
  apiBaseUrl: "https://gcp-us-east1.api.carto.com",
};
```

## Data Table Schema

### Concessions Table
```
concession_id     STRING
concession_name   STRING
status            STRING (active|pending|suspended|expired)
mineral_type      STRING (gold|diamond|bauxite|...)
area_hectares     FLOAT64
company_name      STRING
geom              GEOGRAPHY (Polygon)
```

### Mines Table
```
mine_id           STRING
mine_name         STRING
status            STRING (active|inactive)
mineral_type      STRING
production_volume FLOAT64
operator          STRING
geom              GEOGRAPHY (Point)
```

### Transactions Table
```
transaction_id    STRING
transaction_date  DATE
transaction_type  STRING
volume            FLOAT64
value             FLOAT64
geom              GEOGRAPHY (Point)
```

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (usually http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Ghana Boundaries (for filtering)

```
Latitude:  4.5°N to 11.5°N
Longitude: 3.5°W to 1.5°E

Center: 7.9465°N, 1.0232°W
```

## Common SQL Filters

```sql
-- Filter to Ghana only
WHERE country = 'Ghana'

-- Filter active concessions
WHERE status = 'active'

-- Filter by mineral type
WHERE mineral_type IN ('gold', 'diamond')

-- Filter by date range
WHERE transaction_date >= '2024-01-01'

-- Spatial filter (within Ghana bounds)
WHERE ST_Y(geom) BETWEEN 4.5 AND 11.5
  AND ST_X(geom) BETWEEN -3.5 AND 1.5
```

## Widget Statistics (Sample)

```
Active Concessions: 247
Active Mines: 89
Transactions (MTD): 1,342
```

*Note: Update MiningWidgets.tsx to connect to real CARTO data sources*

## Troubleshooting Quick Fixes

### Map not loading
→ Check CARTO credentials in `App.tsx`  
→ Verify internet connection  
→ Check browser console for errors

### No data showing
→ Verify table names in `miningDataConfig.ts`  
→ Check CARTO connection name (`carto_dw`)  
→ Ensure data has geometry column named `geom`

### Wrong map center
→ Update `GHANA_CENTER` in `miningDataConfig.ts`  
→ Clear browser cache and reload

### Layer colors wrong
→ Check `LAYER_STYLES` in `miningDataConfig.ts`  
→ Ensure RGBA values are valid (0-255)

## Performance Tips

- Use aggregated tables for heatmaps
- Filter data by date range when possible
- Limit transaction points to recent data
- Use spatial indexes on geometry columns
- Consider tiling large polygon datasets

## URLs & Resources

- **CARTO Docs**: https://docs.carto.com/
- **deck.gl Docs**: https://deck.gl/
- **MapLibre Docs**: https://maplibre.org/
- **MUI Docs**: https://mui.com/

## File Locations

```
Configuration:     src/config/miningDataConfig.ts
Main App:          src/App.tsx
Layers:            src/components/MiningLayers.tsx
Widgets:           src/components/MiningWidgets.tsx
State:             src/Redux.tsx
Setup Guide:       MINING_SETUP.md
Import Guide:      GOLDBOD_DATA_IMPORT.md
```

---

**Quick Start**: `npm install` → Update credentials → `npm run dev`
