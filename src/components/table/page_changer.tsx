"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "./data-table";
import { FacetedFilter, SearchFilter } from "./data-table-toolbar";
import { useRouter } from "next/navigation";
import React from "react";

export interface PageChangerProps<TData, TValue> {
  searchParams: {
    [key: string]: number | string | string[] | undefined;
    page: number;
    pageSize: number;
  };
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  facetedFilters?: FacetedFilter[];
  searchFilter?: SearchFilter;
  prefixUrl: string;
  total: number;
}

export function PageChanger<TData, TValue>({
  searchParams,
  columns,
  data,
  facetedFilters,
  searchFilter,
  prefixUrl,
  total,
}: PageChangerProps<TData, TValue>) {
  const router = useRouter();

  function setPage(page: number) {
    router.replace(
      `${prefixUrl}?page=${page}&pageSize=${searchParams.pageSize * 1}`
    );
  }
  function setPageSize(page: number) {
    router.replace(
      `${prefixUrl}?page=${searchParams.page}&pageSize=${page * 1}`
    );
  }

  function setNewFilters(filter: { [key: string]: string | null }) {
    router.push(prefixUrl);
    console.log(filter);
  }
  function setFilters(filter: { [key: string]: string | null }) {
    let query = "";

    for (const key in filter) {
      if (filter[key] != null) {
        // TODO complex filter here
        query += `${key}=${filter[key]}&`;
      }
    }

    router.replace(`${prefixUrl}?${query}`);
  }

  const { page, pageSize } = searchParams;
  return (
    <DataTable
      facetedFilters={facetedFilters}
      searchFilter={searchFilter}
      data={data ?? []}
      columns={columns}
      onRefresh={() => {
        router.refresh();
      }}
      totalItems={total}
      onPageSizeChange={setPageSize}
      onPageChange={setPage}
      pageSize={pageSize}
      page={page}
      setNewFilters={setNewFilters}
      filters={{}}
      onClearFilters={() => {
        setFilters({});
      }}
    />
  );
}
