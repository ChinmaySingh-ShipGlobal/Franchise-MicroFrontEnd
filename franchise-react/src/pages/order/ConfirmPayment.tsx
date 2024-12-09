import { AlertDialog, AlertDialogContent, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/elements/LoadingButton";
import { CardContent, CardFooter } from "@/components/ui/card";
import { IndianRupee, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { payOrder } from "@/services/orders";

export interface ConfirmPaymentProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  confirmPaymentData: any;
  setFetch: Dispatch<SetStateAction<boolean>>;
}

export const ConfirmPayment = ({ open, setOpen, confirmPaymentData, setFetch }: ConfirmPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    payOrder(confirmPaymentData.order_id)
      .then(() => {
        toast({
          title: "Order Paid Successfully",
          variant: "success",
        });
      })
      .then(() => {
        setFetch((prev) => !prev);
        navigate(0);
      })
      .catch((res) => {
        if (res.response?.request.status === 402) {
          toast({
            title: "Insufficient Balance",
            variant: "destructive",
            description:
              "Recharge your wallet with min amount of ₹" + (res.response?.data.errors.min_recharge).toFixed(2),
          });
        } else {
          toast({
            title: "Order Payment Failed",
            variant: "destructive",
          });
        }
      });
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="p-0 py-8 rounded-xl">
        <AlertDialogDescription>
          <CardContent>
            <div className="flex flex-col items-center my-8 text-center gap-y-8">
              <Info size={94} className="text-blue-700 bg-blue-100 rounded-full bg" />
              <p className="px-12 text-base font-normal text-black text-wrap">
                You will be charged
                {confirmPaymentData.total ? (
                  <span className="font-semibold mx-1">
                    <IndianRupee className="inline-flex w-3.5 h-3.5 font-semibold" />
                    {confirmPaymentData.total}
                  </span>
                ) : (
                  <span className="font-semibold mx-1">
                    <IndianRupee className="inline-flex w-3.5 h-3.5 font-semibold" />0
                  </span>
                )}
                for this order. Would you like to continue?
              </p>
            </div>
            <CardFooter className="flex justify-center mt-8 gap-x-4">
              <Button variant="outline_theme" className="" onClick={handleClose}>
                Close
              </Button>
              <LoadingButton loading={isLoading} type="submit" text="Confirm" onClick={handleSubmit} />
            </CardFooter>
          </CardContent>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmPayment;
