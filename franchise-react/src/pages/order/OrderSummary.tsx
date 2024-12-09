import FranchisePage from "@/layouts/FranchisePage";
import { Card } from "@/components/ui/card";
import TextGroup from "@/components/elements/TextGroup";
import { Button } from "@/components/ui/button";
import SuccessImg from "@/assets/success.png";
import { CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { useStore } from "@/zustand/store";
import { BoxMeasurements, ItemDetailsView } from "./ItemSummary";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { safeFormatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getOrderDetails } from "@/services/orders";

export default function OrderSummary() {
  const total = useStore((state: any) => state.order.orderSummary);
  const navigate = useNavigate();

  return (
    <FranchisePage className="h-full min-h-screen">
      <BreadcrumbNav pageTitle="Order Summary" />
      {total.total ? (
        <div className="flex flex-col md:gap-4 lg:mt-3 lg:flex-row">
          <LeftCard />
          <div className="lg:w-1/3 lg:flex lg:flex-col">
            <OrderDetails />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-8 space-y-4">
          <div className="text-sm text-red">Order details not found. Please add an order first.</div>
          <Button
            variant="outline"
            className="font-normal border-primary text-primary"
            onClick={() => navigate("/orders")}
          >
            Go back to orders
          </Button>
        </div>
      )}
    </FranchisePage>
  );
}

const LeftCard = () => {
  const navigate = useNavigate();
  const total = useStore((state: any) => state.order.orderSummary);
  const [orderStatusID, setOrderStatusID] = useState("");
  useEffect(() => {
    getOrderDetails(total.order_id).then((res) => {
      setOrderStatusID(res.data.order_status_id);
    });
  });
  return (
    <div className="w-full lg:w-2/3">
      <Card className="px-6 pt-4 lg:h-144 pb-16 m-0 border shadow-none">
        <div className="flex flex-col items-center justify-center w-full py-5">
          <img src={SuccessImg} alt="success-image" className="w-32 h-32" />
          <p className="mt-3 text-2xl font-medium text-center">Order created successfully</p>
          <OrderStatusBar />
          <Button
            className="my-8 text-xs"
            onClick={() => {
              orderStatusID && orderStatusID === "1" ? navigate("/orders?tab=ready") : navigate("/orders?tab=drafts");
            }}
          >
            Back to Orders
          </Button>
        </div>
      </Card>
    </div>
  );
};
const OrderDetails = () => {
  const {
    tracking,
    order_total,
    total,
    customer_shipping_firstname,
    customer_shipping_lastname,
    customer_shipping_mobile,
    customer_shipping_address,
    customer_shipping_address_2,
    customer_shipping_address_3,
    customer_shipping_city,
    customer_shipping_state,
    customer_shipping_country,
    csb5_status,
    items,
    package_breadth,
    package_height,
    package_length,
    currency_code,
    package_bill_weight,
  } = useStore((state: any) => state.order.orderSummary);

  return (
    <>
      <Card className="p-0 py-6 m-0 lg:min-h-144 border shadow-none">
        <div className="px-5">
          <div className="mb-3 border-b border-b-gray-200">
            <p className="text-lg font-semibold">Order ID : {tracking}</p>
            <div className="my-3 text-xs font-normal">
              <p className="font-semibold text-left">Shipping Address</p>
              <div className="flex flex-col justify-between mt-2 lg:flex-row lg:gap-x-14">
                <div className="whitespace-nowrap">
                  <TextGroup
                    title="Name"
                    value={customer_shipping_firstname + " " + customer_shipping_lastname}
                    valuenextline={customer_shipping_mobile}
                  />
                </div>
                <TextGroup
                  title="Address"
                  value={
                    customer_shipping_address +
                    ", " +
                    customer_shipping_address_2 +
                    ", " +
                    customer_shipping_address_3 +
                    ", " +
                    customer_shipping_city +
                    ", " +
                    customer_shipping_state +
                    ", " +
                    customer_shipping_country
                  }
                />
              </div>
              <p className="mt-3 font-semibold text-left">Shipment Type</p>
              <p className="mt-1 text-sm font-semibold text-left text-orange">
                {csb5_status === "0" ? "CSB-IV" : "CSB-V"}
              </p>
            </div>
          </div>
          {items && (
            <div className="pb-3 border-b border-b-gray-200">
              <p className="pb-3 text-sm font-semibold">Item Details</p>
              <div className="flex flex-col w-full text-left gap-y-4">
                <BoxMeasurements
                  billed_weight={package_bill_weight / 1000}
                  breadth={package_breadth}
                  length={package_length}
                  height={package_height}
                />
                <ItemDetailsView items={items} currency={currency_code} />
              </div>
            </div>
          )}
        </div>
        <div className="mb-12 md:mb-0">
          <div className="flex justify-between px-5 mt-4 space-x-10 text-xs font-normal text-gray-800">
            <div className="grid gap-y-4">
              <p>{order_total[0].title}</p>
              <p>{order_total[1].title}</p>
            </div>
            <div className="grid text-right text-black gap-y-4">
              <p>Rs {order_total[0].value}</p>
              <p>{order_total[1].value}</p>
            </div>
          </div>
          <div className="flex justify-between px-5 py-3 mt-5 text-xs font-semibold bg-yellow">
            <p>Total</p>
            <p>Rs {total}</p>
          </div>
        </div>
      </Card>
    </>
  );
};

const OrderStatusBar = () => {
  const isLG = useMediaQuery("(max-width: 768px)"); //if can be implemented with tailwindcss breakpoints then thats better
  const { order_total } = useStore((state: any) => state.order.orderSummary);
  return (
    <Card className="w-full px-5 border border-gray-200 shadow-none bg-gray-50 mt-9 py-7">
      <div className="flex gap-x-4 lg:flex-col">
        <div className="grid lg:grid-cols-4 justify-items-center gap-y-4">
          {isLG ? <VerticalTimeline /> : <HorizontalTimeline />}
        </div>
        <div className="grid mt-1 lg:grid-cols-4 lg:justify-items-center lg:text-center gap-y-4">
          <TextGroup title="Order Created" value={safeFormatDate(order_total[0].date_added)} />
          <TextGroup title="Order Picked Up" />
          <TextGroup title="Order Received at Hub" />
          <TextGroup title="Order Dispatched from Hub" />
        </div>
      </div>
    </Card>
  );
};
const VerticalLineSegment = () => {
  return <hr className="rotate-90 border-b border-gray-800 border-dotted" />;
};
const HorizontalLineSegment = () => {
  return <hr className="flex-1 border-b border-black border-dotted" />;
};

const VerticalTimeline = () => {
  return (
    <>
      <div className="grid gap-y-1">
        <CircleCheck className="text-green-700 bg-green-100 rounded-full bg" />
        <VerticalLineSegment />
      </div>
      <div className="grid gap-y-1">
        <VerticalLineSegment />
        <CircleCheck />
        <VerticalLineSegment />
      </div>
      <div className="grid gap-y-1">
        <VerticalLineSegment />
        <CircleCheck />
        <VerticalLineSegment />
      </div>
      <div className="grid gap-y-1">
        <VerticalLineSegment />
        <CircleCheck />
      </div>
    </>
  );
};

const HorizontalTimeline = () => {
  return (
    <>
      <div className="grid items-center w-full grid-cols-2">
        <div className="flex justify-end">
          <CircleCheck className="text-green-700 bg-green-100 rounded-full bg" />
        </div>
        <HorizontalLineSegment />
      </div>
      <div className="flex items-center w-full">
        <HorizontalLineSegment /> <CircleCheck /> <HorizontalLineSegment />
      </div>
      <div className="flex items-center w-full">
        <HorizontalLineSegment /> <CircleCheck /> <HorizontalLineSegment />
      </div>
      <div className="grid items-center w-full grid-cols-2">
        <HorizontalLineSegment /> <CircleCheck />
      </div>
    </>
  );
};
