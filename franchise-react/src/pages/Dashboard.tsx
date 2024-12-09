import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/zustand/store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getDashboardOrders } from "@/services/dashboard";
import { AllOrders, CSBP, Dispatched, Dispute, Drafted, KYC, LabelPending, Packed } from "@/assets/DashboardSVG";
import { getTransactionHistory } from "@/services/wallet";
import { getKycStatus } from "@/services/kyc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RechargeDialog } from "./Wallet";
import { useScript } from "usehooks-ts";
import { resetConsigneeLocation, resetCustomerID, resetOrderForm, updateKYCStatus } from "@/zustand/actions";
import { getDate, toSentenceCase } from "@/lib/utils";
import { initialOrderCounts, Transaction } from "@/interfaces/dashboard";
import FranchisePage from "@/layouts/FranchisePage";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";

export default function Dashboard() {
  const profile = useStore((state: any) => state.profile);
  const dispatch = useStore((state: any) => state.dispatch);
  const kyc_status = useStore((state: any) => state.kyc_status);
  const [period, setPeriod] = useState("lastWeek");
  const [dashboardDetails, setDashboardDetails] = useState({
    orders: initialOrderCounts,
    transactions: [],
  });

  useEffect(() => {
    fetchTransactionKYCStatus();
  }, []);
  useEffect(() => {
    fetchData();
  }, [period]);

  const location = useLocation();

  //REFACTOR - code duplication
  useEffect(() => {
    if (
      location.pathname !== "/add-order" &&
      location.pathname !== "/edit-order/:orderId" &&
      location.pathname !== "/add-csbv-order"
    ) {
      dispatch(() => resetOrderForm());
      dispatch(() => resetConsigneeLocation());
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== "/add-csbv-details") {
      dispatch(() => resetCustomerID());
    }
  }, []);

  async function fetchTransactionKYCStatus() {
    getTransactionHistory().then((response) => {
      setDashboardDetails((prev) => {
        return { ...prev, transactions: response.data.data.slice(0, 2) };
      });
    });
    const response = await getKycStatus();
    if (response?.status === 200) {
      dispatch(() => updateKYCStatus(response.data.data.status));
    }
  }

  async function fetchData() {
    const payload = {
      from_date: period === "lastWeek" ? getDate(7) : getDate(30),
      to_date: getDate(),
    };
    const response = await getDashboardOrders(payload);
    if (response) {
      if (response.status === 200) {
        setDashboardDetails((prev) => {
          return { ...prev, orders: response.data.data };
        });
      } else {
        console.log(response.data.message);
      }
    }
  }
  return (
    <FranchisePage className="min-h-screen h-full">
      {Number(dashboardDetails.orders?.total_orders) < 1 && (
        <>
          {kyc_status === null && (
            <Banner
              border="border-orange-200"
              bg="bg-orange-50"
              textColor="text-orange-850"
              message="completing your KYC"
              link="/kyc"
              buttonLabel="Complete KYC"
            />
          )}
          {kyc_status === "approved" && profile.is_pickup_address && dashboardDetails.orders?.total_orders === "0" && (
            <Banner
              border="border-lightBlue-500"
              bg="bg-blue-300/50"
              textColor="text-blue"
              message="creating your first order TODAY"
              link="/add-order"
              buttonLabel="Create Order"
            />
          )}
          {(kyc_status === "submitted" || kyc_status === "approved") && !profile.is_pickup_address && (
            <Banner
              border="border-lightBlue-500"
              bg="bg-blue-300/50"
              textColor="text-blue"
              message="adding your pickup address"
              link="/add-pickup-address"
              buttonLabel="Add Pickup Address"
            />
          )}
        </>
      )}
      <OrderDetails orders={dashboardDetails.orders} period={period} setPeriod={setPeriod} />
      <div className="flex flex-col gap-3 lg:flex-row">
        <ActionSection orders={dashboardDetails.orders} />
        <WalletActivity transactions={dashboardDetails.transactions} />
      </div>
    </FranchisePage>
  );
}

const Banner = ({
  border,
  bg,
  textColor,
  message,
  link,
  buttonLabel,
}: {
  border: string;
  bg: string;
  textColor: string;
  message: string;
  link: string;
  buttonLabel: string;
}) => {
  const profile = useStore((state: any) => state.profile);
  return (
    <Card className={`m-0 border shadow-none px-4 ${border} ${bg}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="text-base font-medium">
          <p className={`${textColor}`}>
            Welcome {toSentenceCase(profile.firstname) + " " + toSentenceCase(profile.lastname)} !!
          </p>
          <p className="mt-1 text-sm font-normal">
            We are excited to have you on board. Start your journey with us by {message}!
          </p>
        </div>
        <div>
          <Button type="submit" variant="default" className="self-end float-end">
            <Link to={link}>{buttonLabel}</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

const OrderDetails = ({
  orders,
  period,
  setPeriod,
}: {
  orders: any;
  period: string;
  setPeriod: Dispatch<SetStateAction<string>>;
}) => {
  const OrderItems = [
    {
      title: "All Orders",
      count: orders.total_orders,
      icon: <AllOrders />,
      bgCard: "orange-100",
      tab: "all",
    },
    {
      title: "Drafted Orders",
      count: orders.drafted_orders,
      icon: <Drafted />,
      bgCard: "lightBlue-100",
      tab: "drafts",
    },

    {
      title: "Pending for Label",
      count: orders.pending_label_orders,
      icon: <LabelPending />,
      bgCard: "green-200",
      tab: "ready",
    },
    {
      title: "Packed Orders",
      count: orders.packed_orders,
      icon: <Packed />,
      bgCard: "pink-100",
      tab: "packed",
    },
    {
      title: "Dispatched Orders",
      count: orders.dispatch_orders,
      icon: <Dispatched />,
      bgCard: "purple-200",
      tab: "dispatched",
    },
  ];
  const navigate = useNavigate();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        <BreadcrumbNav pageTitle="Dashboard" className="pt-3" />
        <Select onOpenChange={setIsSelectOpen} onValueChange={(value) => setPeriod(value)} defaultValue={period}>
          <SelectTrigger className="text-sm font-normal border-none h-7 ring-0 bg bg-lightBlue-100 w-fit">
            <SelectValue placeholder="Last Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastWeek">Last 7 days</SelectItem>
            <SelectItem value="lastMonth">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="grid w-full grid-cols-2 m-0 shadow-none place-content-center lg:grid-cols-5 rounded-xl">
        {OrderItems.map((item) => (
          <Card
            className={`flex flex-col items-center hover:cursor-pointer hover:scale-105 hover:duration-300 py-6 border-2 border-${item.bgCard} shadow-none  bg-gradient-to-b from-${item.bgCard} to-transparent`}
            onClick={() => !isSelectOpen && navigate(`/orders?tab=${item.tab}`)}
          >
            {item.icon}
            <p className="my-3 text-sm font-normal">{item.title}</p>
            <p className="text-2xl font-medium">
              {" "}
              {(item.count || 0) < 10 && "0"}
              {item.count || 0}
            </p>
            <Button
              className="mt-3 font-medium text-black bg-white w-14 h-7 bg hover:bg-white"
              onClick={() => !isSelectOpen && navigate(`/orders?tab=${item.tab}`)}
            >
              View
            </Button>
          </Card>
        ))}
      </Card>
    </div>
  );
};

const ActionSection = ({ orders }: { orders: any }) => {
  const Actions = [
    {
      icon: <KYC />,
      title: orders.kyc_csb4_pending,
      text: "KYC Approval Pending",
      goToPage: "/customers",
    },
    {
      icon: <CSBP />,
      title: orders.kyc_csb5_pending,
      text: "CSB-V Approval Pending",
      goToPage: "/customers",
    },
    {
      icon: <Dispute />,
      title: orders.dispute_orders,
      text: "Disputed Orders",
      goToPage: "/orders?tab=disputes",
    },
  ];
  const navigate = useNavigate();
  return (
    <Card className="py-3 m-0 my-3 shadow-none px-7 rounded-xl lg:w-2/3">
      <p className="mb-2 text-base font-medium ">Action Required</p>
      <div className="grid gap-4 md:grid-cols-3">
        {Actions.map((item) => (
          <div
            className={`flex flex-col px-3 py-3 gap-x-3 border border-gray-200 rounded-[10px] max-w-64 hover:scale-105 hover:duration-200 hover:cursor-pointer `}
            onClick={() => navigate(`${item.goToPage}`)}
          >
            <div className="flex items-center gap-x-4">
              {item.icon}
              <p className="text-2xl font-medium">{item.title || 0}</p>
            </div>

            <p className="mt-3 text-sm font-normal text-gray-800">{item.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

const WalletActivity = ({ transactions }: { transactions: any }) => {
  const [rechargeWalletDialog, setRechargeWalletDialog] = useState(false);
  const activePaymentGateways = ["cashfree", "paytm"];
  useScript("https://sdk.cashfree.com/js/v3/cashfree.js");
  return (
    <Card className="px-5 py-3 m-0 mt-3 mb-20 shadow-none lg:mb-0 rounded-xl lg:w-1/3">
      <p className="mb-2 text-base font-medium ">Wallet Activity</p>
      <div className="grid gap-4 ">
        {transactions.length > 0 ? (
          <>
            {transactions.map((transaction: Transaction, index: number) => {
              const Icon =
                index === 0 ? (
                  <span className="min-w-1 rounded-lg h-full bg-orange-600 bg" />
                ) : (
                  <span className="min-w-1 rounded-lg h-full bg-blue bg" />
                );
              return (
                <div key={index} className="flex px-2 pl-4 py-3 gap-x-3 border border-gray-200 rounded-[10px]">
                  {Icon}
                  <div className="text-sm">
                    <p>{transaction.Description}</p>
                    <p className="mt-1 text-gray-800">{transaction["Transaction Date"]}</p>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-sm font-normal text-gray-800">
              No wallet activity found yet. Please recharge your wallet to “Create Orders”.
            </p>
            <RechargeDialog
              activePaymentGateways={activePaymentGateways}
              rechargeWalletDialog={rechargeWalletDialog}
              setRechargeWalletDialog={setRechargeWalletDialog}
              triggerElement={
                <Button className="flex mt-6 mb-20 gap-x-2" onClick={() => setRechargeWalletDialog(true)}>
                  Recharge Wallet
                </Button>
              }
            />
          </div>
        )}
      </div>
    </Card>
  );
};
``;
