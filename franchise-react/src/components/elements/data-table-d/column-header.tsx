import { Column } from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  sorting?: boolean;
}

export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  sorting = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="text-sm font-normal hover:text-gray text-gray">{title}</span>
      {sorting && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent bg">
              <Icon
                icon="lucide:chevrons-up-down"
                className="w-4 h-4 ml-2"
                onClick={() => {
                  column.toggleSorting(column.getIsSorted() === "asc" ? true : false);
                }}
              />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      )}
    </div>
  );
}
