import { Icon } from "@iconify/react";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarOld } from "@/components/ui/calendarOld";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl } from "./form";

export function DatePicker({ field, className, minDate, maxDate }: any) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground", className)}
          >
            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
            <Icon icon="radix-icons:calendar" className="w-4 h-4 ml-auto opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarOld
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) =>
            date > new Date(maxDate ? maxDate : undefined) || date < new Date(minDate ? minDate : "1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
