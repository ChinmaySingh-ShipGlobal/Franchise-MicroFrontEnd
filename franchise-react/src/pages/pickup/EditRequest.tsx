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
import { editPickupRequest, getPickupRequestDetails } from "@/services/pickup";
import { Form } from "@/components/ui/form";
import { CardContent, CardFooter } from "@/components/ui/card";
import SGFormField from "@/components/elements/SGFormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editPickupRequestSchema } from "@/schemas/PickUp";

export const EditRequest = ({
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
  const [pickupRequestDetails, setPickupRequestDetails] = useState<any>({});

  const editPickupAddressForm = useForm({
    resolver: zodResolver(editPickupRequestSchema),
    defaultValues: {
      estimated_orders: 0,
      estimated_weight: 0,
    },
  });

  async function fetchPickupRequestDetails() {
    if (!pickup_request_id) return;

    try {
      const response = await getPickupRequestDetails({ pickup_request_id });
      if (response) {
        if (response.status === 200) {
          setPickupRequestDetails(response.data.data);
          editPickupAddressForm.reset({
            estimated_orders: pickupRequestDetails.pickupDetail?.estimated_orders || 0,
            estimated_weight: pickupRequestDetails.pickupDetail?.estimated_weight || 0,
          });
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

  const handleCloseDialog = () => {
    setOpen(false);
  };

  async function onSubmit(data: z.infer<typeof editPickupRequestSchema>) {
    try {
      const payload = {
        pickup_request_id: pickup_request_id,
        estimated_orders: data.estimated_orders,
        estimated_weight: data.estimated_weight,
      };

      const response = await editPickupRequest(payload);
      if (response) {
        if (response.status === 200) {
          toast({
            title: response.data.message,
            variant: "success",
          });
          handleCloseDialog();
          setFetch((prev) => !prev);
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
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <div>{trigger}</div>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 rounded-lg">
        <AlertDialogDescription>
          <div className="flex items-center justify-between px-6 py-2 border-b border-b-white-100">
            <p className="text-base font-semibold text-black">Edit Pickup Request</p>
            <AlertDialogCancel className="mt-0 text-gray-800 border-none">
              <X onClick={handleCloseDialog} />
            </AlertDialogCancel>
          </div>

          <Form {...editPickupAddressForm}>
            <CardContent>
              <form onSubmit={editPickupAddressForm.handleSubmit(onSubmit)} className="p-0 text-black">
                <div className="grid items-center mt-5 space-y-2 text-left gap-y-6 md:space-y-0">
                  <SGFormField
                    type="number"
                    name="estimated_orders"
                    required
                    label="Estimated Number of Orders"
                    form={editPickupAddressForm}
                  />
                  <SGFormField
                    type="text"
                    name="estimated_weight"
                    required
                    label="Estimated Weight (in kg)"
                    form={editPickupAddressForm}
                  />
                </div>
                <CardFooter className="flex justify-center p-0">
                  <div className="flex justify-center pt-6">
                    <LoadingButton loading={loading} type="submit" text="Submit" />
                  </div>
                </CardFooter>
              </form>
            </CardContent>
          </Form>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};
