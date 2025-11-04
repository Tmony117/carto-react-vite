# Ghana Gold Mining Data Setup Guide

## Overview
This application is now configured specifically for **Gold mining in Ghana**, using Goldbod data sources and LI2404 compliance standards.

## Current Status ✅
- **Focus Mineral**: Gold (Au) only
- **Region**: Ghana (4.5°N-11.5°N, 3.5°W-1.5°E)
- **Compliance**: LI2404 (Ghana Minerals Commission)
- **Data Source**: Currently using demo data - **REPLACE with actual Goldbod data**

## Layer Rendering Fixed 🔧
The layers are now properly configured to use **QUERY type** instead of TABLE type, which should resolve rendering issues.

## Quick Access to Ghana Gold Data

### Option 1: Using Your Goldbod Database

If you have access to Goldbod data in CARTO, update the queries in `src/config/miningDataConfig.ts`:

#### Gold Concessions
```typescript
concessions: {
  id: "ghana_gold_concessions",
  type: "QUERY" as const,
  connection: "carto_dw",
  data: `
    SELECT 
      geom,
      concession_id,
      concession_name as name,
      status,
      'gold' as mineral_type,
      area_hectares,
      license_number,
      company_name,
      issue_date,
      expiry_date
    FROM \`your-project.goldbod.ghana_concessions\`
    WHERE mineral_type = 'gold'
      AND status IN ('active', 'pending')
      AND ST_Y(geom) BETWEEN 4.5 AND 11.5
      AND ST_X(geom) BETWEEN -3.5 AND 1.5
  `,
}
```

#### Gold Mines
```typescript
mines: {
  id: "ghana_gold_mines",
  type: "QUERY" as const,
  connection: "carto_dw",
  data: `
    SELECT 
      geom,
      mine_id,
      mine_name as name,
      status,
      'gold' as mineral_type,
      operator,
      production_oz_annual,
      reserves_oz
    FROM \`your-project.goldbod.ghana_mines\`
    WHERE mineral_type = 'gold'
      AND ST_Y(geom) BETWEEN 4.5 AND 11.5
      AND ST_X(geom) BETWEEN -3.5 AND 1.5
  `,
}
```

#### Gold Transactions
```typescript
transactions: {
  id: "ghana_gold_transactions",
  type: "QUERY" as const,
  connection: "carto_dw",
  data: `
    SELECT 
      geom,
      transaction_id,
      transaction_date,
      transaction_type,
      volume_oz,
      value_usd,
      buyer,
      seller
    FROM \`your-project.goldbod.ghana_transactions\`
    WHERE mineral_type = 'gold'
      AND transaction_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
  `,
}
```

### Option 2: Ghana Minerals Commission LI2404 Data

If you have access to official Ghana Minerals Commission data:

```sql
-- LI2404 Compliant Concessions
SELECT 
  geom,
  license_number,
  license_type,
  mineral as mineral_type,
  area_ha as area_hectares,
  holder_name as company_name,
  grant_date,
  expiry_date,
  CASE 
    WHEN expiry_date > CURRENT_DATE() THEN 'active'
    ELSE 'expired'
  END as status
FROM `ghana-minerals-commission.li2404.mining_licenses`
WHERE mineral = 'gold'
  AND license_type IN ('Mining Lease', 'Small Scale Mining License')
```

### Option 3: Public Ghana Mining Data

Ghana Geological Survey data (if available through CARTO):

```sql
SELECT 
  geom,
  site_name as name,
  commodity,
  status,
  district,
  region,
  operator
FROM `ghana-geological-survey.mines.gold_deposits`
WHERE status != 'abandoned'
```

## LI2404 Compliance Fields

Ghana's Minerals and Mining (Amendment) Act 2015 (LI 2404) requires:

### Required Fields for Concessions:
- License Number
- License Type (Small Scale / Large Scale)
- Mineral Type
- Area (hectares)
- Holder/Company Name
- Grant Date
- Expiry Date
- Renewal Status
- Environmental Permit Status

### Data Validation
```sql
-- Ensure all concessions are LI2404 compliant
SELECT 
  *,
  CASE 
    WHEN license_number IS NULL THEN 'Missing License Number'
    WHEN expiry_date < CURRENT_DATE() THEN 'Expired License'
    WHEN area_hectares > 300 THEN 'Exceeds Small Scale Limit'
    ELSE 'Compliant'
  END as compliance_status
FROM your_concessions_table
```

## Known Gold Mining Regions in Ghana

Update your queries to focus on major gold-producing regions:

```sql
-- Ashanti Region (Major Gold Belt)
WHERE region = 'Ashanti'
  OR district IN ('Obuasi', 'Konongo', 'Bekwai')

-- Western Region
WHERE region = 'Western'
  OR district IN ('Tarkwa', 'Prestea', 'Bogoso')

-- Eastern Region
WHERE region = 'Eastern'
  OR district IN ('Kibi', 'Akyem')

-- Central Region
WHERE region = 'Central'
  OR district IN ('Dunkwa', 'Assin')
```

## Major Gold Mines in Ghana (Reference)

Some major gold mines you might want to highlight:

1. **Obuasi Gold Mine** (Ashanti Region) - Lat: 6.19°N, Lng: 1.66°W
2. **Tarkwa Mine** (Western Region) - Lat: 5.30°N, Lng: 1.99°W
3. **Ahafo Mine** (Ahafo Region) - Lat: 7.34°N, Lng: 2.49°W
4. **Akyem Mine** (Eastern Region) - Lat: 6.33°N, Lng: 0.95°W
5. **Damang Mine** (Western Region) - Lat: 5.25°N, Lng: 2.06°W

You can add these as reference points:

```sql
SELECT 
  ST_GEOGPOINT(longitude, latitude) as geom,
  mine_name,
  'active' as status,
  'gold' as mineral_type,
  operator,
  production_oz_2023
FROM (
  SELECT 'Obuasi' as mine_name, -1.66 as longitude, 6.19 as latitude, 'AngloGold Ashanti' as operator, 296000 as production_oz_2023
  UNION ALL
  SELECT 'Tarkwa', -1.99, 5.30, 'Gold Fields', 565000, NULL
  -- Add more mines
)
```

## Testing the Application

After updating the data sources:

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Check browser console** for any API errors
3. **Verify layers render** - you should see gold-colored points and polygons
4. **Test tooltips** - click on mines/concessions to see data
5. **Check data counts** in the sidebar widgets

## Troubleshooting

### Layers Still Not Rendering?

1. **Check CARTO credentials** in `src/App.tsx`:
   ```typescript
   accessToken: "your_actual_token"
   ```

2. **Verify connection name**:
   ```typescript
   connection: "carto_dw" // or your actual connection name
   ```

3. **Test query in CARTO SQL console**:
   - Copy the query from `miningDataConfig.ts`
   - Run it in CARTO's SQL editor
   - Verify it returns data with `geom` column

4. **Check browser console** for error messages

### Common Errors

**Error: "Table not found"**
- Solution: Update table names to match your CARTO workspace

**Error: "Invalid credentials"**
- Solution: Generate new access token from CARTO dashboard

**Error: "No geometry column"**
- Solution: Ensure your query includes `geom` column with GEOGRAPHY type

**Error: "Empty result set"**
- Solution: Check your WHERE clause filters aren't too restrictive

## Performance Optimization

For large datasets:

```sql
-- Add spatial index hints
SELECT /*+ USE_SPATIAL_INDEX */ 
  geom,
  -- other columns
FROM your_table
WHERE ST_INTERSECTS(
  geom, 
  ST_GEOGFROMTEXT('POLYGON((...))')  -- Ghana boundary polygon
)
```

## Next Steps

1. ✅ Update queries in `src/config/miningDataConfig.ts`
2. ✅ Replace demo data with actual Goldbod/LI2404 data
3. ✅ Test locally with `npm run dev`
4. ✅ Verify all layers render correctly
5. ✅ Update widget statistics to pull from real data
6. ✅ Deploy to production

## Contact Information

**Goldbod Support**: [Your Goldbod contact]  
**Ghana Minerals Commission**: https://www.mincom.gov.gh/  
**LI2404 Documentation**: [Link to legislation]

---

**Current Demo Data Note**: The application currently uses `world_airports` demo data filtered to Ghana boundaries. This is temporary placeholder data that MUST be replaced with actual gold mining data for production use.
