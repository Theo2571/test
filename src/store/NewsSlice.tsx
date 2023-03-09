// @ts-nocheck
import axios from 'axios';
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {NewsItem} from "../types/interface";

const BASE_URL = "https://hacker-news.firebaseio.com/v0"

const initialState = {
    by: "",
    descendants: null,
    id: null,
    score: null,
    time: null,
    title: "",
    type: "",
    url: "",
    news: [],
    loading: false
} as unknown as NewsItem


export const fetchNewsList = createAsyncThunk(
    "list/fetchNewsList",
    async function () {
        try {
            const response = await axios.get(`${BASE_URL}/newstories.json`);
            const data = response.data;
            return await Promise.all(
                data
                    .slice(0, 100)
                    .map((id: number) => axios.get(`${BASE_URL}/item/${id}.json`).then(response => response.data))
            );
        } catch (error) {
            console.error(error);
        }
    }
);
export const fetchNews = createAsyncThunk(
    "list/fetchNews",
    async function (id) {
        try {
            const response = await axios.get(`${BASE_URL}/item/${id}.json`).then(response => response.data);
            return response;
        } catch (error) {
            console.error(error);
        }
    }
);


const newsSlice = createSlice({
    name: 'news',
    initialState: { news: [], loading: false,},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchNewsList.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchNewsList.fulfilled, (state, action) => {
            state.loading = false;
            state.news = action.payload;
        });
        builder.addCase(fetchNewsList.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(fetchNews.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchNews.fulfilled, (state, action) => {
            state.loading = false;
            state.news = action.payload;
        });
        builder.addCase(fetchNews.rejected, (state) => {
            state.loading = false;
        });
    },
});
export const newsSliceReducer = newsSlice.reducer
