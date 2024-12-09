export const initialOrderCounts = {
  dispatch_orders: "0",
  dispute_orders: "0",
  drafted_orders: "0",
  kyc_csb4_pending: "0",
  kyc_csb5_pending: "0",
  packed_orders: "0",
  pending_label_orders: "0",
  total_orders: "0",
};

export interface OrderDetailsPeriod {
  from_date?: string;
  to_date?: string;
}
export interface Transaction {
  Description: string;
  "Transaction Date": string;
}

export interface OrderDetails {
  dispatch_orders: string;
  dispute_orders: string;
  drafted_orders: string;
  kyc_csb4_pending: string;
  kyc_csb5_pending: string;
  packed_orders: string;
  pending_label_orders: string;
  total_orders: string;
}

interface SubMenuItem {
  key: string;
  label: string;
}
export interface SideBarItems {
  key: string;
  label: string;
  icon: JSX.Element;
  id: number;
  other_keys?: string[];
  subMenu?: SubMenuItem[];
}
