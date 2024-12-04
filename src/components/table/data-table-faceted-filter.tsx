"use client";

import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

import { cn } from "../../lib/utils";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Separator } from "../../ui/separator";
import { useEffect, useState } from "react";
// import {Query} from "appwrite";
import {
  CustomFilter,
  FacetedFilterDropDownOption,
} from "../../components/table/data-table-toolbar";

export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  accessor: string;
  options: FacetedFilterDropDownOption[];
  setNewFilters?: (filters: { [key: string]: string | null }) => void;
  filters?: {
    [key: string]: string | null;
  };
  onClearFilters?: () => void;
  customFilter?: CustomFilter;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  filters,
  setNewFilters,
  accessor,
}: DataTableFacetedFilterProps<TData, TValue>) {
  // const facets = column?.getFacetedUniqueValues();
  const [selectedValues, setSelected] = useState<Set<string>>(new Set([]));
  useEffect(() => {
    if (
      filters == null ||
      !filters.hasOwnProperty(accessor) ||
      filters[accessor] == null
    ) {
      setSelected(new Set([]));
    }
  }, [accessor, filters]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal">
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      let data: Set<string> | null = new Set(selectedValues);
                      // if(customFilter != null) {
                      //     if (setNewFilters) {
                      //         const filter = customFilter(!isSelected);
                      //         if (isSelected) {
                      //             data.delete(accessor);
                      //             if (data.size === 0) {
                      //                 data = null;
                      //             }
                      //         } else {
                      //             data.add(accessor);
                      //         }
                      //         setNewFilters(filter.query);
                      //     }
                      // }else {
                      if (setNewFilters) {
                        if (isSelected) {
                          data.delete(option.value);
                          if (data.size === 0) {
                            data = null;
                          }
                          // TODO set filter
                          // setNewFilters({
                          //     [accessor]: data ? Query.equal(accessor, Array.from(data)) : null
                          // });
                        } else {
                          data.add(option.value);
                          // TODO set filter
                          // setNewFilters({
                          //     [accessor]: Query.equal(accessor, Array.from(data))
                          // });
                        }
                      }
                      // }
                      setSelected(new Set(data ?? []));
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}>
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}>
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {/*                  {facets?.get(option.value) && (*/}
                    {/*                      <span*/}
                    {/*                          className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">*/}
                    {/*  {facets.get(option.value)} Count*/}
                    {/*</span>*/}
                    {/*                  )}*/}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      if (setNewFilters) {
                        setNewFilters({
                          [accessor]: null,
                        });
                      }
                    }}
                    className="justify-center text-center">
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
