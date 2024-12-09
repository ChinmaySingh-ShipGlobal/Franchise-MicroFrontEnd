import { AdminLogin } from "@/pages/AdminLogin";
import CreatePassword from "@/pages/auth/CreatePassword";
import { useStore } from "@/zustand/store";
import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Home = lazy(() => import("@/components/Home"));

export default function PublicRoutes() {
  const auth = useStore((state: any) => state.auth);
  return {
    path: "/auth/",
    element: auth.isLoggedIn ? <Navigate to="/dashboard" /> : <Outlet />,
    children: [
      { path: "", element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "create-password", element: <CreatePassword /> },
      { path: "register", element: <Register /> },
      { path: "home", element: <Home /> },
      { path: "*", element: <NotFound /> },
      { path: "admin-login", element: <AdminLogin /> },
    ],
  };
}
