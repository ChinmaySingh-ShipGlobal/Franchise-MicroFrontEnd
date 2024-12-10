import { Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";

export default function PublicRoutes() {
  return {
    path: "/",
    element: <Outlet />,
    children: [
      { path: "", element: <Home /> },
      { path: "/login", element: <Login /> },
    ],
  };
}
