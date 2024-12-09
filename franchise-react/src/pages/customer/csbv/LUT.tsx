import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FileInputEditable from "@/components/elements/FileInputEditable";
import { RequiredField } from "@/components/elements/SGFormField";
import HelpBadge from "@/components/elements/HelpBadge";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/elements/ErrorMessage";

export const LUTCustomer = ({
  lutNo,
  setLutNo,
  lutFileId,
  setLutFileId,
  lutReason,
  setLutReason,
  edit,
}: {
  lutNo: string;
  setLutNo: Dispatch<SetStateAction<string>>;
  lutFileId: string;
  setLutFileId: Dispatch<SetStateAction<string>>;
  lutReason: string;
  setLutReason: Dispatch<SetStateAction<string>>;
  edit?: boolean;
}) => {
  // const [editMode, setEditMode] = useState(edit);
  const [lutValidationError, setLutValidationError] = useState("");

  // const approvedLut = lutReason === "" || lutReason === null;

  function handleChange(value: string) {
    setLutNo(value);

    // Set validation error if the value is not exactly 4 digits or is empty
    if (value === "" || /^\d{4}$/.test(value)) {
      setLutValidationError("");
    } else {
      setLutValidationError("LUT Expiry must be 4 digits");
    }
  }

  useEffect(() => {
    if (lutFileId === "") {
      setLutValidationError("");
    }
  }, [lutFileId]);

  return (
    <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <div className="space-y-1">
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
              placeholder="Enter LUT Expiry Year . . ."
              name="lut_code"
              value={lutNo}
              onChange={(e) => handleChange(e.target.value)}
              // onFocus={() => setEditMode(false)}
              className={`${
                edit ? (lutReason === null || lutReason === "" ? "border border-green-800" : "border border-red") : ""
              }  lg:min-w-72 h-11`}
            />
          </FormControl>
          <FormMessage />
          {lutValidationError ? <ErrorMessage error={lutValidationError} /> : null}
        </FormItem>
      </div>
      <FileInputEditable
        name="lut"
        label="Upload LUT"
        fileId={lutFileId}
        setFileId={setLutFileId}
        required
        status={lutReason === null || lutReason === "" ? "approved" : "rejected"}
        reason={lutReason}
        setReason={setLutReason}
        customer={true}
      />
    </div>
  );
};
