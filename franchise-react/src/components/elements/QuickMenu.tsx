import { Calculator, Grid2X2, PackageMinusIcon, PackageOpen, Sparkles, Truck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useStore } from "@/zustand/store";
import { Dispatch, SetStateAction } from "react";

export const QuickMenu = ({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const navigate = useNavigate();
  const { is_sg_city, csb5_enabled } = useStore((state: any) => state.profile);

  const Qmenu = [
    {
      title: "Add Order",
      icon: <PackageMinusIcon className="w-10 h-10 p-2 bg-white rounded-md text-blue" />,
      path: "/add-order",
    },
    ...(csb5_enabled === "1"
      ? [
          {
            title: "Add CSB-V Order",
            icon: <Grid2X2 className="w-10 h-10 p-2 bg-white rounded-md text-blue" />,
            path: "/add-csbv-order",
          },
        ]
      : []),
    {
      title: "Create Manifest",
      icon: <PackageOpen className="w-10 h-10 p-2 bg-white rounded-md text-blue" />,
      path: "/manifest-listing",
    },
    ...(is_sg_city
      ? [
          {
            title: "Pickup Request",
            icon: <Truck className="w-10 h-10 p-2 bg-white rounded-md text-blue" />,
            path: "/pickup-listing",
          },
        ]
      : []),

    {
      title: "Rate Calculator",
      icon: <Calculator className="w-10 h-10 p-2 bg-white rounded-md text-blue" />,
      path: "/calculator",
    },
  ];
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="py-0 mr-4 border-r border-r-lightBlue-100">
        <Button variant="link" className="py-0 mr:4" onClick={() => setOpen(!open)}>
          <Sparkles className="w-6 h-6 p-1 mr-1 text-blue" /> Quick Actions
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex justify-around p-6 mt-2 mr-16 border-0 shadow min-w-max gap-x-4">
        {Qmenu.map((item) => (
          <div
            className={`py-3 text-center px-4 max-w-28 flex flex-col items-center bg-lightBlue-50 hover:scale-105 hover:duration-200 hover:cursor-pointer  rounded-2xl`}
            key={item.path}
            onClick={() => {
              navigate(`${item.path}`);
              setOpen(false);
            }}
          >
            {item.icon}
            <p className="mt-2 text-sm font-normal">{item.title}</p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default QuickMenu;
