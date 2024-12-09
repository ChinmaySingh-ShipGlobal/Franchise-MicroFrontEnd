import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { headerType } from ".";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ButtonWithIcon from "../ButtonWithIcon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarOld } from "@/components/ui/calendarOld";
import { Link } from "react-router-dom";
import * as SliderPrimitive from "@radix-ui/react-slider";
import UnitBox from "../UnitBox";
import SGFormField from "../SGFormField";

interface DataTableFilterProps<TData> {
  table: Table<TData>;
  filters: headerType[];
  filtersState: Record<string, string>;
  setFiltersState: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  loading: boolean;
}

export function DataTableDrawerFilter<TData>({
  table,
  filters,
  filtersState,
  setFiltersState,
  loading,
}: DataTableFilterProps<TData>) {
  const [isOpen, setIsOpen] = React.useState(false);

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
        case "numeric":
          schema[filter.slug] = z.number().optional();
          form.setValue(`${filter.slug}_selectBox`, "between");
          form.setValue(`${filter.slug}`, filter.options.min);
          form.setValue(`${filter.slug}_2`, filter.options.max);
          schema[`${filter.slug}_2`] = z.number();
          break;
        case "date":
          schema[filter.slug] = z.date().optional();
          form.setValue(`${filter.slug}_selectBox`, "between");
          schema[`${filter.slug}_2`] = z.number().optional();
          break;
      }
    });
  }, [filters]);

  useEffect(() => {
    // console.log("filerstate", filtersState);

    Object.entries(filtersState).forEach(([key, value]) => {
      form.setValue(key, value);
      form.trigger(key);
    });
  }, [filtersState]);

  // function createSchema() {
  const FormSchema = z.object(schema);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: Object.keys(schema).length ? zodResolver(FormSchema) : undefined,
    defaultValues,
  });

  function onSubmit(data: any) {
    setIsOpen(false);
    let columnFilters: any[] = [];

    filters.forEach((filter) => {
      if (filter.type === "numeric") {
        data[filter.slug] = data[filter.slug].toString();
        data[`${filter.slug}_2`] = data[`${filter.slug}_2`].toString();
      }

      if (
        data[filter.slug]?.length > 0 ||
        (filter.type === "enum" && data[`${filter.slug}_selectBox`]?.length > 0) ||
        (filter.type === "date" && data[`${filter.slug}_2`]?.length > 0)
      ) {
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
  const handleRangeChange = (slug: string, value: [number, number]) => {
    // setRange(value);
    form.setValue(slug, value[0]);
    form.setValue(`${slug}_2`, value[1]);
  };

  const resetField = (filter: headerType) => {
    if (filter.type === "numeric" || filter.type === "date") {
      if (filter.type === "numeric") {
        form.setValue(filter.slug, filter.options.min);
        form.setValue(`${filter.slug}_2`, filter.options.max);
      } else {
        form.setValue(filter.slug, "");
        form.setValue(`${filter.slug}_2`, "");
      }

      form.setValue(`${filter.slug}_selectBox`, "between");
    } else if (filter.type === "text") {
      form.setValue(filter.slug, "");
      form.setValue(`${filter.slug}_selectBox`, "beginwith");
    } else if (filter.type === "enum") {
      form.resetField(`${filter.slug}_selectBox`);
    }
  };

  return (
    <FilterPopover setOpen={setIsOpen} open={isOpen} loading={loading} empty={!filters.length}>
      <div className="flex items-center justify-between px-6 py-2 border-b border-b-white-100">
        <p className="text-base font-semibold text-black">Filters</p>
        <div className="mt-0 text-gray-800 border-none">
          <X onClick={() => setIsOpen(false)} className="w-4 h-4 cursor-pointer" />
        </div>
      </div>
      {filters.length > 0 && (
        <Form {...form}>
          <form id="filterForm" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 px-6 py-2 mx-4 md:mx-auto">
            {filters.slice(1).map((filter) => (
              <div className="mt-2" key={filter.slug}>
                {filter.type === "enum" && (
                  <FormField
                    control={form.control}
                    name={`${filter.slug}_selectBox`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel className="mb-1">{filter.title}</FormLabel>
                          <ResetField resetField={resetField} filter={filter} />
                        </div>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(filter?.options?.options ?? {}).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {filter.type !== "enum" && (
                  <FormField
                    name={`${filter.slug}_selectBox`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                {filter.type === "text" && (
                  <FormField
                    control={form.control}
                    name={filter.slug}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel className="mb-1">{filter.title}</FormLabel>
                          <ResetField resetField={resetField} filter={filter} />
                        </div>
                        <FormControl>
                          <Input type="text" placeholder={`Enter ${filter.title} . . .`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {filter.type === "numeric" && (
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <Label>{filter.title}</Label>
                      <ResetField resetField={resetField} filter={filter} />
                    </div>
                    <Slider
                      min={filter.options.min || 0}
                      max={filter.options.max || 1000000}
                      step={((filter.options.max || 1000000) - (filter.options.min || 0)) / 100}
                      value={form.getValues([filter.slug, `${filter.slug}_2`])}
                      form={form}
                      name={filter.slug}
                      onValueChange={handleRangeChange}
                      formatLabel={(value) => `${filter.options.prefix} ${value}`}
                    />

                    <div className="grid gap-2 md:items-center md:grid-cols-2 mt-4">
                      <FormField
                        control={form.control}
                        name={`${filter.slug}`}
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel className="mb-1">From </FormLabel>
                              <FormControl>
                                <div className="flex flex-row">
                                  {`${filter.slug}` !== "packet-count" ? (
                                    <>
                                      <Input
                                        type="number"
                                        placeholder={`From`}
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="border-r-0 rounded-r-none"
                                      />
                                      <UnitBox unit={`${filter.options.prefix}`} />
                                    </>
                                  ) : (
                                    <Input {...field} placeholder={`From`} />
                                  )}
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name={`${filter.slug}_2`}
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel className="mb-1">To </FormLabel>
                              <FormControl>
                                <div className="flex flex-row">
                                  {`${filter.slug}` !== "packet-count" ? (
                                    <>
                                      <Input
                                        type="number"
                                        placeholder="To"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="border-r-0 rounded-r-none"
                                      />
                                      <UnitBox unit={`${filter.options.prefix}`} />
                                    </>
                                  ) : (
                                    <Input {...field} placeholder="To" />
                                  )}
                                </div>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  </div>
                )}

                {filter.type === "date" && (
                  <div className="grid gap-2 md:items-center md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={filter.slug}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel className="mb-1">From</FormLabel>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarOld
                                mode="single"
                                selected={field.value}
                                onSelect={(value) => {
                                  if (value) {
                                    const selectedDate = new Date(value);
                                    selectedDate.setDate(selectedDate.getDate() + 1);
                                    field.onChange(selectedDate.toISOString().split("T")[0]);
                                  }
                                }}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`${filter.slug}_2`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between">
                            <FormLabel className="mb-1">To</FormLabel>
                            <ResetField resetField={resetField} filter={filter} />
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarOld
                                mode="single"
                                selected={field.value}
                                onSelect={(value) => {
                                  if (value) {
                                    const selectedDate = new Date(value);
                                    selectedDate.setDate(selectedDate.getDate() + 1);
                                    field.onChange(selectedDate.toISOString().split("T")[0]);
                                  }
                                }}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-end pt-4 mb-1 space-x-3">
              <Button
                variant="outline"
                className="font-normal border-primary text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                }}
              >
                Close
              </Button>
              <Button className="font-normal" type="submit">
                Apply
              </Button>
            </div>
          </form>
        </Form>
      )}
    </FilterPopover>
  );
}

const FilterPopover = ({
  open,
  children,
  setOpen,
  loading,
  empty,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (state: boolean) => void;
  loading: boolean;
  empty: boolean;
}) => {
  const openDropdownHandler = () => {
    if (!loading) {
      setOpen(!open);
    }
  };

  return (
    <>
      {!(!loading && empty) && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <ButtonWithIcon
              iconName="lucide:sliders-vertical"
              text="More Filters"
              className="h-10 text-sm font-normal text-black bg-transparent border border-gray-300 rounded-lg hover:bg-transparent"
              onClick={openDropdownHandler}
              disabled={loading}
            />
          </PopoverTrigger>
          <PopoverContent align="start" className="px-0 pt-1 pb-2 overflow-y-auto shadow md:w-100 max-h-88 md:max-h-96">
            <div className="">{children}</div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

interface ResetFieldProps {
  filter: headerType;
  resetField: (filter: headerType) => void;
}

const ResetField: React.FC<ResetFieldProps> = ({ filter, resetField }) => (
  <Link
    to="#"
    className="flex justify-end text-xs text-blue hover:cursor-pointer"
    onClick={(e) => {
      e.preventDefault();
      resetField(filter);
    }}
  >
    Reset
  </Link>
);

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (slug: string, values: [number, number]) => void;
  formatLabel?: (value: number) => string;
  className?: string;
  [key: string]: any;
}

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value = [min, max],
  onValueChange,
  formatLabel,
  className,
  form,
  name,
  ...props
}) => {
  const [_, setLocalValues] = useState<[number, number]>(form.getValues([name, `${name}_2`]));

  useEffect(() => {
    setLocalValues(form.getValues([name, `${name}_2`]));
  }, [form.getValues([name, `${name}_2`])]);

  const handleValueChange = (newValues: [number, number]) => {
    if (newValues[0] <= newValues[1]) {
      onValueChange(name, newValues);
    }
  };

  return (
    <SliderPrimitive.Root
      min={min}
      max={max}
      step={step}
      value={form.getValues([name, `${name}_2`])}
      onValueChange={handleValueChange}
      className={`relative flex w-full touch-none select-none items-center ${className}`}
      {...props}
    >
      <SliderPrimitive.Track className="relative mt-1 h-0.5 w-full grow overflow-hidden rounded-full bg-gray-300">
        <SliderPrimitive.Range className="absolute h-full bg-gray-800" />
      </SliderPrimitive.Track>
      {form.getValues([name, `${name}_2`]).map((value: any, index: any) => (
        <React.Fragment key={index}>
          <div
            className="absolute text-center"
            style={{
              left: `calc(${((value - min) / (max - min)) * 88}% + 0.2rem)`,
              top: `10px`,
            }}
          >
            {/* <span className="text-xs whitespace-nowrap">{formatLabel ? formatLabel(value) : value}</span> */}
          </div>
          <SliderPrimitive.Thumb className="block w-3 h-3 mt-1 transition-colors border rounded-full shadow fill-gray bg-gray border-gray border-primary/50 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
};
