import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FileInputEditable from "@/components/elements/FileInputEditable";
import { RequiredField } from "@/components/elements/SGFormField";
import HelpBadge from "@/components/elements/HelpBadge";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/elements/ErrorMessage";
import { Verified } from "@/components/elements/Verified";
import LoadingButton from "@/components/elements/LoadingButton";
import { verifyIECCSBV } from "@/services/customers";
import { useNavigate, useParams } from "react-router-dom";
interface IecValidationErrorSchema {
  iec_number?: string;
  iec_file_id?: string;
  customer_id?: string;
}
export const IECCustomer = ({
  customerId,
  iecNo,
  setIecNo,
  iecFileId,
  setIecFileId,
  iecVerified,
  setIecVerified,
  iecReason,
  setIecReason,
  edit,
}: {
  customerId: string;
  iecNo: string;
  setIecNo: Dispatch<SetStateAction<string>>;
  iecFileId: string;
  setIecFileId: Dispatch<SetStateAction<string>>;
  iecVerified: boolean;
  setIecVerified: Dispatch<SetStateAction<boolean>>;
  iecReason: string;
  setIecReason: Dispatch<SetStateAction<string>>;
  edit?: boolean;
}) => {
  // const [editMode, setEditMode] = useState(edit);

  const [iecFormLoading, setIecFormLoading] = useState(false);
  const [iecVerificationError, setIecVerificationError] = useState("");
  const [iecValidationError, setIecValidationError] = useState<IecValidationErrorSchema>({});

  const isVerifyDisabled =
    iecNo === "" || (edit && iecReason !== undefined ? iecReason !== "" : iecFileId === "") || iecVerificationError;

  // const approvedIec = iecReason === "" || iecReason === null;

  function handleChange(value: string) {
    const isValidIec = value.length > 0;
    setIecNo(value.toUpperCase());
    if (isValidIec) {
      setIecValidationError((prev) => ({ ...prev, iec_number: "" }));
    } else {
      setIecValidationError((prev) => ({ ...prev, iec_number: "Please enter IEC Number" }));
    }
  }

  useEffect(() => {
    setIecVerificationError("");
    if (iecFileId === "") {
      setIecValidationError({});
      setIecVerified(false);
    }
  }, [iecFileId]);
  const { consignor_id } = useParams();
  const navigate = useNavigate();
  async function callVerifyIec(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIecFormLoading(true);
    setIecValidationError({});
    setIecVerificationError("");
    // setIecFileId(iecFileId);
    // setIecNo(iecNo);

    const response = await verifyIECCSBV({
      iec_number: iecNo,
      iec_file_id: iecFileId,
      customer_id: customerId,
    });
    if (response?.status === 200) {
      setIecVerified(true);
      navigate(`/add-csbv-details/${consignor_id}?edit=1`);
    } else if (response?.data.errors.length !== 0) {
      setIecValidationError(response?.data.errors);
      console.log("error");
    } else {
      setIecVerificationError(response.data.message);
    }
    setIecFormLoading(false);
  }

  return (
    <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <div className="space-y-1">
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
              placeholder={`Enter IEC Number . . .`}
              name="iec_number"
              value={iecNo}
              disabled={iecVerified}
              onChange={(e) => {
                handleChange(e.target.value);
                setIecVerificationError("");
                setIecValidationError({
                  iec_number: "",
                  customer_id: "",
                });
              }}
              // onFocus={() => setEditMode(false)}
              className={`${
                edit ? (iecVerified ? "border border-green-800" : "border border-red") : ""
              }  lg:min-w-72 h-11`}
            />
          </FormControl>
          <FormMessage />
          {iecValidationError?.iec_number ? <ErrorMessage error={iecValidationError.iec_number} /> : null}
        </FormItem>
      </div>
      <div>
        <FileInputEditable
          name="iec"
          label="Upload IEC"
          fileId={iecFileId}
          setFileId={setIecFileId}
          required
          status={iecVerified ? "approved" : "rejected"}
          reason={iecReason}
          setReason={setIecReason}
          setDocumentVerified={setIecVerified}
          customer={true}
        />
        {iecValidationError?.iec_file_id && <ErrorMessage error={iecValidationError.iec_file_id} />}
      </div>
      <div className="space-x-4 space-y-4 lg:flex lg:items-end">
        <div>
          {iecVerificationError ? <ErrorMessage error={iecVerificationError} /> : null}
          {iecVerified ? (
            <Verified className={iecFileId ? "mb-6" : ""} />
          ) : (
            <div className="flex flex-col">
              <LoadingButton
                size="xs"
                loading={iecFormLoading}
                disabled={isVerifyDisabled}
                className={iecFileId !== "" ? "mb-6" : ""}
                onClick={callVerifyIec}
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
