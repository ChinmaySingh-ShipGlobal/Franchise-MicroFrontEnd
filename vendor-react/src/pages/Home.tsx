import React, { lazy } from "react";

const FranchisePage = lazy(() => import("franchise/FranchisePage"));

export default function Home() {
  return <FranchisePage>Home</FranchisePage>;
}
