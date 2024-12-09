import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import FileInputEditable from "@/components/elements/FileInputEditable";
import HelpBadge from "@/components/elements/HelpBadge";
import ErrorMessage from "@/components/elements/ErrorMessage";
import LoadingButton from "@/components/elements/LoadingButton";

import { Verified } from "@/components/elements/Verified";
import { verifyAadhar, verifyDrivingLicense, verifyPassport, verifyVoterId } from "@/services/kyc";
import { useNavigate } from "react-router-dom";

//TODO: Move to utils later
export const getDocumentProperties = (document: string) => {
  switch (document) {
    case "dl":
      return {
        key: document,
        label: "Driving License Number",
        doc_front_label: "Driving License Front",
        doc_back_label: "Driving License Back",
        doc_front_key: "dl_front",
        doc_back_key: "dl_back",
        blog_link: "https://shipglobal.in/blogs/kyc-driving-license/",
      };
    case "voter_id":
      return {
        key: document,
        label: "Voter ID Number",
        doc_front_label: "Voter ID Front",
        doc_back_label: "Voter ID Back",
        doc_front_key: "voter_id_front",
        doc_back_key: "voter_id_back",
        blog_link: "https://shipglobal.in/blogs/kyc-voter-id-card/",
      };
    case "passport":
      return {
        key: document,
        label: "Passport Number",
        doc_front_label: "Passport Front",
        doc_back_label: "Passport Back",
        doc_front_key: "passport_front",
        doc_back_key: "passport_back",
        blog_link: "https://shipglobal.in/blogs/kyc-passport/",
      };
    default:
      return {
        key: document,
        label: "Aadhar Number",
        doc_front_label: "Aadhar Front",
        doc_back_label: "Aadhar Back",
        doc_front_key: "aadhar_front",
        doc_back_key: "aadhar_back",
        blog_link: "https://shipglobal.in/blogs/kyc-aadhar-card/",
      };
  }
};

// autofill billing details that are fetched from address proof document
export function autoFillAddressInBillingDetails(
  form: any,
  name: string,
  address: string,
  district: string,
  state: string,
  pincode: string,
  state_id?: string,
) {
  //set billing address from document
  const names = name.split(" "); // split name into first and last name
  form.setValue("firstName", names[0]);
  form.setValue("lastName", names.slice(1).join(" "));
  form.setValue("address", address);
  form.setValue("city", district);
  form.setValue("state", state);
  form.setValue("pincode", pincode);
  form.setValue("country", "India");
  state_id && form.setValue("state_id", state_id);
}

interface AddressVerificationFormProps {
  form: any;
  documentVerified: boolean;
  setDocumentVerified: Dispatch<SetStateAction<boolean>>;
  className?: string;
  docNo: string;
  setDocNo: Dispatch<SetStateAction<string>>;
  docFrontId: string;
  setDocFrontId: Dispatch<SetStateAction<string>>;
  docBackId: string;
  setDocBackId: Dispatch<SetStateAction<string>>;
  docFrontReason?: string;
  docBackReason?: string;
  setDocFrontReason?: Dispatch<SetStateAction<string>>;
  setDocBackReason?: Dispatch<SetStateAction<string>>;
  edit?: boolean;
}

interface AddressVerificationErrors {
  aadhar_front_file_id?: string;
  aadhar_back_file_id?: string;
  voter_id_front_file_id?: string;
  voter_id_back_file_id?: string;
  dl_front_file_id?: string;
  dl_back_file_id?: string;
  passport_front_file_id?: string;
  passport_back_file_id?: string;
}

const initialAddressVerificationErrors: AddressVerificationErrors = {
  aadhar_front_file_id: "",
  aadhar_back_file_id: "",
  voter_id_front_file_id: "",
  voter_id_back_file_id: "",
  dl_front_file_id: "",
  dl_back_file_id: "",
  passport_front_file_id: "",
  passport_back_file_id: "",
};

export const AddressVerificationForm = ({
  form,
  documentVerified,
  setDocumentVerified,
  className,
  docNo,
  setDocNo,
  docFrontId,
  setDocFrontId,
  docBackId,
  setDocBackId,
  docFrontReason,
  docBackReason,
  setDocBackReason,
  setDocFrontReason,
  edit,
}: AddressVerificationFormProps) => {
  const document = form.watch("documentType");
  const properties = getDocumentProperties(document);
  const navigate = useNavigate();
  //TODO Streamline error handling
  const [loading, setLoading] = useState(false);
  const [documentValidationError, setDocumentValidationError] = useState("");
  const [documentVerificationError, setDocumentVerificationError] = useState("");
  const [verificationErrors, setVerificationErrors] = useState<AddressVerificationErrors>(
    initialAddressVerificationErrors,
  );

  //This regular expression (/^[a-zA-Z0-9]*$/) is used to match strings
  //that consist solely of alphanumeric characters (both uppercase and
  //lowercase letters, and digits) and can also be an empty string.
  function handleChange(value: string) {
    setDocumentValidationError("");
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setDocumentVerificationError("");
      setDocNo(value.toUpperCase());
    } else {
      setDocumentVerificationError("Only alphanumeric characters are allowed");
    }
  }

  //when document is changed using documentType dropdown, clear the document number and file inputs
  useEffect(() => {
    setDocNo("");
    setDocBackId("");
    setDocFrontId("");
  }, [document]);

  //clear errors when file uploaded  is changed
  useEffect(() => {
    setDocumentVerificationError("");
    if (docFrontId === "" || docBackId === "") {
      setDocumentValidationError("");
      setDocumentVerified(false);
    }
  }, [docFrontId, docBackId]);

  async function verifyDocument(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);
    setDocumentValidationError("");
    setDocumentVerificationError("");
    setVerificationErrors({});

    // aadhar verification api
    if (document === "aadhar") {
      const response = await verifyAadhar({
        aadhar_number: docNo.trim(),
        aadhar_front_file_id: docFrontId,
        aadhar_back_file_id: docBackId,
      });
      if (response) {
        if (response.status === 200) {
          setDocumentVerified(true);
          const { name_on_card, address, district, state, pincode, state_id } = response.data.data;
          autoFillAddressInBillingDetails(form, name_on_card, address, district, state, pincode, state_id);
          navigate("/kyc?edit=1");
        } else if (response.data.errors.length !== 0) {
          setVerificationErrors(response.data.errors);
          setDocumentVerificationError(response.data.errors.aadhar_number);
        } else {
          setDocumentValidationError(response.data.message);
        }
      }
    }
    // voter id verification api
    if (document === "voter_id") {
      const response = await verifyVoterId({
        voter_id: docNo.trim(),
        voter_id_front_file_id: docFrontId,
        voter_id_back_file_id: docBackId,
      });
      if (response) {
        if (response.status === 200) {
          setDocumentVerified(true);
          const { name_on_card, address, district, state, pincode } = response.data.data;
          autoFillAddressInBillingDetails(form, name_on_card, address, district, state, pincode);
          navigate("/kyc?edit=1");
        } else if (response.data.errors.length !== 0) {
          setVerificationErrors(response.data.errors);
          setDocumentVerificationError(response.data.errors.voter_id);
        } else {
          setDocumentValidationError(response.data.message);
        }
      }
    }
    // driving license verification api
    if (document === "dl") {
      const response = await verifyDrivingLicense({
        dl_number: docNo.trim(),
        dl_front_file_id: docFrontId,
        dl_back_file_id: docBackId,
      });
      if (response) {
        if (response.status === 200) {
          setDocumentVerified(true);
          const { name_on_card, address, district, state, pincode } = response.data.data;
          autoFillAddressInBillingDetails(form, name_on_card, address, district, state, pincode);
        } else if (response.data.errors.length !== 0) {
          setVerificationErrors(response.data.errors);
          setDocumentVerificationError(response.data.errors.dl_number); //key to be changed after we receive update validation on dl_number
        } else {
          setDocumentValidationError(response.data.message);
        }
      }
    }
    // passport verification api
    if (document === "passport") {
      const response = await verifyPassport({
        passport_number: docNo.trim(),
        passport_front_file_id: docFrontId,
        passport_back_file_id: docBackId,
      });
      if (response) {
        if (response.status === 200) {
          setDocumentVerified(true);
          const { name_on_card, address, district, state, pincode } = response.data.data;
          autoFillAddressInBillingDetails(form, name_on_card, address, district, state, pincode);
        } else if (response.data.errors.length !== 0) {
          setVerificationErrors(response.data.errors);
          setDocumentVerificationError(response.data.errors.passport_number);
        } else {
          setDocumentValidationError(response.data.message);
        }
      }
    }
    setLoading(false);
  }

  // this is being used to show the border color of the document number input field for error and success cases
  // const approvedDoc =
  //   (docFrontReason === "" || docFrontReason === null) && (docBackReason === "" || docBackReason === null);

  // in edit mode - if any document rejection reason is present, then verify button is disabled
  // else if any document field is empty, then verify button is disabled
  // if documentValidation fails, verify button is disabled until any existing file is removed
  const buttonDisabledCondition =
    edit && docFrontReason !== undefined
      ? docFrontReason !== "" || docBackReason !== "" || docNo === "" || documentValidationError !== ""
      : docFrontId === "" || docBackId === "" || docNo === "" || documentValidationError !== "";

  const frontFileIdError =
    verificationErrors?.aadhar_front_file_id ||
    verificationErrors?.voter_id_front_file_id ||
    verificationErrors?.dl_front_file_id ||
    verificationErrors?.passport_front_file_id;
  const backFileError =
    verificationErrors?.aadhar_back_file_id ||
    verificationErrors?.voter_id_back_file_id ||
    verificationErrors?.dl_back_file_id ||
    verificationErrors?.passport_back_file_id;
  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center">
          <Label>{properties.label}</Label>
          <HelpBadge to={properties.blog_link} className="ml-1" text="Need help?" />
        </div>
        <Input
          type="text"
          placeholder={`Enter ${properties.label} . . .`}
          value={docNo}
          disabled={documentVerified}
          maxLength={15}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          className={`${
            edit ? (documentVerified ? "border border-green-800" : "border border-red") : ""
          }  ${className} `}
        />
        {documentVerificationError ? <ErrorMessage error={documentVerificationError} /> : null}
      </div>
      <div>
        <FileInputEditable
          name={properties.doc_front_key}
          label={properties.doc_front_label}
          fileId={docFrontId}
          setFileId={setDocFrontId}
          setReason={setDocFrontReason}
          status={documentVerified ? "approved" : "rejected"}
          reason={docFrontReason}
          required
        />
        {frontFileIdError && <ErrorMessage error={frontFileIdError} />}
      </div>
      <div className="space-x-4 space-y-4 lg:space-y-0 lg:flex">
        <div>
          <FileInputEditable
            name={properties.doc_back_key}
            label={properties.doc_back_label}
            fileId={docBackId}
            setFileId={setDocBackId}
            setReason={setDocBackReason}
            status={documentVerified ? "approved" : "rejected"}
            reason={docBackReason}
            required
          />
          {backFileError && <ErrorMessage error={backFileError} />}
        </div>
        {documentVerified ? (
          <Verified />
        ) : (
          <div className={`flex flex-col ${documentValidationError ? "pt-4" : ""}`}>
            {documentValidationError && <ErrorMessage error={documentValidationError} />}
            <LoadingButton
              size="xs"
              variant={buttonDisabledCondition ? "disabled" : "default"}
              loading={loading}
              disabled={buttonDisabledCondition}
              className={`font-normal ${!documentValidationError ? "lg:mt-11" : "lg:mt-2"}`}
              onClick={verifyDocument}
              text="Verify"
            />
          </div>
        )}
      </div>
    </>
  );
};
