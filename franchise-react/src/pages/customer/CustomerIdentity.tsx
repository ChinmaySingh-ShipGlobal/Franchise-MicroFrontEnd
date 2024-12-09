import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/elements/ErrorMessage";
import HelpBadge from "@/components/elements/HelpBadge";
import { getDocumentProperties } from "../kyc/AddressVerification";
import FileInputEditable from "@/components/elements/FileInputEditable";

export interface DocumentState {
  docFrontId: string;
  docBackId: string;
  docNumber: string;
}

export const CustomerIdentity = ({
  document,
  setDocumentState,
  disabled,
  setCustomerVerified,
}: {
  document: string;
  setDocumentState: Dispatch<SetStateAction<DocumentState>>;
  disabled?: boolean;
  className?: string;
  setCustomerVerified?: Dispatch<SetStateAction<boolean>>;
}) => {
  const properties = getDocumentProperties(document);
  const [documentNumber, setDocumentNo] = useState("");
  const [documentFrontId, setDocumentFrontId] = useState("");
  const [documentBackId, setDocumentBackId] = useState("");

  const [documentVerificationError, setDocumentVerificationError] = useState("");

  function handleChange(value: string) {
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setDocumentVerificationError("");
      setDocumentNo(value.toUpperCase());
      setDocumentState?.((prevState) => ({ ...prevState, docNumber: value }));
    } else {
      setDocumentVerificationError("Only alphanumeric characters are allowed");
    }
  }

  useEffect(() => {
    if (documentFrontId === "" || documentBackId === "") {
      setDocumentVerificationError("");
      setCustomerVerified?.(false);
    } else {
      setDocumentState((prev) => ({ ...prev, docFrontId: documentFrontId, docBackId: documentBackId }));
    }
  }, [documentFrontId, documentBackId]);

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center">
          <Label>{properties.label}</Label>
          <HelpBadge to={properties.blog_link} className={"ml-1"} text="Need help?" />
        </div>
        <Input
          type="text"
          placeholder={`Enter ${properties.label} . . .`}
          value={documentNumber}
          disabled={disabled}
          maxLength={15}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          className="h-10"
        />
        {documentVerificationError ? <ErrorMessage error={documentVerificationError} /> : null}
      </div>
      <div></div>
      <FileInputEditable
        name={properties.doc_front_key}
        label={properties.doc_front_label}
        setFileId={setDocumentFrontId}
        fileId={documentFrontId}
        customer
      />
      <div className="space-4 lg:space-y-0 lg:flex">
        <div>
          <FileInputEditable
            name={properties.doc_back_key}
            label={properties.doc_back_label}
            setFileId={setDocumentBackId}
            fileId={documentBackId}
            customer
          />
        </div>
      </div>
    </>
  );
};
