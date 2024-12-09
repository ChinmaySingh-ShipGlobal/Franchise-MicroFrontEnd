import { generateUniqueId } from "@/lib/utils";

export enum ShipmentType {
  CSBIV = "0",
  CSBV = "1",
}

export interface ConsigneeDetails {
  shipmentType: ShipmentType;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address1: string;
  address2?: string;
  address3: string;
  pincode: string;
  country: string;
  state: string;
  city: string;
  isBillingSameAsShipping?: boolean;
  address1_billing?: string;
  address2_billing?: string;
  address3_billing?: string;
  pincode_billing?: string;
  country_billing?: string;
  state_billing?: string;
  city_billing?: string;
}

export interface ConsigneeLocation {
  country: string;
  state: string;
  country_billing: string;
  state_billing: string;
}

export const initialConsigneeLocation = {
  country: "",
  state: "",
  country_billing: "",
  state_billing: "",
};

export const initialConsigneeDetails = {
  shipmentType: ShipmentType.CSBIV,
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  address1: "",
  address2: "",
  address3: "",
  pincode: "",
  country: "",
  state: "",
  city: "",
  isBillingSameAsShipping: true,
  address1_billing: "",
  address2_billing: "",
  address3_billing: "",
  pincode_billing: "",
  country_billing: "",
  state_billing: "",
  city_billing: "",
};

export interface ShipmentDetails {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceCurrency: string;
  orderReferenceNo?: string;
  iossNumber?: string;
  packageWeight: number | string;
  packageLength: number | string;
  packageBreadth: number | string;
  packageHeight: number | string;
  products: ProductDetails[];
}

export interface ProductDetails {
  id: string;
  productName: string;
  productSKU: string;
  productQty: number | string;
  productUnitPrice: number | string;
  productIGST: string;
  productHSN: string;
}

export const initialProductValue = {
  id: generateUniqueId(),
  productName: "",
  productSKU: "",
  productIGST: "0",
  productQty: "",
  productUnitPrice: "",
  productHSN: "",
};

export const initialShipmentDetails = {
  invoiceNumber: "",
  invoiceDate: "",
  invoiceCurrency: "INR",
  orderReferenceNo: "",
  iossNumber: "",
  packageWeight: "",
  packageLength: "",
  packageBreadth: "",
  packageHeight: "",
  products: [initialProductValue],
};

export interface ShippingRates {
  pickup_fee: number;
  package_weight: number;
  volume_weight: number;
  bill_weight: number;
  notices: string[];
  rate: RateItem[];
}

export const initialShippingRates = {
  pickup_fee: 0,
  package_weight: 0,
  volume_weight: 0,
  bill_weight: 0,
  notices: [],
  rate: [],
};

export interface ConsignorDetails {
  email: string;
  mobile: string;
  documentType: string;
  documentNumber: string;
  documentFile: any; //change to file later
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
}

export const initialConsignorDetails = {
  email: "",
  mobile: "",
  documentType: "",
  documentNumber: "",
  documentFile: "",
  firstName: "",
  lastName: "",
  address: "",
  state: "",
  city: "",
  pincode: "",
};

export interface SelectedConsignorDetails {
  consignor_id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  location?: string;
  document_type: string;
  documentNumber: string;
  csb5_status: string;
}

export const initialSelectedConsignorDetails = {
  consignor_id: "",
  name: "",
  email: "",
  mobile: "",
  address: "",
  location: "",
  document_type: "",
  documentNumber: "",
  csb5_status: "",
};

export interface Shipper {
  HANDLING_FEE: number;
  LOGISTIC_FEES: number;
  REMOTE_FEES: number;
  bill_weight_kg: number;
  display_name: string;
  handling_charges: number;
  helper_text: string;
  image: string;
  provider_code: string;
  provider_status: boolean;
  rate?: number;
  remote_charges: number;
  transit_time: string;
}

export const initialShipperDetails = {
  HANDLING_FEE: 0,
  LOGISTIC_FEES: 0,
  REMOTE_FEES: 0,
  bill_weight_kg: 0,
  display_name: "",
  handling_charges: 0,
  helper_text: "",
  image: "",
  provider_code: "",
  provider_status: false,
  rate: 0,
  remote_charges: 0,
  transit_time: "",
};

export const initialSelectedShippingRates = {
  provider_code: "",
  display_name: "",
  helper_text: "",
  image: "",
  transit_time: "",
  rate: 0,
  cost: 0,
  cost_calc: "",
  bill_weight_kg: 0,
  remote_charges: 0,
  handling_charges: 0,
  provider_status: false,
  LOGISTIC_FEE: 0,
  REMOTE_FEE: 0,
  HANDLING_FEE: 0,
};

export interface PriceSummary {
  provider_code: string;
  order_id: string;
  order_total: PriceDetails[];
  total: string;
}

export const initialPriceSummary = {
  provider_code: "",
  order_id: "",
  order_total: [],
  total: "",
};

export interface RateItem {
  provider_code: string;
  display_name: string;
  helper_text: string;
  image: string;
  transit_time: string;
  rate: number;
  cost: number;
  cost_calc: string;
  bill_weight_kg: number;
  remote_charges: number;
  handling_charges: number;
  provider_status: boolean;
  LOGISTIC_FEE: number;
  REMOTE_FEE: number;
  HANDLING_FEE: number;
}

export interface RateCalculatorData {
  pickup_fee: number;
  rate: RateItem[];
  package_weight: number;
  volume_weight: number;
  bill_weight: number;
  notices: string[];
}

// initial  value for order summary

export const initialOrderSummary = {
  billed_weight: 0,
  tracking: "",
  customer_shipping_firstname: "",
  customer_shipping_lastname: "",
  customer_shipping_mobile: "",
  customer_shipping_address: "",
  customer_shipping_address_2: "",
  customer_shipping_address_3: "",
  customer_shipping_city: "",
  customer_shipping_state: "",
  customer_shipping_country: "",
  csb5_status: "",
  package_breadth: "",
  package_height: "",
  package_length: "",
  package_weight: "",
  total: "",
  items: [],
  order_total: [],
};

export interface OrderSummary {
  package_weight: string;
  tracking: string;
  customer_shipping_firstname: string;
  customer_shipping_lastname: string;
  customer_shipping_mobile: string;
  customer_shipping_address: string;
  customer_shipping_address_2: string;
  customer_shipping_address_3: string;
  customer_shipping_city: string;
  customer_shipping_state: string;
  customer_shipping_country: string;
  csb5_status: string;
  package_breadth: string;
  package_height: string;
  package_length: string;
  total: string;
  items: ItemDetails[];
  order_total: PriceDetails[];
}

export interface ItemDetails {
  vendor_order_item_id: string;
  vendor_order_item_name: string;
  vendor_order_item_hsn: string;
  vendor_order_item_sku: string;
  vendor_order_item_quantity: string;
  vendor_order_item_unit_price: string;
  vendor_order_item_tax_rate: string;
}

export interface PriceDetails {
  code: string;
  title: string;
  value: string;
}
