import ErrorMessage from "@/components/elements/ErrorMessage";
import LoadingButton from "@/components/elements/LoadingButton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyIECCSBV } from "@/services/customers";
import HelpBadge from "@/components/elements/HelpBadge";
import { UseFormReturn } from "react-hook-form";
import { CSBVCustomerForm } from "./old/CSBVCustomer";
import FileInput from "@/components/elements/FileInput";
import { RequiredField } from "@/components/elements/SGFormField";
import { Verified } from "@/components/elements/Verified";

export const IECVerify = ({
  setIec,
  form,
  customerId,
}: {
  setIec: Dispatch<SetStateAction<{ fileId: string; verified: boolean }>>;
  form: UseFormReturn<CSBVCustomerForm>;
  customerId: string;
}) => {
  const [iecFormLoading, setIecFormLoading] = useState(false);
  const [iecValidationError, setIecValidationError] = useState({ iec_number: "" });
  const [iecVerificationError, setIecVerificationError] = useState("");
  const [fileId, setFileId] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (fileId === "") {
      setIecVerificationError("");
      // setIecVerified(false);
      setVerified(false);
    }
  }, [fileId]);

  useEffect(() => {
    if (form.watch("iec_number") !== "" || fileId !== "") {
      setIecVerificationError("");
    }
  }, [form.watch("iec_number"), fileId]);

  // const customerId = useStore((state: any) => state.customer_id);

  async function callVerifyIEC(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIecFormLoading(true);
    setIecValidationError({
      iec_number: "",
    });
    setIec((prev) => ({ ...prev, fileId: fileId }));
    setIecVerificationError("");

    const response = await verifyIECCSBV({
      iec_number: form.watch("iec_number"),
      iec_file_id: fileId,
      customer_id: customerId,
    });
    if (response) {
      if (response.status === 200) {
        setVerified(true);
        setIec((prev) => ({ ...prev, verified: true }));
      } else if (response.data.errors.length !== 0) {
        setIecValidationError(response.data.errors);
        console.log("error");
      } else {
        console.log("message");
        setIecVerificationError(response.data.message);
      }
      console.log(response, "verifyPAN");
    }
    setIecFormLoading(false);
  }

  const verifyDisabled = fileId === "" || form.watch("iec_number") === "" || iecVerificationError !== "";

  return (
    <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <div>
        <FormField
          control={form.control}
          name="iec_number"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-x-1">
                <FormLabel>
                  IEC Number
                  <RequiredField />
                </FormLabel>
                <HelpBadge to="https://shipglobal.in/blogs/kyc-iec-import-export-code/" text="Need help?" />
              </div>
              <FormControl>
                <Input
                  type="text"
                  required
                  {...field}
                  placeholder={`Enter IEC Number . . .`}
                  className="h-11"
                  disabled={verified}
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {iecValidationError && <ErrorMessage error={iecValidationError.iec_number} />}
      </div>
      <FileInput
        name="iec"
        label="Upload IEC"
        setFileId={setFileId}
        isDisabled={verified}
        setIsDisabled={setVerified}
        required
      />
      <div className="space-y-4 lg:flex lg:items-end">
        {verified ? (
          <Verified className={fileId ? "mb-6" : ""} />
        ) : (
          <div className="flex flex-col">
            {iecVerificationError && <ErrorMessage error={iecVerificationError} />}
            <LoadingButton
              size="xs"
              loading={iecFormLoading}
              disabled={verifyDisabled}
              variant={verifyDisabled ? "disabled" : "default"}
              className={fileId !== "" ? "mb-6" : ""}
              onClick={callVerifyIEC}
              text="Verify"
            />
          </div>
        )}
      </div>
    </div>
  );
};
