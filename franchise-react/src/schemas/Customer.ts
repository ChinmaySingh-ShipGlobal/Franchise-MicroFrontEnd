import { z } from "zod";

export const VerifyGSTCSBVSchema = z.object({
  gst_number: z.string().min(1, "GST Number is required"),
  gst_file_id: z.string().min(1, "File is required"),
  customer_id: z.string().min(1, "Customer ID is required"),
});

export const VerifyIECCSBVSchema = z.object({
  iec_number: z.string().min(1, "IEC Number is required"),
  iec_file_id: z.string().min(1, "File is required"),
  customer_id: z.string().min(1, "Customer ID is required"),
});

export const VerifyPANCSBVSchema = z.object({
  pan_number: z.string().min(1, "Pan Number is required"),
  pan_file_id: z.string().min(1, "File is required"),
  customer_id: z.string().min(1, "Customer ID is required"),
  name_on_pan: z.string().optional(),
  dob_on_pan: z.string().optional(),
});

export const consignorCSBVFormSchema = z.object({
  iec_number: z.string().min(1, { message: "IEC Number is required" }),
  ad_code: z.string().min(1, { message: "AD Code is required" }),
  lut_expiry: z
    .string()
    .length(4, { message: "LUT Expiry must be exactly 4 digits" })
    .regex(/^\d{4}$/, { message: "LUT Expiry must be 4 digits" }),
  bank_name: z.string().min(1, { message: "Bank Name is required" }),
  bank_account: z
    .string()
    .min(11, { message: "Bank Account Number must be atleast 11 digits" })
    .max(17, { message: "Bank Account Number must be atmost 17 digits" })
    .regex(/^\d/, { message: "Bank Account Number must a number only" }),
});

export const CSBVFormSchema = z.object({
  iec_number: z.string().optional(),
  ad_code: z.string().optional(),
  lut_expiry: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account: z.string().optional(),
});

export const verifyCustomerFormSchema = z.object({
  mobile: z
    .string()
    .regex(/^[0-9]+$/, { message: "Mobile Number must be numeric" })
    .length(10, "Mobile number must be of 10 digits"),
  email: z.string().email({ message: "Invalid email address" }),
  document_type: z.string({ message: "Document Type is required" }),
  nickname: z.string().regex(/^[a-z0-9]{8,20}$/, {
    message: "Nickname must be 8-20 characters long and only contain lowercase alphanumeric characters.",
  }),
});

export const getCSBVStatus = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});

export const addCustomerFormSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First Name is Required" })
    .regex(/^[a-zA-Z]+$/, { message: "First Name must contain only letters" }),
  lastname: z
    .string()
    .min(2, { message: "Last Name is Required" })
    .regex(/^[a-zA-Z]+$/, { message: "Last Name must contain only letters" }),
  billing_legal_name: z
    .string()
    .min(2, { message: "Billing Legal Name is Required" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Billing Legal Name must contain only letters and spaces" }),
  billing_address: z.string().min(2, { message: "Billing Address is Required" }),
  billing_city: z
    .string()
    .min(2, { message: "Billing City is Required" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Billing City must contain only letters and spaces" }),
  billing_state: z
    .string()
    .min(2, { message: "Billing State is Required" })
    .regex(/^[a-zA-Z\s]+$/, { message: "State must contain only letters and space" }),
  billing_pin_code: z
    .string()
    .length(6, { message: "Billing Pincode must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "Billing Pincode must be numeric" }),
});
