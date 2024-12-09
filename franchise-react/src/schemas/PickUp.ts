import { z } from "zod";

export const pickupAddressSchema = z.object({
  addressNickName: z.string().min(3, { message: "Nickname must be 3 or more character(s)" }).max(30),
  firstName: z.string().min(3, { message: "Firstname must be 3 or more character(s)" }).max(30),
  lastName: z.string().min(3, { message: "Lastname must be 3 or more character(s)" }).max(30),
  email: z.string().email({ message: "Email address should be a valid" }),
  mobile: z.string().length(10, { message: "Mobile number must be 10 digits long" }),
  houseNumber: z.string().min(2, { message: "Must be a valid address" }).max(100),
  locality: z.string().min(1, { message: "Please enter Locality" }).max(50),
  landmark: z.string().optional(),
  pincode: z
    .string()
    .length(6, { message: "Must be a valid pincode" })
    .regex(/^\d{6}$/, { message: "Pincode must contain only digits" }),
  city: z.string().min(1, { message: "Please enter city" }),
  state: z.string().min(2, { message: "Please select state" }),
});

export const initialPickupAddressFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  addressNickName: "",
  houseNumber: "",
  locality: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
};

export const pickupRequestSchema = z.object({
  pickup_address: z.string().min(1, { message: "Please enter pickup address" }),
  estimated_orders: z.coerce.number().min(1, { message: "Estimated orders must be atleast 1" }),
  estimated_weight: z.coerce.number().min(1, { message: "Estimated weight must be atleast 1 kg" }),
});

export const initialPickupRequestFormValues = {
  pickup_address: "",
  // estimated_orders: "",
  // estimated_weight: "",
};

export const editPickupRequestSchema = z.object({
  estimated_orders: z.coerce.number().min(1, { message: "Estimated orders must be atleast 1" }),
  estimated_weight: z.coerce
    .number()
    .min(1, { message: "Estimated weight must be at least 1 kg" })
    .refine((value) => /^(\d+(\.\d{1,2})?)?$/.test(value.toFixed(2)), {
      message: "Estimated weight must be a number with up to two decimal places",
    }),
});
