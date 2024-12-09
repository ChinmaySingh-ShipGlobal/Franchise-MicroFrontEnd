import { Card, CardContent } from "@/components/ui/card";
import FranchisePage from "@/layouts/FranchisePage";
import { Ban, CircleCheck, FileText, Info, MapPin, User, Weight, X } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable, ColumnDef } from "@tanstack/react-table";
import { useNavigate, useParams } from "react-router-dom";
import { cancelOrder, getOrderDetails, processDispute } from "@/services/orders";
import { toast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/elements/LoadingButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { toSentenceCase } from "@/lib/utils";
import { initialOrderDetails, IOrderDetails, Item, OrderTotalItem } from "@/interfaces/view-order";
import { RechargeDialog } from "../Wallet";
import { Icon } from "@iconify/react";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import InfoBox from "@/components/elements/InfoBox";
import {
  BlueWeightSVG,
  Dimension,
  ManifestSVG,
  PickupTruck,
  ShippingPartner,
  WeightSVG,
  YellowWeightSVG,
} from "@/assets/ManifestSymbolsSVG";
import { ViewOrderBillingDetails } from "@/assets/BillingDetailsSVG";

export default function ViewOrders() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<IOrderDetails>(initialOrderDetails);
  const [cancelButtonDialog, setCancelButtonDialog] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  function fetchOrderDetails() {
    if (orderId) {
      getOrderDetails(Number(orderId))
        .then((res) => {
          setOrderDetails(res.data);
        })
        .catch(() => {
          toast({ variant: "destructive", title: "Failed to fetch order details" });
        });
    }
  }

  const cancelOrderHandler = () => {
    if (orderId) {
      setCancelButtonDialog(true);
      cancelOrder(Number(orderId))
        .then(() => {
          toast({ variant: "success", title: "Order cancelled successfully" });
          setOrderDetails(initialOrderDetails);
          fetchOrderDetails();
        })
        .catch(() => {
          toast({ variant: "destructive", title: "Failed to cancel order" });
        })
        .finally(() => {
          setCancelButtonDialog(false);
        });
    }
  };

  const subparent = sessionStorage.getItem("OrderTab") || "All Orders";

  //recharge wallet
  const activePaymentGateways = ["cashfree", "paytm"];
  const [rechargeWalletDialog, setRechargeWalletDialog] = useState(false);

  const [loading, setLoading] = useState(false);
  const [rejectPopup, setRejectPopup] = useState(false);
  const handleDisputeStatus = async (action: string) => {
    setLoading(true);
    const response = await processDispute({
      action: action,
      order_id: orderId,
    });
    if (response) {
      if (response.status === 200) {
        toast({ variant: "success", title: response.data.message });
        navigate("/orders?tab=disputes");
      }
    }
    setLoading(false);
  };
  return (
    <FranchisePage>
      <div className="flex justify-between md:flex-col lg:flex-row">
        <BreadcrumbNav
          parent="Orders"
          parentLink="/orders?tab=all"
          title="View Order"
          titleLink={`/view-order/${orderId}`}
          subParent={subparent === "all" ? "All Orders" : toSentenceCase(subparent)}
          subParentLink={`/orders?tab=${subparent === "null" ? "all" : subparent}`}
          tabName={orderDetails.tracking}
          className="text-lg"
        />

        <div className="flex items-center justify-end mt-2 mr-4 text-xs font-normal gap-x-4">
          {orderDetails?.order_status_id === "12" && (
            <Button onClick={() => setCancelButtonDialog(true)} variant="outline">
              Cancel Order
            </Button>
          )}

          <Button variant="outline_theme" onClick={() => navigate(-1)} className="text-xs font-normal ">
            Back
          </Button>
          <CancelOrderDialog
            open={cancelButtonDialog}
            setIsOpen={setCancelButtonDialog}
            onConfirm={cancelOrderHandler}
          />
        </div>
      </div>
      {orderDetails?.order_status_id === "11" && (
        <div>
          <Card className="flex shadow-none items-center gap-3 px-6 m-0 mt-4 mb-5 border border-yellow-900 rounded-xl bg-yellow-250">
            <Info className="w-6 h-6 text-pink " />
            <p className="text-sm font-medium">
              Your order is under <b className="font-medium text-pink">dispute</b>, Please{" "}
              <b className="font-medium text-pink">pay additional charges</b> to proceed order.
            </p>
          </Card>
          <Card className="flex flex-col justify-between gap-4 px-6 py-1 m-0 shadow-none md:pl-4 md:pr-2 md:flex-row">
            <div className="w-full rounded-lg md:w-2/3 bg-white">
              {orderDetails.dispute_details.dispute
                .filter((item: any) => item.dispute_type !== "other")
                .map((item: any) => {
                  if (item.dispute_type === "weight") {
                    const dimensions =
                      orderDetails.package_length +
                      " x " +
                      orderDetails.package_breadth +
                      " x " +
                      orderDetails.package_height;
                    return (
                      <div className="border border-gray-150 rounded-lg my-3 bg-gray-50">
                        <DisputeBox
                          type="weight"
                          details={item}
                          deadWeight={Number(orderDetails.package_weight) / 1000}
                          dimensions={dimensions}
                          volWeight={Number(orderDetails.package_volume_weight) / 1000}
                        />
                      </div>
                    );
                  } else
                    return (
                      <div className="border border-gray-150 rounded-lg my-3 bg-gray-50">
                        <DisputeBox type={item.dispute_type} details={item} />
                      </div>
                    );
                })}
              {orderDetails.dispute_details.dispute
                .filter((item: any) => item.dispute_type === "other")
                .map((item: any) => (
                  <div className="border border-gray-150 rounded-lg my-3 bg-gray-50">
                    <DisputeBox type={item.dispute_type} details={item} />
                  </div>
                ))}
            </div>
            <CardContent className="w-full p-0 rounded-lg md:w-1/3 bg-gray-50">
              <p className="px-4 py-3 text-sm font-semibold border-b">Amount to be Paid</p>
              <div className="flex justify-between px-4 mt-4 space-x-10 text-xs font-normal text-gray-800">
                <div className="grid text-black gap-y-4">
                  <p>Wallet Balance</p>
                  <p>Dispute Cost</p>
                </div>
                <div className="grid font-medium text-black gap-y-4 ">
                  <p>Rs. {orderDetails.dispute_details.current_wallet_balance}</p>
                  <p>Rs. {orderDetails.dispute_details.dispute_cost}</p>
                </div>
              </div>
              <div className="flex justify-between px-4 py-3 mt-5 text-xs font-semibold bg-gray-200">
                {/* if wallet - dispute cost >= 0 do payment else do recharge  */}
                <p>
                  {Number(orderDetails.dispute_details.current_wallet_balance) -
                    Number(orderDetails.dispute_details.dispute_cost) >=
                  0
                    ? "Payment"
                    : "Recharge"}{" "}
                  Amount
                </p>
                <p>
                  Rs.{" "}
                  {Number(orderDetails.dispute_details.current_wallet_balance) -
                    Number(orderDetails.dispute_details.dispute_cost) >=
                  0
                    ? Number(orderDetails.dispute_details.dispute_cost)
                    : Math.abs(
                        Number(orderDetails.dispute_details.current_wallet_balance) -
                          Number(orderDetails.dispute_details.dispute_cost),
                      ).toFixed(2)}
                </p>
              </div>
              <div className="w-full p-2 py-4">
                <Button variant="ghost" className="w-1/2" onClick={() => setRejectPopup(true)}>
                  Reject
                </Button>
                {Number(orderDetails.dispute_details.current_wallet_balance) -
                  Number(orderDetails.dispute_details.dispute_cost) >=
                0 ? (
                  <Button className="w-1/2" onClick={() => handleDisputeStatus("accept")}>
                    Approve
                    {loading && <Icon icon="lucide:loader" className={"self-center ml-2 animate-spin"} />}
                  </Button>
                ) : (
                  <RechargeDialog
                    activePaymentGateways={activePaymentGateways}
                    rechargeWalletDialog={rechargeWalletDialog}
                    setRechargeWalletDialog={setRechargeWalletDialog}
                    rechargeAmount={Number(
                      Math.abs(
                        Number(orderDetails.dispute_details.current_wallet_balance) -
                          Number(orderDetails.dispute_details.dispute_cost),
                      ).toFixed(2),
                    )}
                    triggerElement={
                      <Button className="w-1/2" onClick={() => setRechargeWalletDialog(true)}>
                        Recharge
                      </Button>
                    }
                  />
                )}
              </div>
              <DisputeRejectOptionsPopup
                open={rejectPopup}
                setOpen={setRejectPopup}
                loading={loading}
                handleDisputeStatus={handleDisputeStatus}
                rto={orderDetails.dispute_details.rto_price}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {Object.keys(orderDetails).length > 0 && (
        <div className="h-screen lg:flex lg:gap-x-3">
          <div className="lg:w-2/3">
            <PickUpAddress orderDetails={orderDetails} />
            <OrderDetails orderDetails={orderDetails} />
            <OrderTable
              data={
                orderDetails?.items
                  ? orderDetails.items.map((v: Item, k: number) => {
                      return {
                        ...v,
                        srNo: (k + 1).toString(),
                        vendor_order_item_unit_price: `${v.vendor_order_item_unit_price} ${orderDetails.currency_code}`,
                        total:
                          (
                            parseFloat(v.vendor_order_item_unit_price) * parseFloat(v.vendor_order_item_quantity)
                          ).toFixed(2) +
                          " " +
                          orderDetails.currency_code,
                      };
                    })
                  : []
              }
            />
          </div>
          <div className="lg:w-1/3">
            <Summary orderDetails={orderDetails} />
            {orderDetails?.order_status_id !== "11" && <Activity orderDetails={orderDetails} />}
          </div>
        </div>
      )}
    </FranchisePage>
  );
}

const DisputeRejectOptionsPopup = ({
  open,
  setOpen,
  handleDisputeStatus,
  loading,
  rto,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleDisputeStatus: (action: string) => void;
  loading: boolean;
  rto: number;
}) => {
  const [selectedType, setSelectedType] = useState("");
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="gap-0 p-0 rounded-lg lg:w-152 lg:max-w-152">
        <AlertDialogHeader className="p-6 pb-0">
          <AlertDialogTitle className="flex items-center justify-between pb-3 text-left border-b">
            Choose a pickup option to reject
            <AlertDialogCancel className="text-gray-800 border-none">
              <X onClick={() => setOpen(false)} className="self-end" />
            </AlertDialogCancel>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="w-full px-8 py-2 text-sm text-pink-900 bg-pink-50">
          Amount paid by you will be refunded back to your wallet.
        </div>
        <ul>
          <li
            className="flex py-4 border-b cursor-pointer justify-evenly"
            onClick={() => {
              setSelectedType("self_pickup");
            }}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-circle-check float-right ${
                  selectedType === "self_pickup" ? "fill-green-900" : "fill-gray-600"
                } stroke-white`}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="text-base text-left">
              <h4 className="font-semibold">Self Pickup</h4>
              <span className="text-xs text-gray-800">
                You can pick up package yourself from office at no extra charge
              </span>
            </div>
            <div className="flex items-center font-medium">Rs 0.00</div>
          </li>
          <li
            className="flex py-4 border-b cursor-pointer justify-evenly"
            onClick={() => {
              setSelectedType("rto");
            }}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-circle-check float-right ${
                  selectedType === "rto" ? "fill-green-900" : "fill-gray-600"
                } stroke-white`}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="text-base text-left max-w-96">
              <h4 className="font-semibold">RTO</h4>
              <span className="text-xs text-gray-800">
                Package will be delivered back to you, this might involve delivery charges{" "}
              </span>
            </div>
            <div className="flex items-center font-medium">Rs. {rto === 0 ? "0.00" : rto}</div>
          </li>
          <li
            className="flex py-4 border-b cursor-pointer justify-evenly"
            onClick={() => {
              setSelectedType("destroy");
            }}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-circle-check float-right ${
                  selectedType === "destroy" ? "fill-green-900" : "fill-gray-600"
                } stroke-white`}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="text-base text-left">
              <h4 className="font-semibold">Discard</h4>
              <span className="text-xs text-gray-800">
                The package will be discarded, you don't have to pay anything
              </span>
            </div>
            <div className="flex items-center font-medium">Rs. 0.00</div>
          </li>
        </ul>
        <AlertDialogFooter>
          <AlertDialogAction>
            <Button className="mt-8 mb-4" onClick={() => handleDisputeStatus(selectedType)}>
              Confirm
              {loading && <Icon icon="lucide:loader" className={"self-center ml-2 animate-spin"} />}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DisputeBox = ({
  type,
  details,
  deadWeight,
  dimensions,
  volWeight,
}: {
  type: string;
  details: any;
  deadWeight?: number;
  dimensions?: string;
  volWeight?: number;
}) => {
  switch (type) {
    case "weight":
      const vol_weight =
        (Number(details.actual_length) * Number(details.actual_breadth) * Number(details.actual_height)) / 5000;
      return (
        <CardContent className="flex flex-col justify-between p-5 pb-0 md:flex-row last:pb-5 gap-7">
          <CardContent className="w-full p-4 px-3 bg-white border border-pink-900 rounded-lg md:w-1/3">
            <div className="flex items-center gap-4">
              <Weight className="w-10 h-10 p-2 border-pink-900 rounded-lg stroke-pink-900 bg-pink-50" />
              <span className="text-base font-medium border-pink-900 text-pink">Weight Dispute</span>
            </div>
            <div className="flex justify-between mt-6 text-sm">
              <span className="font-medium">Charges</span>
              <span className="font-semibold">Rs {details.actual_rate}</span>
            </div>
          </CardContent>
          <CardContent className="w-full bg-white border rounded-lg md:w-2/3">
            <div className="flex justify-between mt-4">
              <div className="flex flex-col justify-end space-y-2 text-xs text-gray-900">
                <span>Dead Weight</span>
                <span>Dimensions (in cm)</span>
                <span>Volumetric Weight</span>
              </div>
              <div className="flex flex-col space-y-1 text-sm font-medium">
                <span>Booked</span>
                <span>{deadWeight} KG</span>
                <span>{dimensions}</span>
                <span>{volWeight} KG</span>
              </div>
              <div className="flex flex-col space-y-1 text-sm font-medium">
                <span>Actual</span>
                <span>{details.actual_weight} KG</span>
                <span>{details.actual_length + " x " + details.actual_breadth + " x " + details.actual_height}</span>
                <span>{vol_weight} KG</span>
              </div>
            </div>
          </CardContent>
        </CardContent>
      );

    default:
      return (
        <CardContent className="flex justify-between p-5 pb-0 last:pb-5 gap-7">
          <CardContent className="w-1/2 p-4 px-3 bg-white border border-pink-900 rounded-lg md:w-1/3">
            <div className="flex items-center gap-4">
              <Ban className="w-10 h-10 p-2 rounded-lg stroke-pink-900 bg-pink-50" />
              <span className="text-base font-medium text-pink-900">
                {toSentenceCase(details.dispute_type)} Dispute
              </span>
            </div>
            <div className="flex justify-between mt-3 text-sm">
              <span className="font-medium">Charges</span>
              <span className="font-semibold">Rs {details.actual_rate}</span>
            </div>
          </CardContent>
          <CardContent className="w-1/2 bg-white border rounded-lg md:w-2/3">
            <div className="flex flex-col justify-between mt-4 text-sm">
              {details.dispute_type === "other" && (
                <div>
                  <span className="font-semibold">Reason : </span>
                  <span className="text-gray-900">{details.other_reason}</span>
                </div>
              )}
              <div>
                <span className="font-semibold">Description : </span>
                <span className="text-gray-900">{details.other_desc}</span>
              </div>
            </div>
          </CardContent>
        </CardContent>
      );
  }
};

const OrderDetails = ({ orderDetails }: { orderDetails: IOrderDetails }) => {
  return (
    <Card className="p-0 m-0 mt-4 shadow-none ">
      <CardContent className="p-5">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger className="flex justify-between p-0 m-0 hover:no-underline" hasArrow={true}>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-lightBlue-100">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-semibold">Order Details</p>
              </div>
            </AccordionTrigger>
            <div className="grid py-4 md:grid-cols-3 md:gap-x-4 xl:gap-x-16 gap-y-4">
              <InfoBox
                title="Billed Weight"
                text={`${Number(orderDetails.package_bill_weight) / 1000} kg`}
                icon={<WeightSVG />}
              />
              <InfoBox
                title="Volumetric Wt"
                text={`${Number(orderDetails.package_volume_weight) / 1000} kg`}
                icon={<YellowWeightSVG />}
              />
              <InfoBox
                title="Dimensions (L x B x H)"
                text={`${orderDetails.package_length} cm x ${orderDetails.package_breadth} cm x ${orderDetails.package_height} cm`}
                icon={<Dimension />}
              />
            </div>
            <AccordionContent className="grid py-0 md:grid-cols-3 md:gap-x-4 xl:gap-x-16 gap-y-4">
              <InfoBox
                title="Dead Weight"
                text={`${Number(orderDetails.package_weight) / 1000} kg`}
                icon={<BlueWeightSVG />}
              />
              {orderDetails.shipper_info && (
                <InfoBox
                  title="Shipping Partner"
                  text={orderDetails.shipper_info.provider_display_name}
                  icon={<ShippingPartner />}
                />
              )}
              {orderDetails.manifest_code && (
                <InfoBox title="Manifest Details" text={orderDetails.manifest_code} icon={<ManifestSVG />} />
              )}
              {orderDetails.pickup_request_code && (
                <InfoBox title="Pickup Request" text={orderDetails.pickup_request_code} icon={<PickupTruck />} />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

const Summary = ({ orderDetails }: { orderDetails: IOrderDetails }) => {
  return (
    <Card className="p-0 m-0 mt-4 shadow-none bg-yellow-50 max-h-max">
      <CardContent className="p-0">
        <div className="px-4 py-3 text-sm font-semibold text-orange-800 border-b border-yellow-600">Summary</div>
        <div className="flex justify-between px-4 mt-4 space-x-10 text-xs font-normal text-black">
          <div className="grid gap-y-4 ">
            {orderDetails.order_total?.map((item: OrderTotalItem) => (
              <p key={item.code}>{item.title}</p>
            ))}
          </div>
          <div className="grid text-black gap-y-4">
            {orderDetails.order_total?.map((item: OrderTotalItem) => (
              <p key={item.code}>Rs. {item.value.replace("Rs.", "")}</p>
            ))}
          </div>
        </div>
        <div className="flex justify-between px-4 py-3 mt-5 mb-12 text-xs font-semibold bg-yellow-700 rounded-md">
          <p>Sub Total</p>
          <p>Rs. {orderDetails.total}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const PickUpAddress = ({ orderDetails }: { orderDetails: IOrderDetails }) => {
  const deliveryAddress = [
    orderDetails.customer_shipping_address,
    orderDetails.customer_shipping_address_2,
    orderDetails.customer_shipping_address_3,
    orderDetails.customer_shipping_city,
    orderDetails.customer_shipping_state,
    orderDetails.customer_shipping_country,
    orderDetails.customer_shipping_postcode,
  ]
    .filter(Boolean)
    .map(toSentenceCase)
    .join(", ");

  const CustomerDetails = [
    orderDetails.pickup_address,
    orderDetails.pickup_landmark,
    orderDetails.pickup_city,
    orderDetails.pickup_postcode,
  ]
    .filter(Boolean)
    .map(toSentenceCase)
    .join(", ");
  return (
    <Card className="grid px-5 py-4 m-0 mt-4 space-y-4 shadow-none lg:space-y-0 lg:grid-cols-2">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-lightBlue-100">
            <User className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base font-semibold">Customer Details</p>
        </div>
        <div className="flex mx-4 space-x-10 text-sm font-normal text-gray-800">
          <div className="grid px-6 space-y-2">
            <div className="flex font-medium">
              {orderDetails.pickup_firstname && orderDetails.pickup_lastname
                ? `${toSentenceCase(orderDetails.pickup_firstname)} ${toSentenceCase(orderDetails.pickup_lastname)}`
                : "Name Not Found"}
              | {orderDetails.pickup_mobile ? `+91 ${orderDetails.pickup_mobile}` : "Mobile Number Not Found"}
            </div>
            <div className="text-wrap ">{orderDetails.pickup_address ? CustomerDetails : "Addresss Not Found"}</div>
          </div>
        </div>
      </CardContent>
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-lightBlue-100">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <p className="text-base font-semibold">Delivery Address</p>
        </div>
        <div className="flex mx-4 space-x-10 text-sm font-normal text-gray-800">
          <div className="grid px-6 space-y-2">
            <div className="flex font-medium">
              {orderDetails.customer_shipping_firstname && orderDetails.customer_shipping_lastname
                ? `${toSentenceCase(orderDetails.customer_shipping_firstname)} ${toSentenceCase(
                    orderDetails.customer_shipping_lastname,
                  )}`
                : "Address Not Found"}
              |{orderDetails.customer_shipping_mobile ? ` ${orderDetails.customer_shipping_mobile}` : ""}
            </div>
            <div className="text-wrap">
              {orderDetails.customer_shipping_address ? deliveryAddress : "Address Not Found"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export type TableData = {
  srNo: string;
  vendor_order_item_name: string;
  vendor_order_item_sku: string;
  vendor_order_item_hsn: string;
  vendor_order_item_quantity: string;
  vendor_order_item_unit_price: string;
  total: string;
};

const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: "srNo",
    header: "Sr No.",
  },
  {
    accessorKey: "vendor_order_item_name",
    header: "Product Name",
  },
  {
    accessorKey: "vendor_order_item_sku",
    header: "SKU",
  },
  {
    accessorKey: "vendor_order_item_hsn",
    header: "HSN",
  },
  {
    accessorKey: "vendor_order_item_quantity",
    header: "Qty",
  },
  {
    accessorKey: "vendor_order_item_unit_price",
    header: "Unit Price",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
];

interface OrderTableProps {
  data: TableData[];
}

const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="w-full p-0 m-0 mt-4 shadow-none lg:pb-10">
      <CardContent className="px-5 py-3">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-lightBlue-100">
            <ViewOrderBillingDetails />
          </div>
          <p className="text-sm font-semibold">Billed Details</p>
        </div>
        <Table>
          <TableHeader className="text-xs font-normal">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-sm font-normal">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const Activity = ({ orderDetails }: { orderDetails: IOrderDetails }) => {
  const statusNames = [
    { name: "Draft", description: "Shipment Created & Awaiting Payment", status: 12 },
    { name: "Ready", description: "Payment Received", status: 1 },
    { name: "Packed", description: "Label Printed & Order Packed", status: 2 },
    { name: "Manifested", description: "Awaiting for Pickup", status: 13 },
    { name: "Dispatched", description: "Shipment in Transit", status: 15 },
    { name: "Received", description: "Received at Hub", status: 17 },
    { name: "Processed", description: "Processed", status: 4 },
  ];
  const allStatusId = statusNames.map((status) => status.status);
  const status = allStatusId.indexOf(Number(orderDetails.order_status_id));
  const visitedStatus = allStatusId.slice(0, status + 1);

  return (
    <Card className="p-0 pb-10 m-0 mt-2 shadow-none max-h-max">
      <CardContent className="p-0 px-4 mb-12 lg:mb-0">
        <div className="py-3 text-sm font-semibold">Activity</div>
        <div className="flex mt-2">
          <div className="flex-col space-y-5">
            {allStatusId.map((step, index) => (
              <div className="grid gap-y-4" key={index}>
                <CircleCheck
                  className={`text-white rounded-full border-none ${
                    visitedStatus.includes(step) ? "bg-green-700" : "bg-gray-800"
                  }`}
                />
                {index < allStatusId.length - 1 && <VerticalLineSegment />}
              </div>
            ))}
          </div>
          <div className="text-black ">
            <div className="w-full pl-2 space-y-11">
              {statusNames.map((item, index) => (
                <div className="text-sm font-normal text-gray-800" key={index}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-black">{item.description}</div>
                    {/* Uncomment and modify if you want to show location */}
                    {/* <div>Delhi, India</div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type CancelOrderDialogProps = {
  open: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
};

const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({ open, setIsOpen, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const confirmHandler = () => {
    setLoading(true);
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={loading ? () => {} : setIsOpen}>
      <AlertDialogContent className="rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-medium">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="">
            This action cannot be undone. This will permanently delete your order.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row end">
          <div className="flex justify-center w-full gap-x-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton loading={loading} onClick={confirmHandler} variant="destructive" className="mt-2" />
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const VerticalLineSegment = () => {
  return <hr className="rotate-90 border border-gray-500 border-dashed mt-0.5 border-dasharray-20" />;
};
