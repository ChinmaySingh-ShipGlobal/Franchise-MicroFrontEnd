import { lazy } from "react";

const LoginPage = lazy(() => import("franchise/Login"));

export default function Login() {
  return <LoginPage />;
}
