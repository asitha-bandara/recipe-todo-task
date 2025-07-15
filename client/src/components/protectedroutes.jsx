import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
    const token = localStorage.getItem('jwtToken');
    if (!token) return <Navigate to="./" />;
    return <Outlet />;
}