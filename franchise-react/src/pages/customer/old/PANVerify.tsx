import HelpBadge from "@/components/elements/HelpBadge";
import FileInput from "@/components/elements/FileInput";
import { Verified } from "@/components/elements/Verified";
import ErrorMessage from "@/components/elements/ErrorMessage";
import LoadingButton from "@/components/elements/LoadingButton";
import { RequiredField } from "@/components/elements/SGFormField";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { verifypanCSBV } from "@/services/customers";
import { useParams } from "react-router-dom";
import { PanDetails } from "./old/CSBVCustomer";

interface PANValidationErrorSchema {
  pan_number?: string;
  name_on_pan?: string;
  dob_on_pan?: string;
}

export const PANVerify = ({ pan, setPan }: { setPan: Dispatch<SetStateAction<PanDetails>>; pan: PanDetails }) => {
  const [panFormLoading, setPanFormLoading] = useState(false);
  const [panValidationError, setPanValidationError] = useState<PANValidationErrorSchema>({});
  const [panVerificationError, setPanVerificationError] = useState("");

  const [fileId, setFileId] = useState("");
  const [verified, setVerified] = useState(false);

  const params = useParams();
  const isVerifyDisabled = fileId === "" || pan.number === "" || panVerificationError;

  function handlePanNumberChange(value: string) {
    setPanVerificationError("");
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setPanValidationError((prev) => ({ ...prev, pan_number: "" }));
      setPan((prev) => ({ ...prev, number: value.toUpperCase() }));
    } else {
      setPanValidationError((prev) => ({ ...prev, pan_number: "Only alphanumeric characters are allowed" }));
    }
  }

  useEffect(() => {
    if (fileId !== "") setPan((prev) => ({ ...prev, fileId: fileId }));
    setPanVerificationError("");
    setPan((prev) => ({ ...prev, verified: false }));
  }, [fileId]);

  async function handleVerifyPan(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setPanFormLoading(true);
    setPanValidationError({});
    setPanVerificationError("");
    setPan((prev) => ({ ...prev, fileId: fileId }));
    const response = await verifypanCSBV({
      pan_file_id: fileId,
      pan_number: pan.number,
      dob_on_pan: pan.date,
      name_on_pan: pan.name,
      customer_id: params.consignor_id || "",
    });
    if (response?.status === 200) {
      setVerified(true);
      setPan((prev) => ({ ...prev, verified: true }));
    } else if (response?.data.errors.length !== 0) {
      setPanValidationError(response?.data.errors);
      console.log("error");
    } else {
      console.log("message");
      setPanVerificationError(response.data.message);
    }
    setPanFormLoading(false);
  }

  return (
    <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <FormItem>
        <div className="flex items-center gap-x-1">
          <FormLabel>
            Company PAN Number
            <RequiredField />
          </FormLabel>
          <HelpBadge to="https://shipglobal.in/blogs/kyc-company-pan/" text="Need help?" />
        </div>

        <FormControl className="lg:min-w-72 h-11">
          <Input
            type="text"
            maxLength={10}
            placeholder="Will fetch from GST"
            disabled
            value={pan.number}
            onChange={(e) => {
              handlePanNumberChange(e.target.value);
            }}
          />
        </FormControl>
        <FormMessage />
        {panValidationError?.pan_number && <ErrorMessage error={panValidationError.pan_number} />}
      </FormItem>

      <FileInput
        name="company_pan"
        label="Upload Company PAN"
        setFileId={setFileId}
        isDisabled={pan.verified}
        setIsDisabled={setVerified}
        required
      />
      <div className="mt-4 space-y-4 lg:flex lg:items-end">
        {verified ? (
          <Verified className={fileId ? "mb-6" : ""} />
        ) : (
          <div className="flex flex-col">
            {panVerificationError && <ErrorMessage error={panVerificationError} />}
            <LoadingButton
              size="xs"
              loading={panFormLoading}
              disabled={isVerifyDisabled}
              variant={isVerifyDisabled ? "disabled" : "default"}
              className={isVerifyDisabled ? "mt-6" : ""}
              onClick={handleVerifyPan}
              text="Verify"
            />
          </div>
        )}
      </div>
    </div>
  );
};
