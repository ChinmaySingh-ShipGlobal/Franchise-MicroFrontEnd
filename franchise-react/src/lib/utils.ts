import { DataTableRequestBody } from "@/schemas/DataTable";
import { downloadDocument } from "@/services/kyc";
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parseISO } from "date-fns";
import { RateItem } from "@/interfaces/add-order";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function paginationBodyBuilder({
  sorting,
  columnFilters,
  pagination,
}: {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}) {
  let body: DataTableRequestBody = {
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    filter: {},
    sort: {},
  };

  if (columnFilters.length > 0) {
    columnFilters.forEach((filter: any) => {
      Object.assign(body.filter, {
        [filter.id]: {
          option: filter.value.option,
          value: filter.value.value === "empty" ? "" : filter.value.value,
          value_2: filter.value?.value_2,
        },
      });
    });
  }

  if (sorting.length > 0) {
    Object.assign(body.sort, {
      [sorting[0].id]: sorting[0].desc ? "desc" : "asc",
    });
  }

  return body;
}

export const getPaginationPages = (pageCount: number, currentPageIndex: number, pageSize = 5) => {
  // Determine the start index
  let start = Math.max(0, currentPageIndex - Math.floor(pageSize / 2));

  // Ensure that the start index + pageSize doesn't exceed pageCount
  start = Math.min(start, pageCount - pageSize);

  // Ensure start is not less than 0
  start = Math.max(start, 0);

  // Generate the page numbers using Array.from and ensure we do not exceed the pageCount
  return Array.from({ length: pageSize }, (_, i) => start + i).filter((page) => page < pageCount);
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // for smooth scrolling
  });
};

export const generateUniqueId = () => {
  return "id-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
};

export const delay = (t: number) => {
  return new Promise((resolve) => setTimeout(resolve, t));
};

//to take date range as "x - y days" and return x and y - USED IN RateCalculator
export function parseTransitTime(transitTime: string): [number, number] {
  const rangeMatch = transitTime.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return [parseInt(rangeMatch[1]), parseInt(rangeMatch[2])];
  }
  return [0, 0];
}
// to sort the table data based on cost and delivery time  - USED IN RateCalculator
export function getSortedRates(data: any, sortOption: string) {
  if (sortOption === "cheapest") {
    data.sort((a: RateItem, b: RateItem) => a.rate - b.rate);
  } else if (sortOption === "fastest") {
    data.sort((a: RateItem, b: RateItem) => {
      const [minA, maxA] = parseTransitTime(a.transit_time);
      const [minB, maxB] = parseTransitTime(b.transit_time);
      if (minA !== minB) {
        return minA - minB;
      }
      return maxA - maxB;
    });
  }

  return data;
}

export function formatDate(dateStr: any) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDocumentValue(value: string | any): string {
  if (!value) return "Not Provided";

  const length = value.length;
  const obscuredLength = Math.max(length - 4, 0);
  const obscuredPart = "X"
    .repeat(obscuredLength)
    .replace(/(.{4})/g, "$1-")
    .slice(0, -1);

  const visiblePart = value.slice(-4);
  return obscuredPart + "-" + visiblePart;
}

export function toSentenceCase(str: string): string {
  if (!str) return "";
  const lowercased = str.toLowerCase();
  return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
}

export async function downloadFiles(fileIds: string[]) {
  for (const fileId of fileIds) {
    try {
      const response = await downloadDocument(fileId);
      console.log(`Downloaded file ${fileId}`, response);
    } catch (error) {
      console.error(`Error downloading file ${fileId}:`, error);
    }
  }
}

export function formatDateShortMonth(orderDate: string): string {
  const [datePart] = orderDate.split(" ");
  const [year, month, day] = datePart.split("-");

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  const optionsDate = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", optionsDate).replace(",", "");
}

export function formatTime(timePart: string): string {
  const [hours, minutes, seconds] = timePart.split(":");
  const date = new Date(0, 0, 0, Number(hours), Number(minutes), Number(seconds));
  const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
  return date.toLocaleTimeString("en-US", optionsTime);
}

export const safeFormatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "d MMM, yyyy h:mm a") : "Invalid date";
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid date";
  }
};

export const getDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};
