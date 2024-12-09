import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FileInputEditable from "@/components/elements/FileInputEditable";
import { RequiredField } from "@/components/elements/SGFormField";
import HelpBadge from "@/components/elements/HelpBadge";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/elements/ErrorMessage";

interface AdValidationErrorSchema {
  ad_number?: string;
}

export const ADCodeCustomer = ({
  adNo,
  setAdNo,
  adFileId,
  setAdFileId,
  adReason,
  setAdReason,
  edit,
}: {
  adNo: string;
  setAdNo: Dispatch<SetStateAction<string>>;
  adFileId: string;
  setAdFileId: Dispatch<SetStateAction<string>>;
  adReason: string;
  setAdReason: Dispatch<SetStateAction<string>>;
  edit?: boolean;
}) => {
  // const [editMode, setEditMode] = useState(edit);
  const [adValidationError, setAdValidationError] = useState<AdValidationErrorSchema>({});

  function handleChange(value: string) {
    const isValidAdCode = value.length > 0 && value.length <= 14;
    setAdNo(value.toUpperCase());

    if (isValidAdCode) {
      setAdValidationError((prev) => ({ ...prev, ad_number: "" }));
    } else {
      setAdValidationError((prev) => ({
        ...prev,
        ad_number: "Please enter valid AD Code with maximum length 14 characters",
      }));
    }
  }

  useEffect(() => {
    if (adFileId === "") {
      setAdValidationError({});
    }
  }, [adFileId]);

  return (
    <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <div className="space-y-1">
        <FormItem>
          <div className="flex items-center gap-x-1">
            <FormLabel>
              Ad Code
              <RequiredField />
            </FormLabel>
            <HelpBadge to="https://shipglobal.in/blogs/kyc-ad-code/" text="Need help?" />
          </div>
          <FormControl>
            <Input
              type="text"
              placeholder="Enter AD Code . . ."
              name="ad_code"
              value={adNo}
              onChange={(e) => handleChange(e.target.value)}
              // onFocus={() => setEditMode(false)}
              className={`${
                edit ? (adReason === null || adReason === "" ? "border border-green-800" : "border border-red") : ""
              }  lg:min-w-72 h-11`}
            />
          </FormControl>
          <FormMessage />
          {adValidationError?.ad_number ? <ErrorMessage error={adValidationError.ad_number} /> : null}
        </FormItem>
      </div>
      <FileInputEditable
        name="ad_code"
        label="Upload AD"
        required
        fileId={adFileId}
        setFileId={setAdFileId}
        status={adReason === null || adReason === "" ? "approved" : "rejected"}
        reason={adReason}
        setReason={setAdReason}
        customer={true}
      />
    </div>
  );
};
