"use client";

import * as React from "react";
import Image from "next/image";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { DataTablePagination } from "./data-table-pagination";
import {
  DataTableToolbar,
  FacetedFilter,
  SearchFilter,
} from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  facetedFilters?: FacetedFilter[];
  searchFilter?: SearchFilter;
  onRefresh?: () => void;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  setNewFilters?: (filters: { [key: string]: string | null }) => void;
  filters?: {
    [key: string]: string | null;
  };
  onClearFilters?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  facetedFilters,
  searchFilter,
  onRefresh,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  totalItems,
  onClearFilters,
  filters,
  setNewFilters,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="w-full space-y-4">
      <DataTableToolbar
        table={table}
        facetedFilters={facetedFilters}
        searchFilter={searchFilter}
        onClearFilters={onClearFilters}
        setNewFilters={setNewFilters}
        filters={filters}
      />
      <div className="rounded-md border w-full overflow-x-scroll">
        <div className="w-full">
          <table className="w-full bg-gray-50 dark:bg-card ">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="px-4  text-sm text-nowrap
      font-bold  text-black dark:text-white">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {table.getRowModel().rows?.length ? (
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="w-min">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    {/* {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))} */}
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center ">
                    <div className="flex flex-col items-center justify-center p-4">
                      <Image
                        src="/not_found.png"
                        height={200}
                        width={200}
                        alt="not found"
                      />
                      <p className="font-medium text-2xl pt-2 ">No results</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </table>
        </div>
      </div>
      <DataTablePagination
        table={table}
        onRefresh={onRefresh}
        onPageSizeChange={onPageSizeChange}
        onPageChange={(pageIndex) => {
          if (onPageChange) onPageChange(pageIndex);
        }}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
      />
    </div>
  );
}
