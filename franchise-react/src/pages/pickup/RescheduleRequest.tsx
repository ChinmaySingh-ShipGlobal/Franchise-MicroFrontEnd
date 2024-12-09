import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/elements/LoadingButton";
import { getPickupRequestDetails, reschedulePickupRequest } from "@/services/pickup";
import { CardContent, CardFooter } from "@/components/ui/card";
import { PickUpDateButton } from "./CreateDialog";
import { useNavigate } from "react-router-dom";

export const RescheduleRequest = ({
  setFetch,
  open,
  setOpen,
  pickup_request_id,
  trigger,
}: {
  setFetch: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  pickup_request_id: string | undefined;
  trigger?: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [pickupRequestDetails, setPickupRequestDetails] = useState<any>({});
  const navigate = useNavigate();

  async function fetchPickupRequestDetails() {
    if (!pickup_request_id) return;

    try {
      const response = await getPickupRequestDetails({ pickup_request_id });
      if (response) {
        if (response.status === 200) {
          setPickupRequestDetails(response.data.data);
        } else {
          console.error("Error fetching pickup request details:", response.data.message);
        }
      }
    } catch (error) {
      console.error("Error fetching pickup request details:", error);
    }
  }

  useEffect(() => {
    fetchPickupRequestDetails();
  }, [pickup_request_id, open]);

  const pickupDatesArray = Object.keys(pickupRequestDetails?.pickup_request_dates || {}).map((dateKey) => ({
    date: dateKey,
    ...pickupRequestDetails?.pickup_request_dates[dateKey],
  }));
  const pickup_date = pickupRequestDetails?.pickupDetail?.pickup_date;

  const handleCloseReschedulePickup = () => {
    setOpen(false);
    setSelectedValue("");
  };
  async function onPickupReshceduleSubmit() {
    if (!selectedValue) return;
    setLoading(true);
    try {
      const payload = {
        pr_id: pickupRequestDetails.pickupDetail.pickup_request_id,
        pr_new_date: selectedValue,
        old_pr_date: pickupRequestDetails.pickupDetail.pickup_date,
      };

      const response = await reschedulePickupRequest(payload);
      if (response) {
        if (response.status === 200) {
          toast({
            title: response.data.message,
            variant: "success",
          });
          handleCloseReschedulePickup();
          setFetch((prev) => !prev);
          // navigate(`/view-pickup/${response.data.data.updated_pickup_id}`);
          navigate("/pickup-listing");
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
      {pickupDatesArray.length > 0 && (
        <AlertDialog open={open}>
          <AlertDialogTrigger asChild>
            <div>{trigger}</div>
          </AlertDialogTrigger>
          <AlertDialogContent className="p-0 rounded-lg">
            <AlertDialogDescription>
              <div className="flex items-center justify-between px-6 py-2 border-b border-b-white-100">
                <p className="text-base font-semibold text-black">Reschedule Pickup Request</p>
                <AlertDialogCancel className="mt-0 text-gray-800 border-none">
                  <X onClick={handleCloseReschedulePickup} />
                </AlertDialogCancel>
              </div>

              <CardContent className="py-10">
                <div className="flex justify-center gap-x-5">
                  {pickupDatesArray.map(({ date, day, month, after12Check }) => (
                    <PickUpDateButton
                      key={date}
                      value={date}
                      selectedValue={selectedValue}
                      onChange={setSelectedValue}
                      disable={after12Check || date === pickup_date}
                    >
                      {day} {month.substring(0, 3)}
                    </PickUpDateButton>
                  ))}
                </div>
                <CardFooter className="flex justify-center mt-8">
                  <div className="flex justify-center">
                    <LoadingButton
                      loading={loading}
                      type="submit"
                      text="Submit"
                      onClick={onPickupReshceduleSubmit}
                      disabled={!selectedValue}
                    />
                  </div>
                </CardFooter>
              </CardContent>
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
