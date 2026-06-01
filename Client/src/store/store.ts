import { configureStore } from "@reduxjs/toolkit";
import { useSelector as useAppSelector } from "react-redux";

export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type useDispatch = typeof store.dispatch;
export const useSelector = useAppSelector<RootState>;