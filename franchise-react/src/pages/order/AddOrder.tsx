import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";

import FranchisePage from "@/layouts/FranchisePage";
import ConsigneeDetails from "@/pages/order/forms/ConsigneeDetails";
import ShippingPartner from "@/pages/order/forms/ShippingPartner";
import ShipmentDetails from "@/pages/order/forms/ShipmentDetails";
import ConsignorDetails from "@/pages/order/forms/ConsignorDetails";
import QuickTips from "./QuickTips";

import { useStore } from "@/zustand/store";
import { updateActiveOrderStep } from "@/zustand/actions";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import TextGroup from "@/components/elements/TextGroup";
import { toSentenceCase } from "@/lib/utils";
import { OrderStepFormProps } from "@/interfaces/add-order";
import { BoxMeasurements, ProductsDetails } from "./ItemSummary";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddOrder() {
  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(true);
  return (
    <FranchisePage>
      <BreadcrumbNav parent="Orders" parentLink="/orders" title="Create CSB-IV Order" />
      <div className="flex flex-row mt-3" style={{ maxHeight: "calc(100vh - 5rem)" }}>
        <div className="w-full overflow-auto lg:w-2/3">
          <OrderStepForm title="Consignor Details" content={<ConsignorDetails />} step={1} />
          <OrderStepForm
            title="Consignee Details"
            content={<ConsigneeDetails setIsBillingSameAsShipping={setIsBillingSameAsShipping} />}
            step={2}
          />
          <OrderStepForm title="Shipment Information" step={3} content={<ShipmentDetails />} />
          <OrderStepForm title="Select Shipping Partner" step={4} content={<ShippingPartner />} />
        </div>
        <div className="hidden overflow-auto lg:w-1/3 lg:flex lg:flex-col pb-28">
          <OrderSummary isBillingSameAsShipping={isBillingSameAsShipping} />
        </div>
      </div>
    </FranchisePage>
  );
}

export const OrderStepForm = ({ title, content, step }: OrderStepFormProps) => {
  const dispatch = useStore((state: any) => state.dispatch);
  const activeStep = useStore((state: any) => state.order.activeStep);
  return (
    <Accordion type="single" collapsible value={String(activeStep)}>
      <AccordionItem value={String(step)} className="mb-2 border rounded">
        <AccordionTrigger
          hasArrow={false}
          className={`px-7 py-3.5 border-b hover:no-underline ${activeStep === step ? "bg-gray-100" : "bg-white"}`}
        >
          <div className="flex flex-row items-center justify-center gap-3">
            <span
              className={`w-5 h-5 rounded-sm text-xs  ${
                activeStep > step
                  ? "bg-green-800 text-white"
                  : `${activeStep === step ? "bg-black text-white" : "bg-gray-150 text-black"}`
              }`}
            >
              {activeStep > step ? (
                <Icon icon={"lucide:check"} width="1rem" className="m-auto mt-0.5" />
              ) : (
                <p className="mt-0.5">{String(step)}</p>
              )}
            </span>
            <div className={`text-sm ${activeStep === step ? "text-black" : "text-gray"}`}>{title}</div>
          </div>
          {activeStep > step && (
            <span
              className="text-sm underline text-primary"
              onClick={() => {
                dispatch(() => updateActiveOrderStep(step));
              }}
            >
              Change
            </span>
          )}
        </AccordionTrigger>
        <AccordionContent className="w-full py-4 bg-white shadow px-7">{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const OrderSummary = ({ isBillingSameAsShipping }: { isBillingSameAsShipping?: boolean | undefined }) => {
  const activeStep = useStore((state: any) => state.order.activeStep);
  const { provider_code } = useStore((state: any) => state.order.priceSummary);
  return (
    <>
      {activeStep === 1 && (
        <Card className="px-5 pt-0 m-0 mx-4 shadow-none">
          <QuickTips />
        </Card>
      )}
      {activeStep >= 2 && (
        <Card className={`px-3 m-0 pt-4 mx-4 shadow-none ${activeStep >= 4 && "rounded-b-none"}`}>
          <SelectedConsignor />
          <OrderConsigneeDetails isBillingSameAsShipping={isBillingSameAsShipping} />
        </Card>
      )}
      {activeStep >= 4 && (
        <>
          <Card className="px-5 py-1 pb-0 my-0 rounded-t-none shadow-none">
            <ItemSummary />
          </Card>
          {provider_code && (
            <Card className="px-0 pb-3 mt-3 border shadow-none border-yellow-750 bg-yellow-50">
              <div className="px-5 py-1.5 text-base font-semibold border-b border-yellow-700 text-orange">Summary</div>
              <AmountSummary />
            </Card>
          )}
        </>
      )}
    </>
  );
};

export const AmountSummary = () => {
  const { order_total, total } = useStore((state: any) => state.order.priceSummary);
  return (
    <div>
      <div className="flex justify-between px-5 mt-4 space-x-10 text-sm font-normal text-black">
        <div className="grid gap-y-4 ">
          <p>{order_total[0].title}</p>
          <p>{order_total[1].title}</p>
        </div>
        <div className="grid text-right text-black gap-y-4">
          <p>Rs. {order_total[0].value}</p>
          <p>{order_total[1].value}</p>
        </div>
      </div>
      <div className="flex justify-between px-5 py-3 mt-5 text-sm font-semibold bg-yellow-700">
        <p>Total</p>
        <p>Rs {total}</p>
      </div>
    </div>
  );
};

export const SelectedConsignor = () => {
  const selectedConsignor = useStore((state: any) => state.order.selectedConsignorDetails);
  const activeStep = useStore((state: any) => state.order.activeStep);
  const [showConsignorDetails, setShowConsignorDetails] = useState(true);

  useEffect(() => {
    activeStep == 4 && setShowConsignorDetails(false);
  }, [activeStep]);
  return (
    <>
      {activeStep >= 2 && (
        <Card className="p-0 m-0 shadow-none">
          <div className="px-3">
            <div className={`pb-2 ${activeStep > 2 && "border-b mb-4 border-b-gray-200"}`}>
              <div className="text-xs font-normal ">
                <div
                  className="flex justify-between cursor-pointer"
                  onClick={() => setShowConsignorDetails(!showConsignorDetails ? true : false)}
                >
                  <p className="mb-2 text-base font-semibold text-left">Consignor Details</p>
                  {showConsignorDetails ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 cursor-pointer" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 cursor-pointer" />
                  )}
                </div>
                {showConsignorDetails && (
                  <div>
                    <div className="flex flex-col gap-4">
                      <div className="whitespace-nowrap">
                        <TextGroup
                          title="Name"
                          value={`${toSentenceCase(selectedConsignor.name)} | ${selectedConsignor.mobile}`}
                          valuenextline={selectedConsignor.email}
                        />
                      </div>
                      <TextGroup subValueClass="font-normal" title="Address" value={selectedConsignor.address} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export const OrderConsigneeDetails = ({
  isBillingSameAsShipping,
}: {
  isBillingSameAsShipping: boolean | undefined;
}) => {
  const consigneeDetails = useStore((state: any) => state.order.consigneeDetails);
  const consigneeLocation = useStore((state: any) => state.consigneeLocation);
  const activeStep = useStore((state: any) => state.order.activeStep);
  const shippingAddress = [
    consigneeDetails.address1,
    consigneeDetails.address2,
    consigneeDetails.address3,
    consigneeDetails.city,
    consigneeLocation.state,
    consigneeLocation.country,
    consigneeDetails.pincode,
  ]
    .filter(Boolean)
    .map(toSentenceCase)
    .join(", ");
  const billingAddress = [
    consigneeDetails.address1_billing,
    consigneeDetails.address2_billing,
    consigneeDetails.address3_billing,
    consigneeDetails.city_billing,
    consigneeLocation.state_billing,
    consigneeLocation.country_billing,
    consigneeDetails.pincode_billing,
  ]
    .filter(Boolean)
    .map(toSentenceCase)
    .join(", ");
  const [showConsigneeDetails, setShowConsigneeDetails] = useState(true);

  useEffect(() => {
    activeStep == 4 && setShowConsigneeDetails(false);
  }, [activeStep]);

  return (
    <>
      {activeStep >= 3 && (
        <Card className="p-0 m-0 shadow-none">
          <div className="px-3">
            <div className={`text-xs font-normal pb-2 ${activeStep > 3 && "border-b mb-4 border-b-gray-200"}`}>
              <div
                className="flex justify-between cursor-pointer"
                onClick={() => setShowConsigneeDetails(!showConsigneeDetails ? true : false)}
              >
                <p className="mb-2 text-base font-semibold text-left">Consignee Details</p>
                {showConsigneeDetails ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 cursor-pointer" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 cursor-pointer" />
                )}
              </div>
              {showConsigneeDetails && (
                <div className="flex flex-col gap-2">
                  <div className="whitespace-nowrap">
                    <TextGroup
                      title="Name"
                      value={`${toSentenceCase(consigneeDetails.firstName + " " + consigneeDetails.lastName)} | ${
                        consigneeDetails.mobile
                      }`}
                    />
                  </div>
                  <TextGroup
                    subValueClass="font-normal"
                    title="Billing Address"
                    value={isBillingSameAsShipping ? "Same as shipping address" : billingAddress}
                  />
                  <TextGroup title="Shipping Address" subValueClass="font-normal" value={shippingAddress} />
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

const ItemSummary = () => {
  const { products, packageBreadth, packageLength, packageHeight } = useStore(
    (state: any) => state.order.shipmentDetails,
  );
  const shippingRates = useStore((state: any) => state.order.shippingRates);

  return (
    <div className="px-1">
      <p className="mb-2 text-base font-semibold text-left">Item Details</p>
      <div className="flex flex-col w-full text-left gap-y-4">
        <BoxMeasurements
          billed_weight={
            shippingRates.package_weight > shippingRates.volume_weight
              ? shippingRates.bill_weight / 1000
              : shippingRates.volume_weight / 1000
          }
          breadth={packageBreadth}
          length={packageLength}
          height={packageHeight}
        />
        <ProductsDetails products={products} />
      </div>
    </div>
  );
};
