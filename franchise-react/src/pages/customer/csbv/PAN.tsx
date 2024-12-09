//pan verification component

import { verifypanCSBV } from "@/services/customers";

import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FileInputEditable from "@/components/elements/FileInputEditable";
import { RequiredField } from "@/components/elements/SGFormField";
import HelpBadge from "@/components/elements/HelpBadge";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/elements/ErrorMessage";
import { Verified } from "@/components/elements/Verified";
import LoadingButton from "@/components/elements/LoadingButton";
import { useNavigate, useParams } from "react-router-dom";
interface PANValidationErrorSchema {
  pan_number?: string;
  pan_file_id?: string;
  name_on_pan?: string;
  dob_on_pan?: string;
}

export const PANCustomer = ({
  panNo,
  setPanNo,
  panFileId,
  setPanFileId,
  panVerified,
  setPanVerified,
  edit,
  customer_id,
  panReason,
  setPanReason,
  nameOnPan,
  dobOnPan,
  gstVerified,
}: {
  panNo: string;
  setPanNo: Dispatch<SetStateAction<string>>;
  panFileId: string;
  setPanFileId: Dispatch<SetStateAction<string>>;
  panVerified: boolean;
  setPanVerified: Dispatch<SetStateAction<boolean>>;
  edit?: boolean;
  customer_id: string;
  panReason: string;
  setPanReason: Dispatch<SetStateAction<string>>;
  nameOnPan: string;
  dobOnPan: string;
  gstVerified: boolean;
}) => {
  const [panFormLoading, setPanFormLoading] = useState(false);
  const [panValidationError, setPanValidationError] = useState<PANValidationErrorSchema>({});
  const [panVerificationError, setPanVerificationError] = useState("");

  const isVerifyDisabled =
    (edit && panReason !== undefined ? panReason !== "" : panFileId === "") ||
    panNo === "" ||
    panVerificationError !== "";

  // const approvedPan = panReason === "" || panReason === null;
  // const [editMode, setEditMode] = useState(edit);

  function handlePanNumberChange(value: string) {
    setPanVerificationError("");
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setPanValidationError((prev) => ({ ...prev, pan_number: "" }));
      setPanNo(value);
    } else {
      setPanValidationError((prev) => ({ ...prev, pan_number: "Only alphanumeric characters are allowed" }));
    }
  }

  useEffect(() => {
    setPanVerificationError("");
    if (panFileId == "") {
      setPanValidationError({});
      setPanVerified(false);
    }
  }, [panFileId]);
  const { consignor_id } = useParams();
  const navigate = useNavigate();

  async function handleVerifyPan(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setPanFormLoading(true);
    setPanValidationError({});
    setPanVerificationError("");
    // setPanFileId(panFileId);
    const response = await verifypanCSBV({
      pan_file_id: panFileId,
      pan_number: panNo,
      customer_id: customer_id,
      name_on_pan: nameOnPan,
      dob_on_pan: dobOnPan,
    });
    if (response?.status === 200) {
      setPanVerified(true);
      navigate(`/add-csbv-details/${consignor_id}?edit=1`);
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
            value={panNo}
            onChange={(e) => {
              handlePanNumberChange(e.target.value);
            }}
            // onFocus={() => setEditMode(false)}
            className={`${
              edit ? (panVerified ? "border border-green-800" : "border border-red") : ""
            }  lg:min-w-72 h-11`}
          />
        </FormControl>
        <FormMessage />
        {panValidationError?.pan_number && <ErrorMessage error={panValidationError.pan_number} />}
      </FormItem>
      <div>
        <FileInputEditable
          name="company_pan"
          label="Upload Company PAN"
          fileId={panFileId}
          required
          setFileId={setPanFileId}
          status={panVerified ? "approved" : "rejected"}
          reason={panReason}
          setReason={setPanReason}
          setDocumentVerified={setPanVerified}
          customer={true}
        />
        {panValidationError?.pan_file_id && <ErrorMessage error={panValidationError.pan_file_id} />}
      </div>
      <div className="mt-4 space-y-4 lg:flex lg:items-end">
        {panVerified ? (
          <Verified className={panFileId ? "mb-6" : ""} />
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
