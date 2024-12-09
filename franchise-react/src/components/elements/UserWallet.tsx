import { useState } from "react";
import WalletSVG from "@/assets/wallet.svg";
import { RechargeDialog } from "@/pages/Wallet";
import { Button } from "../ui/button";
import { useScript } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { RsIcon } from "@/assets/DashboardSVG";
export const UserWallet = ({ isMobile, walletBalance }: { isMobile: boolean; walletBalance: number }) => {
  const [rechargeWalletDialog, setRechargeWalletDialog] = useState(false);
  const activePaymentGateways = ["cashfree", "paytm"];
  const navigate = useNavigate();
  useScript("https://sdk.cashfree.com/js/v3/cashfree.js");

  return (
    <div className="flex items-center justify-center mr-1 mb-1 cursor-pointer w-max">
      <div
        className="flex items-center justify-center space-x-3"
        onClick={() => navigate("/wallet?tab=transactionHistory")}
      >
        <img src={WalletSVG} alt="wallet" />

        <span className="pr-2 mt-1 text-sm font-medium text-black lg:pr-3">
          <div className="inline-flex">
            <RsIcon />
            {walletBalance}
          </div>
        </span>
      </div>
      {!isMobile && (
        <RechargeDialog
          activePaymentGateways={activePaymentGateways}
          rechargeWalletDialog={rechargeWalletDialog}
          setRechargeWalletDialog={setRechargeWalletDialog}
          triggerElement={
            <Button
              variant="link"
              className="pl-0 pt-2.5 font-medium hover:underline text-primary"
              onClick={() => setRechargeWalletDialog(true)}
            >
              Recharge
            </Button>
          }
        />
      )}
    </div>
  );
};
