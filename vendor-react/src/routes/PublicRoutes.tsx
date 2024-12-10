import { Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/auth/Auth";
import { Suspense } from "react";

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
      { path: "/home", element: <Home /> },
    ],
  };
}
