import SearchForm from "@/components/elements/SearchForm";
import { Table } from "@tanstack/react-table";
import ButtonWithIcon from "@/components/elements/ButtonWithIcon";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export default function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between mb-3">
      <SearchForm
        placeholder="Search by Order ID"
        value={(table.getColumn("orderId")?.getFilterValue() as string) ?? ""}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          table.getColumn("orderId")?.setFilterValue(event.target.value)
        }
      />
      <div className="flex justify-between flex-1">
        <ButtonWithIcon variant="outline" iconName="lucide:sliders-horizontal" text="Filters" className="mx-3" />
        <ButtonWithIcon variant="outline" iconName="lucide:cloud-download" text="Export" />
      </div>
    </div>
  );
}
