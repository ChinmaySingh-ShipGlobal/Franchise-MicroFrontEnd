import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import HelpBadge from "@/components/elements/HelpBadge";
import ErrorMessage from "@/components/elements/ErrorMessage";
import LoadingButton from "@/components/elements/LoadingButton";
import FileInputEditable from "@/components/elements/FileInputEditable";

import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { verifyPAN } from "@/services/kyc";
import { cn, formatDate } from "@/lib/utils";
import { Verified } from "@/components/elements/Verified";
import { useNavigate } from "react-router-dom";

interface PANValidationErrorSchema {
  pan_number?: string;
  name_on_pan?: string;
  dob_on_pan?: string;
  pan_file_id?: string;
}

interface PanVerificationProps {
  hasGST: boolean;
  panNo: string;
  setPanNo: Dispatch<SetStateAction<string>>;
  panFileId: string;
  setPanFileId: Dispatch<SetStateAction<string>>;
  dateOnPan: string;
  setDateOnPan: Dispatch<SetStateAction<string>>;
  nameOnPan: string;
  setNameOnPan: Dispatch<SetStateAction<string>>;
  reason?: string;
  setReason?: Dispatch<SetStateAction<string>>;
  panVerified: boolean;
  setPanVerified: Dispatch<SetStateAction<boolean>>;
  edit?: boolean;
}

export const PANVerification = ({
  hasGST,
  panNo,
  setPanNo,
  panFileId,
  setPanFileId,
  dateOnPan,
  setDateOnPan,
  nameOnPan,
  setNameOnPan,
  reason,
  setReason,
  panVerified,
  setPanVerified,
  edit,
}: PanVerificationProps) => {
  const [panFormLoading, setPanFormLoading] = useState(false);
  const [panValidationError, setPanValidationError] = useState<PANValidationErrorSchema>({});
  const [panVerificationError, setPanVerificationError] = useState("");
  const navigate = useNavigate();
  function handleChangeName(value: string) {
    setPanVerificationError("");
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setPanValidationError((prev) => ({ ...prev, name_on_pan: "" }));
      setNameOnPan(value.toUpperCase());
    } else {
      setPanValidationError((prev) => ({ ...prev, name_on_pan: "Only alphabets are allowed" }));
    }
  }

  function handleChangeNumber(value: string) {
    setPanVerificationError("");
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setPanValidationError((prev) => ({ ...prev, pan_number: "" }));
      setPanNo(value.toUpperCase());
    } else {
      setPanValidationError((prev) => ({ ...prev, pan_number: "Only alphanumeric characters are allowed" }));
    }
  }

  //clear errors when file uploaded is changed
  useEffect(() => {
    setPanVerificationError("");
    if (panFileId === "") {
      setPanVerified(false);
    }
    //  else if (panFileId !== "" && setReason) {
    //   setReason("");
    //   console.log("first");
    // }
  }, [panFileId]);

  async function callVerifyPAN(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setPanFormLoading(true);
    setPanValidationError({});
    setPanVerificationError("");

    const response = await verifyPAN({
      pan_file_id: panFileId,
      pan_number: panNo,
      dob_on_pan: dateOnPan,
      name_on_pan: nameOnPan,
    });
    if (response) {
      if (response.status === 200) {
        setPanVerified(true);
        navigate("/kyc?edit=1");
      } else if (response.data.errors.length !== 0) {
        setPanValidationError(response.data.errors);
      } else {
        setPanVerificationError(response.data.message);
      }
    }
    setPanFormLoading(false);
  }

  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  //cases to disable the verify button
  const verifyDisabled =
    edit && reason !== undefined
      ? panNo === "" ||
        panVerificationError !== "" ||
        (hasGST ? false : nameOnPan === "" || dateOnPan === "") ||
        reason !== ""
      : panFileId === "" ||
        panNo === "" ||
        panVerificationError ||
        (hasGST ? false : nameOnPan === "" || dateOnPan === "");

  // this is being used to show the border color of the document number input field for error and success cases
  // const approvedPan = reason === "" || reason === null;

  return (
    <div className="grid gap-y-4 lg:grid-cols-3 lg:gap-x-12">
      <FormItem>
        <div className="flex items-center gap-x-1">
          <FormLabel>{hasGST ? "Company PAN Number" : "PAN Number"}</FormLabel>
          <HelpBadge
            to={hasGST ? "https://shipglobal.in/blogs/kyc-company-pan/" : "https://shipglobal.in/blogs/kyc-pan-card/"}
            text="Need help?"
          />
        </div>
        <FormControl className="lg:min-w-72 h-11">
          <Input
            type="text"
            maxLength={10}
            placeholder={`${hasGST ? "Company PAN Number" : "Enter PAN Number"} . . .`}
            disabled={panVerified || hasGST}
            value={panNo}
            onChange={(e) => {
              handleChangeNumber(e.target.value);
            }}
            // onFocus={() => setEditMode(false)}
            className={`${edit ? (panVerified ? "border border-green-800" : "border border-red") : ""} `}
          />
        </FormControl>
        <FormMessage />
        {panValidationError?.pan_number && <ErrorMessage error={panValidationError.pan_number} />}
      </FormItem>
      {!hasGST && (
        <>
          <FormItem>
            <FormLabel>Name as on PAN</FormLabel>
            <FormControl className="lg:min-w-72 h-11">
              <Input
                type="text"
                placeholder="Enter Name as on PAN . . ."
                value={nameOnPan}
                disabled={panVerified}
                onChange={(e) => {
                  handleChangeName(e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
            {panValidationError?.name_on_pan && <ErrorMessage error={panValidationError.name_on_pan} />}
          </FormItem>
          <FormItem className="space-y-2 mt-[6px]">
            <div className="flex flex-col">
              <FormLabel className="mb-2">DOB as on PAN</FormLabel>
              <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
                <PopoverTrigger asChild className="h-11" disabled={panVerified}>
                  <Button
                    variant={"outline"}
                    className={cn("justify-start text-left font-normal", !dateOnPan && "text-muted-foreground")}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateOnPan ? format(dateOnPan, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    onSelect={(value) => {
                      setDateOnPan(formatDate(value));
                      setIsPopOverOpen(false);
                      setPanVerificationError("");
                    }}
                    fromYear={1900}
                    toYear={2012}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage />
          </FormItem>
        </>
      )}
      <div>
        <FileInputEditable
          name="pan"
          label={hasGST ? "Upload Company PAN" : "Upload PAN"}
          fileId={panFileId}
          setFileId={setPanFileId}
          status={panVerified ? "approved" : "rejected"}
          reason={reason}
          setReason={setReason}
          setDocumentVerified={setPanVerified}
          required
        />
        {panValidationError?.pan_file_id && <ErrorMessage error={panValidationError.pan_file_id} />}
      </div>
      <div className="space-y-4 lg:flex lg:items-end">
        {panVerified ? (
          <Verified className={panFileId ? "mb-6" : ""} />
        ) : (
          <div className="flex flex-col">
            {panVerificationError && <ErrorMessage error={panVerificationError} />}
            <LoadingButton
              size="xs"
              variant={verifyDisabled ? "disabled" : "default"}
              loading={panFormLoading}
              disabled={verifyDisabled}
              className={`font-normal ${panFileId !== "" && "mb-6"}`}
              onClick={callVerifyPAN}
              text="Verify"
            />
          </div>
        )}
      </div>
    </div>
  );
};
