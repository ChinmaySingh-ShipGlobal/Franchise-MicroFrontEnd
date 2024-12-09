import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getPaginationPages, scrollToTop } from "@/lib/utils";

export default function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const noOfRows = table.getPaginationRowModel().rows.length;

  const [pageNumbers, setPageNumbers] = useState(getPaginationPages(pageCount, 0));

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
        table.setPageIndex(pageCount - 1);
        return;
      default:
        table.setPageIndex(Number(num));
        return;
    }
  };

  useEffect(() => {
    setPageNumbers(getPaginationPages(pageCount, currentPage));
  }, [pageSize, currentPage, pageCount]);

  return (
    <div className="flex items-center justify-center px-4 py-4 border lg:px-9">
      <div className="items-start justify-start flex-auto hidden text-sm lg:flex">
        {selectedRows > 0 ? (
          <span>
            {selectedRows} of {table.getRowCount()} order(s) selected.
          </span>
        ) : (
          <span>
            Showing {noOfRows * currentPage + 1} to {noOfRows * currentPage + noOfRows} of
            {" " + table.getRowCount()} entries
          </span>
        )}
      </div>
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="ghost"
          className="hidden w-6 h-6 p-0 hover:bg-transparent lg:flex"
          onClick={() => goToPage(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <Icon icon="lucide:chevrons-left" width="1.5rem" height="1.5rem" />
        </Button>
        <Button
          variant="ghost"
          className="w-6 h-6 p-0 hover:bg-transparent"
          onClick={() => goToPage(-1)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <Icon icon="lucide:chevron-left" width="1.5rem" height="1.5rem" />
        </Button>
        <div className="flex-auto text-sm font-medium ">
          {pageNumbers.map((pageNumber) => (
            <Button
              variant="ghost"
              onClick={() => goToPage(pageNumber)}
              key={pageNumber}
              className={`w-8 h-8 px-3 py-3 rounded-full text-white ${
                currentPage === pageNumber ? "bg-primary" : " text-black "
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
          <Icon icon="lucide:chevron-right" width="1.5rem" height="1.5rem" />
        </Button>
        <Button
          variant="ghost"
          className="hidden w-6 h-6 p-0 hover:bg-transparent lg:flex"
          onClick={() => goToPage("last")}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <Icon icon="lucide:chevrons-right" width="1.5rem" height="1.5rem" />
        </Button>
      </div>
      <div className="items-end justify-end space-x-6 lg:flex-auto lg:space-x-8">
        <div className="items-center justify-end hidden space-x-2 lg:flex">
          <p className="mr-3 text-sm w-fit">Items per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="max-w-22">
              <SelectValue placeholder={pageSize} />
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
    </div>
  );
}
