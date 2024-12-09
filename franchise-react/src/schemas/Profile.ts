import { z } from "zod";

export interface ProfileDetails {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  kyc_status: boolean;
  is_sg_city: boolean;
  is_pickup_address: boolean;
  csb5_enabled: string;
}

export const initialProfileDetails = {
  firstName: "Shon",
  lastName: "Joe",
  email: "email@example.com",
  mobile: "9876543210",
  kyc_status: false,
  is_sg_city: false,
  is_pickup_address: false,
  csb5_enabled: "0",
};

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "New Password must be 6 or more characters long" })
      .max(20, { message: "New Password must not be more than 20 characters" }),
    oldPassword: z.string().min(6, { message: "Password must be 6 or more characters long" }),
    confirmPassword: z.string().min(6, { message: "New Password must be 6 or more characters long" }),
    logout_all_devices: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const initialChangePasswordFormValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
  logout_all_devices: false,
};
