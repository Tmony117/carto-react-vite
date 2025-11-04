# Goldbod Data Import Guide

## Overview
This guide explains how to import and configure Goldbod mining data for use in the Ghana Mining Analytics application.

## Data Requirements

### 1. Mining Concessions Data
**Goldbod Export Requirements:**
- **Format**: GeoJSON, Shapefile, or CSV with WKT geometry
- **Geometry Type**: Polygon or MultiPolygon
- **CRS**: WGS84 (EPSG:4326)

**Required Fields:**
```
- concession_id: Unique identifier for each concession
- concession_name: Name of the concession area
- status: active | pending | suspended | expired
- mineral_type: gold | diamond | bauxite | manganese | iron_ore | other
- area_hectares: Area in hectares (numeric)
- company_name: Operating company name
- license_date: Date when license was issued
- expiry_date: License expiration date
- geometry: Polygon geometry in WGS84
```

### 2. Mining Sites/Mines Data
**Goldbod Export Requirements:**
- **Format**: GeoJSON, Shapefile, or CSV with latitude/longitude
- **Geometry Type**: Point
- **CRS**: WGS84 (EPSG:4326)

**Required Fields:**
```
- mine_id: Unique identifier
- mine_name: Name of the mining site
- status: active | inactive
- mineral_type: Primary mineral type
- production_volume: Annual production (numeric)
- operator: Operating company
- latitude: Latitude coordinate (decimal degrees)
- longitude: Longitude coordinate (decimal degrees)
- start_date: Mining operation start date
```

### 3. Mining Transactions Data
**Goldbod Export Requirements:**
- **Format**: CSV or GeoJSON
- **Geometry Type**: Point (location of transaction)

**Required Fields:**
```
- transaction_id: Unique transaction identifier
- transaction_date: Date of transaction
- transaction_type: sale | purchase | export | import
- mineral_type: Type of mineral
- volume: Transaction volume (metric tons)
- value: Transaction value (USD)
- buyer: Buyer entity
- seller: Seller entity
- latitude: Transaction location latitude
- longitude: Transaction location longitude
```

## Import Process

### Step 1: Export from Goldbod
1. Log into Goldbod system
2. Navigate to Data Export section
3. Select "Ghana" as the country filter
4. Choose date range (recommend full historical data)
5. Select export format: **GeoJSON** (recommended) or **Shapefile**
6. Download the exported files

### Step 2: Data Preparation
Transform the data to match the required schema:

```python
# Example Python script to prepare data
import geopandas as gpd
import pandas as pd

# Load Goldbod export
concessions = gpd.read_file('goldbod_concessions_ghana.geojson')

# Rename/map columns to match expected schema
concessions_mapped = concessions.rename(columns={
    'id': 'concession_id',
    'name': 'concession_name',
    'type': 'mineral_type',
    'area': 'area_hectares',
    # ... map other columns
})

# Ensure geometry is in WGS84
concessions_mapped = concessions_mapped.to_crs(epsg=4326)

# Export prepared data
concessions_mapped.to_file('ghana_concessions_prepared.geojson', driver='GeoJSON')
```

### Step 3: Upload to CARTO

#### Option A: Using CARTO Web Interface
1. Log into your CARTO account
2. Navigate to Data > Your datasets
3. Click "New Dataset"
4. Upload the prepared GeoJSON/Shapefile
5. Name the dataset according to config:
   - `mining_concessions_ghana`
   - `mining_sites_ghana`
   - `mining_transactions_ghana`
6. Ensure the dataset is connected to `carto_dw` connection

#### Option B: Using CARTO CLI
```bash
# Install CARTO CLI if not already installed
npm install -g @carto/carto

# Authenticate
carto login

# Import concessions data
carto import ghana_concessions_prepared.geojson \
  --connection carto_dw \
  --table-name mining_concessions_ghana

# Import mines data
carto import ghana_mines_prepared.geojson \
  --connection carto_dw \
  --table-name mining_sites_ghana

# Import transactions data
carto import ghana_transactions_prepared.csv \
  --connection carto_dw \
  --table-name mining_transactions_ghana \
  --geom-column geom
```

### Step 4: Create Heatmap Aggregation
Create an aggregated view for the heatmap layer:

```sql
-- Run this in CARTO SQL console
CREATE OR REPLACE TABLE `your-project.your-dataset.mining_activity_aggregated` AS
SELECT 
  ST_CENTROID(geom) as geom,
  'Ghana' as country,
  COUNT(*) as transaction_count,
  SUM(production_volume) as production_volume,
  -- Calculate activity intensity (normalized 0-1)
  (COUNT(*) / MAX(COUNT(*)) OVER ()) as activity_intensity,
  -- Grid cell identifier for aggregation
  ST_GEOHASH(ST_CENTROID(geom), 7) as grid_id
FROM `your-project.your-dataset.mining_sites_ghana` mines
LEFT JOIN `your-project.your-dataset.mining_transactions_ghana` trans
  ON ST_DWITHIN(mines.geom, trans.geom, 1000) -- 1km radius
WHERE mines.status = 'active'
GROUP BY grid_id, geom, country;
```

### Step 5: Update Application Configuration
Edit `src/config/miningDataConfig.ts`:

```typescript
export const MINING_DATA_SOURCES = {
  concessions: {
    id: "ghana_concessions",
    type: "TABLE" as const,
    connection: "carto_dw",
    data: "your-project.your-dataset.mining_concessions_ghana", // Update this
  },
  mines: {
    id: "ghana_mines",
    type: "TABLE" as const,
    connection: "carto_dw",
    data: "your-project.your-dataset.mining_sites_ghana", // Update this
  },
  transactions: {
    id: "ghana_mining_transactions",
    type: "TABLE" as const,
    connection: "carto_dw",
    data: "your-project.your-dataset.mining_transactions_ghana", // Update this
  },
  heatmapData: {
    id: "ghana_mining_heatmap",
    type: "TABLE" as const, // Changed from QUERY
    connection: "carto_dw",
    data: "your-project.your-dataset.mining_activity_aggregated", // Update this
  },
};
```

## Data Quality Checks

Before finalizing the import, run these validation queries:

```sql
-- Check concessions geometry
SELECT 
  COUNT(*) as total_concessions,
  COUNT(DISTINCT mineral_type) as mineral_types,
  SUM(area_hectares) as total_area_ha
FROM `your-project.your-dataset.mining_concessions_ghana`;

-- Verify mines have valid coordinates
SELECT 
  COUNT(*) as total_mines,
  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_mines,
  MIN(ST_Y(geom)) as min_lat,
  MAX(ST_Y(geom)) as max_lat,
  MIN(ST_X(geom)) as min_lon,
  MAX(ST_X(geom)) as max_lon
FROM `your-project.your-dataset.mining_sites_ghana`;

-- Check transactions date range
SELECT 
  MIN(transaction_date) as earliest_transaction,
  MAX(transaction_date) as latest_transaction,
  COUNT(DISTINCT transaction_type) as transaction_types
FROM `your-project.your-dataset.mining_transactions_ghana`;
```

Expected results for Ghana:
- Latitude range: ~4.5° to 11.5° N
- Longitude range: ~-3.5° to 1.5° E

## Troubleshooting

### Issue: Geometries not displaying
**Solution**: Ensure geometries are in WGS84 (EPSG:4326)
```sql
-- Check CRS
SELECT ST_SRID(geom) FROM your_table LIMIT 1;

-- Transform if needed
UPDATE your_table 
SET geom = ST_TRANSFORM(geom, 4326);
```

### Issue: Data outside Ghana boundaries
**Solution**: Filter data by bounding box
```sql
-- Filter to Ghana bounds
DELETE FROM your_table
WHERE ST_Y(geom) < 4.5 OR ST_Y(geom) > 11.5
   OR ST_X(geom) < -3.5 OR ST_X(geom) > 1.5;
```

### Issue: Missing mineral types
**Solution**: Standardize mineral type values
```sql
UPDATE mining_concessions_ghana
SET mineral_type = LOWER(TRIM(mineral_type));

-- Map variations to standard types
UPDATE mining_concessions_ghana
SET mineral_type = CASE
  WHEN mineral_type IN ('au', 'gold ore') THEN 'gold'
  WHEN mineral_type IN ('diamond', 'diamonds') THEN 'diamond'
  -- Add other mappings
  ELSE mineral_type
END;
```

## Incremental Updates

For regular data updates from Goldbod:

```sql
-- Append new transactions (replace table name)
INSERT INTO `your-project.your-dataset.mining_transactions_ghana`
SELECT * FROM `staging.new_transactions`
WHERE transaction_date > (
  SELECT MAX(transaction_date) 
  FROM `your-project.your-dataset.mining_transactions_ghana`
);

-- Refresh aggregated heatmap data
-- Re-run the aggregation query from Step 4
```

## Scheduling Automated Imports

Use CARTO's scheduled queries to refresh data automatically:
1. Create a scheduled query in CARTO
2. Set frequency (daily/weekly/monthly)
3. Point to Goldbod export API or cloud storage bucket
4. Run data transformation and import steps

## Support & Resources

- **CARTO Documentation**: https://docs.carto.com/
- **Goldbod Support**: [Contact your Goldbod representative]
- **Application Issues**: See MINING_SETUP.md

## Next Steps

After successful import:
1. Verify data appears on the map
2. Test layer toggles in the UI
3. Validate widget statistics
4. Configure user access and permissions
5. Set up automated data refresh schedule
