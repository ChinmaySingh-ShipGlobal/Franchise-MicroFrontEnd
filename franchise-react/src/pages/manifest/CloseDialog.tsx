import SuccessImg from "@/assets/success.png";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useStore } from "@/zustand/store";
import { closeManifest } from "@/services/manifest";
import { toast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/elements/LoadingButton";
import { ManifestState } from "@/interfaces/manifest";

export const CloseManifestDialog = ({
  isSgCity,
  enable,
  setState,
}: {
  isSgCity: boolean;
  enable: boolean;
  setState: any;
}) => {
  const [dialog, setDialog] = useState({
    open: false,
    success: false,
    loading: false,
  });

  const manifest_pickup_dates = useStore((state: any) => state.manifest_pickup_dates);
  const params = useParams();
  const manifest_code = params?.manifest_code;

  async function handleCloseDialog() {
    setDialog((prev) => ({ ...prev, loading: true }));
    try {
      const payload = {
        manifest_code: manifest_code,
        manifest_pickup_type: "pickup",
        is_sg_city: isSgCity,
      };
      let response;
      if (isSgCity) {
        response = await closeManifest({ ...payload, manifest_pickup_date: selectedValue });
      } else {
        response = await closeManifest(payload);
      }
      console.log(response);
      if (response) {
        if (response.status === 200) {
          setSelectedValue("");
          setDialog((prev) => ({ ...prev, open: false, success: true, loading: false }));
        } else {
          toast({
            title: response.data.message,
            variant: "destructive",
          });
          setDialog((prev) => ({ ...prev, loading: false }));
        }
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
      setDialog((prev) => ({ ...prev, loading: false }));
    }

    setDialog((prev) => ({ ...prev, loading: false }));
  }

  const handleSuccessDialog = () => {
    setDialog((prev) => ({ ...prev, success: false }));
    setState((prevState: ManifestState) => ({ ...prevState, refetch: !prevState.refetch }));
  };
  const [selectedValue, setSelectedValue] = useState("");
  const pickupDatesArray = Object.keys(manifest_pickup_dates).map((dateKey) => ({
    date: dateKey,
    ...manifest_pickup_dates[dateKey],
  }));

  return (
    <>
      <AlertDialog open={dialog.open}>
        <AlertDialogTrigger asChild>
          {isSgCity ? (
            <Button
              type="button"
              className="text-xs font-normal"
              onClick={() => setDialog((prev) => ({ ...prev, open: true }))}
              disabled={!enable}
              variant={!enable ? "disabled" : "default"}
            >
              Select Pickup Date
            </Button>
          ) : (
            <LoadingButton
              loading={dialog.loading}
              type="submit"
              text="Close Manifest"
              onClick={() => handleCloseDialog()}
              variant={!enable ? "disabled" : "default"}
            />
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="p-0 rounded-lg">
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex items-center justify-between px-6 pb-2 border-b border-b-white-100">
              <p className="text-base font-semibold text-black">Manifest Pickup Options</p>
              <AlertDialogCancel className="mt-0 text-gray-800 border-none">
                <X
                  onClick={() => {
                    setDialog((prev) => ({ ...prev, open: false }));
                    setSelectedValue("");
                  }}
                />
              </AlertDialogCancel>
            </div>
            <p className="flex justify-center mt-8 text-2xl text-gray-800">Select a Pick Up Date</p>
            <div className="flex justify-center mt-5 gap-x-5">
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
            <div className="flex justify-center mt-12 mb-10 gap-x-5">
              <Button
                variant="outline_theme"
                className="text-xs font-normal"
                onClick={() => {
                  setDialog((prev) => ({ ...prev, open: false }));
                  setSelectedValue("");
                }}
                disabled={dialog.loading}
              >
                Cancel
              </Button>

              <LoadingButton
                loading={dialog.loading}
                type="submit"
                text="Close Manifest"
                onClick={handleCloseDialog}
                disabled={!selectedValue}
                variant={!selectedValue ? "disabled" : "default"}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialog.success}>
        <AlertDialogContent className="p-0 rounded-lg">
          <AlertDialogDescription className="grid justify-center p-0 text-black gap-y-5">
            <img src={SuccessImg} alt="success" className="mx-auto mt-5" />
            <p className="text-2xl font-medium ">Manifest Closed Successfully</p>
            <p className="text-sm font-normal ">Please download label and other documents</p>
            <div className="flex justify-center mt-4 mb-10 gap-x-5">
              <AlertDialogCancel className="p-0 m-0 border-none">
                <Button className="text-xs font-normal" onClick={handleSuccessDialog}>
                  Close
                </Button>
              </AlertDialogCancel>
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const PickUpDateButton = ({
  value,
  selectedValue,
  onChange,
  children,
  disable,
}: {
  value: string;
  selectedValue: string;
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
