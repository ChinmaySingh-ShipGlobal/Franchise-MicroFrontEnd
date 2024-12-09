import { Row, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableSelectHeaderProps<TData> {
  table: Table<TData>;
}

interface DataTableSelectRowProps<TData> {
  row: Row<TData>;
}

export function DataTableRowSelectionHeader<TData>({ table }: DataTableSelectHeaderProps<TData>) {
  return (
    <Checkbox
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="translate-y-[2px]"
    />
  );
}

export function DataTableRowSelectionCell<TData>({ row }: DataTableSelectRowProps<TData>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="translate-y-[2px]"
    />
  );
}
