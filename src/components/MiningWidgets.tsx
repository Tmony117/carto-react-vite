import { Grid, Paper, Typography, Box, Chip, Checkbox } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateLayer } from "@carto/react-redux";
import { MINING_DATA_SOURCES } from "../config/miningDataConfig";
import { getMockDataStats } from "./SimpleMiningLayers";

// You can import and use CARTO widgets when connected to real data
// import { FormulaWidget, CategoryWidget, HistogramWidget } from "@carto/react-widgets";

interface MiningStatsProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

const StatCard = ({ title, value, subtitle, color = "#1976d2" }: MiningStatsProps) => (
  <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" sx={{ color, fontWeight: 600 }}>
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Paper>
);

export const MiningWidgets = () => {
  const dispatch = useDispatch();
  const layers = useSelector((state: any) => state.carto?.layers || {});
  const stats = getMockDataStats();

  const toggleLayer = (layerId: string) => {
    const currentLayer = layers[layerId];
    // Check if layer exists and get its current visibility
    // Default to true if layer doesn't exist yet (layers are visible by default)
    const isVisible = currentLayer?.visible !== false;
    
    dispatch(updateLayer({
      id: layerId,
      layerAttributes: {
        visible: !isVisible,
      },
    }));
  };

  const isLayerVisible = (layerId: string) => {
    const layer = layers[layerId];
    // Default to visible if layer doesn't exist in Redux yet
    return layer?.visible !== false;
  };

  return (
    <Box sx={{ height: "100%", overflow: "auto" }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "#DAA520" }}>
        🏆 Ghana Gold Mining
      </Typography>

      {/* Quick Stats Grid - Gold Mining Focus */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <StatCard
            title="Gold Concessions"
            value={stats.concessions}
            subtitle="Licensed gold areas"
            color="#DAA520"
          />
        </Grid>
        <Grid item xs={12}>
          <StatCard
            title="Active Gold Mines"
            value={stats.mines}
            subtitle="Operational sites"
            color="#FFD700"
          />
        </Grid>
        <Grid item xs={12}>
          <StatCard
            title="Gold Transactions"
            value={stats.transactions}
            subtitle="Recent activity"
            color="#B8860B"
          />
        </Grid>
      </Grid>

      {/* Mining Type - Gold Only */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: "#FFFACD" }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Focus Mineral
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          <Chip 
            label="🥇 Gold (Au)" 
            sx={{ 
              bgcolor: "#FFD700", 
              color: "#000", 
              fontWeight: 600,
              fontSize: "0.9rem"
            }} 
          />
        </Box>
        <Typography variant="caption" sx={{ mt: 1, display: "block", color: "text.secondary" }}>
          Ghana's primary export mineral
        </Typography>
      </Paper>

      {/* Layer Controls - Gold Mining */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Gold Mining Layers
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Box
            onClick={() => toggleLayer("ghanaGoldConcessionsLayer")}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              p: 0.5,
              borderRadius: 1,
            }}
          >
            <Checkbox
              checked={isLayerVisible("ghanaGoldConcessionsLayer")}
              size="small"
              sx={{ p: 0, mr: 1 }}
            />
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "rgba(255, 215, 0, 0.4)",
                border: "2px solid rgb(218, 165, 32)",
                mr: 1,
                borderRadius: 0.5,
              }}
            />
            <Typography variant="body2">Gold Concessions</Typography>
          </Box>
          <Box
            onClick={() => toggleLayer("ghanaGoldMinesLayer")}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              p: 0.5,
              borderRadius: 1,
            }}
          >
            <Checkbox
              checked={isLayerVisible("ghanaGoldMinesLayer")}
              size="small"
              sx={{ p: 0, mr: 1 }}
            />
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "rgb(255, 215, 0)",
                mr: 1,
                borderRadius: "50%",
                border: "1px solid #000",
              }}
            />
            <Typography variant="body2">Gold Mines</Typography>
          </Box>
          <Box
            onClick={() => toggleLayer("ghanaGoldTransactionsLayer")}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              p: 0.5,
              borderRadius: 1,
            }}
          >
            <Checkbox
              checked={isLayerVisible("ghanaGoldTransactionsLayer")}
              size="small"
              sx={{ p: 0, mr: 1 }}
            />
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "rgba(33, 150, 243, 0.7)",
                mr: 1,
                borderRadius: "50%",
              }}
            />
            <Typography variant="body2">Transactions</Typography>
          </Box>
          <Box
            onClick={() => toggleLayer("ghanaGoldHeatmapLayer")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
              p: 0.5,
              borderRadius: 1,
            }}
          >
            <Checkbox
              checked={isLayerVisible("ghanaGoldHeatmapLayer")}
              size="small"
              sx={{ p: 0, mr: 1 }}
            />
            <Box
              sx={{
                width: 16,
                height: 16,
                background: "linear-gradient(to right, #fff7cc, #bd0026)",
                mr: 1,
                borderRadius: 0.5,
              }}
            />
            <Typography variant="body2">Activity Heatmap</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Data Info - Gold Focus */}
      <Paper elevation={2} sx={{ p: 2, bgcolor: "#FFF8DC" }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Data Source:</strong> Goldbod Gold Mining Database
          <br />
          <strong>Compliance:</strong> LI2404 (Ghana Minerals Commission)
          <br />
          <strong>Region:</strong> Ghana, West Africa
          <br />
          <strong>Mineral:</strong> Gold (Au) Only
          <br />
          <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </Typography>
      </Paper>

      {/* Uncomment when connected to real data sources */}
      {/*
      <Box sx={{ mt: 3 }}>
        <FormulaWidget
          id="totalConcessions"
          title="Total Concessions"
          dataSource={MINING_DATA_SOURCES.concessions.id}
          column="area_hectares"
          operation="sum"
          formatter={(value) => `${value.toLocaleString()} ha`}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <CategoryWidget
          id="miningTypeBreakdown"
          title="Mining by Type"
          dataSource={MINING_DATA_SOURCES.mines.id}
          column="mineral_type"
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <HistogramWidget
          id="productionVolume"
          title="Production Volume Distribution"
          dataSource={MINING_DATA_SOURCES.transactions.id}
          column="production_volume"
        />
      </Box>
      */}
    </Box>
  );
};

export default MiningWidgets;
