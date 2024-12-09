import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ButtonWithIcon from "../ButtonWithIcon";
import { useState } from "react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  loading: boolean;
}

export default function DataTableViewOptions<TData>({ table, loading }: DataTableViewOptionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);

  const openDropdownHandler = () => {
    setIsOpen((value) => !value);
  };
  const hideColumn = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide());
  return (
    <>
      {hideColumn && (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger>
            <ButtonWithIcon
              variant="outline"
              size="sm"
              className="hidden h-8 ml-auto lg:flex"
              iconName="iconamoon:eye-off-duotone"
              text="Columns"
              onClick={openDropdownHandler}
              loading={loading}
              disabled={loading}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hideColumn.map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.accessorFn?.name}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id.replace(/-/g, " ")}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
