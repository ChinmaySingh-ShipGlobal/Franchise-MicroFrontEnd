import FranchisePage from "@/layouts/FranchisePage";
import ConsigneeDetails from "@/pages/order/forms/ConsigneeDetails";
import ShippingPartner from "@/pages/order/forms/ShippingPartner";
import ShipmentDetails from "@/pages/order/forms/ShipmentDetails";
import ConsignorDetails from "@/pages/order/forms/ConsignorDetails";

import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { OrderStepForm, OrderSummary } from "./AddOrder";
import { useState } from "react";

export default function AddCSBVOrder() {
  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(true);
  return (
    <FranchisePage>
      <BreadcrumbNav parent="Orders" parentLink="/orders" title="Create CSB-V Order" />
      <div className="flex flex-row mt-3" style={{ maxHeight: "calc(100vh - 5rem)" }}>
        <div className="w-full overflow-auto lg:w-2/3">
          <OrderStepForm title="Consignor Details" content={<ConsignorDetails csbv={true} />} step={1} />
          <OrderStepForm
            title="Consignee Details"
            content={<ConsigneeDetails csbv={true} setIsBillingSameAsShipping={setIsBillingSameAsShipping} />}
            step={2}
          />
          <OrderStepForm title="Shipment Information" step={3} content={<ShipmentDetails csbv={true} />} />
          <OrderStepForm title="Select Shipping Partner" step={4} content={<ShippingPartner />} />
        </div>
        <div className="hidden overflow-auto lg:w-1/3 lg:flex lg:flex-col pb-28">
          <OrderSummary isBillingSameAsShipping={isBillingSameAsShipping} />
        </div>
      </div>
    </FranchisePage>
  );
}
