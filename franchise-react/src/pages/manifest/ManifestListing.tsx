import FranchisePage from "@/layouts/FranchisePage";
import { useNavigate } from "react-router-dom";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { useState } from "react";
import { createManifest } from "@/services/manifest";
import { toast } from "@/components/ui/use-toast";
import { addManifestID } from "@/zustand/actions";
import { useStore } from "@/zustand/store";
import DataTable from "@/components/elements/data-table-d";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Card } from "@/components/ui/card";
import { KYCPendingPopup } from "../order/OrderListing";

export default function ManifestListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useStore((state: any) => state.dispatch);
  const kyc_status = useStore((state: any) => state.kyc_status);
  const [open, setOpen] = useState<boolean>(false);
  console.log(kyc_status, "kyc status check");
  async function onCreateManifest() {
    setLoading(true);
    const payload = {};
    try {
      const response = await createManifest(payload);
      if (response) {
        if (response.status === 200) {
          toast({
            title: response.data.message,
            variant: "success",
          });
          navigate(`/manifests/view/${response.data.data.manifest_code}`);
        } else {
          toast({
            title: response.data.message,
            variant: "success",
          });
        }
        dispatch(() => addManifestID(response.data.data.manifest_code));
        navigate(`/manifests/view/${response.data.data.manifest_code}`);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  const profile = useStore((state: any) => state.profile);

  return (
    <FranchisePage className="h-screen mb-8">
      <div className="flex items-start justify-between">
        {/* <BreadcrumbNav parent="Manifest" pageTitle="Manifest" /> */}
        <BreadcrumbNav pageTitle="Manifest" />
        <div className="flex justify-end gap-x-5">
          <Button
            type="submit"
            disabled={loading}
            className="absolute font-normal right-8 2xl:right-56 top-3"
            onClick={() => {
              if (kyc_status === "approved" && profile.is_pickup_address) onCreateManifest();
              else setOpen(true);
            }}
          >
            <Icon icon="lucide:plus" className={"w-5 h-5 mr-2"} />
            New Manifest
            {loading && <Icon icon="lucide:loader" className="self-center ml-2 animate-spin" />}
          </Button>
        </div>
      </div>
      <Card className="mx-0 mt-0 md:p-3 shadow-none">
        <DataTable APIEndpoint="/pickup/manifest/list" actionTitle="View Detail" />
      </Card>
      <KYCPendingPopup open={open} setOpen={setOpen} />
    </FranchisePage>
  );
}
