import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/elements/LoadingButton";
import { cancelPickupRequest } from "@/services/pickup";
import { CardContent, CardFooter } from "@/components/ui/card";
import { ConfirmSVG } from "@/assets/ConfirmSVG";

export interface CancelPickupRequestProps {
  pickup_request_id: string | undefined;
  setFetch: Dispatch<SetStateAction<boolean>>;
  trigger?: React.ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const CancelRequest = ({ pickup_request_id, setFetch, setOpen, trigger, open }: CancelPickupRequestProps) => {
  const [loading, setLoading] = useState(false);

  const handleClosePickup = () => setOpen(false);

  async function onPickupCancelSubmit() {
    try {
      const payload = {
        pickup_request_id: pickup_request_id,
      };
      setLoading(true);
      const response = await cancelPickupRequest(payload);
      if (response) {
        if (response.status === 200) {
          toast({
            title: response.data.message,
            variant: "success",
          });
          setLoading(false);
          setFetch((prev) => !prev);
          setOpen(false);
        } else {
          toast({
            title: response.data.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogTrigger asChild>
          <div>{trigger}</div>
        </AlertDialogTrigger>
        <AlertDialogContent className="p-0 rounded-lg">
          <AlertDialogDescription>
            <CardContent>
              <div className="flex my-8 place-content-center">
                <ConfirmSVG />
              </div>
              <p className="text-xl font-semibold text-black">Are you sure to cancel this pickup request?</p>
              <CardFooter className="flex justify-center mt-8 gap-x-4">
                <Button variant="outline_theme" onClick={handleClosePickup}>
                  Close
                </Button>
                <LoadingButton loading={loading} type="submit" text="Confirm" onClick={onPickupCancelSubmit} />
              </CardFooter>
            </CardContent>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
