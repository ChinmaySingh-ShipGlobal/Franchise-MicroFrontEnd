import FranchisePage from "@/layouts/FranchisePage";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { ManifestState, PackedOrder } from "@/interfaces/manifest";
import { ManifestDetails } from "./ManifestDetails";
import { CloseManifestDialog } from "./CloseDialog";
import { ManifestTable } from "./ManifestTable";
import { OrderTable } from "./OrderTable";
import { useStore } from "@/zustand/store";
import { addToManifestOrder, getManifestDetails, manifestBulkAdd, removeFromManifestOrder } from "@/services/manifest";
import { toast } from "@/components/ui/use-toast";
import { toggleManifestButton, updateManifestPickupDates } from "@/zustand/actions";
import { Badge } from "@/components/ui/badge";

export default function CreateManifest() {
  const navigate = useNavigate();
  const params = useParams();

  const [orderTableRowSelection, setOrderTableRowSelection] = useState({});
  const [manifestTableRowSelection, setManifestTableRowSelection] = useState({});

  const [details, setDetails] = useState<ManifestState>({
    manifestDetails: {},
    allOrders: [],
    manifestedOrders: [],
    refetch: false,
  });

  const [editMode, setEditMode] = useState("open");
  const dispatch = useStore((state: any) => state.dispatch);
  const manifest_code = params?.manifest_code;
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [bulkLoading, setBulkLoading] = useState(false);

  async function fetchManifestDetails() {
    try {
      const payload = { manifest_code };
      const response = await getManifestDetails(payload);
      if (response) {
        if (response.status === 200) {
          setDetails((prevState) => ({
            ...prevState,
            manifestDetails: response.data.data,
            allOrders: [...response.data.data.orders, ...response.data.data.otherAddrOrders],
            manifestedOrders: response.data.data.manifestedorders,
          }));
          setEditMode(response.data.data.manifest.manifest_status);
          dispatch(() => toggleManifestButton(response.data.data.show_buttons));
          dispatch(() => updateManifestPickupDates(response.data.data.pickup_request_dates));
        } else {
          console.error("Error fetching manifest details:", response.data.message);
        }
      }
    } catch (error) {
      console.error("Error fetching manifest details:", error);
    }
  }
  useEffect(() => {
    fetchManifestDetails();
  }, [manifest_code, details.refetch, loadingStates, bulkLoading]);

  async function addManifestOrder(order_id: string) {
    setLoadingStates((prev) => ({ ...prev, [order_id]: true }));
    try {
      const payload = { manifest_code, order_id };
      const response = await addToManifestOrder(payload);
      if (response) {
        if (response.status === 200) {
          toast({
            title: response.data.message,
            variant: "success",
          });
          setDetails((prevState) => ({ ...prevState, refetch: !prevState.refetch }));
        } else {
          toast({
            title: response.data.message,
            variant: "destructive",
          });
          console.error("Error fetching manifest details:", response.data.message);
        }
      }
    } catch (error) {
      console.error("Error fetching manifest details:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [order_id]: false }));
      setDetails((prevState) => ({ ...prevState, refetch: !prevState.refetch }));
    }
  }

  async function removeManifestOrder(order_id: string) {
    setLoadingStates((prev) => ({ ...prev, [order_id]: true }));

    try {
      const payload = { manifest_code, order_id };
      const response = await removeFromManifestOrder(payload);
      if (response) {
        if (response.status === 200) {
          toast({
            title: response.data.message,
            variant: "success",
          });
          setDetails((prevState) => ({ ...prevState, refetch: !prevState.refetch }));
        } else {
          console.error("Error fetching manifest details:", response.data.message);
        }
      }
    } catch (error) {
      console.error("Error fetching manifest details:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [order_id]: false }));
      setDetails((prevState) => ({ ...prevState, refetch: !prevState.refetch }));
    }
  }

  async function addBulkToManifest({ orderIds }: { orderIds: string[] }) {
    setBulkLoading(true);
    try {
      const payload = {
        manifest_code: manifest_code,
        order_id: orderIds,
      };
      const response = await manifestBulkAdd(payload);
      if (response) {
        if (response.status === 200) {
          toast({
            title: response.data.message,
            variant: "success",
          });
          setDetails((prevState) => ({ ...prevState, refetch: !prevState.refetch }));
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
      setBulkLoading(false);
      setOrderTableRowSelection({});
    }
  }

  const AllOrdersData = details.allOrders.map((order) =>
    mapOrderData(order, "Add to Manifest", addManifestOrder, loadingStates[order.order_id]),
  );
  const ManifestedOrdersData = details.manifestedOrders.map((order) =>
    mapOrderData(order, "Remove from Manifest", removeManifestOrder, loadingStates[order.order_id]),
  );
  const ClosedManifestedOrdersData = details.manifestedOrders.map((order) => mapOrderData(order));
  const selectPickupEnable = ManifestedOrdersData.length > 0;

  const location = useLocation();

  useEffect(() => {
    if (location?.state?.packedOrderIDs && location.state.packedOrderIDs.length > 0) {
      addBulkToManifest({ orderIds: location.state.packedOrderIDs });
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname]);

  return (
    <FranchisePage>
      <div className="items-center justify-between lg:flex">
        <div className="flex gap-x-4">
          <BreadcrumbNav
            parent="Manifest"
            parentLink="/manifest-listing"
            pageTitle={`Manifest ID : ${details.manifestDetails.manifest?.manifest_code}`}
            tabName={editMode === "open" ? "Create Manifest" : "View Manifest"}
            className="text-lg"
          />
          <Badge
            className={`h-full font-medium ${
              editMode === "close"
                ? "bg bg-pink-100 border-pink text-pink"
                : "bg bg-purple-200 border-purple text-purple"
            }`}
            variant="outline"
          >
            {editMode === "open" ? "Open" : "Closed"}
          </Badge>
        </div>
        <div className="flex justify-end mt-4 md:mt-0 gap-x-5">
          <Button variant="outline_theme" onClick={() => navigate(-1)} className="text-xs font-normal">
            Back
          </Button>
          {details.manifestDetails.manifest?.manifest_status === "open" && (
            <CloseManifestDialog
              isSgCity={details.manifestDetails.isShipGlobalPickupService}
              enable={selectPickupEnable}
              setState={setDetails}
            />
          )}
        </div>
      </div>
      <ManifestDetails manifestDetails={details.manifestDetails} />
      {editMode === "open" ? (
        <>
          <OrderTable
            title="Packed Orders"
            data={AllOrdersData}
            rowSelection={orderTableRowSelection}
            setRowSelection={setOrderTableRowSelection}
            addBulkToManifest={addBulkToManifest}
            bulkLoading={bulkLoading}
          />
          <ManifestTable
            title="Manifested Orders"
            data={ManifestedOrdersData}
            rowSelection={manifestTableRowSelection}
            setRowSelection={setManifestTableRowSelection}
            createManifest
          />
        </>
      ) : (
        <>
          <ManifestTable
            title="Manifested Orders"
            data={ClosedManifestedOrdersData}
            rowSelection={manifestTableRowSelection}
            setRowSelection={setManifestTableRowSelection}
          />
        </>
      )}
    </FranchisePage>
  );
}

const mapOrderData = (
  order: PackedOrder,
  actionLabel?: string,
  actionCallback?: (order_id: string) => void,
  loading?: boolean,
) => ({
  orderId: {
    order_id: order.order_id,
    tracking: order.tracking,
    customer_shipping_country_code: order.customer_shipping_country_code,
    vendor_reference_order_id: order.vendor_reference_order_id,
    vendor_invoice_no: order.vendor_invoice_no,
  },
  customerDetails: {
    customer_shipping_firstname: order.customer_shipping_firstname,
    customer_shipping_lastname: order.customer_shipping_lastname,
    customer_shipping_email: order.customer_shipping_email,
    customer_shipping_mobile: order.customer_shipping_mobile,
  },
  orderDate: order.date_added,
  packageDetails: {
    package_bill_weight: order.package_bill_weight,
    csb5_status: order.csb5_status,
  },
  address: {
    customer_shipping_address: order.customer_shipping_address,
    customer_shipping_address_2: order.customer_shipping_address_2,
    customer_shipping_address_3: order.customer_shipping_address_3,
  },
  lastMileAWB: {
    order_id: order.order_id,
    partner_lastmile_awb_web_tracking: order.partner_lastmile_awb_web_tracking,
    tracking: order.tracking,
    partner_lastmile_awb: order.partner_lastmile_awb,
    partner_lastmile_display: order.partner_lastmile_display,
  },
  origin: "packedOrder",

  action: actionLabel
    ? {
        onClick: () => actionCallback?.(order.order_id),
        label: actionLabel,
        loading: loading,
      }
    : undefined,
});
