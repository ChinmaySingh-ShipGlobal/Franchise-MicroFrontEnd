import { z } from "zod";

export const walletFormSchema = z.object({
  amount: z.coerce
    .number({ message: "Amount must be in digits" })
    .min(1, { message: "Enter amount not less than 1" })
    .default(100),
});
