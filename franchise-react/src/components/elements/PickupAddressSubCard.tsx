import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Trash, SquarePen } from "lucide-react";

interface PickupAddressSubCardProps {
  title: string;
  address: string;
  contact: string;
  buttonLabel?: string;
  buttonClassName?: string;
}

const PickupAddressSubCard: React.FC<PickupAddressSubCardProps> = ({ title, address, contact, buttonLabel }) => {
  return (
    <Card className="shadow-none m-2 border border-blue-50">
      <CardContent className="text-xs font-normal py-3 px-3">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">{title}</div>
          <div className="flex space-x-6">
            <Trash className="h-5 w-5 text-gray-800" />
            <SquarePen className="h-5 w-5 text-gray-800" />
          </div>
        </div>
        <div className=" space-y-3">
          <div className="flex gap-x-6">
            <div className="text-gray-800">Address</div>
            <div className="w-3/5">{address}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-6">
              <div className="text-gray-800">Contact</div>
              <div>{contact}</div>
            </div>
            <Badge className="text-xs font-medium rounded-sm text-purple bg-blue-50 ">{buttonLabel}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default PickupAddressSubCard;
