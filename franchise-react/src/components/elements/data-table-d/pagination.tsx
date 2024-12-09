import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getPaginationPages, scrollToTop } from "@/lib/utils";
import { GoToFirstPage, GoToLastPage, GoToNextPage, GoToPrevPage } from "@/assets/Pagination";

export default function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
  const [pageNumbers, setPageNumbers] = useState(getPaginationPages(table.getPageCount(), 0));

  const goToPage = (num: number | string) => {
    scrollToTop(); //TODO test and fix it for first and last pages
    switch (num) {
      case 1:
        table.nextPage();
        return;
      case -1:
        table.previousPage();
        return;
      case 0:
        table.setPageIndex(0);
        return;
      case "last":
        table.setPageIndex(table.getPageCount() - 1);
        return;
      default:
        table.setPageIndex(Number(num));
        return;
    }
  };

  useEffect(() => {
    setPageNumbers(getPaginationPages(table.getPageCount(), table.getState().pagination.pageIndex));
  }, [table.getState().pagination.pageSize, table.getState().pagination.pageIndex, table.getPageCount()]);

  return (
    <div className="flex items-center justify-center py-4">
      {table.getPaginationRowModel().rows.length > 0 && (
        <>
          <div className="items-start justify-start flex-auto hidden text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
              <span>
                {table.getFilteredSelectedRowModel().rows.length} of {table.getRowCount()} row(s) selected.
              </span>
            ) : (
              <span className="text-gray-600 ml-1">
                Showing{" "}
                {table.getPaginationRowModel().rows.length > 0
                  ? table.getPaginationRowModel().rows.length * table.getState().pagination.pageIndex + 1
                  : 0}{" "}
                to{" "}
                {table.getPaginationRowModel().rows.length * table.getState().pagination.pageIndex +
                  table.getPaginationRowModel().rows.length}{" "}
                of
                {" " + table.getRowCount()} entries
              </span>
            )}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="ghost"
              className="hidden w-6 h-6 p-0 hover:bg-transparent lg:flex"
              onClick={() => goToPage(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              {/* <Icon icon="lucide:chevrons-left" width="1.5rem" height="1.5rem" /> */}
              <GoToFirstPage disabled={!table.getCanPreviousPage()} />
            </Button>
            <Button
              variant="ghost"
              className="w-6 h-6 p-0 hover:bg-transparent"
              onClick={() => goToPage(-1)}
              disabled={!table.getCanPreviousPage()}
            >
              <GoToPrevPage disabled={!table.getCanPreviousPage()} />
              {/* <Icon icon="lucide:chevron-left" width="1.5rem" height="1.5rem" /> */}
            </Button>
            <div className="flex-auto text-sm font-medium ">
              {pageNumbers.map((pageNumber) => (
                <Button
                  variant="ghost"
                  onClick={() => goToPage(pageNumber)}
                  key={pageNumber}
                  className={`w-5 h-5 px-3 py-3 text-xs rounded-full text-white ${
                    table.getState().pagination.pageIndex === pageNumber ? "bg-primary" : " text-gray "
                  }`}
                >
                  {pageNumber + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-6 h-6 p-0 hover:bg-transparent"
              onClick={() => goToPage(1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              {/* <Icon icon="lucide:chevron-right" width="1.5rem" height="1.5rem" /> */}
              <GoToNextPage disabled={!table.getCanNextPage()} />
            </Button>
            <Button
              variant="ghost"
              className="hidden w-6 h-6 p-0 hover:bg-transparent lg:flex"
              onClick={() => goToPage("last")}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              {/* <Icon icon="lucide:chevrons-right" width="1.5rem" height="1.5rem" /> */}
              <GoToLastPage disabled={!table.getCanNextPage()} />
            </Button>
          </div>
          <div className="items-end justify-end space-x-6 lg:flex-auto lg:space-x-8">
            <div className="items-center justify-end hidden space-x-2 lg:flex">
              <p className="mr-3 text-sm w-fit text-gray-600">Items per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="max-w-22">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
