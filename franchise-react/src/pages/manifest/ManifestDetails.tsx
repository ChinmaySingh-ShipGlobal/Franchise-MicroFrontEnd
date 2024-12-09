import InfoBox from "@/components/elements/InfoBox";
import {
  CartonSVG,
  DollarSVG,
  LocationSVG,
  PlaneSVG,
  RupeeSVG,
  TruckSVG,
  WeightSVG,
} from "@/assets/ManifestSymbolsSVG";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toSentenceCase } from "@/lib/utils";
import api, { downloadFile } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export const ManifestDetails = (manifestDetails: any) => {
  const manifestAllDetails = manifestDetails.manifestDetails;
  const navigate = useNavigate();

  const generateInvoice = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      api
        .post(
          "pickup/manifest/print-manifest",
          {
            manifest_code: manifestAllDetails.manifest.manifest_code,
          },
          {
            responseType: "blob",
          },
        )
        .then((res) => {
          downloadFile(res, "Manifest.pdf");
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const generateBoxLabel = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      api
        .post(
          "pickup/manifest/print-manifest-label",
          {
            manifest_code: manifestAllDetails.manifest.manifest_code,
          },
          {
            responseType: "blob",
          },
        )
        .then((res) => {
          downloadFile(res, "BoxLabel.pdf");
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  const pickupAddress = [
    manifestAllDetails.pickup_address?.address_nickname,
    manifestAllDetails?.pickup_address?.address,
    manifestAllDetails.pickup_address?.locality,
    manifestAllDetails.pickup_address?.city,
    manifestAllDetails.pickup_address?.postcode,
  ]
    .filter(Boolean)
    .map(toSentenceCase)
    .join(", ");
  return (
    <Card className="p-0 m-0 mt-4 shadow-none">
      {manifestAllDetails.show_buttons && (
        <CardContent className="p-0">
          <div className="grid py-5 space-y-2 border-b mx-4 md:grid-cols-3 ">
            <div className="flex mx-1 gap-x-2 border-b-gray-300 md:col-span-2">
              <LocationSVG />
              <div className="text-sm">
                <p className="font-normal text-gray-800 ">
                  {toSentenceCase(manifestAllDetails.pickup_address.firstname) +
                    " " +
                    toSentenceCase(manifestAllDetails.pickup_address.lastname)}
                </p>
                <p className="mt-1 font-medium">{pickupAddress}</p>
              </div>
            </div>
            <div className="flex justify-center">
              {manifestAllDetails.manifest?.manifest_status === "close" &&
                manifestAllDetails.isShipGlobalPickupService !== 0 && (
                  <Button
                    className="text-xs font-normal w-44"
                    onClick={() => navigate(`/view-pickup/${manifestAllDetails.manifest.pickup_request_id}`)}
                  >
                    View Pickup Request
                  </Button>
                )}
            </div>
          </div>
          <div
            className={`grid  ${
              manifestAllDetails.manifest?.manifest_status === "close" ? "lg:grid-cols-3" : "lg:grid-cols-2"
            }`}
          >
            <div
              className={`grid grid-cols-2 py-4 pl-5 lg:grid-cols-2 gap-x-4 gap-y-4 ${
                manifestAllDetails.manifest?.manifest_status !== "close" && "lg:w-11/12"
              }`}
            >
              <InfoBox
                icon={<RupeeSVG />}
                title={`Rs. ${manifestAllDetails.manifest.manifest_bill_total}`}
                text="Shipment Cost"
                className={`${manifestAllDetails.manifest?.manifest_status !== "close" && "lg:max-w-52"}`}
              />
              <InfoBox
                icon={<DollarSVG />}
                title={"Rs. " + manifestAllDetails.manifest.manifest_total}
                text="Total Invoice Value"
                className={`${manifestAllDetails.manifest?.manifest_status !== "close" && "lg:max-w-52"}`}
              />

              <InfoBox
                icon={<WeightSVG />}
                title={manifestAllDetails.manifest.manifest_weight / 1000 + " KG"}
                text="Total Order Weight"
                className={`${manifestAllDetails.manifest?.manifest_status !== "close" && "lg:max-w-52"}`}
              />
              <InfoBox
                icon={<CartonSVG />}
                title={
                  Number(manifestAllDetails.manifest.manifest_count) < 10 &&
                  Number(manifestAllDetails.manifest.manifest_count) !== 0
                    ? `0${manifestAllDetails.manifest.manifest_count}`
                    : `${manifestAllDetails.manifest.manifest_count}`
                }
                text="Box Count"
                className={`${manifestAllDetails.manifest?.manifest_status !== "close" && "lg:max-w-52"}`}
              />
            </div>
            <div className="grid py-4 pl-5 md:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-4">
              {manifestAllDetails.manifest?.manifest_status === "close" && (
                <>
                  <InfoBox
                    icon={<PlaneSVG />}
                    title={manifestAllDetails.manifest.manifest_partner_pickup_awb}
                    text="AWB Number"
                    className="lg:max-w-64 lg:min-w-52"
                  />
                  <InfoBox
                    icon={<TruckSVG />}
                    title={manifestAllDetails.manifest.partner_pickup_display}
                    text="Pickup Services"
                    className="lg:max-w-max lg:min-w-64"
                  />
                </>
              )}
            </div>
            {manifestAllDetails.manifest?.manifest_status === "close" && (
              <div className="flex justify-center py-5 lg:flex-col lg:items-center gap-x-4 gap-y-5">
                <Button className="text-xs font-normal w-44" onClick={() => generateInvoice()}>
                  <Download className="w-5 h-5" />
                  <span className="ml-2">Manifest</span>
                </Button>
                {manifestAllDetails.isShipGlobalPickupService !== 0 && (
                  <Button className="text-xs font-normal w-44" onClick={() => generateBoxLabel()}>
                    <Download className="w-5 h-5" />
                    <span className="ml-2">Box Label</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
