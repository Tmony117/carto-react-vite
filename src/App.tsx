import { Grid, Box } from "@mui/material";

import Map from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import DeckGL from "@deck.gl/react/typed";
import { setDefaultCredentials, API_VERSIONS } from "@deck.gl/carto/typed";

import { AppBar } from "@carto/react-ui";
import { BASEMAPS } from "@carto/react-basemaps";

import { ReactComponent as Logo } from "@/assets/carto.svg";
import { useSimpleMiningLayers } from "./components/SimpleMiningLayers";
import { MiningWidgets } from "./components/MiningWidgets";
import { GHANA_CENTER } from "./config/miningDataConfig";

const useCredentials = () => {
  const credentials = {
    // Prepare the appropriate accessToken & apiBaseUrl to access your datasets and account at Workspace
    apiVersion: API_VERSIONS.V3,
    accessToken:
      "eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfNDd1dW5tZWciLCJqdGkiOiJkMDExNTlmYyJ9.OHB-o6t2PhtWF5dnBBTZ4CsjeGJVnPw6HTMpqTNc4Rg",
    apiBaseUrl: "https://gcp-us-east1.api.carto.com",
  };

  // NOTE: Prepare in your account a proper accessToken, for your required datasets & APIs
  setDefaultCredentials(credentials);
};

const useMap = () => {
  // Ghana-centered view for West Africa mining analysis
  const viewState = GHANA_CENTER;
  const basemap = BASEMAPS.voyager.options.mapStyle;

  return { viewState, basemap };
};

function App() {
  useCredentials();
  const { viewState, basemap } = useMap();
  const { layers } = useSimpleMiningLayers();

  return (
    <Grid container sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar brandLogo={<Logo />} brandText="🥇 Ghana Gold Mining Analytics">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              bgcolor: "#DAA520",
              color: "white",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Gold Focus
          </Box>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            LI2404 Compliant
          </Box>
        </Box>
      </AppBar>
      <Grid
        component="main"
        sx={{
          marginTop: "48px",
          flexGrow: 1,
          display: "flex",
        }}
        container
      >
        <Grid
          item
          component="aside"
          sx={{
            flex: "0 0 350px",
            p: 2,
            bgcolor: "background.paper",
            borderRight: 1,
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <MiningWidgets />
        </Grid>
        <Grid item component="section" sx={{ flex: "1", position: "relative", display: "flex" }}>
          <DeckGL initialViewState={viewState} layers={layers} controller={true}>
            <Map mapLib={maplibregl} mapStyle={basemap} />
          </DeckGL>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
