import { ProfileDetails } from "@/schemas/Profile";
import {
  ConsignorDetails,
  ConsigneeDetails,
  ShipmentDetails,
  SelectedConsignorDetails,
  ShippingRates,
  OrderSummary,
  PriceSummary,
  ConsigneeLocation,
} from "./interfaces";

//actions constants
//order module
export const UPDATE_ORDER_ID = "UPDATE_ORDER_ID";
export const UPDATE_ORDER_SELECTED_CONSIGNOR = "UPDATE_ORDER_SELECTED_CONSIGNOR";
export const UPDATE_ORDER_PRICE_SUMMARY = "UPDATE_ORDER_PRICE_SUMMARY";
export const UPDATE_ORDER_CONSIGNEE_DETAILS = "UPDATE_ORDER_CUSTOMER_DETAILS";
export const UPDATE_ORDER_SHIPMENT_DETAILS = "UPDATE_ORDER_SHIPMENT_DETAILS";
export const UPDATE_PROFILE_DETAILS = "UPDATE_PROFILE_DETAILS";
export const UPDATE_CONSIGNOR_CONTACT_DETAILS = "UPDATE_CONSIGNOR_CONTACT_DETAILS";
export const UPDATE_ORDER_SHIPPING_RATES = "UPDATE_ORDER_SHIPPING_RATES";
export const UPDATE_SUCCESSFUL_ORDER_SUMMARY = "UPDATE_SUCCESSFUL_ORDER_SUMMARY";
export const UPDATE_ACTIVE_ORDER_STEP = "UPDATE_ACTIVE_ORDER_STEP";
export const RESET_ADD_ORDER_FORM = "RESET_ADD_ORDER_FORM";
export const UPDATE_EDIT_ORDER_DATA = "UPDATE_EDIT_ORDER_DATA";
export const ADD_NEW_CONSIGNOR = "ADD_NEW_CONSIGNOR";
export const ADD_CUSTOMER_ID = "ADD_CUSTOMER_ID";
export const RESET_CUSTOMER_ID = "RESET_CUSTOMER_ID";
export const TOGGLE_LOGIN_STATUS = "TOGGLE_LOGIN_STATUS";
export const UPDATE_WALLET_BALANCE = "UPDATE_WALLET_DETAILS";
export const ADD_MANIFEST_CODE = "ADD_MANIFEST_CODE";
export const MANIFEST_SHOW_BUTTON = "MANIFEST_SHOW_BUTTON";
export const MANIFEST_PICKUP_DATES = "MANIFEST_PICKUP_DATES";
export const UPDATE_KYC_STATUS = "UPDATE_KYC_STATUS";
export const UPDATE_CONSIGNEE_LOCATION = "UPDATE_CONSIGNEE_LOCATION";
export const RESET_CONSIGNEE_LOCATION = "RESET_CONSIGNEE_LOCATION";
//action creators

//order module
export function resetOrderForm() {
  return { type: RESET_ADD_ORDER_FORM, payload: null };
}

export function resetCustomerID() {
  return { type: RESET_CUSTOMER_ID, payload: null };
}

export function updateOrderId(data: string) {
  return { type: UPDATE_ORDER_ID, payload: data };
}

export function updateKYCStatus(status: string) {
  return { type: UPDATE_KYC_STATUS, payload: status };
}

export function updateEditOrderForm(data: any) {
  return { type: UPDATE_EDIT_ORDER_DATA, payload: data };
}

export function updateActiveOrderStep(data: number) {
  return { type: UPDATE_ACTIVE_ORDER_STEP, payload: data };
}

export function updateOrderConsignorID(data: SelectedConsignorDetails) {
  return { type: UPDATE_ORDER_SELECTED_CONSIGNOR, payload: data };
}
export function addCustomerID(data: string) {
  return { type: ADD_CUSTOMER_ID, payload: data };
}
export function updateOrderSummary(data: OrderSummary) {
  return { type: UPDATE_SUCCESSFUL_ORDER_SUMMARY, payload: data };
}

export function updateOrderConsigneeDetails(data: ConsigneeDetails) {
  return { type: UPDATE_ORDER_CONSIGNEE_DETAILS, payload: data };
}

export function updateOrderShipmentDetails(data: ShipmentDetails) {
  return { type: UPDATE_ORDER_SHIPMENT_DETAILS, payload: data };
}
export function updateOrderPriceSummary(data: PriceSummary) {
  return { type: UPDATE_ORDER_PRICE_SUMMARY, payload: data };
}

export function updateOrderShippingRates(data: ShippingRates) {
  return { type: UPDATE_ORDER_SHIPPING_RATES, payload: data };
}

//misc
export function updateProfileDetails(data: ProfileDetails) {
  return { type: UPDATE_PROFILE_DETAILS, payload: data };
}
export function updateConsigneeLocation(data: ConsigneeLocation) {
  return { type: UPDATE_CONSIGNEE_LOCATION, payload: data };
}

export function resetConsigneeLocation() {
  return { type: RESET_CONSIGNEE_LOCATION, payload: null };
}

export function updateConsignorContactDetails(data: ConsignorDetails) {
  return { type: UPDATE_CONSIGNOR_CONTACT_DETAILS, payload: data };
}

export function addNewConsignor(data: ConsignorDetails) {
  return { type: ADD_NEW_CONSIGNOR, payload: data };
}

export function toggleLoginStatus(data: boolean) {
  return { type: TOGGLE_LOGIN_STATUS, payload: data };
}

export function updateWalletBalance(data: number) {
  return { type: UPDATE_WALLET_BALANCE, payload: data };
}

export function addManifestID(data: string) {
  return { type: ADD_MANIFEST_CODE, payload: data };
}

export function toggleManifestButton(data: boolean) {
  return { type: MANIFEST_SHOW_BUTTON, payload: data };
}

export function updateManifestPickupDates(data: any) {
  return { type: MANIFEST_PICKUP_DATES, payload: data };
}
