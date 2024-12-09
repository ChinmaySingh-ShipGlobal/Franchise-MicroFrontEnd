import { initialShippingRates } from "@/interfaces/add-order";
import {
  ADD_NEW_CONSIGNOR,
  TOGGLE_LOGIN_STATUS,
  UPDATE_ACTIVE_ORDER_STEP,
  UPDATE_CONSIGNOR_CONTACT_DETAILS,
  UPDATE_ORDER_CONSIGNEE_DETAILS,
  UPDATE_ORDER_SELECTED_CONSIGNOR,
  UPDATE_ORDER_SHIPMENT_DETAILS,
  UPDATE_ORDER_SHIPPING_RATES,
  UPDATE_SUCCESSFUL_ORDER_SUMMARY,
  UPDATE_PROFILE_DETAILS,
  UPDATE_WALLET_BALANCE,
  RESET_ADD_ORDER_FORM,
  UPDATE_ORDER_PRICE_SUMMARY,
  UPDATE_EDIT_ORDER_DATA,
  UPDATE_ORDER_ID,
  ADD_CUSTOMER_ID,
  RESET_CUSTOMER_ID,
  ADD_MANIFEST_CODE,
  MANIFEST_SHOW_BUTTON,
  MANIFEST_PICKUP_DATES,
  UPDATE_KYC_STATUS,
  UPDATE_CONSIGNEE_LOCATION,
} from "./actions";
import {
  initialConsigneeDetails,
  initialConsignorDetails,
  initialPriceSummary,
  initialSelectedConsignorDetails,
  initialShipmentDetails,
} from "./interfaces";
import { State, Action, initialStore } from "./store";

export const rootReducer = (state: State, action: Action) => {
  switch (action.type) {
    case UPDATE_ORDER_CONSIGNEE_DETAILS:
      return { ...state, order: { ...state.order, consigneeDetails: action.payload } };
    case UPDATE_ORDER_SELECTED_CONSIGNOR:
      return { ...state, order: { ...state.order, selectedConsignorDetails: action.payload } };
    case UPDATE_ORDER_SHIPMENT_DETAILS:
      return { ...state, order: { ...state.order, shipmentDetails: action.payload } };
    case UPDATE_KYC_STATUS:
      return { ...state, kyc_status: action.payload };
    case UPDATE_EDIT_ORDER_DATA:
      return {
        ...state,
        order: {
          consignorDetails: initialConsignorDetails,
          selectedConsignorDetails: action.payload.selectedConsignorDetails,
          consigneeDetails: action.payload.consigneeDetails,
          shipmentDetails: action.payload.shipmentDetails,
          priceSummary: initialPriceSummary,
          selected_shipper: action.payload.selected_shipper,
          activeStep: 2,
          orderSummary: state.order.orderSummary,
          shippingRates: initialShippingRates,
        },
      };
    case RESET_ADD_ORDER_FORM:
      return {
        ...state,
        order: {
          consignorDetails: initialConsignorDetails,
          selectedConsignorDetails: initialSelectedConsignorDetails,
          consigneeDetails: initialConsigneeDetails,
          shipmentDetails: initialShipmentDetails,
          priceSummary: initialPriceSummary,
          shippingRates: initialShippingRates,
          activeStep: 1,
          orderSummary: state.order.orderSummary,
        },
      };

    case UPDATE_ORDER_ID:
      return { ...state, order: { ...state.order, order_id: action.payload } };
    case UPDATE_SUCCESSFUL_ORDER_SUMMARY:
      return {
        ...state,
        order: {
          ...state.order,
          orderSummary: action.payload,
        },
      };
    case UPDATE_ORDER_SHIPPING_RATES:
      return { ...state, order: { ...state.order, shippingRates: action.payload } };
    case UPDATE_ORDER_PRICE_SUMMARY:
      return { ...state, order: { ...state.order, priceSummary: action.payload } };
    case UPDATE_CONSIGNOR_CONTACT_DETAILS:
      return {
        ...state,
        order: { ...state.order, consignorDetails: action.payload },
      };
    case UPDATE_ACTIVE_ORDER_STEP:
      return {
        ...state,
        order: { ...state.order, activeStep: action.payload },
      };

    case ADD_NEW_CONSIGNOR:
      return {
        ...state,
        order: { ...state.order, consignorDetails: { ...state.order.consignorDetails, ...action.payload } },
      };

    case UPDATE_PROFILE_DETAILS:
      return { ...state, profile: action.payload };

    case UPDATE_CONSIGNEE_LOCATION:
      return { ...state, consigneeLocation: { ...state.consigneeLocation, ...action.payload } };

    case ADD_CUSTOMER_ID:
      return { ...state, customer_id: action.payload };

    case RESET_CUSTOMER_ID:
      return { ...state, customer_id: "" };

    case TOGGLE_LOGIN_STATUS:
      return { ...initialStore, auth: { isLoggedIn: action.payload } };

    case UPDATE_WALLET_BALANCE:
      return { ...state, wallet: { balance: action.payload } };

    case ADD_MANIFEST_CODE:
      return { ...state, manifest_code: action.payload };

    case MANIFEST_SHOW_BUTTON:
      return { ...state, manifest_show_buttons: action.payload };

    case MANIFEST_PICKUP_DATES:
      return { ...state, manifest_pickup_dates: action.payload };

    default:
      return state;
  }
};
