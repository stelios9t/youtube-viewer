import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

import videosReducer from "./videosSlice";

//combining reducers, as the application grows more reducers will be needed and added here
const rootReducer = combineReducers({
  videos: videosReducer,
});
// Defining the shape of the entire Redux state
export type RootState = ReturnType<typeof rootReducer>;

//complete state of the app
export const store = configureStore({
  reducer: rootReducer,
});
