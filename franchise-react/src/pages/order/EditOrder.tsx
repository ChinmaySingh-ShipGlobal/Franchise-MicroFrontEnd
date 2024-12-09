import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderDetails } from "@/services/orders";
import { useStore } from "@/zustand/store";
import { updateEditOrderForm, updateOrderConsignorID, updateOrderId } from "@/zustand/actions";
import { ShipmentType } from "@/zustand/interfaces";
import FranchisePage from "@/layouts/FranchisePage";
import { OrderStepForm, OrderSummary } from "./AddOrder";
import ConsignorDetails from "./forms/ConsignorDetails";
import ConsigneeDetails from "./forms/ConsigneeDetails";
import ShipmentDetails from "./forms/ShipmentDetails";
import ShippingPartner from "./forms/ShippingPartner";
import { generateUniqueId } from "@/lib/utils";
import { getCustomerDetails } from "@/services/customers";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";

export default function EditOrder() {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({});
  const dispatch = useStore((state: any) => state.dispatch);
  const consignor = useStore((state: any) => state.order.selectedConsignorDetails);
  const [isCSBV, setIsCSBV] = useState(false);
  useEffect(() => {
    if (orderId) {
      getOrderDetails(Number(orderId)).then((res) => {
        setOrderDetails(res.data);
        const {
          customer_shipping_firstname,
          customer_shipping_lastname,
          customer_shipping_email,
          customer_shipping_mobile,
          customer_shipping_address,
          customer_shipping_address_2,
          customer_shipping_address_3,
          customer_shipping_postcode,
          customer_billing_postcode,
          customer_billing_address,
          customer_billing_address_2,
          customer_billing_address_3,
          customer_billing_city,
          customer_shipping_city,
          customer_shipping_state_id,
          customer_billing_state_id,
          customer_billing_country_code,
          customer_shipping_country_code,
        } = res.data;

        const consigneeDetailsEdit = {
          shipmentType: res.data.csb5_status === "0" ? ShipmentType.CSBIV : ShipmentType.CSBV,
          firstName: customer_shipping_firstname,
          lastName: customer_shipping_lastname,
          mobile: customer_shipping_mobile,
          email: customer_shipping_email,
          address1: customer_shipping_address,
          address2: customer_shipping_address_3,
          address3: customer_shipping_address_2,
          pincode: customer_shipping_postcode,
          country: customer_shipping_country_code,
          state: customer_shipping_state_id,
          city: customer_shipping_city,
          isBillingSameAsShipping: customer_billing_postcode === customer_shipping_postcode,
          address1_billing: customer_billing_address,
          address2_billing: customer_billing_address_3,
          address3_billing: customer_billing_address_2,
          pincode_billing: customer_billing_postcode,
          country_billing: customer_billing_country_code,
          state_billing: customer_billing_state_id,
          city_billing: customer_billing_city,
        };
        const shipmentDetailsEdit = {
          invoiceNumber: res.data.vendor_invoice_no,
          invoiceDate: res.data.vendor_order_date,
          invoiceCurrency: res.data.currency_code,
          orderReferenceNo: res.data.order_reference,
          iossNumber: res.data.ioss_number,
          packageWeight: Number(res.data.package_weight) / 1000,
          packageLength: Number(res.data.package_length),
          packageBreadth: Number(res.data.package_breadth),
          packageHeight: Number(res.data.package_height),
          products: res.data.items.map((item: any) => ({
            id: generateUniqueId(),
            productName: item.vendor_order_item_name,
            productSKU: item.vendor_order_item_sku,
            productQty: Number(item.vendor_order_item_quantity),
            productUnitPrice: Number(item.vendor_order_item_unit_price),
            productHSN: item.vendor_order_item_hsn,
            productIGST: String(Number(item.vendor_order_item_tax_rate)),
          })),
        };
        dispatch(() =>
          updateEditOrderForm({
            selectedConsignorDetails: consignor,
            consigneeDetails: consigneeDetailsEdit,
            shipmentDetails: shipmentDetailsEdit,
            selected_shipper: res.data.shipper,
          }),
        );
        dispatch(() => updateOrderId(res.data.order_id));
      });
    }
  }, []);

  useEffect(() => {
    if (orderDetails.customer_id) setConsignorDetails(orderDetails.customer_id);
  }, [orderDetails]);

  async function setConsignorDetails(customer_id: string) {
    const response = await getCustomerDetails(customer_id);
    if (response) {
      const consignor = {
        consignor_id: response.data.customer_id,
        name: response.data.firstname + " " + response.data.lastname,
        email: response.data.email,
        mobile: response.data.mobile,
        address: response.data.meta_data?.address,
        location: "location",
        documentType: "Aadhar Card",
        documentNumber: response.data.meta_data?.id_number,
        csb5_status: response.data.csb5_status,
      };
      dispatch(() => updateOrderConsignorID(consignor));
      setIsCSBV(response.data.csb5_status);
    }
  }
  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(true);
  console.log(location.pathname);
  return (
    <FranchisePage>
      <BreadcrumbNav
        parent="Orders"
        parentLink="/orders"
        subParent="Drafts"
        subParentLink="/orders?tab=drafts"
        title={`Edit ${isCSBV ? "CSB-V" : "CSB-IV "} Order`}
      />
      <div className="flex flex-row mt-3" style={{ maxHeight: "calc(100vh - 5rem)" }}>
        <div className="w-full overflow-auto lg:w-2/3">
          <OrderStepForm title="Consignor Details" content={<ConsignorDetails edit={true} />} step={1} />
          <OrderStepForm
            title="Consignee Details"
            content={<ConsigneeDetails setIsBillingSameAsShipping={setIsBillingSameAsShipping} />}
            step={2}
          />
          <OrderStepForm title="Shipment Information" step={3} content={<ShipmentDetails csbv={isCSBV} />} />
          <OrderStepForm title="Select Shipping Partner" step={4} content={<ShippingPartner />} />
        </div>
        <div className="hidden overflow-auto lg:w-1/3 lg:flex lg:flex-col pb-28">
          <OrderSummary isBillingSameAsShipping={isBillingSameAsShipping} />
        </div>
      </div>
    </FranchisePage>
  );
}
