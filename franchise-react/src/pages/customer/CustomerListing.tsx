import { useState } from "react";
import { Card } from "@/components/ui/card";
import FranchisePage from "@/layouts/FranchisePage";
import ButtonWithIcon from "@/components/elements/ButtonWithIcon";
import DataTable from "@/components/elements/data-table-d";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { KYCPendingPopup } from "../order/OrderListing";
import { useStore } from "@/zustand/store";
import CSBIVAddCustomerPopup from "./CSBIVCustomerAdd";

export default function CustomerListing() {
  const [customerPopupOpen, setCustomerPopupOpen] = useState(false);
  const kyc_status = useStore((state: any) => state.kyc_status);
  const [open, setOpen] = useState<boolean>(false);
  const profile = useStore((state: any) => state.profile);
  const [fetch, setFetch] = useState(false);
  return (
    <FranchisePage className="h-screen mb-8">
      <div className="flex justify-between">
        {/* <BreadcrumbNav parent="Customers" parentLink="/customers" pageTitle="Customers" /> */}
        <BreadcrumbNav pageTitle="Customers" />
        <ButtonWithIcon
          onClick={() => {
            if (kyc_status === "approved" && profile.is_pickup_address) setCustomerPopupOpen(true);
            else setOpen(true);
          }}
          text="Add Customer"
          iconName="lucide-user"
          className="absolute right-8 2xl:right-56 top-3"
        />
      </div>
      <CSBIVAddCustomerPopup
        open={customerPopupOpen}
        setOpen={setCustomerPopupOpen}
        setFetch={setFetch}
        fetch={fetch}
      />
      <Card className="mx-0 shadow-none mt-0 md:p-3">
        <DataTable
          APIEndpoint="customer"
          refresh={fetch}
          triggers={{
            functions: {
              csb4KYC: function () {
                setCustomerPopupOpen(true);
              },
            },
          }}
        />
      </Card>
      <KYCPendingPopup open={open} setOpen={setOpen} />
    </FranchisePage>
  );
}
