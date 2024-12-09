import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import HelpBadge from "@/components/elements/HelpBadge";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CSBVCustomerForm } from "./old/CSBVCustomer";
import FileInput from "@/components/elements/FileInput";
import { RequiredField } from "@/components/elements/SGFormField";

interface LUTVerifyProps {
  setLutFileId: Dispatch<SetStateAction<string>>;
  form: UseFormReturn<CSBVCustomerForm>;
}
export const LUT = ({ setLutFileId, form }: LUTVerifyProps) => {
  return (
    <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <FormField
        control={form.control}
        name="lut_expiry"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-x-1">
              <FormLabel>
                LUT Expiry and Bond Year
                <RequiredField />
              </FormLabel>
              <HelpBadge to="https://shipglobal.in/blogs/kyc-lut-letter-of-undertaking/" text="Need help?" />
            </div>
            <FormControl>
              <Input
                type="text"
                required
                {...field}
                placeholder={`Enter LUT Expiry Year . . .`}
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
      <FileInput name="lut" label="Upload LUT" setFileId={setLutFileId} required />
    </div>
  );
};
