import { create } from "zustand";
import {
  ConsignorDetails,
  ConsigneeDetails,
  initialConsignorDetails,
  initialConsigneeDetails,
  initialShipmentDetails,
  ShipmentDetails,
  initialSelectedConsignorDetails,
  SelectedConsignorDetails,
  initialShippingRates,
  ShippingRates,
  initialOrderSummary,
  OrderSummary,
  PriceSummary,
  initialPriceSummary,
  ConsigneeLocation,
  initialConsigneeLocation,
} from "./interfaces";
import { rootReducer } from "./reducer";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { initialProfileDetails, ProfileDetails } from "@/schemas/Profile";

// global application state object types
export interface State {
  order: {
    consignorDetails: ConsignorDetails;
    selectedConsignorDetails: SelectedConsignorDetails;
    consigneeDetails: ConsigneeDetails;
    shipmentDetails: ShipmentDetails;
    shippingRates: ShippingRates;
    priceSummary: PriceSummary;
    orderSummary: OrderSummary;
    activeStep: number;
    selected_shipper: string;
    order_id: string;
  };
  profile: ProfileDetails;
  auth: {
    isLoggedIn: boolean;
  };
  wallet: {
    balance: number;
  };
  customer_id: string;
  manifest_code: string;
  manifest_show_buttons: boolean;
  manifest_pickup_dates: any;
  kyc_status: string | null;
  consigneeLocation: ConsigneeLocation;
}

export const initialStore: State = {
  order: {
    consignorDetails: initialConsignorDetails,
    selectedConsignorDetails: initialSelectedConsignorDetails,
    consigneeDetails: initialConsigneeDetails,
    shipmentDetails: initialShipmentDetails,
    shippingRates: initialShippingRates,
    priceSummary: initialPriceSummary,
    orderSummary: initialOrderSummary,
    activeStep: 1,
    selected_shipper: "",
    order_id: "",
  },
  consigneeLocation: initialConsigneeLocation,
  customer_id: "",
  manifest_code: "",
  manifest_show_buttons: false,
  manifest_pickup_dates: {},
  profile: initialProfileDetails,
  kyc_status: null,
  auth: {
    isLoggedIn: localStorage.getItem("token") ? true : false,
  },
  wallet: {
    balance: 0,
  },
};

export interface Action {
  type: string;
  payload: any;
}

const myMiddlewares = (f: any) =>
  devtools(
    persist(f, {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
    }),
  );

export const useStore = create()(
  myMiddlewares((set: any) => ({
    ...initialStore,
    dispatch: (actionCreator: (...args: any[]) => Action) => {
      const action = actionCreator();
      set((state: State) => rootReducer(state, action));
    },
  })),
);

/* type of middleware input - <State & { dispatch: (actionCreator: (...args: any[]) => Action) => void }> */
