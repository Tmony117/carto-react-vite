import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { createCartoSlice, InitialCarto3State } from "@carto/react-redux";
import { VOYAGER } from "@carto/react-basemaps";
import { API_VERSIONS } from "@deck.gl/carto/typed";
import { ReactNode } from "react";

// Ghana-centered view for West Africa mining analysis
const initialState: InitialCarto3State = {
  viewState: {
    latitude: 7.9465, // Ghana center
    longitude: -1.0232,
    zoom: 7,
    pitch: 0,
    bearing: 0,
    dragRotate: false,
  },
  basemap: VOYAGER,
  credentials: {
    apiVersion: API_VERSIONS.V3,
    apiBaseUrl: "https://gcp-us-east1.api.carto.com",
  },
  // TODO declare google variables as optional in c4r
  googleApiKey: "", // only required when using a Google Basemap,
  googleMapId: "", // only required when using a Google Custom Basemap
};

const store = configureStore({
  reducer: {
    carto: createCartoSlice(initialState),
  },
});

const ReduxProvider = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

export default ReduxProvider;
