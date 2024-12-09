import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, ColumnDef } from "@tanstack/react-table";
import DataTablePagination from "@/components/elements/data-table/pagination";
import { CornerDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateShortMonth } from "@/lib/utils";

export const PickupTable = ({ title, data, setRowSelection, rowSelection }: any) => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "tracking",
      header: "Order ID ",
      cell: ({ row }) => {
        const navigate = useNavigate();
        const orderTracking: string = row.getValue("tracking");
        const order_id: string = row.getValue("order_id");
        return (
          <div className="font-medium text-blue cursor-pointer" onClick={() => navigate(`/view-order/${order_id}`)}>
            <p>{orderTracking}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "date_added",
      header: "Order Date",
      cell: ({ row }) => {
        const date_added: string = row.getValue("date_added");
        return (
          <div className="font-normal">
            <p>{formatDateShortMonth(date_added)}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "order_weight",
      header: "Order Weight",
      cell: ({ row }) => {
        const order_weight: string = row.getValue("order_weight");
        const package_weight = row.original?.package_weight / 1000;
        return (
          <div className="font-normal">
            <p>{order_weight ? order_weight : package_weight} kg</p>
          </div>
        );
      },
    },
    {
      accessorKey: "package_bill_weight",
      header: "Bill Weight",
      cell: ({ row }) => {
        const package_bill_weight: string = row.getValue("package_bill_weight");
        return (
          <div className="font-normal">
            <p>{Number(package_bill_weight) / 1000} kg</p>
          </div>
        );
      },
    },
    {
      accessorKey: "manifest_code",
      header: "Manifest Code",
      cell: ({ row }) => {
        const navigate = useNavigate();
        const manifest_code: string = row.getValue("manifest_code");
        return (
          <div
            className="font-medium text-blue cursor-pointer"
            onClick={() => navigate(`/manifests/view/${manifest_code}`)}
          >
            <p>{manifest_code}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "order_id",
      header: "View",
      cell: ({ row }) => {
        const order_id: string = row.getValue("order_id");
        const navigate = useNavigate();
        return (
          <CornerDownRight
            className="w-5 h-5 text-gray-800 cursor-pointer"
            onClick={() => navigate(`/view-order/${order_id}`)}
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

  return (
    <Card className="w-full p-0 m-0 mt-4 border-lightBlue-100 border shadow-none">
      <CardContent className="p-3">
        <p className="px-3 mt-1 mb-2 text-base font-semibold">{title}</p>
        <Table>
          <TableHeader className="text-xs font-normal whitespace-nowrap">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
