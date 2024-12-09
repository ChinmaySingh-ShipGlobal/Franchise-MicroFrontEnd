import { generateUniqueId } from "@/lib/utils";
import { ReactNode } from "react";

export enum ShipmentType {
  CSBIV = "0",
  CSBV = "1",
}

//Consignor Details Step 1 - Add Order Data Types
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
  documentType: string;
  documentNumber: string;
}

export const initialSelectedConsignorDetails = {
  consignor_id: "",
  name: "",
  email: "",
  mobile: "",
  address: "",
  location: "",
  documentType: "",
  documentNumber: "",
};

//Consignee Details Step 2 - Add Order Data Types
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

//Shipment Details Step 3 - Add Order Data Types
export interface ProductDetails {
  id: string;
  productName: string;
  productSKU?: string;
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

//Shipper Details Step 4 - Add Order Data Types
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

// Add Order Sidebar Summary Data Types
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

export interface ItemDetails {
  vendor_order_item_id?: string;
  vendor_order_item_name: string;
  vendor_order_item_hsn: string;
  vendor_order_item_quantity: string | number;
  vendor_order_item_unit_price: string | number;
  vendor_order_item_tax_rate: string;
}

export interface ValidateOrderItems {
  csbv: number;
  currency_code: string;
  vendor_order_item: ItemDetails[];
  "csbv5-limit-comfirmation"?: number;
}

export interface PriceDetails {
  code: string;
  title: string;
  value: string;
}

//Order Creation Summary Data Types
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

export interface MetaData {
  address: string;
  date_of_birth: string;
  district: string;
  fathers_name: string;
  gender: string;
  house_number: string;
  id_number: string;
  is_scanned: string;
  name_on_card: string;
  pincode: string;
  state: string;
  street_address: string;
  year_of_birth: string;
  city: string;
  document_type: string;
}

export interface KycDoc {
  doc_id: number;
  document_type: string;
  document_value: string;
}

export interface Customer {
  country_code: string;
  csb5_status: string;
  customer_id: string;
  customer_type: string;
  date_added: string;
  date_modified: string | null;
  default_kyc_id: string;
  email: string;
  firstname: string;
  kyc_docs: KycDoc[];
  kyc_status: string;
  lastname: string;
  meta_data: MetaData;
  mobile: string;
  status: string;
  vendor_id: string;
}

export interface AddCustomer {
  label: string;
  value: string;
  csb5_status: string;
}
export interface OrderStepFormProps {
  title: string;
  content: ReactNode;
  step: number;
}

export interface ProcessDispute {
  order_id: string | undefined;
  action: string;
}
