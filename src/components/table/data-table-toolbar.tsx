"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import React, { useEffect, useState } from "react";
// import {Query} from "appwrite";

import Link from "next/link";
import { Plus } from "lucide-react";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  facetedFilters?: FacetedFilter[];
  searchFilter?: SearchFilter;
  setNewFilters?: (filters: { [key: string]: string | null }) => void;
  filters?: {
    [key: string]: string | null;
  };
  onClearFilters?: () => void;
}

export interface SearchFilter {
  accessorKey: string;
  placeHolder: string;
}

export interface FacetedFilterDropDownOptionCustomFilter {
  query: { [key: string]: string };
}

export interface FacetedFilterDropDownOption {
  label: string;
  value: any;
  icon?: React.ComponentType<{ className?: string }> | null;
}

export type CustomFilter = (
  isSelected: boolean
) => FacetedFilterDropDownOptionCustomFilter;
export interface FacetedFilter {
  title: string;
  accessorKey: string;
  options: FacetedFilterDropDownOption[];
  customFilter?: CustomFilter;
}

export function DataTableToolbar<TData>({
  table,
  facetedFilters,
  searchFilter,
  setNewFilters,
  filters,
  onClearFilters,
}: DataTableToolbarProps<TData>) {
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    setIsFiltered(filters != null && Object.keys(filters).length > 0);
  }, [filters]);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchFilter && (
          <Input
            placeholder={searchFilter.placeHolder}
            // value={(filters != null && filters.hasOwnProperty(searchFilter.accessorKey) ? filters[searchFilter.accessorKey] : "")
            // }
            onChange={(event) => {
              // const key = searchFilter?.accessorKey;
              // const value = event.target.value;
              // if (setNewFilters) {
              // TODO update filter
              // console.log("Search", Query.startsWith(searchFilter?.accessorKey, value));
              // if (value === ""){
              //     setNewFilters({[key]: null})
              // }else{
              //     setNewFilters({[key]: Query.startsWith(searchFilter?.accessorKey, value)})
              // }
              // }
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {facetedFilters?.map((filter) => {
          return (
            <DataTableFacetedFilter
              key={filter.accessorKey}
              column={table.getColumn(filter.accessorKey)}
              title={filter.title}
              options={filter.options}
              accessor={filter.accessorKey}
              filters={filters}
              setNewFilters={setNewFilters}
            />
          );
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              if (onClearFilters) {
                onClearFilters();
              }
            }}
            className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/** TODO: Implement filters here */}
      <div className="mr-2">
        <Button variant="outline">Filters</Button>
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
