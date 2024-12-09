import { CustomerDetails, OrderId, PackageDetails, PackedOrder } from "@/interfaces/manifest";
import { formatDateShortMonth, formatTime } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

export const commonColumns: ColumnDef<PackedOrder>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => {
      const orderId: OrderId = row.getValue("orderId");
      const navigate = useNavigate();
      return (
        <div className="text-sm text-gray-800">
          <p
            className="inline font-semibold cursor-pointer text-blue"
            onClick={() => navigate(`/view-order/${orderId.order_id}`)}
          >
            {orderId.tracking} <span className="text-black">- {orderId.customer_shipping_country_code}</span>
          </p>
          <p>{`${orderId.vendor_reference_order_id && `Ref no. ${orderId.vendor_reference_order_id}`}`}</p>
          <p>Invoice no. {orderId.vendor_invoice_no}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "customerDetails",
    header: "Customer Details",
    cell: ({ row }) => {
      const customerDetails: CustomerDetails = row.getValue("customerDetails");
      return (
        <div className="text-sm text-gray-800">
          <p className="font-medium text-black">
            {customerDetails.customer_shipping_firstname} {customerDetails.customer_shipping_lastname}
          </p>
          <p>{customerDetails.customer_shipping_email}</p>
          <p>{customerDetails.customer_shipping_mobile}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => {
      const date: string = row.getValue("orderDate");
      const [datePart, timePart] = date.split(" ");

      return (
        <div className="text-sm text-gray-800">
          <p className="font-medium text-black">{formatDateShortMonth(datePart)}</p>
          <p className="font-normal">{formatTime(timePart)}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "packageDetails",
    header: "Package Details",
    cell: ({ row }) => {
      const packageDetails: PackageDetails = row.getValue("packageDetails");
      return (
        <div className="text-sm text-gray-800">
          <p className="font-medium text-black">{packageDetails.package_bill_weight / 1000} kg</p>
          <p>{packageDetails.csb5_status === "0" ? "CSB-IV" : "CSB-V"}</p>
        </div>
      );
    },
  },
];
