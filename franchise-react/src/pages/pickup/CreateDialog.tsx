import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/elements/LoadingButton";
import { createPickupRequest, getPickupRequest } from "@/services/pickup";
import { Form } from "@/components/ui/form";
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CardContent, CardFooter } from "@/components/ui/card";
import SGFormField from "@/components/elements/SGFormField";
// import { RequiredField } from "@/components/elements/SGFormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/elements/ErrorMessage";
import { Icon } from "@iconify/react";
import { initialPickupRequestFormValues, pickupRequestSchema } from "@/schemas/PickUp";
import { useStore } from "@/zustand/store";
import { KYCPendingPopup } from "../order/OrderListing";

export const CreatePickupDialog = ({
  pickupAddressID,
  pickupDates,
  setFetch,
}: {
  pickupAddressID: string;
  pickupDates: any;
  setFetch: Dispatch<SetStateAction<boolean>>;
}) => {
  const pickupRequestForm = useForm({
    resolver: zodResolver(pickupRequestSchema),
    defaultValues: initialPickupRequestFormValues,
  });

  const [dialog, setDialog] = useState({
    open: false,
    loading: false,
  });

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (selectedValue) {
      fetchPickupRequest();
    }
  }, [selectedValue]);

  const pickupDatesArray = Object.keys(pickupDates).map((dateKey) => ({
    date: dateKey,
    ...pickupDates[dateKey],
  }));

  const handleCreatePickup = () => {
    setDialog((prev) => ({ ...prev, open: true }));
    pickupRequestForm.setValue("pickup_address", pickupAddressID);
  };

  const handleCloseCreatePickup = () => {
    setDialog((prev) => ({ ...prev, open: false }));
    setSelectedValue("");
    setError("");
    setFetch((prev) => !prev);
    pickupRequestForm.reset();
  };
  async function onPickUpRequestSubmit(data: z.infer<typeof pickupRequestSchema>) {
    setDialog((prev) => ({ ...prev, loading: true }));
    try {
      const payload = {
        pickup_date: selectedValue,
        pickup_address_id: pickupAddressID,
        estimated_orders: data.estimated_orders,
        estimated_weight: data.estimated_weight,
      };

      const response = await createPickupRequest(payload);
      if (response) {
        if (response.status === 200) {
          toast({
            title: response.data.message,
            variant: "success",
          });
          handleCloseCreatePickup();
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
      setDialog((prev) => ({ ...prev, loading: false }));
    }
  }
  const kyc_status = useStore((state: any) => state.kyc_status);

  async function fetchPickupRequest() {
    setError("");
    try {
      const payload = {
        pickup_date: selectedValue,
        pickup_address_id: pickupAddressID,
      };
      const response = await getPickupRequest(payload);
      if (response) {
        if (response.status === 200) {
          setError(response.data.message);
        } else {
          setError("");
        }
      }
    } catch (error) {
      setError("Something went wrong");
    }
  }

  const [open, setOpen] = useState<boolean>(false);
  const profile = useStore((state: any) => state.profile);
  return (
    <>
      <AlertDialog open={dialog.open}>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            className="font-normal"
            onClick={() => {
              if (kyc_status === "approved" && profile.is_pickup_address) handleCreatePickup();
              else setOpen(true);
            }}
          >
            <Icon icon="lucide:plus" className={"w-5 h-5 mr-2"} />
            Create Pickup
          </Button>
        </AlertDialogTrigger>
        <KYCPendingPopup open={open} setOpen={setOpen} />
        <AlertDialogContent className="p-0 rounded-lg">
          <AlertDialogDescription>
            <div className="flex items-center justify-between px-6 py-2 border-b border-b-white-100">
              <p className="text-base font-semibold text-black">Create New Pickup Request</p>
              <AlertDialogCancel className="mt-0 text-gray-800 border-none">
                <X onClick={handleCloseCreatePickup} />
              </AlertDialogCancel>
            </div>
            <p className="flex justify-center mt-8 text-2xl text-gray-800">Select a Pick Up Date</p>
            <div className="flex justify-center my-5 gap-x-5">
              {pickupDatesArray.map(({ date, day, month, after12Check }) => (
                <PickUpDateButton
                  key={date}
                  value={date}
                  selectedValue={selectedValue}
                  onChange={setSelectedValue}
                  disable={after12Check}
                >
                  {day} {month.substring(0, 3)}
                </PickUpDateButton>
              ))}
            </div>
            {error && (
              <div className="flex justify-center mb-2">
                <ErrorMessage error={error} />
              </div>
            )}

            <Form {...pickupRequestForm}>
              <CardContent className="">
                <form onSubmit={pickupRequestForm.handleSubmit(onPickUpRequestSubmit)} className="p-0 mb-5 text-black">
                  <div className="grid items-center space-y-2 text-left gap-y-6 md:space-y-0">
                    {/* <FormField
                      control={pickupRequestForm.control}
                      name="pickup_address"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>
                              Pickup Address
                              <RequiredField />
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={pickupRequestForm.watch("pickup_address")}
                                disabled
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    /> */}

                    <SGFormField
                      type="number"
                      name="estimated_orders"
                      required
                      label="Estimated Orders"
                      form={pickupRequestForm}
                    />
                    <SGFormField
                      type="number"
                      name="estimated_weight"
                      required
                      label="Estimated Weight (KG)"
                      form={pickupRequestForm}
                    />
                    <CardFooter className="flex justify-center p-0">
                      <div className="flex justify-center mt-3">
                        <LoadingButton
                          loading={dialog.loading}
                          type="submit"
                          text="Submit"
                          disabled={!selectedValue || error}
                        />
                      </div>
                    </CardFooter>
                  </div>
                </form>
              </CardContent>
            </Form>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const PickUpDateButton = ({
  value,
  selectedValue,
  onChange,
  children,
  disable,
}: {
  value: string;
  selectedValue: string | null;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disable?: boolean;
}) => {
  const isSelected = value === selectedValue;

  return (
    <Button
      onClick={() => onChange(value)}
      className={`w-20 h-8 text-sm font-medium rounded-full ${
        isSelected
          ? "bg-green-50 text-green border border-green hover:bg-green-50"
          : "text-gray-800 bg-white border border-gray-800 hover:cursor-pointer hover:bg-white"
      }`}
      disabled={disable}
    >
      {children}
    </Button>
  );
};
