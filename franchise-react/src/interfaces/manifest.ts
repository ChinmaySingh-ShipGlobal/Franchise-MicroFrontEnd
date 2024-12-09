import { Dispatch, SetStateAction } from "react";

export interface GetManifestDetails {
  manifest_code: string | undefined;
}

export interface AddRemoveToManifest extends GetManifestDetails {
  order_id: string;
}

export interface CloseManifest extends GetManifestDetails {
  manifest_pickup_date?: string;
  manifest_pickup_type: string;
}

export interface AddBulkManifest extends GetManifestDetails {
  order_id: string[];
  selected_pickup_address?: string;
}

export interface ManifestTableProps {
  title: string;
  data: TableData[];
  onActionClick: (row: TableData) => void;
  setRowSelection: Dispatch<SetStateAction<{}>>;
  rowSelection: any;
  createManifest?: boolean;
}

export interface ManifestState {
  manifestedOrders: PackedOrder[];
  manifestDetails: any;
  allOrders: PackedOrder[];
  refetch: boolean;
}

export interface OrderTableProps {
  title: string;
  data: AllOrders[];
  onActionClick: (order: PackedOrder) => void;
  rowSelection: Record<string, boolean>;
  setRowSelection: (selection: Record<string, boolean>) => void;
}

export interface TableData {
  id: string;
  orderID: string;
  customerDetails: string;
  orderDate: string;
  packageDetails: string;
  lastMileAWS: string;
  address: string;
  origin: string;
}
export interface PackedOrder {
  tracking: string;
  customer_shipping_country_code: string;
  vendor_reference_order_id: string;
  vendor_invoice_no: string;
  customer_shipping_firstname: string;
  customer_shipping_lastname: string;
  customer_shipping_email: string;
  customer_shipping_mobile: string;
  date_added: string;
  package_bill_weight: number;
  csb5_status: number;
  customer_shipping_address: string;
  customer_shipping_address_2: string;
  customer_shipping_address_3: string;
  partner_lastmile_awb_web_tracking: string;
  partner_lastmile_awb: string;
  partner_lastmile_display: string;
  origin: string;
  order_id: string;
  action: {
    onClick: (order_id: string) => void;
    label: string;
  };
}

export interface OrderId {
  tracking: string;
  customer_shipping_country_code: string;
  vendor_reference_order_id: string;
  vendor_invoice_no: string;
  order_id?: string;
}

export interface CustomerDetails {
  customer_shipping_firstname: string;
  customer_shipping_lastname: string;
  customer_shipping_email: string;
  customer_shipping_mobile: string;
}

export interface PackageDetails {
  package_bill_weight: number;
  csb5_status: string;
}

export interface Address {
  customer_shipping_address: string;
  customer_shipping_address_2: string;
  customer_shipping_address_3: string;
}

export interface Action {
  onClick: () => void;
  label: string;
  loading?: boolean;
}

export interface LastMileAWB {
  partner_lastmile_awb_web_tracking: string;
  order_id?: string;
  tracking: string;
  partner_lastmile_awb: string;
  partner_lastmile_display: string;
}

export interface AllOrders {
  orderId: OrderId;
  customerDetails: CustomerDetails;
  orderDate: string;
  packageDetails: PackageDetails;
  address: Address;
  lastMileAWB: string;
  origin: string;
  action: Action;
}
