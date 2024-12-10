import { lazy } from "react";

const PublicPages = lazy(() => import("franchise/PublicPages"));

export default function Login() {
  return <PublicPages>Login</PublicPages>;
}
