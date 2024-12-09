import { ShipmentType } from "@/zustand/interfaces";
import { z } from "zod";

export const rateCalculatorSchema = z.object({
  destCountry: z.string().min(1, { message: "Please select a country" }),
  destPincode: z.string().min(4, { message: "Please enter a valid pincode" }).max(12),
  deadWeight: z
    .number()
    .min(0.01, { message: "Weight must be above 0.01 KG" })
    .max(300, { message: "Weight must not be more than 300 KG" }),
  packageLength: z
    .number()
    .int({ message: "Length must be an integer" })
    .max(120, { message: "Length must not be more than 120 cm" })
    .optional(),
  packageBreadth: z
    .number()
    .int({ message: "Breadth must be an integer" })
    .max(120, { message: "Breadth must not be more than 120 cm" })
    .optional(),
  packageHeight: z
    .number()
    .int({ message: "Height must be an integer" })
    .max(120, { message: "Height must not be more than 120 cm" })
    .optional(),
});

export interface Country {
  country_display: string;
  country_id: number;
  country_iso2: string;
  country_iso3: string;
  country_name: string;
}
export interface States {
  state_id: string;
  state_name: string;
  state_country_id: string;
}

export interface RateCalculatorProps {
  destPincode: string;
  destCountry: string;
  deadWeight: number;
  packageLength: number;
  packageBreadth: number;
  packageHeight: number;
}

export const ConsigneeDetailsSchema = z
  .object({
    shipmentType: z.enum([ShipmentType.CSBIV, ShipmentType.CSBV], {
      required_error: "You need to select shipment type",
    }),
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .max(30)
      .regex(/^[A-Za-z\s]+$/, { message: "Please enter alphabetic characters" }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .max(30)
      .regex(/^[A-Za-z]+$/, { message: "Please enter alphabetic characters" }),
    mobile: z
      .string()
      .min(1, { message: "Mobile number is required" })
      .max(20, { message: "Mobile number should not be long than 20 characters" })
      .regex(/^[\d\s\+\(\)-]+$/, { message: "Only numbers,brackets, hypen and + allowed." }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    address1: z
      .string()
      .min(1, { message: "Address 1 is required" })
      .max(100)
      .regex(/^[a-zA-Z0-9,\/#&()_\.\-\s]+$/, {
        message:
          "Address 1 can only contain alphabets, numbers, commas, hyphens, slashes, hash symbols, ampersands, parentheses, underscores, periods, and spaces",
      }),
    address2: z.string().optional(),
    address3: z
      .string()
      .min(1, { message: "Address 2 is required" })
      .max(100)
      .regex(/^[a-zA-Z0-9,\/#&()_\.\-\s]+$/, {
        message:
          "Address 2 can only contain alphabets, numbers, commas, hyphens, slashes, hash symbols, ampersands, parentheses, underscores, periods, and spaces",
      }),
    pincode: z
      .string()
      .min(1, { message: "Pincode is required" })
      .max(20, { message: "Pincode should not be long than 20 characters" })
      .regex(/^[A-Za-z0-9\s]*$/, { message: "Pincode can only contain letters, numbers, and spaces" }),

    country: z.string().min(2, { message: "Please select a country" }),
    state: z.string().min(2, { message: "Please select a state" }),
    city: z
      .string()
      .min(1, { message: "City is required" })
      .regex(/^[A-Za-z\s]+$/, "Only alphabets and spaces are allowed"),
    isBillingSameAsShipping: z.boolean().optional(),
    address1_billing: z.string().optional(),
    address2_billing: z.string().optional(),
    address3_billing: z.string().optional(),
    pincode_billing: z.string().optional(),
    country_billing: z.string().optional(),
    state_billing: z.string().optional(),
    city_billing: z.string().optional(),
  })
  .superRefine(
    (
      {
        isBillingSameAsShipping,
        address1_billing,
        address3_billing,
        pincode_billing,
        country_billing,
        state_billing,
        city_billing,
      },
      checkBillingAddress,
    ) => {
      if (!isBillingSameAsShipping) {
        if (!address1_billing)
          checkBillingAddress.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["address1_billing"],
            message: "Address 1 is required",
          });
        if (!address3_billing)
          checkBillingAddress.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["address3_billing"],
            message: "Address 2 is required",
          });

        if (!pincode_billing)
          checkBillingAddress.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["pincode_billing"],
            message: "Pincode is required",
          });
        if (!country_billing)
          checkBillingAddress.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["country_billing"],
            message: "Please select a country",
          });
        if (!state_billing)
          checkBillingAddress.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["state_billing"],
            message: "Please select a state",
          });
        if (!city_billing)
          checkBillingAddress.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["city_billing"],
            message: "City is required",
          });
      }
    },
  );

export const placeOrderSchema = z.object({
  vendor_reference_order_id: z.string(),
  order_id: z.string().optional(),
  vendor_invoice_no: z.string().min(1),
  vendor_order_date: z.string().min(1),
  order_reference: z.string().min(1),
  ioss_number: z.string().optional(),
  shipper: z.string().min(1),
  package_weight: z.number().min(1),
  package_length: z.number().min(1),
  package_breadth: z.number().min(1),
  package_height: z.number().min(1),
  currency_code: z.string().min(1),
  csb5_status: z.string().min(1),
  customer_shipping_firstname: z.string().min(1),
  customer_shipping_lastname: z.string().min(1),
  customer_shipping_mobile: z.string().min(1),
  customer_shipping_email: z.string().email({ message: "Must be a valid email address" }),
  customer_shipping_company: z.string().optional(),
  customer_shipping_address: z.string().min(1),
  customer_shipping_address_2: z.string().min(1),
  customer_shipping_address_3: z.string().optional(),
  customer_shipping_city: z.string().min(1),
  customer_shipping_postcode: z.string().min(1),
  customer_shipping_country_code: z.string().min(1),
  customer_shipping_state_id: z.string().min(1),
  customer_shipping_billing_same: z.string().min(1),
  customer_id: z.string().min(1),
  vendor_order_item: z
    .array(
      z.object({
        vendor_order_item_name: z.string().min(1),
        vendor_order_item_sku: z.string().optional(),
        vendor_order_item_quantity: z.string().min(1),
        vendor_order_item_unit_price: z.string().min(1),
        vendor_order_item_hsn: z.string().length(8),
        vendor_order_item_tax_rate: z.string().min(1),
      }),
    )
    .nonempty(),
  customer_billing_firstname: z.string().optional(),
  customer_billing_lastname: z.string().optional(),
  customer_billing_mobile: z.string().optional(),
  customer_billing_email: z.string().optional(),
  customer_billing_company: z.string().optional(),
  customer_billing_address: z.string().optional(),
  customer_billing_address_2: z.string().optional(),
  customer_billing_address_3: z.string().optional(),
  customer_billing_city: z.string().optional(),
  customer_billing_postcode: z.string().optional(),
  customer_billing_country_code: z.string().optional(),
  customer_billing_state_id: z.string().optional(),
});
