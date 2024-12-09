export interface IOrderDetails {
  shipper_info: any;
  dispute_details: any;
  manifest_code: string;
  pickup_request_code: any;
  order_id: string;
  tracking?: string;
  date_added: string;
  package_length: string;
  package_breadth: string;
  package_height: string;
  package_weight: string;
  package_bill_weight: string;
  package_volume_weight: string;
  customer_shipping_firstname: string;
  customer_shipping_lastname: string;
  customer_shipping_address: string;
  customer_shipping_address_2: string;
  customer_shipping_address_3: string;
  customer_shipping_city: string;
  customer_shipping_state: string;
  customer_shipping_country: string;
  customer_shipping_postcode: string;
  customer_shipping_mobile: string;
  order_total: OrderTotalItem[];
  total: string;
  items: Item[];
  pickup_firstname: string;
  pickup_lastname: string;
  pickup_address: string;
  pickup_mobile: string;
  order_status_id: string;
  customer_billing_address: string;
  customer_billing_address_2: string;
  customer_billing_address_3: string;
  customer_billing_city: string;
  currency_code: string;
  pickup_landmark: string;
  pickup_city: string;
  pickup_postcode: string;
  status:number;
  order_status_name: string;
}

export const initialOrderDetails = {
  order_id: "",
  dispute_details: {},
  manifest_code: "",
  tracking: "",
  date_added: "",
  package_length: "",
  package_breadth: "",
  package_height: "",
  package_weight: "",
  package_bill_weight: "",
  package_volume_weight: "",
  customer_shipping_firstname: "",
  customer_shipping_lastname: "",
  customer_shipping_address: "",
  customer_shipping_address_2: "",
  customer_shipping_address_3: "",
  customer_shipping_city: "",
  customer_shipping_state: "",
  customer_shipping_country: "",
  customer_shipping_postcode: "",
  customer_shipping_mobile: "",
  order_total: [],
  shipper_info: {},
  total: "",
  items: [],
  pickup_firstname: "",
  pickup_lastname: "",
  pickup_address: "",
  pickup_mobile: "",
  order_status_id: "",
  customer_billing_address: "",
  customer_billing_address_2: "",
  customer_billing_address_3: "",
  customer_billing_city: "",
  currency_code: "",
  pickup_request_code: "",
  pickup_landmark: "",
  pickup_city: "",
  pickup_postcode: "",
};

export type OrderTotalItem = LogisticFee | GST;

interface LogisticFee {
  cancel_invoice_id: string;
  code: string;
  date_added: string;
  invoice_id: string;
  order_id: string;
  order_total_id: string;
  reverse_order_total_id: string;
  sort_order: string;
  tax_percentage: string;
  title: string;
  txn_invoice_status: string;
  value: string;
}

interface GST {
  code: string;
  order_id: number;
  sort_order: string;
  tax_percentage: string;
  title: string;
  value: string;
}

export interface Item {
  vendor_order_id: string;
  vendor_order_item_category_id: string;
  vendor_order_item_declare_unit_price: string;
  vendor_order_item_hsn: string;
  vendor_order_item_id: string;
  vendor_order_item_meta_data: string;
  vendor_order_item_name: string;
  vendor_order_item_quantity: string;
  vendor_order_item_sku: string;
  vendor_order_item_tax_rate: string;
  vendor_order_item_unit_price: string;
}
