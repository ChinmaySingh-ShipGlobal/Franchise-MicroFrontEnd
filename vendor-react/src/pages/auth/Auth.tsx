import { lazy } from "react";

const AuthPage = lazy(() => import("franchise/Login"));

export default function Auth() {
  return <AuthPage title="Heading for action">This is login page</AuthPage>;
}
