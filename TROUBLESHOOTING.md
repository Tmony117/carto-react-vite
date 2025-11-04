# Troubleshooting Guide - Ghana Gold Mining App

## Current Issues Fixed ✅

### 1. Layer Rendering Problems
**Problem**: Layers had undefined IDs and SQL queries were treated as URLs  
**Solution**: 
- Created `SimpleMiningLayers.tsx` with proper layer IDs
- Using actual CARTO demo tables (`world_airports`)
- All layers now have unique IDs: `ghanaGoldConcessionsLayer`, `ghanaGoldMinesLayer`, etc.

### 2. Data Source Issues
**Problem**: Queries were failing with 404 errors  
**Solution**:
- Changed from `MAP_TYPES.QUERY` to `MAP_TYPES.TABLE`
- Using existing CARTO demo data that's accessible
- Added `uniqueIdProperty: "cartodb_id"` to all layers

### 3. Multiple Layer Conflicts
**Problem**: "Multiple new layers with same id undefined"  
**Solution**:
- Each layer now has a unique ID
- Proper cleanup in useEffect
- Layers added to Redux store correctly

## How to Test the App 🔧

### Step 1: Start Development Server
```bash
npm install
npm run dev
```

### Step 2: What You Should See
- Map centered on Ghana (7.9465°N, 1.0232°W)
- Gold-colored points representing airports (demo data)
- Gold-themed UI with "🥇 Ghana Gold Mining Analytics" header
- Sidebar with gold mining statistics

### Step 3: Check Browser Console
Open Developer Tools (F12) and look for:
- ✅ No "undefined layer" errors
- ✅ No 404 errors for SQL queries
- ✅ Layers should load successfully

### Step 4: Test Map Interaction
- Pan and zoom the map
- Click on gold points to see tooltips
- Verify map stays within reasonable bounds

## Current Demo Data 🗺️

The app is currently using `carto-demo-data.demo_tables.world_airports` as placeholder data:
- **Points**: Airport locations worldwide
- **Colors**: Gold/goldenrod theme
- **Purpose**: Test that layers render correctly
- **Next Step**: Replace with your Goldbod data

## Connecting Real Goldbod Data 🥇

When you're ready to connect your actual data:

### 1. Update SimpleMiningLayers.tsx
Replace the data source in each layer:

```typescript
// Replace this:
data: "carto-demo-data.demo_tables.world_airports"

// With this:
data: "your-project.goldbod.ghana_gold_concessions"
```

### 2. Add Ghana Filtering
Add spatial filters to show only Ghana data:

```typescript
// Add to CartoLayer props:
filter: `ST_Y(geom) BETWEEN 4.5 AND 11.5 AND ST_X(geom) BETWEEN -3.5 AND 1.5`
```

### 3. Update Layer Properties
Match your actual data columns:

```typescript
// Example for concessions:
getFillColor: (d: any) => {
  return d.properties?.mineral_type === 'gold' 
    ? [255, 215, 0, 100]  // Gold
    : [200, 200, 200, 50]; // Other minerals (grey)
}
```

## Common Issues & Solutions

### Issue: "No valid loader found"
**Cause**: Data source doesn't exist or is inaccessible  
**Solution**: 
1. Check CARTO credentials in `src/App.tsx`
2. Verify table names exist in your CARTO workspace
3. Test query in CARTO SQL console first

### Issue: Map shows but no points
**Cause**: Data outside map bounds or filtered out  
**Solution**:
1. Check if data has geometry column
2. Verify Ghana bounds filter isn't too restrictive
3. Check data in CARTO SQL console

### Issue: Points are wrong color
**Cause**: Layer styling not applied correctly  
**Solution**:
1. Verify `getFillColor` function
2. Check RGBA values are valid (0-255)
3. Ensure layer is visible (not hidden)

### Issue: Performance is slow
**Cause**: Too much data loading  
**Solution**:
1. Add LIMIT clauses to queries
2. Use spatial filtering
3. Consider aggregating data for heatmaps

## File Structure After Fix 📁

```
src/
├── components/
│   ├── SimpleMiningLayers.tsx    # ✅ Working layer implementation
│   ├── MiningLayers.tsx          # ⚠️ Old version (broken)
│   └── MiningWidgets.tsx         # ✅ Gold-themed widgets
├── config/
│   └── miningDataConfig.ts       # ⚠️ Needs updating for real data
├── App.tsx                       # ✅ Uses SimpleMiningLayers
└── Redux.tsx                     # ✅ Ghana-centered view
```

## Next Steps Checklist 📋

### Immediate (to verify fix):
- [ ] Run `npm run dev`
- [ ] See gold points on map
- [ ] No console errors
- [ ] Map centered on Ghana

### For Production:
- [ ] Replace demo data with Goldbod tables
- [ ] Add Ghana spatial filtering
- [ ] Update widget statistics
- [ ] Test with real data
- [ ] Deploy to production

## Debug Commands 🛠️

### Check CARTO Connection
```javascript
// In browser console:
console.log(window.deck.layers);
// Should show your layers with data
```

### Test Data Access
```sql
-- In CARTO SQL console:
SELECT COUNT(*) FROM carto-demo-data.demo_tables.world_airports
WHERE ST_Y(geom) BETWEEN 4.5 AND 11.5
  AND ST_X(geom) BETWEEN -3.5 AND 1.5;
```

### Verify Layer IDs
```javascript
// Check Redux store:
console.log(window.__REDUX_STORE__.getState());
```

## Support Contacts 📞

- **CARTO Support**: https://docs.carto.com/
- **deck.gl Issues**: https://github.com/visgl/deck.gl
- **Goldbod Data**: [Your Goldbod contact]

---

**Status**: ✅ **Fixed - Layers should now render with demo data**  
**Next**: Replace demo data with your Goldbod gold mining data  
**Last Updated**: {new Date().toISOString().split('T')[0]}
