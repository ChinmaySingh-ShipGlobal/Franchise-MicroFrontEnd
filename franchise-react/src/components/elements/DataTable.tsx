// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";

// export const columns: ColumnDef<TableData>[] = [
//   {
//     accessorKey: "orderId",
//     header: () => (
//       <div className="flex items-center justify-center">
//         <Checkbox />
//       </div>
//     ),
//     cell: () => (
//       <div className="flex items-center justify-center">
//         <Checkbox />
//       </div>
//     ),
//   },
//   {
//     accessorKey: "orderId",
//     header: "Order ID",
//     cell: ({ row }) => {
//       const orderId = row.getValue("orderId");
//       return (
//         <div className="flex flex-col min-w-48">
//           {/* when the no of rows of data gets very large, we can implement accordion so the user do not have to scroll much */}
//           <span>{orderId.tracking}</span>
//           <span>{orderId.shipping_country}</span>
//           <span>{orderId.invoice_no}</span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "customerDetails",
//     header: "Customer Details",
//     cell: ({ row }) => {
//       const customerDetails = row.getValue("customerDetails");
//       return (
//         <div className="flex flex-col min-w-52">
//           <span>{customerDetails.name}</span>
//           <span>{customerDetails.email}</span>
//           <span>{customerDetails.mobile}</span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "orderDate",
//     header: "Order Date",
//     cell: ({ row }) => {
//       const orderDate = row.getValue("orderDate");
//       return (
//         <div className="flex flex-col min-w-28">
//           <span>{orderDate.date}</span>
//           <span>{orderDate.time}</span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "packageDetails",
//     header: "Package Details",
//     cell: ({ row }) => {
//       const packageDetails = row.getValue("packageDetails");
//       return (
//         <div className="flex flex-col min-w-44">
//           <span>{packageDetails.packageVolume}</span>
//           <span>{packageDetails.packageWeight}</span>
//           <span>{packageDetails.billWeight}</span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => <div className="min-w-28">{row.getValue("status")}</div>,
//   },
//   {
//     accessorKey: "shipping",
//     header: "Last Mile AWB",
//     cell: ({ row }) => <div className="min-w-28">{row.getValue("shipping")}</div>,
//   },
//   {
//     accessorKey: "invoice",
//     header: "Invoice",
//     cell: () => (
//       <div className="flex items-center justify-center">
//         <Button size="icon" className="w-8 h-8 p-0 ">
//           V
//         </Button>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "print-label",
//     header: "Print Label",
//     cell: () => (
//       <div className="flex items-center justify-center">
//         <Button size="icon" className="w-8 h-8 p-0 ">
//           V
//         </Button>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "view-order",
//     header: "View Order",
//     cell: () => (
//       <div className="flex items-center justify-center">
//         <Button size="icon" className="w-8 h-8 p-0 ">
//           {">"}
//         </Button>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "edit-order",
//     header: "Edit Order",
//     cell: () => (
//       <div className="flex items-center justify-center">
//         <Button size="icon" className="w-8 h-8 p-0 ">
//           {"X"}
//         </Button>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "pay-now",
//     header: "Pay",
//     cell: () => (
//       <div className="flex items-center justify-center">
//         <Button size="icon" className="w-8 h-8 p-0 ">
//           {"$"}
//         </Button>
//       </div>
//     ),
//   },
// ];

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   status: string;
// }

// export default function OrderTable({ status }: { status: string }) {
//   const formData = Array.from({ length: 100 }, (_) => ({
//     orderDate: {
//       date: "2024-05-14",
//       time: "12:00",
//     },
//     orderId: {
//       tracking: "SG32405074",
//       shipping_country: "USA",
//       invoice_no: "Invoice no. 465-257-6524",
//     },
//     customerDetails: {
//       name: "Shubham",
//       email: "mukesharrora@gmail.com",
//       mobile: "9898328932",
//     },
//     packageDetails: {
//       packageVolume: "Package Volume: 0.012",
//       packageWeight: "Dead Weight: 1.5",
//       billWeight: "Bill Weight: 1.5",
//     },
//     shipping: "SG12323287272",
//     status: "In Progress",
//   }));

//   return <DataTable columns={columns} data={formData} status={status} />;
// }

// export type TableData = {
//   orderId: {
//     tracking: string;
//     shipping_country: string;
//     invoice_no: string;
//   };
//   customerDetails: {
//     name: string;
//     email: string;
//     mobile: string;
//   };
//   orderDate: {
//     date: string;
//     time: string;
//   };
//   packageDetails: {
//     packageVolume: string;
//     packageWeight: string;
//     billWeight: string;
//   };
//   status: "pending" | "processing" | "success" | "failed";
//   shipping: string;
// };

// export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <Table>
//       <TableHeader>
//         {table.getHeaderGroups().map((headerGroup) => (
//           <TableRow key={headerGroup.id}>
//             {headerGroup.headers.map((header) => {
//               return (
//                 <TableHead key={header.id}>
//                   {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                 </TableHead>
//               );
//             })}
//           </TableRow>
//         ))}
//       </TableHeader>
//       <TableBody>
//         {table.getRowModel().rows?.length ? (
//           table.getRowModel().rows.map((row) => (
//             <TableRow data-state={row.getIsSelected() && "selected"}>
//               {row.getVisibleCells().map((cell) => (
//                 <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//               ))}
//             </TableRow>
//           ))
//         ) : (
//           <TableRow>
//             <TableCell colSpan={columns.length} className="h-24 text-center">
//               No results.
//             </TableCell>
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// }
