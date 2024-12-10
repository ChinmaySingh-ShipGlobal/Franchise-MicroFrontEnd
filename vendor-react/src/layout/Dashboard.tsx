import { lazy } from "react";

const DashboardLayout = lazy(() => import("franchise/Dashboard"));
const FranchisePage = lazy(() => import("franchise/FranchisePage"));

export default function Dashboard() {
  return <FranchisePage className="min-h-screen">Dashboard page is here</FranchisePage>;
}
