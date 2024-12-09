import { Dispatch, SetStateAction } from "react";

interface PickupRequestDetails {
  pickupDetail: {
    pickup_request_id: string;
  };
}

export interface CancelPickupDialogProps {
  pickupRequestDetails: PickupRequestDetails;
  setFetch: Dispatch<SetStateAction<boolean>>;
}

export interface PickupAddressSubCardProps {
  title: string;
  address: string;
  contact: string;
  buttonLabel?: string;
  buttonClassName?: string;
}

export interface pickupAddressItem {
  address_id: string;
  firstname: string;
  lastname: string;
  address: string;
  mobile: string;
  default: string;
}

export interface GetPickupRequestDetails {
  pickup_address_id: string;
  pickup_date: string | null;
}

export interface CreatePickup extends GetPickupRequestDetails {
  estimated_orders: number;
  estimated_weight: number;
}

export interface ViewPickupDetails {
  pickup_request_id: string | undefined;
}

export interface EditPickupRequest {
  pickup_request_id: string | undefined;
  estimated_orders: number;
  estimated_weight: number;
}

export interface ReschedulePickupRequest {
  pr_id: string;
  pr_new_date: string;
  old_pr_date: string;
}

export interface AddPickupAddress {
  firstname: string;
  lastname: string;
  mobile: string;
  address: string;
  city: string | undefined;
  locality: string;
  postcode: string;
  state_id: string;
  address_nickname: string;
  email?: string;
  landmark?: string;
}

export interface OrderTrackingColumn {
  order_id: string;
  tracking: string;
}
