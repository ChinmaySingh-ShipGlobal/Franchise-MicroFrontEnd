import api, { downloadFile, formDataApi } from "@/lib/api";
import {
  BusinessKYCSchema,
  FileUploadSchema,
  IndividualKYCSchema,
  VerifyAadharSchema,
  VerifyDrivingLicenseSchema,
  VerifyGSTSchema,
  VerifyPANSchema,
  VerifyPassportSchema,
  VerifyVoterIdSchema,
} from "@/schemas/KYC";
import { AxiosError } from "axios";
import { z } from "zod";

export const fileUpload = async (data: z.infer<typeof FileUploadSchema>) => {
  try {
    return await formDataApi.post("/kyc/upload-files", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};
export const fileUploadCustomer = async (data: z.infer<typeof FileUploadSchema>) => {
  try {
    return await formDataApi.post("/customer/customer-document", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const verifyGST = async (data: z.infer<typeof VerifyGSTSchema>) => {
  try {
    return await api.post("/kyc/gst", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const verifyPAN = async (data: z.infer<typeof VerifyPANSchema>) => {
  try {
    return await api.post("/kyc/pan", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const verifyAadhar = async (data: z.infer<typeof VerifyAadharSchema>) => {
  try {
    return await api.post("/kyc/aadhar", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const verifyVoterId = async (data: z.infer<typeof VerifyVoterIdSchema>) => {
  try {
    return await api.post("/kyc/voter-id", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const verifyDrivingLicense = async (data: z.infer<typeof VerifyDrivingLicenseSchema>) => {
  try {
    return await api.post("/kyc/driving-license", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const verifyPassport = async (data: z.infer<typeof VerifyPassportSchema>) => {
  try {
    return await api.post("/kyc/passport", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const submitBusinessKYC = async (data: z.infer<typeof BusinessKYCSchema>) => {
  try {
    return await api.post("/kyc/doc-profile", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const submitIndividualKYC = async (data: z.infer<typeof IndividualKYCSchema>) => {
  try {
    return await api.post("/kyc/doc-profile", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const getBillingDetails = async () => {
  try {
    const response = await api.get("/auth/get-billing-address");
    return response.data;
  } catch (error) {
    console.error("Error" + error);
  }
};

export const getKycStatus = async () => {
  try {
    return await api.get("/kyc/get-status");
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const downloadDocument = async (file_id: string) => {
  try {
    const response = await api.post("/kyc/download", { file_id }, { responseType: "blob" });
    downloadFile(response, "document.pdf");
  } catch (error) {
    console.error("Error" + error);
  }
};
