import ErrorMessage from "@/components/elements/ErrorMessage";
import SGFormField from "@/components/elements/SGFormField";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { validateItemsAmount, rateCalculator } from "@/services/orders";
import {
  updateActiveOrderStep,
  updateOrderPriceSummary,
  updateOrderShipmentDetails,
  updateOrderShippingRates,
} from "@/zustand/actions";
import { initialPriceSummary, initialProductValue, initialShipmentDetails, ProductDetails } from "@/zustand/interfaces";
import { useStore } from "@/zustand/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, UseFormReturn, UseFieldArrayRemove } from "react-hook-form";
import { z } from "zod";
import { RateCalculatorProps } from "@/schemas/Order";
import HelpBadge from "@/components/elements/HelpBadge";
import { Checkbox } from "@/components/ui/checkbox";

type ShipmentDetailsForm = z.infer<typeof ShipmentDetailsSchema>;

const ProductSchema = z.object({
  id: z.string().min(1),
  productSKU: z.string().optional(),
  productName: z.string().min(1, "Required"),
  productQty: z.coerce.number().min(1, "Quantity must not be Zero").int("Quantity must be an integer"),
  productUnitPrice: z.coerce
    .number()
    .min(1, "Unit Price must not be Zero")
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(String(value)), "Maximum two decimal places allowed."),
  productIGST: z.string().min(1, "Required"),
  productHSN: z
    .string()
    .length(8, "HSN must be 8 digits long")
    .regex(/^\d+$/, { message: "Please enter numeric values" }),
});

const ShipmentDetailsSchema = z.object({
  invoiceNumber: z
    .string()
    .min(1, { message: "Please enter invoice number" })
    .max(30)
    .regex(/^[A-Za-z0-9]+$/, { message: "Please enter alphanumeric characters" }),

  invoiceDate: z.string().min(1, { message: "Please select invoice date" }),
  invoiceCurrency: z.string().min(2, { message: "Please select a currency" }),
  orderReferenceNo: z.string().optional(),
  iossNumber: z.string().optional(),
  packageWeight: z.coerce
    .number()
    .min(0.01, { message: "Weight must be atleast 0.01 KG" })
    .max(300, { message: "Weight must not be more than 300 KG" }),
  packageLength: z.coerce
    .number()
    .int({ message: "Length must be an integer" })
    .min(1, { message: "Length must be atleast 1 cm" })
    .max(120, { message: "Length must not be more than 120 cm" }),
  packageBreadth: z.coerce
    .number()
    .int({ message: "Breadth must be an integer" })
    .min(1, { message: "Breadth must be atleast 1 cm" })
    .max(120, { message: "Breadth must not be more than 120 cm" }),
  packageHeight: z.coerce
    .number()
    .int({ message: "Height must be an integer" })
    .min(1, { message: "Height must be atleast 1 cm" })
    .max(120, { message: "Height must not be more than 120 cm" }),
  products: z.array(ProductSchema).nonempty(),
  aboveTenLac: z.boolean().optional(),
});

export default function ShipmentDetails({ csbv }: { csbv?: boolean }) {
  const shipmentDetails = useStore((state: any) => state.order.shipmentDetails);
  const shippingDetailsForm = useForm<ShipmentDetailsForm>({
    resolver: zodResolver(ShipmentDetailsSchema),
    defaultValues: shipmentDetails ? shipmentDetails : initialShipmentDetails,
  });
  const { control } = shippingDetailsForm;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });
  const dispatch = useStore((state: any) => state.dispatch);
  const consigneeDetails = useStore((state: any) => state.order.consigneeDetails);
  const activeStep = useStore((state: any) => state.order.activeStep);

  useEffect(() => {
    dispatch(() => updateOrderPriceSummary(initialPriceSummary));
    shippingDetailsForm.setValue("aboveTenLac", false);
  }, [activeStep != 4]);

  async function fetchRates(data: RateCalculatorProps) {
    const response = await rateCalculator(data);
    if (response.errors.length === 0) {
      dispatch(() => updateOrderShippingRates(response.data));
    } else {
      dispatch(() =>
        updateOrderShippingRates({
          pickup_fee: 0,
          package_weight: 0,
          volume_weight: 0,
          bill_weight: 0,
          notices: [],
          rate: [],
        }),
      );
    }
  }

  const [unitPriceError, setProductsPriceError] = useState("");
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const fetchRatesandNextStep = (data: ShipmentDetailsForm) => {
    fetchRates({
      destPincode: consigneeDetails.pincode,
      destCountry: consigneeDetails.country,
      deadWeight: data.packageWeight,
      packageLength: data.packageLength,
      packageBreadth: data.packageBreadth,
      packageHeight: data.packageHeight,
    });
    dispatch(() => updateOrderShipmentDetails(data));
    dispatch(() => updateActiveOrderStep(4));
  };
  async function nextStep(data: ShipmentDetailsForm) {
    setProductsPriceError("");
    //csbv v above 1- 10 lac condition
    if (csbv && data.aboveTenLac) {
      const response = await validateItemsAmount({
        csbv: consigneeDetails.shipmentType,
        "csbv5-limit-comfirmation": 1,
        currency_code: data.invoiceCurrency,
        vendor_order_item: data.products.map((product: ProductDetails) => ({
          vendor_order_item_name: product.productName,
          vendor_order_item_sku: product.productSKU,
          vendor_order_item_quantity: product.productQty,
          vendor_order_item_unit_price: product.productUnitPrice,
          vendor_order_item_hsn: product.productHSN,
          vendor_order_item_tax_rate: product.productIGST,
        })),
      });
      if (response) {
        if (response.status === 200) {
          fetchRatesandNextStep(data);
        } else {
          setProductsPriceError(response.data.message);
        }
      }
    } else {
      /// general condition
      const response = await validateItemsAmount({
        csbv: consigneeDetails.shipmentType,
        currency_code: data.invoiceCurrency,
        vendor_order_item: data.products.map((product: ProductDetails) => ({
          vendor_order_item_name: product.productName,
          vendor_order_item_sku: product.productSKU,
          vendor_order_item_quantity: product.productQty,
          vendor_order_item_unit_price: product.productUnitPrice,
          vendor_order_item_hsn: product.productHSN,
          vendor_order_item_tax_rate: product.productIGST,
        })),
      });
      if (response) {
        if (response.status === 200) {
          fetchRatesandNextStep(data);
        } else {
          setProductsPriceError(response.data.message);
          setRequiresConfirmation(response.data.data.requires_confirmation);
        }
      }
    }
  }

  const currencyData = [
    { key: "INR", value: "INR" },
    { key: "USD", value: "USD" },
    { key: "EUR", value: "EUR" },
    { key: "GBP", value: "GBP" },
    { key: "CAD", value: "CAD" },
    { key: "AUD", value: "AUD" },
    { key: "AED", value: "AED" },
    { key: "SAR", value: "SAR" },
  ];

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    totalPriceCalculation();
  }, [shippingDetailsForm]);

  function totalPriceCalculation() {
    shippingDetailsForm.watch((order) => {
      const newTotal =
        (order?.products &&
          order?.products.reduce((sum, product) => {
            return sum + ((product && product.productUnitPrice) || 0) * ((product && product.productQty) || 0);
          }, 0)) ||
        0;

      setTotalAmount(newTotal);
    });
  }

  return (
    <Form {...shippingDetailsForm}>
      <form onSubmit={shippingDetailsForm.handleSubmit(nextStep)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:mr-6">
            <SGFormField type="text" name="invoiceNumber" required label="Invoice Number" form={shippingDetailsForm} />
          </div>
          <div className="mt-3 md:mt-0 md:mr-6">
            <SGFormField
              type="date-picker"
              name="invoiceDate"
              required
              label="Invoice Date"
              form={shippingDetailsForm}
            />
          </div>
          <div className="mt-3 md:mt-0">
            <SGFormField
              type="select"
              name="invoiceCurrency"
              required
              label="Invoice Currency"
              selectValues={currencyData}
              form={shippingDetailsForm}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:mr-6">
            <SGFormField type="text" name="orderReferenceNo" label="Order/Reference ID" form={shippingDetailsForm} />
          </div>
          <div className="mt-3 md:mt-0 md:mr-6">
            <SGFormField type="text" name="iossNumber" label="IOSS Number" form={shippingDetailsForm} />
          </div>
          <div className="mt-3 md:mt-0"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Box Measurements</h3>
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="md:mr-6">
              <SGFormField
                type="input-weight"
                name="packageWeight"
                required
                label="Dead Weight"
                form={shippingDetailsForm}
              />
            </div>
            <div className="mt-3 md:mt-0 md:mr-6">
              <SGFormField type="input-size" name="packageLength" required label="Length" form={shippingDetailsForm} />
            </div>
            <div className="mt-3 md:mt-0 md:mr-6">
              <SGFormField
                type="input-size"
                name="packageBreadth"
                required
                label="Breadth"
                form={shippingDetailsForm}
              />
            </div>
            <div className="mt-3 md:mt-0">
              <SGFormField type="input-size" name="packageHeight" required label="Height" form={shippingDetailsForm} />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-x-2">
            <h3 className="text-sm font-semibold">Item(s) Details</h3>
            <HelpBadge text="Items that can export" to="#" />
          </div>
          {fields?.map((product, idx) => (
            <div key={product.id}>
              <AddProductForm
                form={shippingDetailsForm}
                index={idx}
                remove={remove}
                currency={shippingDetailsForm.watch("invoiceCurrency")}
                csbv={csbv}
              />
            </div>
          ))}
          <div className="mt-2">
            {unitPriceError !== "" && (
              <div className="flex items-center gap-x-2">
                <FormField
                  name="aboveTenLac"
                  control={shippingDetailsForm.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-x-3">
                      <FormControl>
                        <div className="flex -mt-3">
                          {consigneeDetails.shipmentType === "1" && requiresConfirmation && (
                            <Checkbox
                              id="aboveTenLac"
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                              }}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormLabel htmlFor="aboveTenLac" className="text-sm font-normal">
                        <ErrorMessage error={unitPriceError} />
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div
              onClick={() => append(initialProductValue)}
              className="flex flex-row items-center mt-4 font-medium underline cursor-pointer text-primary max-w-max"
            >
              <Icon icon="lucide:plus" className="ml-2 cursor-pointer" width="1.25rem" color="#1F499E" />
              <span>Add Another Product</span>
            </div>
            <div>
              <p className="text-base font-semibold">
                Total Price : {shippingDetailsForm.watch("invoiceCurrency")} {totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <Button type="submit" onClick={shippingDetailsForm.handleSubmit(nextStep)}>
            {/* validate data and next step */}
            Select Shipping
          </Button>
        </div>
      </form>
    </Form>
  );
}

export const AddProductForm = ({
  form,
  index,
  remove,
  currency,
  csbv,
}: {
  form: UseFormReturn<ShipmentDetailsForm>;
  remove: UseFieldArrayRemove;
  index: number;
  currency: string;
  csbv?: boolean;
}) => {
  const IGSTData = [
    { key: "0", value: "0%" },
    { key: "3", value: "3%" },
    { key: "5", value: "5%" },
    { key: "12", value: "12%" },
    { key: "18", value: "18%" },
    { key: "28", value: "28%" },
  ];

  return (
    <>
      <div className="flex flex-col w-full space-y-3 lg:flex-row lg:space-y-0 lg:space-x-2">
        <SGFormField
          type="text"
          name={`products[${index}].productName`}
          required
          className="lg:min-w-28"
          label="Product Name"
          form={form}
        />
        <SGFormField
          type="text"
          name={`products[${index}].productSKU`}
          label="SKU"
          className="lg:min-w-12"
          form={form}
        />
        <SGFormField
          type="text"
          name={`products[${index}].productHSN`}
          required
          label="HSN"
          className="lg:min-w-24"
          form={form}
        />
        <SGFormField
          type="number"
          name={`products[${index}].productQty`}
          required
          label="Qty"
          className="lg:min-w-12"
          form={form}
        />
        <SGFormField
          type="number"
          name={`products[${index}].productUnitPrice`}
          required
          label={`Unit Price (${currency})`}
          className="lg:min-w-24"
          form={form}
        />

        <SGFormField
          type="select"
          name={`products[${index}].productIGST`}
          required
          selectValues={IGSTData}
          label="IGST"
          form={form}
          disabled={!csbv}
        />
        <div
          onClick={() => remove(index)}
          className={`flex items-center mb-4 justify-center  ${index === 0 ? "invisible" : ""}`}
        >
          <Icon icon="lucide:trash-2" className="cursor-pointer lg:mt-4" width="1.25rem" color="red" />
        </div>
      </div>
    </>
  );
};
