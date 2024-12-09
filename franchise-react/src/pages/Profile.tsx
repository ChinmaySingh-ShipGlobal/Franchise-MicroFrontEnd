import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CirclePlus, User } from "lucide-react";
import { Approved } from "@/assets/KYCPendingSVG";
import { DocumentsSVG } from "@/assets/DocumentsSVG";
import { BillingDetailsSVG } from "@/assets/BillingDetailsSVG";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TextGroup from "@/components/elements/TextGroup";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import DocumentDetailsField from "@/components/elements/DocumentDetailsField";
import { KYCPendingPopup } from "@/pages/order/OrderListing";
import FranchisePage from "@/layouts/FranchisePage";

import { Address, BillingDetails, KYCDocs } from "@/interfaces/profile";
import { useStore } from "@/zustand/store";
import { updateKYCStatus } from "@/zustand/actions";
import { getPickupAddress } from "@/services/pickup";
import { getBillingDetails, getKycStatus } from "@/services/kyc";
import { formatDocumentValue, toSentenceCase } from "@/lib/utils";

const documentTitleMap: { [key: string]: string } = {
  aadhar_front: "Aadhar",
  voter_id_front: "Voter ID",
  dl_front: "Driving License",
  passport_front: "Passport",
};

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useStore((state: any) => state.dispatch);
  const kyc_status = useStore((state: any) => state.kyc_status);
  const { firstname, lastname, email, mobile } = useStore((state: any) => state.profile);

  const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
  const [kycDocs, setKycDocs] = useState<KYCDocs[]>([]);
  const [displayAddress, setDisplayAddress] = useState<Address[]>([]);
  const [kycPending, setKycPending] = useState(true);

  useEffect(() => {
    fetchBillingDetails();
    checkFranchiseKycStatus();
    fetchPickupAddressDetails();
  }, []);

  const fetchBillingDetails = async () => {
    const response = await getBillingDetails();
    if (response.data) setBillingDetails(response.data);
  };
  console.log(billingDetails);

  const checkFranchiseKycStatus = async () => {
    const response = await getKycStatus();
    if (response?.data) {
      setKycDocs(response?.data.data.meta_data.kyc_documents);
      dispatch(() => updateKYCStatus(response?.data.data.status));
    }
  };

  async function fetchPickupAddressDetails() {
    const response = await getPickupAddress();
    if (response?.status === 200) {
      setDisplayAddress(response.data.data);
    } else {
      console.error("Error fetching manifest details:", response?.data.message);
    }
  }

  const identityDocuments = kycDocs.filter((doc) =>
    [
      "aadhar_front",
      "aadhar_back",
      "voter_id_front",
      "voter_id_back",
      "dl_front",
      "dl_back",
      "passport_front",
      "passport_back",
    ].includes(doc.document_type),
  );
  const panDocument = kycDocs.find((doc) => ["pan", "company_pan"].includes(doc.document_type));
  const gstDocument = kycDocs.find((doc) => ["gst"].includes(doc.document_type));

  const billingAddressName = billingDetails?.company
    ? billingDetails.company
    : billingDetails?.firstname + " " + billingDetails?.lastname;

  const billingAddressDisplay = [
    billingDetails?.address,
    billingDetails?.city,
    billingDetails?.state_name,
    "INDIA",
    billingDetails?.postcode,
  ]
    .filter((part) => part)
    .join(", ");

  const pickupAddressName =
    toSentenceCase(displayAddress[0]?.firstname) + " " + toSentenceCase(displayAddress[0]?.lastname) || "";

  const pickupAddressDisplay = [
    displayAddress[0]?.address,
    displayAddress[0]?.locality,
    displayAddress[0]?.city,
    displayAddress[0]?.state_name,
    displayAddress[0]?.postcode,
  ]
    .filter((part) => part)
    .map((part) => toSentenceCase(part))
    .join(", ");

  const reKyc = kyc_status === "rejected" || kyc_status === "partial";
  const kycAttempted = kyc_status !== null && kyc_status !== "partial";
  const userName = toSentenceCase(firstname) + " " + toSentenceCase(lastname);

  return (
    <FranchisePage className="h-screen">
      <BreadcrumbNav pageTitle="Profile" />
      <Card className="w-full p-0 m-0 font-semibold text-left shadow-none md:p-3 rounded-xl">
        {/* Profile Card */}
        <Card className="grid px-6 py-5 mb-5 border rounded-lg shadow-none border-lightBlue-100">
          <div className="grid justify-between lg:w-3/4 gap-y-5 gap-x-4 lg:flex last:mr-24">
            <div className="flex items-center justify-center gap-x-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-primary`}>
                <User className="w-6 h-6 text-xs text-white" />
              </div>
              <TextGroup title="Name" value={userName} divClass="grid mt-2" />
            </div>
            <TextGroup title="Email ID" value={email} divClass="mt-2" />
            <TextGroup title="Mobile Number" value={mobile} divClass="mt-2" />
          </div>
        </Card>
        <CardContent className="px-4 font-semibold text-left">
          {kyc_status !== null ? (
            <>
              {/* KYC Documents */}
              <Card className="px-6 py-5 m-0 border rounded-lg shadow-none border-lightBlue-100">
                <div className="flex items-center pb-3 border-b border-b-blue-50 gap-x-3 lg:col-span-4">
                  <DocumentsSVG />
                  <p className="text-base font-medium">KYC Documents</p>
                  <KycBadge kyc_status={kyc_status} />
                  {reKyc && (
                    <Button variant="default" className="ml-auto" onClick={() => navigate("/kyc?edit=1")}>
                      Re-Upload Document
                    </Button>
                  )}
                </div>
                <div className="grid mt-6 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
                  <DocumentDetailsField
                    title={documentTitleMap[identityDocuments[0]?.document_type]}
                    value={formatDocumentValue(identityDocuments[0]?.document_value)}
                    fileIds={identityDocuments.map((doc) => doc.uuid)}
                  />
                  {gstDocument && (
                    <DocumentDetailsField
                      title="GST"
                      value={formatDocumentValue(gstDocument?.document_value)}
                      fileIds={[gstDocument.uuid]}
                    />
                  )}
                  <DocumentDetailsField
                    title={gstDocument ? "Company PAN" : "PAN"}
                    value={formatDocumentValue(panDocument?.document_value)}
                    fileIds={[panDocument?.uuid]}
                  />
                  <DocumentDetailsField
                    title="Signature"
                    value=""
                    className="lg:mx-auto"
                    fileIds={[kycDocs.find((doc) => ["signature"].includes(doc.document_type))?.uuid]}
                  />
                </div>
              </Card>
              <Card className="px-6 m-0 mt-5 mb-12 border rounded-lg shadow-none border-lightBlue-100 md:mb-0">
                <div className="flex items-center pb-3 border-b border-b-blue-50 gap-x-3 lg:col-span-4">
                  <BillingDetailsSVG />
                  <p className="text-base font-medium">Address</p>
                </div>
                <div className="mt-6 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:space-x-24">
                  {kycAttempted && (
                    <div className="space-y-2 md:mr-24">
                      <p className="text-sm font-medium">Billing Address</p>
                      <TextGroup
                        title={billingAddressName}
                        value={billingAddressDisplay}
                        subValueClass="text-sm font-normal"
                      />
                    </div>
                  )}
                  {displayAddress.length === 0 ? (
                    <Card
                      className="px-8 mx-2 my-0 border shadow-none max-w-96 border-lightBlue-100 hover:cursor-pointer"
                      onClick={() => navigate("/add-pickup-address")}
                    >
                      <CardContent className="p-2 m-2 text-blue">
                        <div className="flex flex-col items-center justify-center">
                          <CirclePlus className="w-12 h-12 p-1" />
                          <div className="mt-3 text-sm font-medium whitespace-nowrap">Add Pickup Address</div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    // Pickup Address
                    <div className="items-start mt-0 space-y-2">
                      <p className="text-sm font-medium">Pickup Address</p>
                      <TextGroup
                        title={pickupAddressName}
                        value={pickupAddressDisplay}
                        subValueClass="text-sm font-normal"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </>
          ) : (
            <KYCPendingPopup open={kycPending} setOpen={setKycPending} />
          )}
        </CardContent>
      </Card>
    </FranchisePage>
  );
}

const KycBadge = ({ kyc_status }: { kyc_status: string }) => {
  const getKYCStatusClass = (status: string) => {
    switch (status) {
      case "rejected":
        return "bg-pink-100 border-pink text-pink";
      case "partial":
        return "bg-orange-50 text-orange border-orange";
      default:
        return "bg-green-50 text-green border-green";
    }
  };
  const kycBadgeClass = getKYCStatusClass(kyc_status);
  return (
    <Badge className={`h-5 flex gap-x-2 text-[10px] ml-2 mt-0.5 font-medium ${kycBadgeClass}`}>
      {toSentenceCase(kyc_status)} {kyc_status === "approved" && <Approved />}
    </Badge>
  );
};
