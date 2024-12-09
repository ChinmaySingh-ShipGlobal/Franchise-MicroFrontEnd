import api from "@/lib/api";
import {
  addCustomerFormSchema,
  consignorCSBVFormSchema,
  getCSBVStatus,
  verifyCustomerFormSchema,
  VerifyGSTCSBVSchema,
  VerifyIECCSBVSchema,
  VerifyPANCSBVSchema,
} from "@/schemas/Customer";
import { AxiosError } from "axios";
import { z } from "zod";

export const searchCustomers = async (customerSearchTerm: string) => {
  try {
    const response = await api.post("customer/search", {
      customer_details: customerSearchTerm.trim(),
      offset: "0", // how many entries to skip
    });
    return response.data;
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response?.data;
  }
};

export const getCustomerDetails = async (customer_id: string) => {
  try {
    const response = await api.post("customer/details", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error" + error);
  }
};

export const verifyGSTCSBV = async (data: z.infer<typeof VerifyGSTCSBVSchema>) => {
  try {
    return await api.post("/customer/gst", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const verifyIECCSBV = async (data: z.infer<typeof VerifyIECCSBVSchema>) => {
  try {
    return await api.post("/customer/iec", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const verifypanCSBV = async (data: z.infer<typeof VerifyPANCSBVSchema>) => {
  try {
    return await api.post("/customer/pan", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const addCustomer = async (data: z.infer<typeof addCustomerFormSchema>) => {
  try {
    return await api.post("customer/submit-customer", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};
export const addCustomerCSBV = async (data: z.infer<typeof consignorCSBVFormSchema>) => {
  try {
    return await api.post("customer/doc-profile", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const verifyCSBIVCustomer = async (data: z.infer<typeof verifyCustomerFormSchema>) => {
  try {
    return await api.post("customer/customer-verify", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const CSBVGetStatus = async (data: z.infer<typeof getCSBVStatus>) => {
  try {
    return await api.post("customer/get-status", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};
