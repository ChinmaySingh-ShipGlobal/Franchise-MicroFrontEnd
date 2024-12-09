import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, ColumnDef } from "@tanstack/react-table";
import { Action, Address, LastMileAWB, OrderId, PackedOrder } from "@/interfaces/manifest";
import { commonColumns } from "./CommonColumns";
import { Checkbox } from "@/components/ui/checkbox";
import { CornerDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@/components/elements/LoadingButton";
import DataTablePagination from "@/components/elements/data-table-d/pagination";

export const OrderTable = ({ title, data, setRowSelection, rowSelection, addBulkToManifest, bulkLoading }: any) => {
  const columns: ColumnDef<PackedOrder>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    ...commonColumns,
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const address: Address = row.getValue("address");
        return (
          <div className="text-sm text-gray-800">
            <p>
              {address.customer_shipping_address}, {address.customer_shipping_address_2},{" "}
              {address.customer_shipping_address_3}
            </p>
          </div>
        );
      },
    },

    {
      accessorKey: "lastMileAWB",
      header: "Last Mile AWB",
      cell: ({ row }) => {
        const lastMileAWB: LastMileAWB = row.getValue("lastMileAWB");
        const orderId: OrderId = row.getValue("orderId");
        console.log(orderId);
        return (
          <div className="text-sm text-gray-800">
            <p>{lastMileAWB.partner_lastmile_awb ? `, ${lastMileAWB.partner_lastmile_awb}` : ""}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "viewOrder",
      header: "View Order",
      cell: ({ row }: { row: any }) => {
        const navigate = useNavigate();
        return (
          <CornerDownRight
            className="mx-auto text-gray-800 cursor-pointer"
            onClick={() => navigate(`/view-order/${row.original.orderId.order_id}`)}
          />
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action: Action = row.getValue("action");
        return (
          <LoadingButton
            text={action.label}
            onClick={action.onClick}
            loading={action.loading || false}
            className="border border-primary text-primary bg-background hover:text-white hover:bg-primary"
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      rowSelection,
    },
  });
  const selectedRows = table.getRowModel().rows.filter((row) => row.getIsSelected());

  const orderIds = selectedRows.map((row: any) => row.original.orderId.order_id);

  return (
    <Card className="w-full p-0 m-0 mt-4 shadow-none">
      <CardContent className="p-3">
        <div className="flex items-center justify-between px-3 mt-1 mb-2">
          <p className="text-base font-semibold">{title}</p>
          <LoadingButton
            text="Bulk Add to Manifest"
            className="text-sm font-normal"
            variant={selectedRows.length <= 0 ? "disabled" : "default"}
            disabled={selectedRows.length <= 0}
            onClick={() => addBulkToManifest({ orderIds })}
            loading={bulkLoading}
          />
        </div>
        <Table>
          <TableHeader className="text-sm font-normal whitespace-nowrap">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination table={table} />
      </CardContent>
    </Card>
  );
};
