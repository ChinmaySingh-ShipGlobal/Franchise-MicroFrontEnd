import AddOrder from "@/pages/order/AddOrder";
import FranchiseKYC from "@/pages/kyc/FranchiseKYC";
import ChangePassword from "@/pages/ChangePassword";
import Profile from "@/pages/Profile";
import RateCalculator from "@/pages/order/RateCalculator";
import Wallet from "@/pages/Wallet";
import { useStore } from "@/zustand/store";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AddPickUpAddress from "@/pages/AddPickUpAddress";
import ViewOrders from "@/pages/order/ViewOrders";
import OrderSummary from "@/pages/order/OrderSummary";
import EditOrder from "@/pages/order/EditOrder";
import AddCSBVOrder from "@/pages/order/AddCSBVOrder ";
import CreateManifest from "@/pages/manifest/CreateManifest";
import ManifestListing from "@/pages/manifest/ManifestListing";
import PickupListing from "@/pages/pickup/PickupListing";
import ViewPickup from "@/pages/pickup/ViewPickup";
import NotFound from "@/pages/NotFound";
import BulkReport from "@/pages/bulk/BulkReport";
import CustomerListing from "@/pages/customer/CustomerListing";
import BulkOrder from "@/pages/bulk/BulkOrder";
import ErrorBoundary from "@/components/elements/ErrorBoundary";
import CSBVCustomerAdd from "@/pages/customer/CSBVCustomerAdd";
const OrderListing = lazy(() => import("@/pages/order/OrderListing"));
const DashboardLayout = lazy(() => import("@/layouts/Dashboard"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));

export default function PrivateRoutes() {
  const auth = useStore((state: any) => state.auth);
  return {
    path: "/",
    element: auth.isLoggedIn ? <DashboardLayout /> : <Navigate to="/auth/login" />,
    children: [
      { path: "", element: <DashboardPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "orders", element: <OrderListing /> },
      { path: "view-order/:orderId", element: <ViewOrders /> },
      { path: "edit-order/:orderId", element: <EditOrder /> },
      { path: "add-order", element: <AddOrder /> },
      { path: "add-csbv-order", element: <AddCSBVOrder /> },
      { path: "add-csbv-details/:consignor_id", element: <CSBVCustomerAdd /> },
      { path: "order-summary", element: <OrderSummary /> },
      { path: "/manifests/view/:manifest_code", element: <CreateManifest /> },
      { path: "manifest-listing", element: <ManifestListing /> },
      { path: "pickup-listing", element: <PickupListing /> },
      { path: "view-pickup/:pickup_request_id", element: <ViewPickup /> },
      { path: "kyc", element: <FranchiseKYC /> },
      { path: "calculator", element: <RateCalculator /> },
      { path: "profile", element: <Profile />, errorElement: <ErrorBoundary /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "wallet", element: <Wallet /> },
      { path: "customers", element: <CustomerListing /> },
      { path: "bulk-report", element: <BulkReport /> },
      { path: "add-bulk-order", element: <BulkOrder /> },
      { path: "add-pickup-address", element: <AddPickUpAddress /> },
      { path: "*", element: <NotFound /> },
    ],
  };
}
