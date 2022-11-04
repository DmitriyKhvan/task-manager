import { combineReducers, configureStore } from "@reduxjs/toolkit";
import toDoReducer from "./reducers/ToDoSlice";
import flagReducer from "./reducers/FlagSlice";

const rootReducer = combineReducers({
  toDoReducer,
  flagReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};
