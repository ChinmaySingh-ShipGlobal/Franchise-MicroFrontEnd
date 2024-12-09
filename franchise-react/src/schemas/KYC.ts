import { z } from "zod";

const MAX_FILE_SIZE = 2000000; // 2MBchange this based on business requirements

export const FileUploadSchema = z.any().superRefine((val, ctx) => {
  if (val && val.size > MAX_FILE_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Max file size is 2MB.`,
    });
  }
  if (val === undefined || val.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "File is required",
    });
  }
});

export const VerifyGSTSchema = z.object({
  gst_number: z.string().min(1, "GST Number is required"),
  gst_file_id: z.string().min(1, "File is required"),
});

export const VerifyPANSchema = z.object({
  pan_number: z.string().min(1, "PAN Number is required"),
  pan_file_id: z.string().min(1, "File is required"),
  dob_on_pan: z.string().min(1, "Date is required"),
  name_on_pan: z.string().min(1, "Name is required"),
});

export const VerifyAadharSchema = z.object({
  aadhar_number: z.string().min(1, "Aadhar Number is required"),
  aadhar_front_file_id: z.string().min(1, "File is required"),
  aadhar_back_file_id: z.string().min(1, "File is required"),
});

export const VerifyVoterIdSchema = z.object({
  voter_id: z.string().min(1, "Voter ID Number is required"),
  voter_id_front_file_id: z.string().min(1, "File is required"),
  voter_id_back_file_id: z.string().min(1, "File is required"),
});

export const VerifyDrivingLicenseSchema = z.object({
  dl_number: z.string().min(1, "Driving License Number is required"),
  dl_front_file_id: z.string().min(1, "File is required"),
  dl_back_file_id: z.string().min(1, "File is required"),
});

export const VerifyPassportSchema = z.object({
  passport_number: z.string().min(1, "Passport Number is required"),
  passport_front_file_id: z.string().min(1, "File is required"),
  passport_back_file_id: z.string().min(1, "File is required"),
});

export const KYCFormSchema = z.object({
  documentType: z.string().min(1, "Document Type is required"),
  pickupAddressSameCheckbox: z.boolean().optional(),
  agreementCheckbox: z.boolean().refine((val) => val === true, { message: "Please accept the terms of agreement" }),
});

export const BusinessKYCSchema = z.object({
  document_type: z.string().min(1, "Document Type is required"),
  vendor_type: z.number().min(4).max(5),
  company_pan_number: z.string().min(1, "PAN Number is required"),
  gst_number: z.string().min(1, "GST Number is required"),
  gst_file_id: z.string().min(1, "GST File is required"),
  company_pan_file_id: z.string().min(1, "PAN File is required"),
  signature_file_id: z.string().min(1, "Signature File is required"),
  pickup_address_same: z.string().min(1),
  agreement: z.string().min(1),
});

export const IndividualKYCSchema = z.object({
  document_type: z.string().min(1, "Document Type is required"),
  vendor_type: z.number().min(4).max(5),
  pan_number: z.string().min(1, "PAN Number is required"),
  pan_file_id: z.string().min(1, "PAN File is required"),
  dob_on_pan: z.string().min(1, "Date is required"),
  name_on_pan: z.string().min(1, "Name is required"),
  signature_file_id: z.string().min(1, "Signature File is required"),
  pickup_address_same: z.string().min(1),
  agreement: z.string().min(1),
});
