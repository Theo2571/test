import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import News from "./components/News/News";
import HomePage from "./pages/HomePage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/item/:id" element={<News />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};
export default AppRoutes;