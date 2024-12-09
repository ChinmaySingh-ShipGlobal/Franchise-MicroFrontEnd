import { Input } from "@/components/ui/input";
import HelpBadge from "@/components/elements/HelpBadge";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CSBVCustomerForm } from "./old/CSBVCustomer";
import { RequiredField } from "@/components/elements/SGFormField";

interface BankDetailsProps {
  form: UseFormReturn<CSBVCustomerForm>;
}

export const BankDetails = ({ form }: BankDetailsProps) => {
  return (
    <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <FormField
        control={form.control}
        name="bank_name"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-x-1">
              <FormLabel>
                Bank Name
                <RequiredField />
              </FormLabel>
              <HelpBadge to="#" text="Need help?" />
            </div>
            <FormControl>
              <Input
                type="text"
                required
                {...field}
                placeholder={`Enter bank name . . .`}
                className="h-11"
                onChange={(e) => {
                  field.onChange(e.target.value.toUpperCase());
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bank_account"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-x-1">
              <FormLabel>
                Bank Account Number <RequiredField />
              </FormLabel>
              <HelpBadge to="#" text="Need help?" />
            </div>
            <FormControl>
              <Input type="text" required {...field} placeholder={`Enter bank account number . . .`} className="h-11" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
