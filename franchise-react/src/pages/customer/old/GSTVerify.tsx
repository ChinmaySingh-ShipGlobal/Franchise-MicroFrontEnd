import HelpBadge from "@/components/elements/HelpBadge";
import FileInput from "@/components/elements/FileInput";
import { Verified } from "@/components/elements/Verified";
import ErrorMessage from "@/components/elements/ErrorMessage";
import LoadingButton from "@/components/elements/LoadingButton";
import { RequiredField } from "@/components/elements/SGFormField";

import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { verifyGSTCSBV } from "@/services/customers";
import { PanDetails } from "./old/CSBVCustomer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface GSTValidationErrorSchema {
  gst_number?: string;
  customer_id?: string;
}

export const GSTVerify = ({
  setGst,
  setPan,
  customerId,
}: {
  setGst: Dispatch<SetStateAction<{ fileId: string; number: string }>>;
  setPan: Dispatch<SetStateAction<PanDetails>>;
  customerId: string;
}) => {
  //gst verification ------------------------------
  const [number, setNumber] = useState("");
  const [fileId, setFileId] = useState("");
  const [gstVerified, setGstVerified] = useState(false);
  const [gstFormLoading, setGstFormLoading] = useState(false);
  const [gstVerificationError, setGstVerificationError] = useState("");
  const [gstValidationError, setGstValidationError] = useState<GSTValidationErrorSchema>({});

  const isVerifyDisabled = !fileId || !number || gstVerificationError;

  function handleChange(value: string) {
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setGstValidationError((prev) => ({ ...prev, gst_number: "" }));
      setNumber(value.toUpperCase());
    } else {
      setGstValidationError((prev) => ({ ...prev, gst_number: "Only alphanumeric characters are allowed" }));
    }
  }

  useEffect(() => {
    if (fileId === "") {
      setGstValidationError({});
      setGstVerificationError("");
      setGstVerified(false);
    }
  }, [fileId]);

  async function callVerifyGST(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setGstFormLoading(true);
    setGstValidationError({});
    setGstVerificationError("");
    setGst((prev) => ({ ...prev, fileId: fileId, number: number }));

    const response = await verifyGSTCSBV({ gst_file_id: fileId, gst_number: number, customer_id: customerId });
    if (response?.status === 200) {
      setGstVerified(true);
      setPan((prev) => ({
        ...prev,
        number: response.data.data.pan_number,
        name: response.data.data.name_on_card,
        date: response.data.data.date_of_registration,
      }));
    } else if (response?.data.errors.length !== 0) {
      setGstValidationError(response?.data.errors);
      console.log("error");
    } else {
      setGstVerificationError(response.data.message);
    }
    setGstFormLoading(false);
  }

  return (
    <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <div className="space-y-1">
        <FormItem>
          <div className="flex items-center gap-x-1">
            <FormLabel>
              GST Number
              <RequiredField />
            </FormLabel>
            <HelpBadge to="https://shipglobal.in/blogs/kyc-gst-document/" text="Need help?" />
          </div>
          <FormControl>
            <Input
              type="text"
              placeholder={`Enter GST Number . . .`}
              name="gst_number"
              value={number}
              disabled={gstVerified}
              maxLength={15}
              onChange={(e) => {
                handleChange(e.target.value);
                setGstVerificationError("");
                setGstValidationError({
                  gst_number: "",
                  customer_id: "",
                });
              }}
              className="lg:min-w-72 h-11"
            />
          </FormControl>
          <FormMessage />
          {gstValidationError?.gst_number ? <ErrorMessage error={gstValidationError.gst_number} /> : null}
        </FormItem>
      </div>
      <FileInput
        name="gst"
        label="Upload GST"
        setFileId={setFileId}
        isDisabled={gstVerified}
        setIsDisabled={setGstVerified}
        required
      />
      <div className="space-x-4 space-y-4 lg:flex lg:items-end">
        <div>
          {gstVerificationError ? <ErrorMessage error={gstVerificationError} /> : null}
          {gstVerified ? (
            <Verified className={fileId ? "mb-6" : ""} />
          ) : (
            <div className="flex flex-col">
              <LoadingButton
                size="xs"
                loading={gstFormLoading}
                disabled={isVerifyDisabled}
                className={fileId !== "" ? "mb-6" : ""}
                onClick={callVerifyGST}
                text="Verify"
                variant={isVerifyDisabled ? "disabled" : "default"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
