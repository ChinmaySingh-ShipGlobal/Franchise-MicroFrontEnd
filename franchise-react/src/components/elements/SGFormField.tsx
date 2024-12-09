import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Icon } from "@iconify/react";
import PhoneCode from "./PhoneCode";
import { CalendarOld } from "@/components/ui/calendarOld";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import UnitBox from "./UnitBox";
import { useState } from "react";
import { Country, States } from "@/schemas/Order";

//Type of Form Fields
// 1. Based on field type - email, mobile, password, country select, state select, city select, avg daily order select
// 2. Based on Field Label

interface SGFormFieldProps {
  type: string;
  name: string;
  className?: string;
  form: any;
  label: string;
  required?: boolean;
  disabled?: boolean;
  selectValues?: any;
}
interface City {
  city: string;
}
interface SelectItemType {
  key: string;
  value: string;
}

export default function SGFormField({
  type,
  name,
  className = "",
  form,
  label,
  disabled,
  selectValues = [],
  required = false,
}: SGFormFieldProps) {
  switch (type) {
    case "text":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem className={className}>
                <FormLabel>
                  {label}
                  {required && <RequiredField />}
                </FormLabel>
                <FormControl>
                  <Input type="text" placeholder={`Enter ${label} . . .`} {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
    case "email":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <FormControl>
                <Input type={type} placeholder="Enter Email ID . . ." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "mobile":
      return (
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem className={className}>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <FormControl>
                <div className="flex flex-row">
                  <PhoneCode />
                  <Input type="tel" className="border-l-0 rounded-l-none" placeholder="XXXX XXX XXX" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "password":
      const [visible, setVisible] = useState(false);
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <div className="flex items-end">
                <FormControl>
                  <Input
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Type here . . ."
                    {...field}
                  />
                </FormControl>
                {visible ? (
                  <Eye className="self-center w-5 h-5 -ml-10 cursor-pointer" onClick={() => setVisible(!visible)} />
                ) : (
                  <EyeOff className="self-center w-5 h-5 -ml-10 cursor-pointer" onClick={() => setVisible(!visible)} />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "textarea":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Type here . . ." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "select-country":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className={className}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectValues.length > 0 ? (
                    selectValues.map((country: Country) => (
                      <SelectItem key={country.country_id} value={country.country_iso2}>
                        {country.country_name} ({country.country_iso3})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="0">Not Available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "select-state":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl className={className}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectValues.length > 0 ? (
                    selectValues.map((state: States) => (
                      <SelectItem key={state.state_id} value={state.state_id}>
                        {state.state_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="0">Not Available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "select-city":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className={className}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectValues.length > 0 ? (
                    selectValues.map((item: City) => (
                      <SelectItem key={item.city} value={item.city}>
                        {item.city}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="0">Please Select State</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "select-avgDailyOrder":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(e) => {
                    console.log(e);
                    field.onChange(e);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectValues &&
                      selectValues.map((item: string) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "select":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={className} disabled={disabled}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectValues.map((item: SelectItemType) => (
                      <SelectItem key={item.key} value={item.key}>
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "input-weight":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem className={className}>
                <FormLabel>
                  {label} {required && <RequiredField />}
                </FormLabel>
                <FormControl>
                  <div className="flex flex-row">
                    <Input
                      type="number"
                      placeholder={`Eg. 1.25`}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border-r-0 rounded-r-none"
                    />
                    <UnitBox unit="kg" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
    case "input-size":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem className={className}>
                <FormLabel>
                  {label} {required && <RequiredField />}
                </FormLabel>
                <FormControl>
                  <div className="flex flex-row">
                    <Input
                      type="number"
                      placeholder={`Eg. 10`}
                      min="1.0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border-r-0 rounded-r-none"
                    />
                    <UnitBox unit="cm" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
    case "date-picker":
      const [isPopOverOpen, setIsPopOverOpen] = useState(false);
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {label} {required && <RequiredField />}
              </FormLabel>
              <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full text-left font-normal", !field.value && "text-muted-foreground")}
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
                      field.onChange(value?.toISOString());
                      setIsPopOverOpen(false);
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
      );
    case "number":
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem className={className}>
                <FormLabel>
                  {label} {required && <RequiredField />}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`Enter ${label} . . .`}
                    min="1.0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
    default:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  {label} {required && <RequiredField />}
                </FormLabel>
                <FormControl>
                  <Input
                    type={type}
                    placeholder={`Enter ${label} . . .`}
                    {...field}
                    className={className}
                    disabled={disabled ? true : false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
  }
}

export const RequiredField = () => <span className="ml-1 text-red">*</span>;
