import {
  AddPickupAddress,
  CreatePickup,
  EditPickupRequest,
  GetPickupRequestDetails,
  ReschedulePickupRequest,
  ViewPickupDetails,
} from "@/interfaces/pickup";
import api from "@/lib/api";
import { AxiosError } from "axios";

export const createPickupRequest = async (data: CreatePickup) => {
  try {
    return await api.post("/pickup/add-request", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const getPickupRequest = async (data: GetPickupRequestDetails) => {
  try {
    return await api.post("/pickup/get-request", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const getPickupRequestDetails = async (data: ViewPickupDetails) => {
  try {
    return await api.post("/pickup/view-details", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const getPickupDates = async () => {
  try {
    const response = await api.get("pickup/get-pickup-date");
    return response;
  } catch (error) {
    console.error("Error" + error);
  }
};

export const editPickupRequest = async (data: EditPickupRequest) => {
  try {
    return await api.post("/pickup/update-request", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const reschedulePickupRequest = async (data: ReschedulePickupRequest) => {
  try {
    return await api.post("/pickup/reschedule", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const cancelPickupRequest = async (data: ViewPickupDetails) => {
  try {
    return await api.post("/pickup/cancel-request", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const addPickupAddress = async (data: AddPickupAddress) => {
  try {
    return await api.post("/pickup/add-update", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const getPickupAddress = async () => {
  try {
    return await api.get("/pickup/get-pickup-address");
  } catch (error) {
    console.error("Error" + error);
  }
};
