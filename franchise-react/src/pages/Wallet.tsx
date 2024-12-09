import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IndianRupee, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonWithIcon from "@/components/elements/ButtonWithIcon";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { walletFormSchema } from "@/schemas/Wallet";
import FranchisePage from "@/layouts/FranchisePage";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PaytmImage from "@/assets/paytm.png";
import CashfreeImage from "@/assets/cashfree.png";
import WalletImg from "@/assets/Wallet.png";
import DataTable from "@/components/elements/data-table-d";
import { toast, useToast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/elements/LoadingButton";
import { useScript } from "usehooks-ts";
import {
  getTransactionStatus,
  initiateTransaction,
  // getActivePaymentGateways as getActivePaymentGatewaysApi,
} from "@/services/wallet";
import useQueryParams from "@/hooks/use-queryParams";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/elements/ErrorMessage";
import { cn } from "@/lib/utils";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";

export default function Wallet() {
  const [rechargeWalletDialog, setRechargeWalletDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentDialogData, setPaymentDialogData] = useState({});
  const { deleteQueryParam, hasQueryParam, getQueryParam } = useQueryParams();
  const activePaymentGateways = ["cashfree", "paytm"];

  useScript("https://sdk.cashfree.com/js/v3/cashfree.js");

  const { toast } = useToast();

  useEffect(() => {
    showRechargeWalletDialog();
  }, []);

  async function showRechargeWalletDialog() {
    if (!hasQueryParam("transaction_code")) return;
    deleteQueryParam("transaction_code");
    setPaymentDialog(true);

    await getTransactionStatus(getQueryParam("transaction_code") ?? "")
      .then((res) => {
        setPaymentDialogData(res.data);
      })
      .catch(() => {
        setPaymentDialog(false);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Error while fetching transaction status",
          variant: "destructive",
        });
      });
  }
  // const [activeTab, setActiveTab] = useState<string>("transaction history");
  return (
    <FranchisePage className="min-h-screen h-full">
      <div className="flex justify-between md:flex-col lg:flex-row">
        {/* <BreadcrumbNav
          parent="Wallet"
          pageTitle="Wallet"
          title={activeTab === "rechargeHistory" ? "Recharge history" : "Transaction history"}
        /> */}
        <BreadcrumbNav pageTitle="Wallet" />
        <div className="flex items-center justify-end mt-2 mr-4 text-xs font-normal gap-x-4">
          <RechargeDialog
            activePaymentGateways={activePaymentGateways}
            rechargeWalletDialog={rechargeWalletDialog}
            setRechargeWalletDialog={setRechargeWalletDialog}
            triggerElement={
              <ButtonWithIcon
                iconName="lucide:wallet"
                text="Recharge Wallet"
                className="absolute font-normal 2xl:right-56 right-8 top-3"
                onClick={() => setRechargeWalletDialog(true)}
              />
            }
          />
          <PaymentDialog open={paymentDialog} setOpen={setPaymentDialog} data={paymentDialogData} />
        </div>
      </div>
      {/* <WalletTabs setActiveTab={setActiveTab} /> */}
      <WalletTabs />
    </FranchisePage>
  );
}

interface RechargeDialogProps {
  rechargeWalletDialog: boolean;
  setRechargeWalletDialog: Dispatch<SetStateAction<boolean>>;
  activePaymentGateways: Array<string>;
  rechargeAmount?: number;
  triggerElement?: React.ReactNode;
}

interface PaymentGatewayConfig {
  [key: string]: {
    image: string;
    title: string;
    description: string;
  };
}

export const RechargeDialog: React.FC<RechargeDialogProps> = ({
  rechargeWalletDialog,
  setRechargeWalletDialog,
  activePaymentGateways,
  rechargeAmount,
  triggerElement,
}) => {
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<string>("");
  const [error, setError] = useState<string>("");

  const paymentGateways: PaymentGatewayConfig = {
    cashfree: {
      image: CashfreeImage,
      title: "Cashfree Online Payment",
      description: "Debit Card, Credit Card, Net Banking, UPI",
    },
    paytm: {
      image: PaytmImage,
      title: "Paytm Online Payment",
      description: "Debit Card, Credit Card, Net Banking, UPI",
    },
  };

  const cashfreeRedirect = async (paymentSessionId: string) => {
    //unavailable variable/constructor
    const cashfree = Cashfree({
      mode: import.meta.env.PROD ? "production" : "sandbox",
    });

    let checkoutOptions = {
      paymentSessionId: paymentSessionId,
      redirectTarget: "_self",
    };
    cashfree.checkout(checkoutOptions);
  };

  useEffect(() => {
    if (activePaymentGateways.length > 0) {
      setSelectedPaymentGateway(activePaymentGateways[0]);
    }
  }, [activePaymentGateways]);

  const walletForm = useForm<z.infer<typeof walletFormSchema>>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
      amount: rechargeAmount ? rechargeAmount : 100,
    },
  });

  async function onWalletSubmit(data: z.infer<typeof walletFormSchema>) {
    await initiateTransaction(data.amount, selectedPaymentGateway)
      .then((res) => {
        if (selectedPaymentGateway === "cashfree") {
          cashfreeRedirect(res.data.session_id);
        }

        if (selectedPaymentGateway === "paytm") {
          const form = document.createElement("form");
          form.method = "post";
          form.action = res.data.payment_url; // Replace with actual Paytm URL
          form.name = "paytm";

          const midInput = document.createElement("input");
          midInput.type = "hidden";
          midInput.name = "mid";
          midInput.value = res.data.mid;
          form.appendChild(midInput);

          const orderIdInput = document.createElement("input");
          orderIdInput.type = "hidden";
          orderIdInput.name = "orderId";
          orderIdInput.value = res.data.order_id;
          form.appendChild(orderIdInput);

          const txnTokenInput = document.createElement("input");
          txnTokenInput.type = "hidden";
          txnTokenInput.name = "txnToken";
          txnTokenInput.value = res.data.txn_token;
          form.appendChild(txnTokenInput);

          document.body.appendChild(form);
          form.submit();
        }
      })
      .catch(() => {
        toast({
          title: "Uh oh! Something went wrong.",
          variant: "destructive",
        });
      });
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    let value = e.target.value;
    const parts = value.split(".");
    if (parts.length > 2) {
      value = `${parts[0]}.${parts.slice(1).join("")}`;
    }
    if (parts.length > 1) {
      value = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    const numericValue = parseFloat(value);

    if (!isNaN(numericValue)) {
      if (numericValue > 100000) {
        // value = "100000";
        setError("Amount should not be more than 1,00,000");
      }
    } else {
      value = "";
    }
    e.target.value = value;
  };

  return (
    <AlertDialog open={rechargeWalletDialog}>
      <AlertDialogTrigger asChild>{triggerElement}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg">
        <AlertDialogDescription>
          <Form {...walletForm}>
            <form onSubmit={walletForm.handleSubmit(onWalletSubmit)} className="text-black">
              <div className="flex justify-end">
                <AlertDialogCancel className="mt-0 text-gray-800 border-none">
                  <X onClick={() => setRechargeWalletDialog(false)} />
                </AlertDialogCancel>
              </div>
              <div className="flex flex-col items-center justify-center">
                <img src={WalletImg} alt="wallet" />
                <p className="mt-2 text-base font-semibold">Recharge Wallet</p>
              </div>
              <div className="mt-6 md:px-4">
                <FormField
                  control={walletForm.control}
                  name="amount"
                  render={({}) => (
                    <FormItem>
                      <div>
                        <Label className="font-medium">Enter Recharge Amount</Label>
                        <FormControl className="mt-1">
                          <div>
                            <div className="flex items-center rounded-lg justify-center px-3 border">
                              <div className="w-3 h-3">
                                <IndianRupee className="w-3 h-3" />
                              </div>
                              <Input
                                type="text"
                                placeholder="Type amount ..."
                                className="px-0 border-transparent rounded-lg placeholder:text-sm placeholder:text-gray-400 ring-transparent no-spinner focus-visible:ring-0"
                                {...walletForm.register("amount")}
                                onChange={handleInput}
                              />
                              <Button
                                className="p-0 font-medium bg-transparent hover:bg-transparent text-blue"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setError("");
                                  if (walletForm.getValues("amount") <= 99500) {
                                    walletForm.setValue("amount", +walletForm.getValues("amount") + 500);
                                    walletForm.trigger("amount");
                                  } else {
                                    setError("Amount should not be more than 100000");
                                  }
                                }}
                              >
                                + Rs. <span className="underline">500.00</span>
                              </Button>
                            </div>

                            {walletForm.formState.errors?.amount?.message === "Enter amount not less than 1" && (
                              <p className="text-red text-xs font-normal mt-1">
                                Minimum recharge value
                                <span className="font-medium"> ₹ 1</span>
                              </p>
                            )}
                            {error != "" && <ErrorMessage error={error} />}
                          </div>
                        </FormControl>
                        {walletForm.formState.errors?.amount?.message !== "Enter amount not less than 1" && (
                          <FormMessage />
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                <p className="mt-8 mb-1 text-sm font-semibold">Select Payment Method</p>
                {activePaymentGateways.map((gateway: string) => {
                  return (
                    <Button
                      key={gateway}
                      className={cn(
                        "w-full h-16 mt-4 text-black border hover:bg-blue-200 border-gray-350",
                        selectedPaymentGateway === gateway ? "bg-blue-50" : "bg-transparent",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPaymentGateway(gateway);
                      }}
                    >
                      <div className="flex items-center justify-between w-full py-3 ">
                        <div className="text-left">
                          <p className="text-sm font-medium">{paymentGateways[gateway].title}</p>
                          <p className="mt-2 text-xs text-gray-800">{paymentGateways[gateway].description}</p>
                        </div>
                        <img src={paymentGateways[gateway].image} alt={gateway} />
                      </div>
                    </Button>
                  );
                })}
              </div>
              <div className="flex items-center justify-center mt-8 mb-4 gap-x-4">
                <LoadingButton
                  className="flex text-white bg-blue gap-x-2"
                  loading={walletForm.formState.isSubmitting}
                  type="submit"
                  disabled={error !== ""}
                  text="Proceed to Payment"
                />
              </div>
            </form>
          </Form>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface PaymentDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: {
    [key: string]: any;
  };
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, setOpen, data }) => {
  const badgeColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Failed":
        return "danger";
      default:
        return "info";
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent className="p-0 rounded-lg">
        <AlertDialogDescription>
          <form>
            <div className="flex items-center justify-between px-6 py-2 border-b border-b-gray-150">
              <p className="text-base font-semibold text-black">Transaction Details</p>
              <AlertDialogCancel className="mt-0 text-gray-800 border-none">
                <X onClick={() => setOpen(false)} />
              </AlertDialogCancel>
            </div>
            <div className="flex flex-col items-center justify-center mt-8 text-2xl text-gray font-normal">
              Transaction Amount
            </div>
            {data?.amount !== undefined && (
              <>
                <div className="flex items-center justify-center mt-4 text-2xl font-medium text-black gap-x-3">
                  ₹ {data?.amount}
                  <Badge variant={badgeColor(data?.status)}>{data?.status}</Badge>
                </div>
                <div className="flex items-center justify-center mt-4 mb-10 text-sm text-gray-800">
                  Date added :<span className="ml-2 text-sm text-black">{data?.transaction_date}</span>
                </div>
              </>
            )}
            {data?.amount === undefined && (
              <div className="flex flex-col items-center gap-2 mt-4 mb-10">
                <Skeleton className="flex items-center justify-center h-8 w-80" />
                <Skeleton className="flex items-center justify-center h-8 w-80" />
              </div>
            )}
          </form>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const WalletDetailsDialog: React.FC<PaymentDialogProps> = ({ open, setOpen, data }) => {
  const badgeColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "success";
      case "Pending":
        return "info";
      default:
        return "danger";
    }
  };

  const navigate = useNavigate();
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent className="p-0 rounded-lg">
        <AlertDialogTitle></AlertDialogTitle>
        <AlertDialogDescription>
          <form>
            <div className="flex items-center justify-between px-6 py-2 border-b border-b-gray-150">
              <p className="text-base font-semibold text-black">Wallet Transaction Details</p>
              <AlertDialogCancel className="mt-0 text-gray-800 border-none">
                <X onClick={() => setOpen(false)} />
              </AlertDialogCancel>
            </div>
            <div className="flex flex-col items-center justify-center mt-8 text-2xl text-gray font-normal">
              Transaction Amount
            </div>
            <div className="flex items-center justify-center mt-4 text-2xl font-medium text-black gap-x-3">
              ₹ {data?.amount}
              <Badge variant={badgeColor(data?.status)}>{data?.status}</Badge>
            </div>
            <div className="flex items-center justify-center mt-4 text-sm text-gray-800">
              Date added :<span className="ml-2 text-sm text-black">{data?.date_added}</span>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-800 mt-7">
              <span className="ml-2 text-sm text-black">{data?.description}</span>
            </div>
            <div className="flex justify-center mt-6 mb-8">
              {data?.order_id && (
                <Button
                  type="submit"
                  className="text-xs font-normal text-white bg-blue"
                  onClick={() => navigate("/view-order/" + data.order_id)}
                >
                  View Order Details
                </Button>
              )}
            </div>
          </form>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const TransactionHistoryTab = () => {
  return (
    <TabsContent value="transactionHistory" className="p-0">
      <div className="bg-white rounded-xl">
        <Card className="w-full p-3 m-0 shadow-none rounded-xl ">
          <CardContent className="px-0">
            <DataTable
              APIEndpoint="/wallet"
              actionTitle="View Detail"
              tab="transactionHistory"
              triggers={{
                viewWalletDetails: WalletDetailsDialog,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

const RechargeHistoryTab = () => {
  return (
    <TabsContent value="rechargeHistory">
      <div className="bg-white rounded-xl">
        <Card className="w-full p-3 m-0 shadow-none">
          <CardContent className="px-0">
            <DataTable
              APIEndpoint="/wallet/transaction-history"
              actionTitle="View Detail"
              tab="rechargeHistory"
              triggers={{
                viewTransactionDetails: PaymentDialog,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

const WalletTabs = () =>
  // { setActiveTab }: any
  {
    const { getQueryParam, addQueryParams } = useQueryParams();
    const [tab, setTab] = useState<string>(getQueryParam("tab") || "transactionHistory");

    const onTabChange = (value: string) => {
      setTab(value);
      // setActiveTab(value);
      addQueryParams({ tab: value }, true);
    };

    useEffect(() => {
      const tab = getQueryParam("tab");
      if (tab) {
        setTab(tab);
      }
    }, []);

    return (
      <div className="text-left">
        <Tabs value={tab} onValueChange={onTabChange}>
          <div>
            <TabsList className="items-start justify-start w-full h-12 overflow-x-auto overflow-y-hidden lg:w-auto">
              <TabsTrigger value="transactionHistory" className="py-3 font-normal text-gray lg:px-5 border-b-gray-300">
                Transaction History
              </TabsTrigger>
              <TabsTrigger value="rechargeHistory" className="py-3 font-normal text-gray lg:px-5 border-b-gray-300">
                Recharge History
              </TabsTrigger>
            </TabsList>
            <hr className="relative  w-full h-2 bottom-1 block" />
          </div>
          <TransactionHistoryTab />
          <RechargeHistoryTab />
        </Tabs>
      </div>
    );
  };
