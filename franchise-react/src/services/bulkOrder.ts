import { formDataApi } from "@/lib/api";
import { FileUploadSchema } from "@/schemas/KYC";

import { AxiosError } from "axios";
import { z } from "zod";

export const addBulkOrder = async (data: z.infer<typeof FileUploadSchema>) => {
  try {
    return await formDataApi.post("/orders/upload-bulk-order", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};
