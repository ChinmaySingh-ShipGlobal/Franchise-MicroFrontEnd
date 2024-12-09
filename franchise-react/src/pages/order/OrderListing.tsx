import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DataTable from "@/components/elements/data-table-d";
import FranchisePage from "@/layouts/FranchisePage";
import ButtonWithIcon from "@/components/elements/ButtonWithIcon";
import { useNavigate, useSearchParams } from "react-router-dom";
import useQueryParams from "@/hooks/use-queryParams";
import { bulkPayOrder, bulkProcess, generateInvoice, generateLabel, getOrderDetails } from "@/services/orders";
import { toast } from "@/components/ui/use-toast";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { useStore } from "@/zustand/store";
import { addManifestID, updateKYCStatus } from "@/zustand/actions";
import { getKycStatus } from "@/services/kyc";
import { KYCPendingSVG } from "@/assets/KYCPendingSVG";
import { createManifest } from "@/services/manifest";
import ConfirmPayment from "./ConfirmPayment";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RechargeDialog } from "../Wallet";

const OrderStatus = [
  { key: "all", status: "All Orders" },
  { key: "drafts", status: "Drafts" },
  { key: "ready", status: "Ready" },
  { key: "packed", status: "Packed" },
  { key: "manifested", status: "Manifested" },
  { key: "dispatched", status: "Dispatched" },
  { key: "received", status: "Received" },
  { key: "cancelled", status: "Cancelled" },
  { key: "disputes", status: "Disputed" },
];

export default function OrderListing() {
  const { getQueryParam, addQueryParams } = useQueryParams();
  const [activeTab, setActiveTab] = useState(getQueryParam("tab") || "all");
  const tabsListRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    addQueryParams({ tab: value }, true);
  };
  const kyc_status = useStore((state: any) => state.kyc_status);

  useEffect(() => {
    if (tabsListRef.current) {
      const selectedTab = tabsListRef.current.querySelector(`[data-value="${activeTab}"]`);
      if (selectedTab) {
        selectedTab.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
      }
    }
  }, [activeTab]);
  const [searchParams] = useSearchParams();
  sessionStorage.setItem("OrderTab", searchParams.get("tab") || "all");

  useEffect(() => {
    const tabFromParams = getQueryParam("tab") || "all";
    if (tabFromParams !== activeTab) {
      setActiveTab(tabFromParams);
    }
  }, [searchParams, activeTab, getQueryParam]);
  const [open, setOpen] = useState<boolean>(false);
  const [confirmPayment, setConfirmPayment] = useState<boolean>(false);
  const [confirmPaymentData, setConfirmPaymentData] = useState<any>({});
  const [orderDetails, setOrderDetails] = useState<any>({});
  const [rechargeAmount, setRechargeAmount] = useState<number>(0);
  const [openRecharge, setOpenRecharge] = useState<boolean>(false);
  const [fetch, setFetch] = useState(false);
  const profile = useStore((state: any) => state.profile);
  const dispatch = useStore((state: any) => state.dispatch);
  const storeWalletBalance = useStore((state: any) => state.wallet);
  const activePaymentGateways = ["cashfree", "paytm"];
  let packedOrderIDs: string[] = [];

  const fetchOrderDetails = async (order_id: number) => {
    console.log(order_id);
    try {
      const response = await getOrderDetails(order_id);
      const isNegativeValue = storeWalletBalance.balance - response.data.total < 0;
      if (isNegativeValue) {
        setOrderDetails(response.data.total);
        setRechargeAmount(response.data.total - storeWalletBalance.balance);
        toast({
          title: "Insufficient Wallet Balance",
          variant: "destructive",
        });
        setOpenRecharge(true);
        return;
      } else {
        setConfirmPaymentData(response.data);
        setConfirmPayment(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  async function onCreateManifest() {
    const payload = {};
    try {
      const response = await createManifest(payload);
      if (response) {
        if (response.status === 200) {
          toast({
            title: response.data.message,
            variant: "success",
          });
          console.log(response.data.data.manifest_code);
          navigate(`/manifests/view/${response.data.data.manifest_code}`, { state: { packedOrderIDs } });
        } else {
          toast({
            title: response.data.message,
            variant: "success",
          });
        }

        dispatch(() => addManifestID(response.data.data.manifest_code));
        navigate(`/manifests/view/${response.data.data.manifest_code}`, { state: { packedOrderIDs } });
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <FranchisePage className="h-full min-h-screen">
      <div className="absolute flex items-center float-right 2xl:right-56 right-8 top-3">
        <ButtonWithIcon
          iconName="lucide:plus"
          text="Create Order"
          className={`h-9 border-r rounded-lg ${profile.csb5_enabled !== "0" && "rounded-r-none"}`}
          onClick={() => {
            if (kyc_status === "approved" && profile.is_pickup_address) navigate("/add-order");
            else setOpen(true);
          }}
        />
        {profile.csb5_enabled !== "0" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="px-2 border-l-0 rounded-l-none h-9">
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 mr-8">
              <Button
                className="h-10 border-r rounded-lg rounded-r-none"
                variant="ghost"
                onClick={() => {
                  if (kyc_status === "approved" && profile.is_pickup_address) navigate("/add-csbv-order");
                  else setOpen(true);
                }}
              >
                Create CSB-V Order
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <ButtonWithIcon
          iconName="lucide:upload"
          text="Bulk Order"
          className="ml-4 border-r rounded-lg h-9 "
          onClick={() => {
            if (kyc_status === "approved" && profile.is_pickup_address) navigate("/add-bulk-order");
            else setOpen(true);
          }}
        />
      </div>
      {/* <BreadcrumbNav
        parent="All Orders"
        title={activeTab === "all" ? "" : toSentenceCase(activeTab)}
        titleLink={`/orders?tab=${searchParams.get("tab")}`}
        pageTitle="Orders"
      /> */}
      <BreadcrumbNav pageTitle="Orders" />
      <div id="statusTabs" className="pb-4">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div>
            <TabsList
              ref={tabsListRef}
              className="items-start justify-between w-full h-12 overflow-x-auto overflow-y-hidden lg:w-auto"
            >
              {OrderStatus?.map((item) => (
                <TabsTrigger
                  value={item.key}
                  data-value={item.key}
                  key={item.key}
                  className="py-3 font-normal text-gray lg:px-5 border-b-gray-300"
                >
                  {item.status}
                </TabsTrigger>
              ))}
            </TabsList>
            <hr className="relative hidden w-full h-2 bottom-1 lg:block" />
          </div>
          {OrderStatus?.map((item) => (
            <TabsContent value={item.key} key={item.key} className="p-3 mb-8  bg-white rounded-xl">
              <DataTable
                key={item.key}
                APIEndpoint={`orders/listing/${item.key}`}
                refresh={fetch}
                actionTitle={
                  item.key === "all" || item.key === "cancelled" || item.key === "disputes" ? "View Order" : "Actions"
                }
                triggers={{
                  functions: {
                    payNow: function (data: any, setIsLoading: any) {
                      setIsLoading(true);
                      fetchOrderDetails(data.order_id)
                        .then(() => {
                          // toast({
                          //   title: "Order Paid Successfully",
                          //   variant: "success",
                          // });
                        })
                        .catch(() => {
                          toast({
                            title: "Payment Failed",
                            variant: "destructive",
                          });
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    },
                    generateLabel: function (data: any, setIsLoading: any, refreshDataTableHandler: any) {
                      setIsLoading(true);
                      generateLabel(data.order_id)
                        .then(() => {
                          getQueryParam("tab") === "ready" && refreshDataTableHandler();
                          toast({
                            title: "Label Generated Successfully",
                            variant: "success",
                          });
                        })
                        .catch(() => {
                          toast({
                            title: "Label Generation Failed",
                            variant: "destructive",
                          });
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    },
                    generateInvoice: function (data: any, setIsLoading: any) {
                      setIsLoading(true);
                      generateInvoice(data.order_id)
                        .then(() => {
                          toast({
                            title: "Invoice Generated Successfully",
                            variant: "success",
                          });
                        })
                        .catch(() => {
                          toast({
                            title: "Invoice Generation Failed",
                            variant: "destructive",
                          });
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    },
                    bulkPay: function (data: any, setIsLoading: any, refreshDataTableHandler: any) {
                      if (Object.keys(data.rowSelection).length === 0) {
                        toast({
                          title: "Please select at least one order to pay",
                          variant: "destructive",
                        });
                        return;
                      }

                      setIsLoading(true);

                      let orderIds: string[] = [];

                      Object.keys(data.rowSelection).map((key) => {
                        orderIds.push(data.data[key].actions["Pay Now"].order_id);
                      });

                      bulkPayOrder(orderIds)
                        .then(() => {
                          refreshDataTableHandler();
                          toast({
                            title: "Orders Paid Successfully",
                            variant: "success",
                          });
                        })
                        .catch((res) => {
                          toast({
                            title: res.response?.data.message || "Order Payment Failed",
                            variant: "destructive",
                          });
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    },
                    bulkInvoice: function (data: any, setIsLoading: any, refreshDataTableHandler: any) {
                      if (Object.keys(data.rowSelection).length === 0) {
                        toast({
                          title: "Please select at least one order",
                          variant: "destructive",
                        });
                        return;
                      }

                      setIsLoading(true);

                      let orderIds: string[] = [];

                      Object.keys(data.rowSelection).map((key) => {
                        orderIds.push(data.data[key].actions["Print Invoice"].order_id);
                      });

                      bulkProcess("invoice", orderIds)
                        .then(() => {
                          refreshDataTableHandler();
                          toast({
                            title: "Job created successfully",
                            variant: "success",
                          });
                        })
                        .catch((res) => {
                          toast({
                            title: res.response?.data.message,
                            variant: "destructive",
                          });
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    },
                    bulkLabel: function (data: any, setIsLoading: any, refreshDataTableHandler: any) {
                      if (Object.keys(data.rowSelection).length === 0) {
                        toast({
                          title: "Please select at least one order",
                          variant: "destructive",
                        });
                        return;
                      }

                      setIsLoading(true);

                      let orderIds: string[] = [];

                      Object.keys(data.rowSelection).map((key) => {
                        orderIds.push(data.data[key].actions["Print Invoice"].order_id);
                      });

                      bulkProcess("label", orderIds)
                        .then(() => {
                          refreshDataTableHandler();
                          toast({
                            title: "Job created successfully",
                            variant: "success",
                          });
                        })
                        .catch((res) => {
                          toast({
                            title: res.response?.data.message,
                            variant: "destructive",
                          });
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    },
                    addToManifest: function (data: any) {
                      if (Object.keys(data.rowSelection).length === 0) {
                        toast({
                          title: "Please select at least one order to pay",
                          variant: "destructive",
                        });
                        return;
                      }

                      Object.keys(data.rowSelection).map((key) => {
                        packedOrderIDs.push(data.data[key].actions["Print Invoice"].order_id);
                      });
                      onCreateManifest();
                    },
                  },
                }}
              />
            </TabsContent>
          ))}
        </Tabs>
        <ConfirmPayment
          open={confirmPayment}
          setOpen={setConfirmPayment}
          confirmPaymentData={confirmPaymentData}
          setFetch={setFetch}
        />

        <RechargeDialog
          rechargeWalletDialog={openRecharge}
          setRechargeWalletDialog={setOpenRecharge}
          activePaymentGateways={activePaymentGateways}
          rechargeAmount={rechargeAmount}
        />
        <KYCPendingPopup open={open} setOpen={setOpen} />
      </div>
    </FranchisePage>
  );
}

export const KYCPendingPopup = ({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const navigate = useNavigate();
  const kyc_status = useStore((state: any) => state.kyc_status);
  const profile = useStore((state: any) => state.profile);
  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const dispatch = useStore((state: any) => state.dispatch);
  async function fetchKYCStatus() {
    const response = await getKycStatus();
    if (response?.status === 200) {
      dispatch(() => updateKYCStatus(response.data.data.status));
    }
  }
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="flex flex-col items-center justify-center rounded-lg h-76">
        <AlertDialogCancel className="absolute right-0 flex justify-end m-2 text-gray-800 border-none top-2">
          <X onClick={() => setOpen(false)} />
        </AlertDialogCancel>
        <KYCPendingSVG />
        <AlertDialogTitle className="my-4 text-2xl leading-10 text-center xl:flex xl:flex-col">
          {kyc_status !== "approved" && kyc_status !== "submitted" ? (
            <p className="text-base font-normal">
              KYC verification is mandatory for shipping your orders. Complete your KYC to start shipping orders
              seamlessly.
            </p>
          ) : (
            <div className="text-base font-normal">
              {!profile.is_pickup_address
                ? "Please add your pickup address to start shipping orders"
                : kyc_status === "approved"
                ? ""
                : "Please wait for your KYC Approval"}
            </div>
          )}

          {kyc_status === "submitted" && profile.is_pickup_address && (
            <Button
              className="self-center mt-6 max-w-max"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Go to Dashboard
            </Button>
          )}
        </AlertDialogTitle>
        <div className="flex space-x-2">
          {kyc_status === "rejected" || kyc_status === "partial" ? (
            <Button variant="default" className="ml-auto" onClick={() => navigate("/kyc?edit=1")}>
              Re-Upload Document
            </Button>
          ) : (
            <>
              {kyc_status !== "approved" && kyc_status !== "submitted" && (
                <Button
                  className="flex items-center justify-center mt-2 font-normal text-center"
                  onClick={() => {
                    navigate("/kyc");
                  }}
                >
                  Complete KYC
                </Button>
              )}
            </>
          )}
          {/*  */}
          {(kyc_status === "approved" || kyc_status === "submitted") && !profile.is_pickup_address && (
            <Button
              className="flex items-center justify-center mt-2 font-normal text-center"
              onClick={() => {
                navigate("/add-pickup-address");
              }}
            >
              Add Pickup Address
            </Button>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
