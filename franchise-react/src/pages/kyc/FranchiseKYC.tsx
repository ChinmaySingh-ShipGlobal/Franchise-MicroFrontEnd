import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText } from "lucide-react";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogDescription } from "@/components/ui/alert-dialog";

import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import FranchisePage from "@/layouts/FranchisePage";
import ErrorMessage from "@/components/elements/ErrorMessage";
import FileInputEditable from "@/components/elements/FileInputEditable";
import SGFormField from "@/components/elements/SGFormField";

import { KYCFormSchema } from "@/schemas/KYC";
import { documents } from "@/lib/constants";
import { useStore } from "@/zustand/store";
import { updateKYCStatus } from "@/zustand/actions";
import { getKycStatus, submitBusinessKYC, submitIndividualKYC } from "@/services/kyc";

import { AddressVerificationForm } from "@/pages/kyc/AddressVerification";
import { GSTVerification } from "@/pages/kyc/GSTVerification";
import { PANVerification } from "@/pages/kyc/PANVerification";
import { TermsConditionsContent } from "@/pages/kyc/TermsAndConditionsContent";
import { getStates } from "@/services/locations";

export interface FetchedAddress {
  name: string;
  address: string;
  district: string;
  pincode: string;
  state: string;
  country: string;
}

export default function FranchiseKYC() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useStore((state: any) => state.dispatch);
  const franchiseKYCForm = useForm({
    resolver: zodResolver(KYCFormSchema),
    defaultValues: {
      documentType: "aadhar",
      firstName: "",
      lastName: "",
      address: "",
      pincode: "",
      city: "",
      state_id: "",
      state: "",
      pickupAddressSameCheckbox: false,
      agreementCheckbox: false,
    },
  });

  // address verification docs
  const [docNo, setDocNo] = useState("");
  const [docFrontId, setDocFrontId] = useState("");
  const [docBackId, setDocBackId] = useState("");
  const [documentVerified, setDocumentVerified] = useState(false);
  const [docFrontReason, setDocFrontReason] = useState("");
  const [docBackReason, setDocBackReason] = useState("");

  //helpers states
  const [hasGST, setHasGST] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //gst docs
  const [gstNumber, setGstNumber] = useState("");
  const [gstFileId, setGstFileId] = useState("");
  const [gstVerified, setGstVerified] = useState(false);
  const [gstReason, setGstReason] = useState("");

  //pan verification
  const [panNo, setPanNo] = useState("");
  const [panFileId, setPanFileId] = useState("");
  const [nameOnPan, setNameOnPan] = useState("");
  const [dateOnPan, setDateOnPan] = useState("");
  const [panVerified, setPanVerified] = useState(false);
  const [panReason, setPanReason] = useState("");

  //signature
  const [signatureFileId, setSignatureFileId] = useState("");
  const [signError, setSignError] = useState("");
  const [signatureRejectionReason, setSignatureRejectionReason] = useState("");

  //state-list
  const [stateList, setStateList] = useState([]);

  //error message
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit() {
    setLoading(true);
    setSignError("");
    setErrorMessage("");
    const billing_address = {
      billing_firstname: franchiseKYCForm.watch("firstName"),
      billing_lastname: franchiseKYCForm.watch("lastName"),
      billing_legal_name: franchiseKYCForm.watch("firstName") + " " + franchiseKYCForm.watch("lastName"),
      billing_address: franchiseKYCForm.watch("address"),
      billing_pin_code: franchiseKYCForm.watch("pincode"),
      billing_city: franchiseKYCForm.watch("city"),
      billing_state: franchiseKYCForm.watch("state_id"),
      billing_country: "India",
    };
    let response;
    if (hasGST) {
      const businessKYCData = {
        document_type: franchiseKYCForm.watch("documentType"),
        document_front_file_id: docFrontId,
        document_back_file_id: docBackId,
        vendor_type: 5,
        company_pan_number: panNo,
        gst_number: gstNumber,
        company_pan_file_id: panFileId,
        gst_file_id: gstFileId,
        signature_file_id: signatureFileId,
        pickup_address_same: franchiseKYCForm.watch("pickupAddressSameCheckbox") ? "1" : "0",
        agreement: franchiseKYCForm.watch("agreementCheckbox") ? "1" : "0",
        ...billing_address,
      };
      response = await submitBusinessKYC(businessKYCData);
    } else {
      const individualKYCData = {
        document_type: franchiseKYCForm.watch("documentType"),
        document_front_file_id: docFrontId,
        document_back_file_id: docBackId,
        vendor_type: 4,
        pan_number: panNo,
        pan_file_id: panFileId,
        dob_on_pan: dateOnPan,
        name_on_pan: nameOnPan,
        signature_file_id: signatureFileId,
        pickup_address_same: franchiseKYCForm.watch("pickupAddressSameCheckbox") ? "1" : "0",
        agreement: franchiseKYCForm.watch("agreementCheckbox") ? "1" : "0",
        ...billing_address,
      };
      response = await submitIndividualKYC(individualKYCData);
    }
    if (response) {
      if (response.status === 200) {
        toast({
          title: "KYC Successful",
          variant: "success",
        });
        dispatch(() => updateKYCStatus("submitted"));
        navigate("/profile");
      } else {
        setError(response.data.errors?.agreement);
        setSignError(response.data.errors?.signature_file_id);
        setErrorMessage(response.data?.message);
      }
    }
    setLoading(false);
  }

  async function fetchData() {
    const states = await getStates();
    setStateList(states.data.states);
    if (searchParams.get("edit") === "1") {
      await updateEditedDocsValuesInState();
    }
  }
  useEffect(() => {
    fetchData();
  }, [searchParams]);

  async function updateEditedDocsValuesInState() {
    getKycStatus().then((response) => {
      const data = response?.data.data.meta_data.kyc_documents;
      const billingAddress = response?.data.data.billing_address || {};
      franchiseKYCForm.setValue("firstName", billingAddress.firstname);
      franchiseKYCForm.setValue("lastName", billingAddress.lastname);
      franchiseKYCForm.setValue("address", billingAddress.address);
      franchiseKYCForm.setValue("pincode", billingAddress.postcode);
      franchiseKYCForm.setValue("city", billingAddress.city);
      franchiseKYCForm.setValue("state_id", billingAddress.state_id);

      // franchiseKYCForm.setValue(
      //   "state",
      //   stateList.find((state: any) => state.state_id === billingAddress.state_id)?.state_name,
      // );
      setSignatureFileId(data.filter((doc: any) => doc.document_type === "signature")[0]?.uuid);
      setSignatureRejectionReason(data.filter((doc: any) => doc.document_type === "signature")[0]?.reason);

      //address proof docs
      setDocNo(data.filter((doc: any) => doc.document_type.includes("_front"))[0]?.document_value);
      setDocFrontId(data.filter((doc: any) => doc.document_type.includes("_front"))[0]?.uuid);
      setDocBackId(data.filter((doc: any) => doc.document_type.includes("_back"))[0]?.uuid);
      const backReason = data.filter((doc: any) => doc.document_type.includes("_back"))[0]?.reason;
      setDocBackReason(backReason);
      const frontReason = data.filter((doc: any) => doc.document_type.includes("_front"))[0]?.reason;
      setDocFrontReason(frontReason);
      if ((frontReason === "" || frontReason === null) && (backReason === "" || backReason === null)) {
        setDocumentVerified(true);
      } else {
        setDocumentVerified(false);
      }
      if (data.filter((doc: any) => doc.document_type === "gst")[0]?.uuid) setHasGST(true);
      const hasGSTID = data.filter((doc: any) => doc.document_type === "gst")[0]?.uuid;
      if (hasGSTID) setHasGST(true);
      setGstFileId(hasGSTID);
      setGstNumber(data.filter((doc: any) => doc.document_type === "gst")[0]?.document_value);
      const reasonGst = data.filter((doc: any) => doc.document_type === "gst")[0]?.reason;
      setGstReason(reasonGst);
      if (reasonGst === "" || reasonGst === null) {
        setGstVerified(true);
        setPanNo(data.filter((doc: any) => doc.document_type === "gst")[0]?.meta_data?.pan_number);
        setNameOnPan(data.filter((doc: any) => doc.document_type === "gst")[0]?.meta_data?.pan_name);
        setDateOnPan(data.filter((doc: any) => doc.document_type === "gst")[0]?.meta_data?.pan_dob);
      } else {
        setGstVerified(false);
      }
      const reasonPan = data.filter((doc: any) => doc.document_type === "pan")[0]?.reason;
      setPanReason(reasonPan);
      if (reasonPan === "" || reasonPan === null) {
        setPanVerified(true);
        setPanFileId(data.filter((doc: any) => doc.document_type === "pan")[0]?.uuid);
        setPanNo(data.filter((doc: any) => doc.document_type === "pan")[0]?.document_value);
        setNameOnPan(data.filter((doc: any) => doc.document_type === "pan")[0]?.meta_data?.pan_name);
        setDateOnPan(data.filter((doc: any) => doc.document_type === "pan")[0]?.meta_data?.pan_dob);
      } else {
        setPanVerified(false);
      }
    });
  }

  useEffect(() => {
    setGstReason("");
  }, [gstVerified]);

  return (
    <FranchisePage>
      <BreadcrumbNav pageTitle="Franchise KYC" />
      <Card className="pb-20 m-0 mt-4">
        <Form {...franchiseKYCForm}>
          <form onSubmit={franchiseKYCForm.handleSubmit(onSubmit)}>
            <CardHeader className="flex justify-center text-sm font-medium bg-gray-100 rounded-t-lg h-11">
              <div className="flex">
                <FileText className="p-1 mr-3 bg-black rounded-full fill-white" />
                <span className="self-center">Document</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <div className="grid lg:grid-cols-3 lg:gap-x-12">
                <FormField
                  control={franchiseKYCForm.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11" disabled={documentVerified}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documents.map((document) => (
                            <SelectItem value={document.key} key={document.key}>
                              {document.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid mt-5 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
                <AddressVerificationForm
                  form={franchiseKYCForm}
                  documentVerified={documentVerified}
                  setDocumentVerified={setDocumentVerified}
                  className="lg:min-w-72 h-11"
                  docNo={docNo}
                  setDocNo={setDocNo}
                  docFrontId={docFrontId}
                  setDocFrontId={setDocFrontId}
                  docBackId={docBackId}
                  setDocBackId={setDocBackId}
                  docFrontReason={docFrontReason}
                  docBackReason={docBackReason}
                  setDocFrontReason={setDocFrontReason}
                  setDocBackReason={setDocBackReason}
                  edit={searchParams.get("edit") === "1"}
                />
              </div>
              <FormItem className="flex flex-row items-center mt-6 mb-3">
                <Checkbox id="hasGST" checked={hasGST} onCheckedChange={() => setHasGST(!hasGST)} />
                <FormLabel htmlFor="hasGST" className="ml-2 leading-5 cursor-pointer">
                  I have GST Number
                </FormLabel>
              </FormItem>
              {/* GST Verification */}
              {hasGST && (
                <GSTVerification
                  form={franchiseKYCForm}
                  gstFileId={gstFileId}
                  setGstFileId={setGstFileId}
                  gstNumber={gstNumber}
                  setGstNumber={setGstNumber}
                  setDateOnCompanyPan={setDateOnPan}
                  setNameOnCompanyPan={setNameOnPan}
                  setPanNo={setPanNo}
                  reason={gstReason}
                  setReason={setGstReason}
                  gstVerified={gstVerified}
                  setGstVerified={setGstVerified}
                  edit={searchParams.get("edit") === "1"}
                />
              )}
              <div className="mt-6">
                <PANVerification
                  hasGST={hasGST}
                  panNo={panNo}
                  setPanNo={setPanNo}
                  panFileId={panFileId}
                  setPanFileId={setPanFileId}
                  dateOnPan={dateOnPan}
                  setDateOnPan={setDateOnPan}
                  nameOnPan={nameOnPan}
                  setNameOnPan={setNameOnPan}
                  reason={panReason}
                  setReason={setPanReason}
                  panVerified={panVerified}
                  setPanVerified={setPanVerified}
                  edit={searchParams.get("edit") === "1"}
                />
              </div>
              <div className="grid mt-5 lg:grid-cols-3 lg:gap-x-12">
                <div className="flex flex-col">
                  <FileInputEditable
                    name="signature"
                    label={hasGST ? "Upload Signature with Stamp" : "Upload Signature"}
                    required
                    fileId={signatureFileId}
                    setFileId={setSignatureFileId}
                    status={
                      signatureRejectionReason === "" || signatureRejectionReason === null ? "approved" : "rejected"
                    }
                    reason={signatureRejectionReason}
                  />
                  {signError && <ErrorMessage error={signError || ""} />}
                </div>
              </div>
            </CardContent>
            <BillingDetails form={franchiseKYCForm} />
            <div className="flex items-center justify-end pt-10 mr-16 space-x-3">
              <ErrorMessage error={errorMessage} />
              {error && <ErrorMessage error={error} />}
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="font-normal border-primary text-primary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-normal"
                onClick={franchiseKYCForm.handleSubmit(onSubmit)}
                disabled={!(documentVerified && panVerified)}
              >
                Submit
                {loading && <Icon icon="lucide:loader" className={"self-center ml-2 animate-spin"} />}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </FranchisePage>
  );
}

export const BillingDetails = ({ form, customer }: { form: any; customer?: boolean }) => {
  const [termsAndConditionsDialog, setTermsAndConditionsDialog] = useState(false);
  const [states, setStates] = useState([]);
  useEffect(() => {
    getStates().then((response) => {
      setStates(response.data.states);
    });
  }, []);
  const [change, setChange] = useState(false);
  useEffect(() => {
    form.watch("state_id");
    setChange(!change);
  }, [form.watch("state_id")]);
  const stateID = form.watch("state_id");
  console.log(stateID);
  return (
    <>
      <CardHeader className="flex justify-center mt-5 text-sm font-medium bg-gray-100 rounded-t-lg h-11">
        <div className="flex">
          <FileText className="p-1 mr-2 bg-black rounded-full fill-white" />
          <span className="self-center">Billing Details</span>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4 space-y-4">
        <div className="grid gap-y-4 md:gap-x-4 lg:grid-cols-3 lg:gap-x-12">
          <SGFormField type="text" name="firstName" required label="First Name" form={form} />
          <SGFormField type="text" name="lastName" required label="Last Name" form={form} />
          <SGFormField type="text" name="address" required label="Address" className="md:col-span-2" form={form} />
          <SGFormField type="text" name="pincode" required label="Pincode" form={form} />
          <SGFormField type="text" name="city" required label="City" form={form} />
          {change ? (
            <div>
              <SGFormField
                type="select-state"
                selectValues={states}
                name="state_id"
                required
                label="State"
                form={form}
                disabled
              />
            </div>
          ) : (
            <SGFormField
              type="select-state"
              selectValues={states}
              name="state_id"
              required
              label="State"
              form={form}
              disabled
            />
          )}
        </div>
        {!customer && (
          <>
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Controller
                  name="pickupAddressSameCheckbox"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center">
                      <Checkbox
                        id="pickupAddressSameCheckbox"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                      <FormLabel htmlFor="pickupAddressSameCheckbox" className="ml-2 leading-5 cursor-pointer">
                        Make this as the pickup address as well
                      </FormLabel>
                    </div>
                  )}
                />
              </FormControl>
            </FormItem>
            <FormField
              name="agreementCheckbox"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start ">
                  <FormControl className="flex flex-row-reverse">
                    <div className="flex items-center">
                      <FormLabel className="ml-2 leading-5 cursor-pointer">
                        Your acknowledgement is required, click submit after{" "}
                        <a
                          className="text-primary"
                          target="_blank"
                          rel="noreferrer noopner"
                          onClick={() => {
                            setTermsAndConditionsDialog(true);
                          }}
                        >
                          reviewing the terms in the agreement
                        </a>
                        .
                      </FormLabel>
                      <Checkbox
                        id="agreementCheckbox"
                        checked={field.value}
                        // onCheckedChange={(checked) => field.onChange(checked)}
                        onClick={() => setTermsAndConditionsDialog(true)}
                      />
                      <TermsAndConditions
                        open={termsAndConditionsDialog}
                        setOpen={setTermsAndConditionsDialog}
                        accept={field.value}
                        setAccept={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </CardContent>
    </>
  );
};

const TermsAndConditions = ({
  open,
  setOpen,
  accept,
  setAccept,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  accept: boolean;
  setAccept: Dispatch<SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    setTimeout(() => {
      if (accept) {
        setOpen(false);
      }
    }, 500);
  }, [accept]);

  useEffect(() => {
    const handleContextmenu = (e: MouseEvent | KeyboardEvent) => {
      e.preventDefault();
    };
    if (open) {
      document.addEventListener("contextmenu", handleContextmenu);
      document.addEventListener("keydown", handleContextmenu);
    } else {
      document.removeEventListener("contextmenu", handleContextmenu);
      document.removeEventListener("keydown", handleContextmenu);
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextmenu);
      document.removeEventListener("keydown", handleContextmenu);
    };
  }, [open]);

  function cancelAgreement() {
    setOpen(false);
    setAccept(false);
  }
  function acceptAgreement() {
    setAccept(true);
    setTimeout(() => {
      setOpen(false);
    }, 500);
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-full p-4 rounded-lg lg:min-w-240">
        <AlertDialogDescription className="overflow-y-auto p-0 px-8 max-h-[70vh]">
          <TermsConditionsContent />
        </AlertDialogDescription>
        <div className="flex justify-end gap-x-4">
          <Button variant="outline_theme" onClick={cancelAgreement}>
            Cancel
          </Button>
          <Button onClick={acceptAgreement}>Accept</Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
