import { configureStore } from '@reduxjs/toolkit'
import {newsSliceReducer} from "./NewsSlice";

export const store = configureStore({
    reducer: {
        userReducer: newsSliceReducer,
    },
})
export default store;