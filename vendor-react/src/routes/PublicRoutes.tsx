import { Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/auth/Auth";
import { lazy, Suspense } from "react";
import Dashboard from "../layout/Dashboard";
const DashboardLayout = lazy(() => import("franchise/Dashboard"));

export default function PublicRoutes() {
  return {
    path: "/",
    element: (
      <Suspense>
        <DashboardLayout headerChildren={"This is header exposed from franchise react"} />
      </Suspense>
    ),
    children: [
      { path: "", element: <Auth /> },
      { path: "/auth", element: <Auth /> },
      { path: "/home", element: <Home /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
  };
}
