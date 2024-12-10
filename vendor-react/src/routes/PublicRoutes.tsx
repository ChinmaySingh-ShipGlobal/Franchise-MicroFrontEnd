import { Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/auth/Auth";
import { Suspense } from "react";
import Dashboard from "../pages/layout/Dashboard";

export default function PublicRoutes() {
  return {
    path: "/",
    element: (
      <Suspense>
        <Outlet />
      </Suspense>
    ),
    children: [
      { path: "", element: <Auth /> },
      { path: "/auth", element: <Auth /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/home", element: <Home /> },
    ],
  };
}
