import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, ColumnDef } from "@tanstack/react-table";
import { Address, LastMileAWB, PackedOrder } from "@/interfaces/manifest";
import { commonColumns } from "./CommonColumns";
import { CornerDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@/components/elements/LoadingButton";
import DataTablePagination from "@/components/elements/data-table-d/pagination";

export const ManifestTable = ({ title, data, setRowSelection, rowSelection, createManifest }: any) => {
  const columns: ColumnDef<PackedOrder>[] = [
    ...commonColumns,
    ...(createManifest
      ? [
          {
            accessorKey: "address",
            header: "Address",
            cell: ({ row }: { row: any }) => {
              console.log(row);
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
        ]
      : []),

    {
      accessorKey: "lastMileAWB",
      header: "Last Mile AWB",
      cell: ({ row }) => {
        const lastMileAWB: LastMileAWB = row.getValue("lastMileAWB");
        return (
          <div className="text-sm text-gray-800">
            <p>
              {/* {lastMileAWB.partner_lastmile_awb_web_tracking ?? ""} */}
              {lastMileAWB.partner_lastmile_awb ? `, ${lastMileAWB.partner_lastmile_awb}` : ""}
              {/* {lastMileAWB.partner_lastmile_display ?? ""} */}
            </p>
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
    ...(createManifest
      ? [
          {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }: { row: any }) => {
              const action = row.getValue("action");
              return (
                <LoadingButton
                  text={action.label}
                  onClick={action.onClick}
                  loading={action.loading}
                  className="text-sm bg-white border text-red border-red hover:bg-red-50"
                />
              );
            },
          },
        ]
      : []),
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

  return (
    <Card className="w-full p-0 m-0 mt-4 mb-12 shadow-none">
      <CardContent className="p-3">
        <p className="px-3 mt-1 mb-2 text-base font-semibold">{title}</p>
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
