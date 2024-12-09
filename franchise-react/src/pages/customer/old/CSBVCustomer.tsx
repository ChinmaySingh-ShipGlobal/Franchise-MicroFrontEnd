import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FranchisePage from "@/layouts/FranchisePage";
import { consignorCSBVFormSchema } from "@/schemas/Customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { GSTVerify } from "../GSTVerify";
// import { PANVerify } from "../PANVerify";
// import { IECVerify } from "../IECVerify";
// import { ADCode } from "../ADCode";
// import { LUT } from "../LUT";
// import { BankDetails } from "../BankDetails";
import { Button } from "@/components/ui/button";
import { addCustomerCSBV, getCustomerDetails } from "@/services/customers";
import { toast } from "@/components/ui/use-toast";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import FileInput from "@/components/elements/FileInput";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { GSTVerify } from "./GSTVerify";
import { PANVerify } from "./PANVerify";
import { IECVerify } from "./IECVerify";
import { ADCode } from "./ADCode";
import { LUT } from "./LUT";
import { BankDetails } from "./BankDetails";

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
export default function CSBVCustomer() {
  const [gst, setGst] = useState({
    fileId: "",
    number: "",
  });
  const [pan, setPan] = useState({
    fileId: "",
    number: "",
    verified: false,
    name: "",
    date: "",
  });

  const [iec, setIec] = useState({
    fileId: "",
    verified: false,
  });
  const [customerDetails, setCustomerDetails] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [adCodeFileId, setAdCodeFileId] = useState("");
  const [lutFileId, setLutFileId] = useState("");
  const [signatureFileId, setSignatureFileId] = useState("");
  // const consignor_id = useStore((state: any) => state.customer_id);
  const { consignor_id } = useParams();
  // console.log(consignor_id, "consignor_id");
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

  const form = useForm({
    resolver: zodResolver(consignorCSBVFormSchema),
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
  const navigate = useNavigate();
  async function onSubmitCustomer() {
    setLoading(true);
    const csbVConsignorData = {
      customer_id: consignor_id,
      gst_number: gst.number,
      gst_file_id: gst.fileId,
      signature_file_id: signatureFileId,
      company_pan_number: pan.number,
      company_pan_file_id: pan.fileId,
      iec_file_id: iec.fileId,
      iec_number: form.watch("iec_number"),
      ad_code: form.watch("ad_code"),
      ad_code_file_id: adCodeFileId,
      lut_expiry: form.watch("lut_expiry"),
      lut_file_id: lutFileId,
      bank_name: form.watch("bank_name"),
      bank_account: form.watch("bank_account"),
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
    // pan.verified &&
    return !(
      iec.verified &&
      pan.verified &&
      form.watch("bank_name") &&
      form.watch("bank_account") &&
      form.watch("ad_code") &&
      form.watch("lut_expiry") &&
      adCodeFileId &&
      lutFileId &&
      signatureFileId
    );
  }
  return (
    <FranchisePage>
      {/* <BreadcrumbNav parent="Customers" pageTitle="CSB-V Details" subParent="Add Customers" /> */}
      <BreadcrumbNav pageTitle="CSB-V Details" />
      {customerDetails ? (
        <>
          <Card className="pb-20 m-0 mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitCustomer)}>
                <CardContent className="p-0">
                  {customerDetails && <SelectedCustomer customerDetails={customerDetails} />}
                  {/* <div className="m-4 text-sm text-red">* All fields are mandatory</div> */}
                  <GSTVerify setGst={setGst} setPan={setPan} customerId={consignor_id || "0"} />
                  <PANVerify pan={pan} setPan={setPan} />
                  <IECVerify setIec={setIec} form={form} customerId={consignor_id || "0"} />
                  <ADCode setAdCodeFileId={setAdCodeFileId} form={form} />
                  <LUT setLutFileId={setLutFileId} form={form} />
                  <BankDetails form={form} />
                  <div className="grid p-4 gap-y-4 lg:grid-cols-3 lg:gap-x-12">
                    <FileInput
                      name="signature"
                      label="Upload Signature with Stamp"
                      setFileId={setSignatureFileId}
                      required
                    />
                  </div>
                </CardContent>
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
