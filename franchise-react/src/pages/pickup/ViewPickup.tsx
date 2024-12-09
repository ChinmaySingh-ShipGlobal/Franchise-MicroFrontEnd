import FranchisePage from "@/layouts/FranchisePage";
import { useEffect, useState } from "react";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { Badge } from "@/components/ui/badge";
import { getPickupRequestDetails } from "@/services/pickup";
import { PickupRequestDetails } from "./PickupDetails";
import { useNavigate, useParams } from "react-router-dom";
import { PickupTable } from "./PickupTable";
import { CancelRequest } from "./CancelRequest";
import { Button } from "@/components/ui/button";
import { EditRequest } from "./EditRequest";
import { RescheduleRequest } from "./RescheduleRequest";

export default function ViewPickup() {
  const [pickupRequestDetails, setPickupRequestDetails] = useState<any>({});
  const [actionButtons, setActionButtons] = useState<any>({});
  const { pickup_request_id } = useParams<{ pickup_request_id: string }>();
  const [fetch, setFetch] = useState(false);
  const [pickedOrderRowSelection, setPickedOrderRowSelection] = useState({});
  const [toPickOrderRowSelection, setToPickOrderRowSelection] = useState({});
  const [unPickedOrderRowSelection, setUnPickedOrderRowSelection] = useState({});
  const navigate = useNavigate();
  const [cancelDialog, setCancelDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  async function fetchPickupRequestDetails() {
    try {
      const payload = { pickup_request_id: pickup_request_id };
      const response = await getPickupRequestDetails(payload);
      if (response) {
        if (response.status === 200) {
          setPickupRequestDetails(response.data.data);
          setActionButtons(response.data.data.pickupDetail.actionButtons);
        } else {
          console.error("Error fetching pickup request details:", response.data.message);

          navigate("/pickup-listing");
        }
      }
    } catch (error) {
      console.error("Error fetching pickup request details:", error);
      navigate("/pickup-listing");
    }
  }

  useEffect(() => {
    fetchPickupRequestDetails();
  }, [fetch, pickup_request_id]);

  const statusBadgeClass =
    pickupRequestDetails?.pickupDetail?.status_name === "Cancelled"
      ? "bg bg-orange-100 border-pink text-pink"
      : "bg bg-purple-100 border-purple text-purple";

  const transformData = (data: any) => {
    return data.map((item: any) => ({
      ...item,
      orderTracking: { order_id: item.order_id, tracking: item.tracking },
    }));
  };

  return (
    <FranchisePage className="min-h-screen h-full">
      <div className="items-center justify-between lg:flex">
        <div>
          <div className="flex gap-x-4">
            <BreadcrumbNav
              parent="Pickup Requests"
              parentLink="/pickup-listing"
              pageTitle={`Pickup Code: ${pickupRequestDetails.pickupDetail?.pickup_request_code}`}
              tabName="View Pickup"
              className="text-lg"
            />
            <Badge className={`h-full font-medium ${statusBadgeClass}`} variant="outline">
              {pickupRequestDetails?.pickupDetail?.status_name}
            </Badge>
          </div>
        </div>
        <div className="flex justify-end mt-4 md:mt-0 gap-x-5">
          {pickupRequestDetails.pickup_request_dates && actionButtons.reschedule && (
            <RescheduleRequest
              setFetch={setFetch}
              open={rescheduleDialog}
              setOpen={setRescheduleDialog}
              pickup_request_id={pickup_request_id}
              trigger={
                <Button
                  type="button"
                  variant="outline_theme"
                  className="text-xs font-normal"
                  onClick={() => setRescheduleDialog(true)}
                >
                  Reschedule
                </Button>
              }
            />
          )}
          {actionButtons?.edit && (
            <EditRequest
              setFetch={setFetch}
              open={editDialog}
              setOpen={setEditDialog}
              pickup_request_id={pickup_request_id}
              trigger={
                <Button
                  type="button"
                  variant="outline_theme"
                  className="text-xs font-normal"
                  onClick={() => setEditDialog(true)}
                >
                  Edit
                </Button>
              }
            />
          )}
          {actionButtons?.cancel && (
            <CancelRequest
              pickup_request_id={pickup_request_id}
              open={cancelDialog}
              setOpen={setCancelDialog}
              setFetch={setFetch}
              trigger={
                <Button onClick={() => setCancelDialog(true)} type="button" className="text-xs font-normal">
                  Cancel
                </Button>
              }
            />
          )}
        </div>
      </div>

      <PickupRequestDetails pickupDetails={pickupRequestDetails} />
      <div className="space-y-12 mb-1">
        {pickupRequestDetails?.unpickedOrdersDetail?.length > 0 && (
          <PickupTable
            title="Unpicked Orders"
            data={pickupRequestDetails.unpickedOrdersDetail}
            rowSelection={unPickedOrderRowSelection}
            setRowSelection={setUnPickedOrderRowSelection}
          />
        )}
        {pickupRequestDetails?.pickedOrderDetail?.length > 0 && (
          <PickupTable
            title="Picked Orders"
            data={pickupRequestDetails.pickedOrderDetail}
            rowSelection={pickedOrderRowSelection}
            setRowSelection={setPickedOrderRowSelection}
          />
        )}
        {pickupRequestDetails?.ordersTobePick?.length > 0 && (
          <PickupTable
            title="Orders to Pick"
            data={transformData(pickupRequestDetails.ordersTobePick)}
            rowSelection={toPickOrderRowSelection}
            setRowSelection={setToPickOrderRowSelection}
          />
        )}
        {pickupRequestDetails?.ordersTobePick?.length > 0 && (
          <PickupTable
            title="Orders to Pick"
            data={transformData(pickupRequestDetails.ordersTobePick)}
            rowSelection={toPickOrderRowSelection}
            setRowSelection={setToPickOrderRowSelection}
          />
        )}

        {pickupRequestDetails?.thirdPartyAssignedOrders?.length > 0 && (
          <PickupTable
            title="Orders Assigned to Third Party"
            data={transformData(pickupRequestDetails.thirdPartyAssignedOrders)}
            rowSelection={toPickOrderRowSelection}
            setRowSelection={setToPickOrderRowSelection}
          />
        )}
      </div>
    </FranchisePage>
  );
}
