import { BoxSVG } from "@/assets/BoxSVG";
import { Info } from "lucide-react";

export default function QuickTips() {
  return (
    <div className="flex flex-col items-center justify-center pb-4 gap-y-4">
      <p className="mt-4 text-base font-semibold">Quick Tips</p>
      <BoxSVG />
      <div className="space-y-4 text-xs font-normal">
        <p className="text-sm font-semibold text-left">Dead Weight:</p>
        <p>
          Dead/Dry weight or volumetric weight whichever is higher will be taken while calculating the freight rates.
        </p>
        <p>
          Fixed COD charge or COD % of the order value whichever is higher will be taken while calculating the COD fee.
        </p>
        <p>Above prices are exclusive of GST</p>
        <p>The above pricing is subject to change based on fuel surcharges and courier company base rates.</p>
      </div>
      <div className="mt-6 text-xs">
        <p className="text-sm font-semibold">
          Volumetric Weight:
          <span className="font-base mx-2">(L x W x H / 5000)</span>
        </p>
        <p className="mt-4 font-normal">
          Volumetric Weight (or DIM weight) is calculated based on the dimensions of the package.
        </p>
        <p className="mt-4">
          The formula for calculating volumetric weight involves multiplying the length, width, and height of the
          package and then dividing by 5000.
        </p>
      </div>
    </div>
  );
}
