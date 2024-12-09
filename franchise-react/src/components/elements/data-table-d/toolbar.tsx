import { Table } from "@tanstack/react-table";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { headerType, Trigger } from ".";
import { DataTableDrawerFilter } from "@/components/elements/data-table-d/drawer-filter";
import { OutsideDrawerFilter } from "./SingleFilter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters: headerType[];
  filterState: Record<string, string>;
  resetFilterState: () => void;
  setFilterState: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  loading: boolean;
  bulkActions: any[];
  triggers?: any;
  refreshDataTable: () => void;
  data: [];
}

export function DataTableToolbar<TData>({
  table,
  filters,
  filterState,
  setFilterState,
  resetFilterState,
  loading,
  bulkActions,
  triggers,
  refreshDataTable,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-start space-x-2">
        <OutsideDrawerFilter
          table={table}
          filters={filters}
          filtersState={filterState}
          setFiltersState={setFilterState}
        />
        <DataTableDrawerFilter
          table={table}
          filters={filters}
          filtersState={filterState}
          setFiltersState={setFilterState}
          loading={loading}
        />
        {isFiltered && (
          <Button variant="ghost" onClick={resetFilterState} className="h-8 px-2 lg:px-3">
            Reset
            <Icon icon="radix-icons:cross-2" className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      {/* <div>{<DataTableViewOptions table={table} loading={loading} />}</div>  to be added later if needed*/}

      <div className="ml-2 flex lg:flex-row flex-col gap-2">
        {bulkActions.length > 0 &&
          bulkActions.map((action, key) => {
            return (
              <Trigger
                key={key}
                action={action}
                triggerComponents={triggers}
                triggerName={[action.options.function_name]}
                data={{
                  data,
                  rowSelection: table.getState().rowSelection,
                }}
                type="bulkAction"
                refreshDataTable={refreshDataTable}
                disabled={table.getFilteredSelectedRowModel().rows.length == 0}
              />
            );
          })}
      </div>
    </div>
  );
}
