import FranchisePage from "@/layouts/FranchisePage";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { CreatePickupDialog } from "./CreateDialog";
import { useEffect, useState } from "react";
import { getPickupAddress, getPickupDates } from "@/services/pickup";
import DataTable from "@/components/elements/data-table-d";
import { CancelRequest } from "./CancelRequest";
import { RescheduleRequest } from "./RescheduleRequest";
import { Card } from "@/components/ui/card";

export default function PickupListing() {
  const [pickupAddressID, setPickupAddressID] = useState("");
  const [pickupDates, setPickupDates] = useState<any>({});
  const [fetchDate, setFetchDate] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [pickupRequestID, setPickupRequestID] = useState("");
  const [fetch, setFetch] = useState(false);

  useEffect(() => {
    getPickupAddress().then((res) => {
      setPickupAddressID(res?.data.data[0]?.address_id);
    });

    getPickupDates().then((res) => {
      setPickupDates(res?.data.data);
      setFetchDate(true);
    });
  }, []);

  return (
    <FranchisePage className="h-screen mb-8">
      <div className="flex justify-between">
        {/* <BreadcrumbNav parent="Pickup Request" pageTitle="Pickup Request" /> */}
        <BreadcrumbNav pageTitle="Pickup Request" />
        <div
          // className="flex justify-end gap-x-5 "
          className="absolute font-normal 2xl:right-56 right-8 top-3"
        >
          {fetchDate && (
            <CreatePickupDialog
              setFetch={setFetch}
              pickupAddressID={pickupAddressID}
              pickupDates={pickupDates.pickup_dates}
            />
          )}
        </div>
      </div>
      <Card className="m-0 shadow-none">
        <DataTable
          APIEndpoint="/pickup/get-list"
          refresh={fetch}
          triggers={{
            functions: {
              reschedulePickup: function (data: any) {
                setRescheduleDialog(true);
                setPickupRequestID(data.pickup_request_id);
              },
              cancelPickup: function (data: any) {
                setCancelDialog(true);
                setPickupRequestID(data.pickup_request_id);
              },
            },
          }}
        />
        <CancelRequest
          pickup_request_id={pickupRequestID}
          open={cancelDialog}
          setOpen={setCancelDialog}
          setFetch={setFetch}
        />
        <RescheduleRequest
          setFetch={setFetch}
          open={rescheduleDialog}
          setOpen={setRescheduleDialog}
          pickup_request_id={pickupRequestID}
        />
      </Card>
    </FranchisePage>
  );
}
