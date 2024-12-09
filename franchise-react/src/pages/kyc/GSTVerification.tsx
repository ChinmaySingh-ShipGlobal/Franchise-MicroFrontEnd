import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import ErrorMessage from "@/components/elements/ErrorMessage";
import LoadingButton from "@/components/elements/LoadingButton";
import FileInputEditable from "@/components/elements/FileInputEditable";
import HelpBadge from "@/components/elements/HelpBadge";

import { verifyGST } from "@/services/kyc";
import { Verified } from "@/components/elements/Verified";
import { autoFillAddressInBillingDetails } from "./AddressVerification";
import { useNavigate } from "react-router-dom";

interface GSTValidationErrorSchema {
  gst_number?: string;
  gst_file_id?: string;
}

interface GSTVerificationProps {
  gstFileId: string;
  setGstFileId: Dispatch<SetStateAction<string>>;
  gstNumber: string;
  setGstNumber: Dispatch<SetStateAction<string>>;
  form: any;
  setDateOnCompanyPan: Dispatch<SetStateAction<string>>;
  setNameOnCompanyPan: Dispatch<SetStateAction<string>>;
  setPanNo: Dispatch<SetStateAction<string>>;
  gstVerified: boolean;
  setGstVerified: Dispatch<SetStateAction<boolean>>;
  reason?: string;
  setReason?: Dispatch<SetStateAction<string>>;
  edit?: boolean;
}

export const GSTVerification = ({
  gstFileId,
  setGstFileId,
  gstNumber,
  setGstNumber,
  form,
  setDateOnCompanyPan,
  setNameOnCompanyPan,
  setPanNo,
  gstVerified,
  setGstVerified,
  reason,
  setReason,
  edit,
}: GSTVerificationProps) => {
  //gst verification ------------------------------
  // const [editMode, setEditMode] = useState(edit);
  const [gstFormLoading, setGstFormLoading] = useState(false);
  const [gstValidationError, setGstValidationError] = useState<GSTValidationErrorSchema>({});
  const [gstVerificationError, setGstVerificationError] = useState("");
  const navigate = useNavigate();
  //This regular expression (/^[a-zA-Z0-9]*$/) is used to match strings
  //that consist solely of alphanumeric characters (both uppercase and
  //lowercase letters, and digits) and can also be an empty string.
  function handleChange(value: string) {
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setGstValidationError((prev) => ({ ...prev, gst_number: "" }));
      setGstNumber(value.toUpperCase());
    } else {
      setGstValidationError((prev) => ({ ...prev, gst_number: "Only alphanumeric characters are allowed" }));
    }
  }
  //clear errors when file uploaded  is changed
  useEffect(() => {
    setGstVerificationError("");
    if (gstFileId === "") {
      setGstValidationError({});
      setGstVerified(false);
    }
  }, [gstFileId]);

  const buttonDisabledCondition =
    edit && reason !== undefined
      ? reason !== "" || gstNumber === "" || gstVerificationError !== ""
      : gstFileId === "" || gstNumber === "" || gstVerificationError !== "";

  // this is being used to show the border color of the document number input field for error and success cases
  // const approvedGst = reason === "" || reason === null;

  async function callVerifyGST(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setGstFormLoading(true);
    setGstValidationError({
      gst_number: "",
      gst_file_id: "",
    });
    setGstVerificationError("");

    const response = await verifyGST({ gst_file_id: gstFileId, gst_number: gstNumber });
    if (response) {
      if (response.status === 200) {
        setGstVerified(true);
        const { name_on_card, address, district, state, pincode, state_id } = response.data.data;
        autoFillAddressInBillingDetails(form, name_on_card, address, district, state, pincode, state_id);
        setDateOnCompanyPan(response.data.data.date_of_registration);
        setNameOnCompanyPan(response.data.data.name_on_card);
        setPanNo(response.data.data.pan_number);
        navigate("/kyc?edit=1");
      } else if (response.data.errors.length !== 0) {
        setGstValidationError(response.data.errors);
      } else {
        setGstVerificationError(response.data.message);
      }
    }
    setGstFormLoading(false);
  }

  return (
    <div className="grid gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <div className="space-y-1">
        <div className="flex items-center gap-x-1">
          <Label>GST Number</Label>
          <HelpBadge to="https://shipglobal.in/blogs/kyc-gst-document/" text="Need help?" />
        </div>
        <Input
          type="text"
          placeholder={`Enter GST Number . . .`}
          value={gstNumber}
          disabled={gstVerified}
          maxLength={15}
          onChange={(e) => {
            handleChange(e.target.value);
            setGstVerificationError("");
            setGstValidationError({
              gst_number: "",
              gst_file_id: "",
            });
          }}
          // onFocus={() => setEditMode(false)}
          className={`${edit ? (gstVerified ? "border border-green-800" : "border border-red") : ""}  lg:min-w-72 h-11`}
        />
        {gstValidationError?.gst_number ? <ErrorMessage error={gstValidationError.gst_number} /> : null}
      </div>
      <div>
        <FileInputEditable
          name="gst"
          label="Upload GST"
          fileId={gstFileId}
          setFileId={setGstFileId}
          status={gstVerified ? "approved" : "rejected"}
          reason={reason}
          setReason={setReason}
          setDocumentVerified={setGstVerified}
          required
        />
        {gstValidationError?.gst_file_id && <ErrorMessage error={gstValidationError.gst_file_id} />}
      </div>
      <div className="space-x-4 space-y-4 lg:flex lg:items-end">
        {gstVerified ? (
          <Verified className={gstFileId ? "mb-6" : ""} />
        ) : (
          <div className="flex flex-col">
            {gstVerificationError && <ErrorMessage error={gstVerificationError} />}
            <LoadingButton
              size="xs"
              variant={buttonDisabledCondition ? "disabled" : "default"}
              loading={gstFormLoading}
              disabled={buttonDisabledCondition}
              className={`font-normal ${gstFileId !== "" && "mb-6"}`}
              onClick={callVerifyGST}
              text="Verify"
            />
          </div>
        )}
      </div>
    </div>
  );
};
