import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dispatch, SetStateAction, useState } from "react";
import { RequiredField } from "@/components/elements/SGFormField";
import HelpBadge from "@/components/elements/HelpBadge";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/elements/ErrorMessage";

interface BankValidationErrorSchema {
  bank_number?: string;
  bank_name?: string;
}

export const BankCustomer = ({
  bankAccNo,
  setBankAccNo,
  bankName,
  setBankName,
}: {
  bankAccNo: string;
  setBankAccNo: Dispatch<SetStateAction<string>>;
  bankName: string;
  setBankName: Dispatch<SetStateAction<string>>;
}) => {
  const [bankValidationError, setBankValidationError] = useState<BankValidationErrorSchema>({});

  function handleBankNameChange(value: string) {
    setBankName(value.toUpperCase());

    if (value.length > 0) {
      setBankValidationError((prev) => ({ ...prev, bank_name: "" }));
    } else {
      setBankValidationError((prev) => ({ ...prev, bank_name: "Bank Name is required" }));
    }
  }

  function handleBankAccNoChange(value: string) {
    const isValidBankAccNo = /^\d{11,17}$/.test(value);

    setBankAccNo(value);

    if (!value) {
      setBankValidationError((prev) => ({ ...prev, bank_number: "Bank Account Number is required" }));
    } else if (value.length < 11) {
      setBankValidationError((prev) => ({ ...prev, bank_number: "Bank Account Number must be at least 11 digits" }));
    } else if (value.length > 17) {
      setBankValidationError((prev) => ({ ...prev, bank_number: "Bank Account Number must be at most 17 digits" }));
    } else if (!/^\d+$/.test(value)) {
      setBankValidationError((prev) => ({ ...prev, bank_number: "Bank Account Number must contain numbers only" }));
    } else {
      setBankValidationError((prev) => ({ ...prev, bank_number: "" }));
    }
  }

  return (
    <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <div className="space-y-1">
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
              placeholder="Enter Bank name . . ."
              name="bank_account_name"
              value={bankName}
              onChange={(e) => handleBankNameChange(e.target.value)}
              className="lg:min-w-72 h-11"
            />
          </FormControl>
          <FormMessage />
          {bankValidationError?.bank_name ? <ErrorMessage error={bankValidationError.bank_name} /> : null}
        </FormItem>
      </div>
      <div className="space-y-1">
        <FormItem>
          <div className="flex items-center gap-x-1">
            <FormLabel>
              Bank Account Number
              <RequiredField />
            </FormLabel>
            <HelpBadge to="#" text="Need help?" />
          </div>
          <FormControl>
            <Input
              type="text"
              placeholder="Enter Bank account number . . ."
              name="bank_account_no"
              value={bankAccNo}
              onChange={(e) => handleBankAccNoChange(e.target.value)}
              className="lg:min-w-72 h-11"
            />
          </FormControl>
          <FormMessage />
          {bankValidationError?.bank_number ? <ErrorMessage error={bankValidationError.bank_number} /> : null}
        </FormItem>
      </div>
    </div>
  );
};
