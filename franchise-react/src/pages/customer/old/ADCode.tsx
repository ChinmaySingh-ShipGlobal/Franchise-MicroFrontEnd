import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import HelpBadge from "@/components/elements/HelpBadge";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CSBVCustomerForm } from "./old/CSBVCustomer";
import FileInput from "@/components/elements/FileInput";
import { RequiredField } from "@/components/elements/SGFormField";

interface ADCodeVerifyProps {
  setAdCodeFileId: Dispatch<SetStateAction<string>>;
  form: UseFormReturn<CSBVCustomerForm>;
}
export const ADCode = ({ setAdCodeFileId, form }: ADCodeVerifyProps) => {
  return (
    <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <FormField
        control={form.control}
        name="ad_code"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-x-1">
              <FormLabel>
                AD Code
                <RequiredField />
              </FormLabel>
              <HelpBadge to="https://shipglobal.in/blogs/kyc-ad-code/" text="Need help?" />
            </div>
            <FormControl>
              <Input
                type="text"
                required
                {...field}
                placeholder={`Enter AD Code . . .`}
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
      <FileInput name="ad_code" label="Upload AD" setFileId={setAdCodeFileId} required />
    </div>
  );
};
