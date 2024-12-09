import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FranchisePage from "@/layouts/FranchisePage";
import { CSBVFormSchema } from "@/schemas/Customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { addCustomerCSBV, CSBVGetStatus, getCustomerDetails } from "@/services/customers";
import { toast } from "@/components/ui/use-toast";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { PanCustomer } from "./PAN";
import { GstCustomer } from "./GST";
import ErrorMessage from "@/components/elements/ErrorMessage";
import FileInputEditable from "@/components/elements/FileInputEditable";
import { IecCustomer } from "./IEC";
import { AdCustomer } from "./ADCode";
import { LutCustomer } from "./LUT";
import { BankCustomer } from "./Bank";
import { BillingDetails } from "@/pages/kyc/FranchiseKYC";

export interface FetchedAddress {
  name: string;
  address: string;
  district: string;
  pincode: string;
  state: string;
  country: string;
}

export interface CSBVCustomerForm {
  gst_number: string;
  gst_file_id: string;
  company_pan_number: string;
  company_pan_file_id: string;
  iec_file_id: string;
  iec_number: string;
  ad_code: string;
  ad_code_file_id: string;
  lut_expiry: string;
  lut_file_id: string;
  bank_name: string;
  bank_account: string;
}

export interface PanDetails {
  fileId: string;
  verified: boolean;
  name: string;
  date: string;
  number: string;
}

export interface BillingDetails {
  name_on_card: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
  state: string;
  state_id: string;
}
export default function CSBVCustomerAdd() {
  const [customerDetails, setCustomerDetails] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { consignor_id } = useParams();

  useEffect(() => {
    if (!consignor_id) return;
    const fetchCustomerDetails = async () => {
      try {
        const response = await getCustomerDetails(consignor_id);
        if (response) {
          setCustomerDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    fetchCustomerDetails();
  }, [consignor_id]);

  async function updateCustomerEditedDocs(consignor_id: string) {
    CSBVGetStatus({ customer_id: consignor_id }).then((response) => {
      if (response?.status === 200) {
        const data = response?.data?.data?.meta_data?.kyc_documents;
        const billingAddress = response?.data.data.billing_address;
        customerForm.setValue("firstName", billingAddress.firstname);
        customerForm.setValue("lastName", billingAddress.lastname);
        customerForm.setValue("address", billingAddress.address);
        customerForm.setValue("pincode", billingAddress.postcode);
        customerForm.setValue("city", billingAddress.city);
        // customerForm.setValue("state", billingAddress.state_name);
        customerForm.setValue("state_id", billingAddress.state_id);
        const gst = data.filter((doc: any) => doc.document_type === "gst")[0];
        setGstFileId(gst.uuid);
        setGstNumber(gst.document_value);
        setGstReason(gst.reason);
        if (gst.reason === null || gst.reason === "") {
          setGstVerified(true);
        } else setGstVerified(false);

        const pan = data.filter((doc: any) => doc.document_type === "pan")[0];
        setPanFileId(pan.uuid);
        setPanNo(pan.document_value);
        setNameOnPan(pan.meta_data?.pan_name);
        setDobOnPan(pan.meta_data?.pan_dob);
        setPanReason(pan.reason);
        if (pan.reason === "" || pan.reason === null) {
          setPanVerified(true);
        } else setPanVerified(false);

        const iec = data.find((doc: any) => doc.document_type === "iec");

        setIecFileId(iec.uuid);
        setIecNo(iec.document_value);
        setIecReason(iec.reason);
        setIecVerified(iec.status === "approved");

        const ad = data.find((doc: any) => doc.document_type === "adcode");

        setAdcNo(ad.document_value);
        setAdFileId(ad.uuid);
        setAdReason(ad.reason);

        const lut = data.find((doc: any) => doc.document_type === "lut");

        setLutNo(lut.document_value);
        setLutFileId(lut.uuid);
        setLutReason(lut.reason);

        const bank_name = data.find((doc: any) => doc.document_type === "bank_name");

        setBankName(bank_name.document_value);

        const bank_number = data.find((doc: any) => doc.document_type === "bank_number");

        setBankAccNo(bank_number.document_value);

        const signature = data.find((doc: any) => doc.document_type === "signature");

        setSignatureFileId(signature.uuid);
        setSignatureRejectionReason(signature.reason);
      }
    });
  }

  async function fetchData() {
    if (searchParams.get("edit") === "1") {
      if (consignor_id) {
        await updateCustomerEditedDocs(consignor_id);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [consignor_id]);

  const form = useForm({
    resolver: zodResolver(CSBVFormSchema),
    defaultValues: {
      gst_number: "",
      gst_file_id: "",
      company_pan_number: "",
      company_pan_file_id: "",
      iec_file_id: "",
      iec_number: "",
      ad_code: "",
      ad_code_file_id: "",
      lut_expiry: "",
      lut_file_id: "",
      bank_name: "",
      bank_account: "",
    },
  });

  const customerForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: " ",
      address: "",
      city: "",
      state: "",
      pincode: "",
      state_id: "",
      country: "India",
    },
  });
  const navigate = useNavigate();
  async function onSubmitCustomer() {
    setLoading(true);
    const csbVConsignorData = {
      customer_id: consignor_id,
      gst_number: gstNumber,
      gst_file_id: gstFileId,
      company_pan_number: panNo,
      company_pan_file_id: panFileId,
      iec_number: iecNo,
      iec_file_id: iecFileId,
      ad_code: adNo,
      ad_code_file_id: adFileId,
      lut_expiry: lutNo,
      lut_file_id: lutFileId,
      bank_name: bankName,
      bank_account: bankAccNo,
      signature_file_id: signatureFileId,
      billing_firstname: customerForm.watch("firstName"),
      billing_lastname: customerForm.watch("lastName"),
      billing_legal_name: customerForm.watch("firstName") + " " + customerForm.watch("lastName"),
      billing_address: customerForm.watch("address"),
      billing_city: customerForm.watch("city"),
      billing_pin_code: customerForm.watch("pincode"),
      billing_country: "IN",
      billing_state: customerForm.watch("state_id"),
    };
    const response = await addCustomerCSBV(csbVConsignorData);
    if (response) {
      if (response.status === 200) {
        toast({
          title: "CSB V Customer details added successfully",
          variant: "success",
        });
        navigate("/customers");
      } else {
        console.log(response.data.errors);
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    }
    setLoading(false);
  }

  function isSubmitDisabled() {
    return !(
      gstVerified &&
      panVerified &&
      iecVerified &&
      adNo &&
      adFileId &&
      lutNo &&
      lutFileId &&
      bankName &&
      bankAccNo &&
      signatureFileId
    );
  }
  const [searchParams, setSearchParams] = useSearchParams();

  //gst docs
  const [gstNumber, setGstNumber] = useState("");
  const [gstFileId, setGstFileId] = useState("");
  const [gstVerified, setGstVerified] = useState(false);
  const [gstReason, setGstReason] = useState("");

  //pan verification
  const [panNo, setPanNo] = useState("");
  const [panFileId, setPanFileId] = useState("");
  const [panVerified, setPanVerified] = useState(false);
  const [panReason, setPanReason] = useState("");
  const [nameOnPan, setNameOnPan] = useState("");
  const [dobOnPan, setDobOnPan] = useState("");

  //iec verification
  const [iecNo, setIecNo] = useState("");
  const [iecFileId, setIecFileId] = useState("");
  const [iecVerified, setIecVerified] = useState(false);
  const [iecReason, setIecReason] = useState("");

  //adCode verification
  const [adNo, setAdcNo] = useState("");
  const [adFileId, setAdFileId] = useState("");
  const [adReason, setAdReason] = useState("");

  //lut verification
  const [lutNo, setLutNo] = useState("");
  const [lutFileId, setLutFileId] = useState("");
  const [lutReason, setLutReason] = useState("");

  //bank details
  const [bankName, setBankName] = useState("");
  const [bankAccNo, setBankAccNo] = useState("");

  //signature
  const [signatureFileId, setSignatureFileId] = useState("");
  const [signError, setSignError] = useState("");
  const [signatureRejectionReason, setSignatureRejectionReason] = useState("");

  return (
    <FranchisePage className="h-screen">
      <BreadcrumbNav pageTitle="CSB-V Details" />
      {customerDetails ? (
        consignor_id && (
          <>
            <Card className="pb-20 m-0 mt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitCustomer)}>
                  {
                    <CardContent className="p-0">
                      {customerDetails && <SelectedCustomer customerDetails={customerDetails} />}
                      <GstCustomer
                        form={customerForm}
                        gstFileId={gstFileId}
                        setGstFileId={setGstFileId}
                        gstNumber={gstNumber}
                        setGstNumber={setGstNumber}
                        setNameOnPan={setNameOnPan}
                        setDobOnPan={setDobOnPan}
                        setPanNo={setPanNo}
                        gstReason={gstReason}
                        setGstReason={setGstReason}
                        gstVerified={gstVerified}
                        setGstVerified={setGstVerified}
                        customerId={consignor_id}
                        edit={searchParams.get("edit") === "1"}
                      />
                      <PanCustomer
                        panNo={panNo}
                        setPanNo={setPanNo}
                        panFileId={panFileId}
                        setPanFileId={setPanFileId}
                        panVerified={panVerified}
                        setPanVerified={setPanVerified}
                        panReason={panReason}
                        setPanReason={setPanReason}
                        customer_id={consignor_id}
                        edit={searchParams.get("edit") === "1"}
                        nameOnPan={nameOnPan}
                        dobOnPan={dobOnPan}
                        gstVerified={gstVerified}
                      />
                      <IecCustomer
                        iecNo={iecNo}
                        setIecNo={setIecNo}
                        iecFileId={iecFileId}
                        setIecFileId={setIecFileId}
                        iecVerified={iecVerified}
                        setIecVerified={setIecVerified}
                        iecReason={iecReason}
                        setIecReason={setIecReason}
                        customerId={consignor_id}
                        edit={searchParams.get("edit") === "1"}
                      />
                      <AdCustomer
                        adNo={adNo}
                        setAdNo={setAdcNo}
                        adFileId={adFileId}
                        setAdFileId={setAdFileId}
                        adReason={adReason}
                        setAdReason={setAdReason}
                        edit={searchParams.get("edit") === "1"}
                      />
                      <LutCustomer
                        lutNo={lutNo}
                        setLutNo={setLutNo}
                        lutFileId={lutFileId}
                        setLutFileId={setLutFileId}
                        lutReason={lutReason}
                        setLutReason={setLutReason}
                        edit={searchParams.get("edit") === "1"}
                      />
                      <BankCustomer
                        bankAccNo={bankAccNo}
                        setBankAccNo={setBankAccNo}
                        bankName={bankName}
                        setBankName={setBankName}
                      />

                      <div className="grid px-4 mt-5 lg:grid-cols-3 lg:gap-x-12">
                        <div className="flex flex-col">
                          <FileInputEditable
                            name="signature"
                            label="Upload Signature with Stamp"
                            required
                            fileId={signatureFileId}
                            setFileId={setSignatureFileId}
                            status={
                              signatureRejectionReason === "" || signatureRejectionReason === null
                                ? "approved"
                                : "rejected"
                            }
                            reason={signatureRejectionReason}
                            customer={true}
                          />
                          {signError && <ErrorMessage error={signError || ""} />}
                        </div>
                      </div>

                      <BillingDetails form={customerForm} customer />
                    </CardContent>
                  }
                  <CardFooter>
                    <div className="flex justify-end w-full pt-10 mr-16 space-x-3">
                      <Button
                        variant="outline"
                        className="font-normal border-primary text-primary"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="font-normal"
                        onClick={form.handleSubmit(onSubmitCustomer)}
                        disabled={isSubmitDisabled()}
                      >
                        Submit
                        {loading && <Icon icon="lucide:loader" className={"self-center ml-2 animate-spin"} />}
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </>
        )
      ) : (
        <div className="flex flex-col items-center justify-center mt-8 space-y-4">
          <div className="text-sm text-red">Customer details not found. Please add a customer first.</div>
          <Button
            variant="outline"
            className="font-normal border-primary text-primary"
            onClick={() => navigate("/customers")}
          >
            Go back to customers
          </Button>
        </div>
      )}
    </FranchisePage>
  );
}

const SelectedCustomer = ({ customerDetails }: any) => {
  const documentTypeMap: { [key: string]: string } = {
    aadhar_front: "Aadhar Card",
    voter_id_front: "Voter ID",
    dl_front: "Driving License",
    passport_front: "Passport",
  };

  const document = customerDetails.kyc_docs[0];
  return (
    <Card className="p-0 m-0 bg-gray-100 rounded-sm shadow-none">
      <CardContent className="flex flex-col justify-between w-2/3 px-5 py-4 text-xs gap-y-4 lg:flex-row ">
        <div>
          <p className="font-semibold">
            {customerDetails.firstname} {customerDetails.lastname}
          </p>
          <p className="leading-6">{customerDetails.email}</p>
          <p>+91-{customerDetails.mobile}</p>
        </div>
        <div className="lg:mx-4">
          <p className="font-medium text-gray-700 ">Address</p>
          <p className="leading-6 lg:max-w-112">{customerDetails.meta_data.address}</p>
        </div>
        <div className="min-w-32">
          <p className="font-medium text-gray-700">Document Type</p>
          <p className="leading-6">{documentTypeMap[document.document_type]}</p>
          <p>{document.document_value}</p>
        </div>
      </CardContent>
    </Card>
  );
};
