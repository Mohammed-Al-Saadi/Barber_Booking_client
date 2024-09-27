import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import servicesReducer from "../redux/slices"; // Adjust the path if needed

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, servicesReducer);

const store = configureStore({
  reducer: {
    services: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Ignore persist actions
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
