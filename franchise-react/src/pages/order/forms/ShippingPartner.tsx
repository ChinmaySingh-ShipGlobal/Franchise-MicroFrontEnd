import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ErrorMessage from "@/components/elements/ErrorMessage";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

import { useStore } from "@/zustand/store";
import { ProductDetails, Shipper } from "@/zustand/interfaces";
import { resetOrderForm, updateOrderId, updateOrderPriceSummary, updateOrderSummary } from "@/zustand/actions";

import { getSortedRates } from "@/lib/utils";
import { createOrderId, payAndAddOrder } from "@/services/orders";
import { CircleCheck, Loader } from "lucide-react";

export default function ShippingPartner() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shipperCode, setShipperCode] = useState("");
  const [shipperSelected, setShipperSelected] = useState(false);

  const dispatch = useStore((state: any) => state.dispatch);
  const order_id = useStore((state: any) => state.order.order_id);
  const { provider_code } = useStore((state: any) => state.order.priceSummary);
  const { consignor_id } = useStore((state: any) => state.order.selectedConsignorDetails);
  const {
    firstName,
    lastName,
    mobile,
    email,
    address1,
    address2,
    address3,
    city,
    pincode,
    shipmentType,
    state,
    country,
    isBillingSameAsShipping,
    address1_billing,
    address2_billing,
    address3_billing,
    pincode_billing,
    country_billing,
    city_billing,
    state_billing,
  } = useStore((state: any) => state.order.consigneeDetails);

  const shippingRates = useStore((state: any) => state.order.shippingRates);
  const {
    invoiceNumber,
    invoiceDate,
    orderReferenceNo,
    iossNumber,
    packageWeight,
    packageLength,
    packageBreadth,
    packageHeight,
    products,
    invoiceCurrency,
  } = useStore((state: any) => state.order.shipmentDetails);

  const getOrderPayload = () => {
    let orderPayload = {
      vendor_reference_order_id: "", // remove this
      vendor_invoice_no: invoiceNumber,
      vendor_order_date: invoiceDate.slice(0, 10),
      order_reference: orderReferenceNo,
      package_weight: packageWeight,
      package_length: packageLength,
      package_breadth: packageBreadth,
      package_height: packageHeight,
      currency_code: invoiceCurrency,
      csb5_status: shipmentType,
      customer_shipping_firstname: firstName,
      customer_shipping_lastname: lastName,
      customer_shipping_mobile: mobile,
      customer_shipping_email: email,
      customer_shipping_company: "",
      customer_shipping_address: address1,
      customer_shipping_address_2: address3, //add2ship //Landmark shipping optional
      customer_shipping_address_3: address2,
      customer_shipping_city: city,
      customer_shipping_postcode: pincode,
      customer_shipping_country_code: country,
      customer_shipping_state_id: state,
      customer_shipping_billing_same: isBillingSameAsShipping ? "1" : "0",
      ioss_number: iossNumber,
      vendor_order_item: products.map((product: ProductDetails) => ({
        vendor_order_item_name: product.productName,
        vendor_order_item_sku: product.productSKU,
        vendor_order_item_quantity: product.productQty,
        vendor_order_item_unit_price: product.productUnitPrice,
        vendor_order_item_hsn: product.productHSN,
        vendor_order_item_tax_rate: product.productIGST,
      })),
      customer_id: String(consignor_id),
    };

    const billingPayload = {
      customer_billing_firstname: firstName,
      customer_billing_lastname: lastName,
      customer_billing_mobile: mobile,
      customer_billing_email: email,
      customer_billing_company: "",
      customer_billing_address: address1_billing,
      customer_billing_address_2: address3_billing, //fix this asap Landmark billipng optional
      customer_billing_address_3: address2_billing,
      customer_billing_city: city_billing,
      customer_billing_postcode: pincode_billing,
      customer_billing_country_code: country_billing,
      customer_billing_state_id: state_billing,
    };
    if (!isBillingSameAsShipping)
      return {
        ...orderPayload,
        ...billingPayload,
      };
    else return orderPayload;
  };

  const selectShipperAndLoadRates = async (shipper: Shipper, code: string) => {
    setError("");
    setShipperCode(code);
    setShipperSelected(true);
    const payload = { ...getOrderPayload() };
    let response;
    if (order_id) {
      response = await createOrderId({
        ...payload,
        order_id: order_id,
        shipper: shipper.provider_code,
      });
    } else {
      response = await createOrderId({ ...payload, shipper: shipper.provider_code });
    }
    if (response) {
      if (response.status !== 200) {
        setError(response.data.message);
      }
      dispatch(() =>
        updateOrderPriceSummary({
          total: response.data.data.total,
          order_id: response.data.data.order_id,
          provider_code: response.data.data.shipper,
          order_total: response.data.data.order_total,
        }),
      );
      if (!order_id) {
        dispatch(() => updateOrderId(response.data.data.order_id));
      }
      dispatch(() => updateOrderSummary(response.data.data));
    }
    setShipperSelected(false);
  };

  async function placeOrder() {
    setLoading(true);
    const response = await payAndAddOrder(order_id);
    if (response) {
      if (response.status === 200) {
        dispatch(() => resetOrderForm());
        toast({
          title: "Order Successfully Created.",
          variant: "success",
        });
        setLoading(false);
        navigate("/order-summary");
      } else if (response.status === 402) {
        dispatch(() => resetOrderForm());
        toast({
          title: "Order Moved to Draft due to low wallet Balance",
          variant: "success",
        });
        setLoading(false);
        navigate("/order-summary");
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }
  }

  const shipPartners = shippingRates?.rate.length;
  const deadWt = shippingRates.package_weight / 1000 + " KG";
  const volumeWt = shippingRates.volume_weight / 1000 + " KG";
  const billWt =
    (shippingRates.package_weight > shippingRates.volume_weight
      ? shippingRates.bill_weight / 1000
      : shippingRates.volume_weight / 1000) + " KG";

  return (
    <div className="mb-6">
      <div>
        <p>
          All shipments via ShipGlobal services are <b>Delivered Duty Paid (DDP)</b>, hence <b>no extra duty</b> will be
          billed on the consignee or the shipper. Rates are inclusive of covid & fuel surcharge, exclusive of GST and
          ex-Delhi Hub.
        </p>
        <br />
        In case any doubt, please call/whatsapp at{" "}
        <a href="tel:01142277777" className="font-semibold text-primary">
          011-422 77777
        </a>
      </div>
      {shipPartners > 0 ? (
        <>
          <div className="flex justify-center gap-2 mt-5">
            <DisplayBox text={deadWt} label="Dead Weight" />
            <DisplayBox text={volumeWt} label="Volumetric Weight" />
            <DisplayBox text={billWt} label="Billed Weight" active />
          </div>
          <div className="flex flex-row justify-between mt-5">
            <span className="self-center font-semibold">Showing {shipPartners} Results</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <THead title="Courier Partner" />
                <THead title="Delivery Time" />
                <THead title="Shipment Rate" />
                <THead title="Select" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {getSortedRates(shippingRates.rate, "cheapest").map((item: Shipper) => {
                return (
                  <>
                    {item.helper_text && (
                      <TableCell
                        className={`absolute w-full py-0 m-0 border border-b-0 bg bg-blue-50 rounded-t cursor-pointer`}
                        colSpan={3}
                      >
                        <div className="py-0.5 text-xs" dangerouslySetInnerHTML={{ __html: ` ${item.helper_text}` }} />
                      </TableCell>
                    )}
                    <TableRow
                      key={item.provider_code}
                      onClick={() => selectShipperAndLoadRates(item, item.provider_code)}
                      className={`cursor-pointer `}
                    >
                      <TCell helperText={item.helper_text} content={item.display_name} className="font-medium" />
                      <TCell helperText={item.helper_text} content={item.transit_time} />
                      <TCell helperText={item.helper_text} content={`Rs. ${item.rate}`} />
                      <TCell
                        helperText={item.helper_text}
                        content={
                          shipperSelected && item.provider_code === shipperCode ? (
                            <Loader className="self-center animate-spin h-5 w-5" />
                          ) : (
                            <CircleCheck
                              className={`w-6 h-6  ${
                                item.provider_code === provider_code && !shipperSelected
                                  ? "fill-green-800"
                                  : "fill-gray-400"
                              } stroke-white`}
                            />
                          )
                        }
                        className="justify-center"
                      />
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>No Shipping Partner Found</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}

      <div className="flex items-end justify-end gap-x-6 mt-2">
        {error && <ErrorMessage error={error} />}
        <Button type="submit" onClick={placeOrder} disabled={!provider_code}>
          Pay and Order
          {loading && <Loader className="self-center ml-2 animate-spin h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}

export const DisplayBox = ({ text, label, active }: { text: string; label: string; active?: boolean }) => (
  <div
    className={`px-5 py-2 text-center border rounded-md ${
      active ? "border-orange-850 bg-yellow-200 text-orange-850" : "border-gray-300 bg bg-gray-50 text-gray-900"
    }`}
  >
    <p className={`text-base font-medium`}>{text}</p>
    <p className={`text-xs text-gray-700 ${active && "text-orange-850"}`}>{label}</p>
  </div>
);

const THead = ({ title }: { title: string }) => {
  return <TableHead className="text-gray-900 font-normal">{title}</TableHead>;
};

const TCell = ({
  helperText,
  content,
  className,
}: {
  helperText: string;
  content: string | number | ReactNode | undefined;
  className?: string;
}) => {
  return <TableCell className={`${className} ${helperText !== "" && "pt-5"}`}>{content}</TableCell>;
};
