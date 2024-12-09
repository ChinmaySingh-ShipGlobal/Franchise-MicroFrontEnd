import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowData,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import DataTablePagination from "@/components/elements/data-table-d/pagination";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableToolbar } from "@/components/elements/data-table-d/toolbar";
import DataTableColumnHeader from "@/components/elements/data-table-d/column-header";
import { paginationBodyBuilder } from "@/lib/utils";
import api from "@/lib/api";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APIColumnType } from "@/schemas/DataTable";
import LoadingIconButton from "../LoadingIconButton";
import useQueryParams from "@/hooks/use-queryParams";
import { toast } from "@/components/ui/use-toast";
import { TooltipHover } from "../Tooltip";
import { DataTableRowActions } from "./row-actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    // sortingKey: string;
  }
}

export type headerType = {
  type: "text" | "numeric" | "date" | "enum";
  slug: string;
  title: string;
  filter: boolean;
  options: {
    options?: Record<string, string>;
    multiple?: boolean;
    min_date?: string | null;
    max_date?: string | null;
    min?: number | null;
    max?: number | null;
    prefix?: string;
    searchable: boolean;
  };
};

type badgeVariantsOptions = VariantProps<typeof badgeVariants>["variant"];

interface DataTableProps {
  APIEndpoint: string;
  tab?: string;
  triggers?: any;
  refresh?: boolean;
  actionTitle?: string;
}

const DataTable = ({ APIEndpoint, tab, triggers, refresh, actionTitle }: DataTableProps) => {
  const { getQueryParam, addQueryParams, hasQueryParam } = useQueryParams();

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: getQueryParam("page") ? parseInt(getQueryParam("page")!) - 1 : 0,
    pageSize: getQueryParam("limit") ? parseInt(getQueryParam("limit")!) : 20,
  });

  const [sorting, setSorting] = React.useState<SortingState>(
    getQueryParam("sortKey") && getQueryParam("sortValue")
      ? [
          {
            id: getQueryParam("sortKey")!,
            desc: getQueryParam("sortValue") === "desc",
          },
        ]
      : [],
  );

  const [columns, setColumns] = React.useState<ColumnDef<any>[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [filtersState, setFiltersState] = React.useState<Record<string, string>>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<any>({
    data: [],
    pagination: { total_pages: 0, current_page: 1 },
    table_options: { columns: [], filters: [], row_actions: [], bulk_actions: [] },
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  React.useEffect(() => {
    const filters = getQueryParam("filters");

    if (tab !== undefined && tab !== getQueryParam("tab")) {
      return;
    }

    if (filters) {
      let filtersState: Record<string, string> = {};
      const filtersArray: String[] = filters.split(",");
      setFiltersState(filtersState);

      const filterArr = filtersArray.map((filter) => {
        const filterValues = filter.split("~");
        if (filterValues.length > 3) {
          filtersState[`${filterValues[0]}_2`] = filterValues[3];
        }

        if (filterValues.length > 2) {
          filtersState[filterValues[0]] = filterValues[2] === "empty" ? "" : filterValues[2];
        }

        filtersState[`${filterValues[0]}_selectBox`] = filterValues[1];

        return {
          id: filterValues[0],
          value: {
            option: filterValues[1],
            value: filterValues[2] ?? "",
            value_2: filterValues[3] ?? "",
          },
        };
      });

      setColumnFilters(filterArr);
    }
  }, []);

  useEffect(() => {
    getDataFromAPI();
  }, [sorting, columnFilters, pagination]);

  const getDataFromAPI = async () => {
    setIsLoading(true);
    let body = paginationBodyBuilder({ sorting, columnFilters, pagination });

    api
      .post(APIEndpoint, body)
      .then((res) => {
        setRowSelection({});
        setColumns((prev) => {
          if (prev.length === 0) {
            return createColumnData(res.data.data.table_options);
          } else {
            return prev;
          }
        });

        return res.data.data;
      })
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((res) => {
        if (res.response.status === 422) {
          toast({
            title: "Invalid data format",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Failed to fetch data",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const createCellView = (data: APIColumnType, row: any, parent?: string) => {
    let cellData = row.original[data.title];

    if (parent) {
      cellData = row.original[parent][data.title];
    }

    switch (data.type) {
      case "redirect": {
        return (
          <Link
            to={cellData.url === "disabled" ? "#" : cellData.url}
            target={data.options.open_in_new_tab ? "_blank" : undefined}
          >
            <span
              key={parent ? data.title : undefined}
              className={!data.options.bold ? "text-primary" : "font-medium text-primary"}
            >
              {cellData.display}
            </span>
          </Link>
        );
      }
      case "text":
        return (
          <span key={parent ? data.title : undefined} className={!data.options.bold ? "text-gray-700" : "font-medium"}>
            {cellData}
          </span>
        );
      case "group":
        return (
          <div className="flex flex-col">
            {data.options.group.map((group) => {
              return createCellView(group, row, data.title);
            })}
          </div>
        );
      case "action":
        return (
          <Link to={cellData} target={data.options.open_in_new_tab ? "_blank" : undefined}>
            <Button key={parent ? data.title : undefined} size="sm">
              {data.title}
            </Button>
          </Link>
        );
      case "badge":
        let badgeVariant: badgeVariantsOptions = "default";

        if (data.options?.color && data.options.color[cellData] !== undefined) {
          badgeVariant = data.options.color[cellData];
        } else if (data.options?.default_color) {
          badgeVariant = data.options.default_color;
        }

        return (
          <Badge
            key={parent ? data.title : undefined}
            dangerouslySetInnerHTML={{ __html: cellData }}
            variant={badgeVariant}
          ></Badge>
        );
      case "tag":
        let variant: badgeVariantsOptions = "default";
        if (data.options?.color && data.options.color[cellData] !== undefined) {
          variant = data.options.color[cellData];
        } else if (data.options?.default_color) {
          variant = data.options.default_color;
        }

        if (data.options.tags[cellData] === undefined) return <></>;

        return (
          <Badge variant={variant} key={parent ? data.title : undefined} className="w-fit whitespace-nowrap">
            {data.options.tags[cellData]}
          </Badge>
        );
    }
  };

  const createColumnData = (data: any) => {
    let columnsList: typeof columns = [];

    if (data.bulk_actions.length > 0) {
      columnsList.push({
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
        enableSorting: false,
        enableHiding: false,
      });
    }

    for (const columnData of data.columns as APIColumnType[]) {
      columnsList.push({
        accessorKey: columnData.slug,
        header: ({ column }) => {
          return <DataTableColumnHeader column={column} title={columnData.title} sorting={columnData.sortable} />;
        },
        cell: ({ row }) => {
          return createCellView(columnData, row);
        },
        enableSorting: columnData.sortable,
        enableHiding: true,
      });
    }

    if (data.row_actions.length > 0) {
      const normalActions = data.row_actions.filter((action: any) => !action.dropdown_menu);
      const dropdownActions = data.row_actions.filter((action: any) => action.dropdown_menu);

      columnsList.push({
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => {
          return <span className="text-sm font-normal hover:text-gray text-gray">{actionTitle || "Actions"}</span>;
        },
        cell: ({ row }) => {
          return (
            <div className="flex items-center">
              {normalActions.map((action: any, key: any) => {
                if (action.type === "request") {
                  return (
                    <div key={key}>
                      <TooltipHover
                        triggerElement={
                          <div>
                            <Trigger
                              key={key}
                              action={action}
                              triggerComponents={triggers}
                              triggerName={[action.options.function_name]}
                              data={row.original.actions[action.title]}
                              refreshDataTable={getDataFromAPI}
                            />
                          </div>
                        }
                        text={action.title}
                      />
                    </div>
                  );
                }

                return (
                  <div key={key}>
                    <TooltipHover
                      triggerElement={
                        <Link
                          to={
                            row.original.actions[action.title] === "disabled" ? "#" : row.original.actions[action.title]
                          }
                          target={action.options.open_in_new_tab ? "_blank" : undefined}
                          onClick={(event) => {
                            if (row.original.actions[action.title] === "disabled") {
                              event.preventDefault();
                            }
                          }}
                          className={
                            row.original.actions[action.title] === "disabled" ? "cursor-not-allowed" : undefined
                          }
                        >
                          <LoadingIconButton
                            variant={action.full_size_button ? "outline" : "ghost"}
                            size={action.full_size_button ? undefined : "icon"}
                            iconName={action.icon ?? "solar:forward-2-bold"}
                            disabled={row.original.actions[action.title] === "disabled"}
                            text={action.full_size_button ? action.title : undefined}
                            color={action.options.color ?? "primary"}
                          />
                        </Link>
                      }
                      text={action.title}
                    />
                  </div>
                );
              })}

              {dropdownActions.filter((action: any) => {
                return row.original.actions[action.title] !== "disabled";
              }).length > 0 && (
                <DataTableRowActions row={row}>
                  {dropdownActions
                    .filter((action: any) => {
                      return row.original.actions[action.title] !== "disabled";
                    })
                    .map((action: any, key: any) => {
                      if (action.type === "request") {
                        return (
                          <DropdownMenuItem
                            key={key}
                            asChild
                            className="cursor-pointer"
                            disabled={row.original.actions[action.title] === "disabled"}
                          >
                            <div>
                              <Trigger
                                action={action}
                                triggerComponents={triggers}
                                triggerName={[action.options.function_name]}
                                data={row.original.actions[action.title]}
                                type="link"
                                refreshDataTable={getDataFromAPI}
                              />
                            </div>
                          </DropdownMenuItem>
                        );
                      }

                      return (
                        <DropdownMenuItem
                          key={key}
                          asChild
                          className="cursor-pointer"
                          disabled={row.original.actions[action.title] === "disabled"}
                        >
                          <Link
                            to={
                              row.original.actions[action.title] === "disabled"
                                ? "#"
                                : row.original.actions[action.title]
                            }
                            target={action.options.open_in_new_tab ? "_blank" : undefined}
                          >
                            {action.title}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                </DataTableRowActions>
              )}
            </div>
          );
        },
      });
    }

    return columnsList;
  };

  React.useEffect(() => {
    const params: Record<string, string> = {};

    if (tab) {
      // addQueryParam("tab", tab);
      params.tab = tab;
    }

    if (pageIndex !== 0) {
      // addQueryParam("page", (pageIndex + 1).toString());
      params.page = (pageIndex + 1).toString();
    } else {
      // deleteQueryParam("page");
      params.page = "";
    }

    if (pageSize !== 20) {
      // addQueryParam("limit", pageSize.toString());
      params.limit = pageSize.toString();
    } else {
      params.limit = "";
      // deleteQueryParam("limit");
    }

    if (sorting.length > 0) {
      // addQueryParam("sortKey", sorting[0].id);
      // addQueryParam("sortValue", sorting[0].desc ? "desc" : "asc");
      params.sortKey = sorting[0].id;
      params.sortValue = sorting[0].desc ? "desc" : "asc";
    } else {
      params.sortKey = "";
      params.sortValue = "";
      // deleteQueryParam("sortKey");
      // deleteQueryParam("sortValue");
    }

    if (columnFilters.length > 0) {
      let filterString = "";

      columnFilters.forEach((filter: any) => {
        if (filterString.length > 0) {
          filterString += ",";
        }

        filterString += `${filter.id}~${filter.value.option}`;

        if (filter.value.value !== undefined && filter.value.value !== "") {
          filterString += `~${filter.value.value}`;
        }

        if (filter.value?.value_2) {
          filterString += `~${filter.value.value_2}`;
        }
      });

      // filterString.length > 0 ? addQueryParam("filters", filterString) : deleteQueryParam("filters");
      params.filters = filterString;
    } else {
      if (hasQueryParam("filters")) {
        // deleteQueryParam("page");
        params.page = "";
      }
      params.filters = "";
    }

    addQueryParams(params);
  }, [sorting, pageIndex, pageSize, columnFilters]);

  const resetFiltersState = () => {
    table.resetColumnFilters();
    setFiltersState({});
  };

  const table = useReactTable({
    data: data.data,
    columns: columns,
    pageCount: data.pagination.total_pages,
    state: {
      pagination,
      rowSelection,
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    enableColumnFilters: true,
    manualFiltering: true,
    manualPagination: true,
    onPaginationChange: setPagination,
    enableRowSelection: data.table_options.bulk_actions.length > 0,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  });

  useEffect(() => {
    getDataFromAPI();
  }, [refresh]);

  return (
    <>
      <DataTableToolbar
        data={data.data}
        table={table}
        filterState={filtersState}
        setFilterState={setFiltersState}
        resetFilterState={resetFiltersState}
        filters={data.table_options.filters}
        loading={isLoading}
        bulkActions={data.table_options.bulk_actions}
        triggers={triggers}
        refreshDataTable={getDataFromAPI}
      />

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {!isLoading &&
            table.getRowModel().rows?.length > 0 &&
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && !table.getRowModel().rows?.length && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-40 lg:h-80 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}

          {isLoading &&
            Array(pageSize)
              .fill(undefined)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={columns.length}>
                    <Skeleton className="w-full h-5 rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <DataTablePagination
        table={table}
        //   enableRowSelection={enableRowSelection}
      />
    </>
  );
};

interface TriggerProps {
  action: any;
  triggerComponents: any;
  triggerName: any;
  onClick?: () => void;
  data: any;
  refreshDataTable: () => void;
  type?: "link" | "bulkAction";
  disabled?: boolean;
}

export const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ action, triggerComponents, triggerName, onClick, data, refreshDataTable, type, disabled }, forwardRef) => {
    let TriggerComponent = null;
    let triggerFunction = null;

    if (triggerComponents.hasOwnProperty(triggerName)) {
      TriggerComponent = triggerComponents[triggerName];
    }

    if (!TriggerComponent) {
      triggerFunction = triggerComponents.functions[triggerName];
    }

    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const refreshDataTableHandler = () => {
      refreshDataTable();
    };

    const onClickHandler = (e: any) => {
      e.preventDefault();

      if (onClick) {
        onClick();
      }
      setIsOpen((prev) => !prev);

      if (triggerFunction) {
        triggerFunction(data, setIsLoading, refreshDataTableHandler);
      }
    };

    return (
      <>
        {type !== "link" && (
          <LoadingIconButton
            ref={forwardRef} // Forwarding the ref to the LoadingIconButton
            variant={disabled ? "disabled" : type === "bulkAction" ? undefined : "ghost"}
            size={type === "bulkAction" ? undefined : "icon"}
            iconName={action.icon}
            loading={isLoading}
            onClick={onClickHandler}
            text={type === "bulkAction" ? action.title : undefined}
            disabled={disabled}
          />
        )}

        {type === "link" && <p onClick={onClickHandler}>{action.title}</p>}

        {TriggerComponent && <TriggerComponent open={isOpen} setOpen={setIsOpen} data={data} />}
      </>
    );
  },
);

export default DataTable;
