# 🥇 Ghana Gold Mining Analytics Platform

A geospatial analysis application for **gold mining operations** in Ghana, West Africa. Built with CARTO, deck.gl, and React. **LI2404 Compliant**.

## Features

- 🗺️ **Interactive Map**: Ghana-centered view with gold mining layers
- 📍 **Gold Concessions**: Visualize licensed gold mining areas (LI2404)
- ⛏️ **Active Gold Mines**: Track operational gold mining sites
- 💰 **Gold Transactions**: Monitor gold mining transaction data
- 🔥 **Activity Heatmaps**: Gold mining activity density visualization
- 📊 **Analytics Widgets**: Real-time gold mining statistics
- ✅ **Gold Focused**: Exclusively tracking gold (Au) operations

## Data Sources

This application is configured for **Goldbod Gold Mining Database**, including:
- Gold mining concessions and lease areas (LI2404 compliant)
- Active gold mine locations
- Gold transaction records
- Production volumes and activity metrics
- **Mineral Focus**: Gold (Au) only

## Quick Start

### Install Dependencies
```bash
npm install
```

### Configure CARTO Credentials
1. Update your CARTO access token in `src/App.tsx`:
```typescript
accessToken: "YOUR_ACCESS_TOKEN_HERE"
```

2. Update data table names in `src/config/miningDataConfig.ts` to match your CARTO tables

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Documentation

- 🥇 **[Gold Data Setup Guide](GOLD_DATA_SETUP.md)** - Quick guide for connecting Goldbod gold data ⭐ **START HERE**
- 📋 **[Changes Summary](CHANGES_SUMMARY.md)** - What changed in the gold-focused update
- 📘 **[Mining Setup Guide](MINING_SETUP.md)** - Application configuration and customization
- 📗 **[Goldbod Data Import Guide](GOLDBOD_DATA_IMPORT.md)** - Step-by-step data import process

## Project Structure

```
src/
├── config/
│   └── miningDataConfig.ts      # Data sources and layer styling
├── components/
│   ├── MiningLayers.tsx         # Map layer definitions
│   └── MiningWidgets.tsx        # Analytics sidebar widgets
├── App.tsx                       # Main application component
└── Redux.tsx                     # State management configuration
```

## Map Layers

1. **Heatmap Layer** - Gold mining activity density (yellow → red gradient)
2. **Gold Concessions Layer** - Polygons showing gold lease areas (gold/goldenrod)
3. **Gold Mines Layer** - Points for active gold mines (gold markers, 8-25px)
4. **Transactions Layer** - Gold transaction data points (blue, toggleable)

**Current Status**: Using demo data - replace with Goldbod data (see [GOLD_DATA_SETUP.md](GOLD_DATA_SETUP.md))

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Mapping**: deck.gl + MapLibre GL
- **Data Platform**: CARTO (v3 API)
- **UI Components**: Material-UI
- **State Management**: Redux Toolkit

## Expanding Coverage

To add more West African countries:
1. Export Goldbod data for the target country
2. Import following the [data import guide](GOLDBOD_DATA_IMPORT.md)
3. Update configuration in `miningDataConfig.ts`
4. Add country selector UI component

## Support

- **CARTO Documentation**: https://docs.carto.com/
- **deck.gl Documentation**: https://deck.gl/
- **Application Issues**: Check troubleshooting in MINING_SETUP.md

## License

Based on CARTO React Vite template

---

**Region**: Ghana, West Africa  
**Mineral**: Gold (Au) Only  
**Data Source**: Goldbod Gold Mining Database  
**Compliance**: LI2404 (Ghana Minerals Commission)  
**Last Updated**: 2025
