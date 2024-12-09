import { LocationSVG, PickupCartonSVG, WeightSVG } from "@/assets/ManifestSymbolsSVG";
import InfoBox from "@/components/elements/InfoBox";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateShortMonth, toSentenceCase } from "@/lib/utils";

export const PickupRequestDetails = ({ pickupDetails }: { pickupDetails: any }) => {
  const { pickupDetail } = pickupDetails || {};
  if (!pickupDetail?.address_id) return null;

  const {
    firstname,
    lastname,
    address_nickname,
    address,
    city,
    locality,
    postcode,
    pickup_date,
    totalOrders,
    totalWeight,
    manifest_count,
    manifest_weight,
    estimated_orders,
    estimated_weight,
  } = pickupDetail;

  return (
    <Card className="p-0 m-0 mt-4 shadow-none border-lightBlue-100 border rounded-xl">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row px-5 py-4 space-y-4 justify-between bg-gray-100 border border-lightblue-100 rounded-xl rounded-b-none">
          <div className="flex text-sm gap-x-2 border-b-gray-300 md:col-span-2">
            <LocationSVG />
            <div>
              <p className="text-gray-800">{`${toSentenceCase(firstname)} ${toSentenceCase(lastname)}`}</p>
              <p className="mt-1 font-medium text-sm lg:max-w-144">
                {[address_nickname, address, city, locality, postcode]
                  .filter((part) => part)
                  .map(toSentenceCase)
                  .join(", ")}
                , India
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between text-sm font-normal text-gray-800 md:flex-row gap-x-14">
            <p>
              Pickup Date: <span className="text-black">{formatDateShortMonth(pickup_date)}</span>
            </p>
            <p>
              Total Orders: <span className="text-black">{totalOrders}</span>
            </p>
            <p>
              Total Weight: <span className="text-black">{Number(totalWeight).toFixed(2)} kg</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-full py-4 lg:flex-row px-7 gap-x-11">
          {manifest_count !== "0" && (
            <OrderDetails order="Manifested Order Details" title={manifest_count} weight={manifest_weight} />
          )}
          {estimated_orders !== "0" && (
            <OrderDetails
              order={manifest_count !== "0" ? "Additional Order Details" : "Pickup Request"}
              title={estimated_orders}
              weight={estimated_weight}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const OrderDetails = ({ order, title, weight }: { order: string; title: string; weight: string }) => {
  return (
    <Card className="w-full p-0 m-0 shadow-none rounded-md lg:max-w-96">
      <CardContent className="p-0">
        <div className="px-5 py-4 border border-lightBlue-100 rounded-xl">
          <p className="px-3 pb-4 text-sm font-semibold border-b">{order} </p>
          <div className="flex justify-between pt-1 space-x-8 text-sm font-normal">
            <InfoBox icon={<PickupCartonSVG />} title={title} text="Total Order" className="border-none" />
            <InfoBox icon={<WeightSVG />} title={`${weight} kg`} text="Total Weight" className="border-none" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
