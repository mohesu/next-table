import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import React from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  onRefresh?: () => void;
  onDelete?: (size: number) => void;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  page?: number;
  pageSize?: number;
  totalItems?: number;
}

export function DataTablePagination<TData>({
  table,
  onRefresh,
  onDelete,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  totalItems,
}: DataTablePaginationProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const totalRows = totalItems ?? table.getFilteredRowModel().rows.length;

  // const [numberOfPages, setNumberOfPages] = useState<number | null>(null);

  const getNumberOfPages = (
    page?: number,
    pageSize?: number,
    totalItems?: number
  ) => {
    if (page != null && pageSize != null && totalItems != null) {
      return Math.ceil(totalItems / pageSize);
    }
    return null;
  };
  return (
    <div className="flex items-center justify-between px-2">
      <div className=" md:flex-1 flex items-center space-x-4">
        <div
          className="text-sm text-muted-foreground hidden md:block


                ">
          {selectedRows} of {totalRows} row(s) selected.{" "}
          {getNumberOfPages(page, pageSize, totalItems)}
        </div>
        {selectedRows > 0 && onDelete ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onDelete(selectedRows);
            }}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        ) : null}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        {onRefresh && (
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            title="Refresh"
            onClick={onRefresh}>
            <span className="sr-only">Go to next page</span>
            <ReloadIcon className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium hidden md:block">Rows per page</p>
          <Select
            value={`${pageSize ?? table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              if (onPageSizeChange) {
                onPageSizeChange(Number(value));
              } else {
                table.setPageSize(Number(value));
              }
            }}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={pageSize ?? table.getState().pagination.pageSize}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[1, 5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[100px] text-sm font-medium hidden md:block">
          Page {(page ?? table.getState().pagination.pageIndex) + 1} of{" "}
          {getNumberOfPages(page, pageSize, totalItems) ?? table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (onPageChange) {
                onPageChange(0);
              } else {
                table.setPageIndex(0);
              }
            }}
            disabled={page ? page == 0 : !table.getCanPreviousPage()}>
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (onPageChange && page != null) {
                onPageChange(page - 1);
              } else {
                table.previousPage();
              }
            }}
            disabled={page ? page == 0 : !table.getCanPreviousPage()}>
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (onPageChange && page != null) {
                onPageChange(page + 1);
              } else {
                table.nextPage();
              }
            }}
            disabled={
              getNumberOfPages(page, pageSize, totalItems)
                ? page == getNumberOfPages(page, pageSize, totalItems)! - 1
                : !table.getCanNextPage()
            }>
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (
                onPageChange &&
                getNumberOfPages(page, pageSize, totalItems) != null
              ) {
                onPageChange(getNumberOfPages(page, pageSize, totalItems)! - 1);
              } else {
                table.setPageIndex(table.getPageCount() - 1);
              }
            }}
            disabled={
              getNumberOfPages(page, pageSize, totalItems) != null
                ? page == getNumberOfPages(page, pageSize, totalItems)! - 1
                : !table.getCanNextPage()
            }>
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
