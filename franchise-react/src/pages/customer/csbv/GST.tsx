import HelpBadge from "@/components/elements/HelpBadge";
import { Verified } from "@/components/elements/Verified";
import ErrorMessage from "@/components/elements/ErrorMessage";
import LoadingButton from "@/components/elements/LoadingButton";
import { RequiredField } from "@/components/elements/SGFormField";

import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { verifyGSTCSBV } from "@/services/customers";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FileInputEditable from "@/components/elements/FileInputEditable";
import { autoFillAddressInBillingDetails } from "@/pages/kyc/AddressVerification";
import { useNavigate } from "react-router-dom";

interface GSTValidationErrorSchema {
  gst_number?: string;
  gst_file_id?: string;
  customer_id?: string;
}

export const GSTCustomer = ({
  customerId,
  gstNumber,
  setGstNumber,
  gstFileId,
  setGstFileId,
  gstVerified,
  setGstVerified,
  gstReason,
  setGstReason,
  setPanNo,
  edit,
  setNameOnPan,
  setDobOnPan,
  form,
}: {
  customerId: string;
  gstNumber: string;
  setGstNumber: Dispatch<SetStateAction<string>>;
  gstFileId: string;
  setGstFileId: Dispatch<SetStateAction<string>>;
  gstVerified: boolean;
  setGstVerified: Dispatch<SetStateAction<boolean>>;
  gstReason: string;
  setGstReason: Dispatch<SetStateAction<string>>;
  setPanNo: Dispatch<SetStateAction<string>>;
  edit?: boolean;
  setNameOnPan: Dispatch<SetStateAction<string>>;
  setDobOnPan: Dispatch<SetStateAction<string>>;
  form: any;
}) => {
  // const [editMode, setEditMode] = useState(edit);

  const [gstFormLoading, setGstFormLoading] = useState(false);
  const [gstVerificationError, setGstVerificationError] = useState("");
  const [gstValidationError, setGstValidationError] = useState<GSTValidationErrorSchema>({});
  const navigate = useNavigate();
  const isVerifyDisabled =
    gstNumber === "" ||
    (edit && gstReason !== undefined ? gstReason !== "" : gstFileId === "") ||
    gstVerificationError !== "";

  // const approvedGst = gstReason === "" || gstReason === null;

  function handleChange(value: string) {
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      if (value.length <= 15) {
        setGstValidationError((prev) => ({ ...prev, gst_number: "" }));
        setGstNumber(value.toUpperCase());
      }
      if (value.length < 15) {
        setGstValidationError((prev) => ({
          ...prev,
          gst_number: "GST Number must be exactly 15 alphanumeric characters",
        }));
      }
    } else {
      setGstValidationError((prev) => ({ ...prev, gst_number: "Only alphanumeric characters are allowed" }));
    }
  }
  useEffect(() => {
    setGstVerificationError("");
    if (gstFileId === "") {
      setGstValidationError({});
      setGstVerified(false);
    }
  }, [gstFileId]);

  async function callVerifyGST(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setGstFormLoading(true);
    setGstValidationError({});
    setGstVerificationError("");
    // setGstFileId(gstFileId);
    // setGstNumber(gstNumber);
    const response = await verifyGSTCSBV({ gst_file_id: gstFileId, gst_number: gstNumber, customer_id: customerId });
    if (response?.status === 200) {
      setGstVerified(true);
      navigate(`/add-csbv-details/${customerId}?edit=1`);
      setPanNo(response.data.data.pan_number);
      setNameOnPan(response.data.data.name_on_card);
      setDobOnPan(response.data.data.date_of_registration);
      const { name_on_card, address, district, state, pincode, state_id } = response.data.data;
      autoFillAddressInBillingDetails(form, name_on_card, address, district, state, pincode, state_id);
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
              value={gstNumber}
              disabled={gstVerified || gstFormLoading}
              maxLength={15}
              onChange={(e) => {
                handleChange(e.target.value);
                setGstVerificationError("");
                setGstValidationError({
                  gst_number: "",
                  customer_id: "",
                });
              }}
              // onFocus={() => setEditMode(false)}
              className={`${
                edit ? (gstVerified ? "border border-green-800" : "border border-red") : ""
              }  lg:min-w-72 h-11`}
            />
          </FormControl>
          <FormMessage />
          {gstValidationError?.gst_number ? <ErrorMessage error={gstValidationError.gst_number} /> : null}
        </FormItem>
      </div>
      <div>
        <FileInputEditable
          name="gst"
          label="Upload GST"
          fileId={gstFileId}
          required
          setFileId={setGstFileId}
          status={gstVerified ? "approved" : "rejected"}
          reason={gstReason}
          setReason={setGstReason}
          setDocumentVerified={setGstVerified}
          customer={true}
        />
        {gstValidationError?.gst_file_id && <ErrorMessage error={gstValidationError.gst_file_id} />}
      </div>
      <div className="space-x-4 space-y-4 lg:flex lg:items-end">
        <div>
          {gstVerificationError ? <ErrorMessage error={gstVerificationError} /> : null}
          {gstVerified ? (
            <Verified className={gstFileId ? "mb-6" : ""} />
          ) : (
            <div className="flex flex-col">
              <LoadingButton
                size="xs"
                loading={gstFormLoading}
                disabled={isVerifyDisabled}
                className={gstFileId !== "" ? "mb-6" : ""}
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
