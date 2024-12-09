import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useEffect } from "react";
import { headerType } from ".";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Search } from "lucide-react";

interface DataTableFilterProps<TData> {
  table: Table<TData>;
  filters: headerType[];
  filtersState: Record<string, string>;
  setFiltersState: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function OutsideDrawerFilter<TData>({
  table,
  filters,
  filtersState,
  setFiltersState,
}: DataTableFilterProps<TData>) {
  let schema: {
    [key: string]: any;
  } = {};

  let defaultValues: {
    [key: string]: any;
  } = {};

  useEffect(() => {
    if (Object.keys(filtersState).length) return;

    filters.forEach((filter) => {
      schema[`${filter.slug}_selectBox`] = z.string().optional();
      form.setValue(filter.slug, "");

      switch (filter.type) {
        case "text":
          schema[filter.slug] = z.string().optional();
          form.setValue(`${filter.slug}_selectBox`, "beginwith");
          break;
      }
    });
  }, [filters]);

  useEffect(() => {
    Object.entries(filtersState).forEach(([key, value]) => {
      form.setValue(key, value);
      form.trigger(key);
    });
  }, [filtersState]);
  const FormSchema = z.object(schema);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: Object.keys(schema).length ? zodResolver(FormSchema) : undefined,
    defaultValues,
  });

  function onSubmit(data: any) {
    let columnFilters: any[] = [];

    filters.forEach((filter) => {
      if (data[filter.slug]?.length > 0) {
        columnFilters.push({
          id: filter.slug,
          value: {
            option: data[`${filter.slug}_selectBox`],
            value: data[filter.slug] !== "" ? data[filter.slug] : data[`${filter.slug}_2`] ? "empty" : "",
            value_2: data[`${filter.slug}_2`] ?? "",
          },
        });
      }
      return columnFilters;
    });

    table.setColumnFilters(() => columnFilters);
    setFiltersState(data);
  }
  function applyfilter(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 2 || e.target.value.length === 0) {
      form.handleSubmit(onSubmit)();
    }
  }
  return (
    <>
      {filters.length > 0 && (
        <Form {...form}>
          <form id="filterForm" onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="flex space-x-2">
              {filters
                .filter((fil) => fil.options.searchable)
                .slice(0, 1)
                .map((filter) => (
                  <div key={filter.slug}>
                    {filter.type === "text" && (
                      <div className="">
                        <FormField
                          control={form.control}
                          name={filter.slug}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center border px-2 rounded-lg">
                                  <Search className="w-4 h-4 opacity-50 text-gray-800 shrink-0" />
                                  <Input
                                    type="text"
                                    className="min-w-48 h-10 pl-1.5 border-none active:border-none focus-visible:ring-0"
                                    placeholder={`Enter ${filter.title} . . .`}
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      applyfilter(e);
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
