import { AddBulkManifest, AddRemoveToManifest, CloseManifest, GetManifestDetails } from "@/interfaces/manifest";
import api from "@/lib/api";
import { AxiosError } from "axios";

export const createManifest = async (data: {}) => {
  try {
    return await api.post("/pickup/manifest/create", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};
export const getManifestDetails = async (data: GetManifestDetails) => {
  try {
    return await api.post("/pickup/manifest/details", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const addToManifestOrder = async (data: AddRemoveToManifest) => {
  try {
    return await api.post("/pickup/manifest/add", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const removeFromManifestOrder = async (data: AddRemoveToManifest) => {
  try {
    return await api.post("/pickup/manifest/remove", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const closeManifest = async (data: CloseManifest) => {
  try {
    return await api.post("/pickup/manifest/close", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const manifestBulkAdd = async (data: AddBulkManifest) => {
  try {
    return await api.post("/pickup/manifest/bulk", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};
