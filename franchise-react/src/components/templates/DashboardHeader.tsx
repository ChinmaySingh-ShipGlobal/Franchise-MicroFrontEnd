import { useEffect, useState } from "react";
import { CircleHelp, LockKeyhole, LogOut, User } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "/logo.png";

import { UserWallet } from "@/components/elements/UserWallet";
import ProfileIcon from "@/components/elements/ProfileIcon";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import QuickMenu from "../elements/QuickMenu";

import { initialOrderCounts, OrderDetails } from "@/interfaces/dashboard";
import { useStore } from "@/zustand/store";
import { toggleLoginStatus, updateProfileDetails, updateWalletBalance } from "@/zustand/actions";

import { logout, logoutOtherDevices, profileDetails } from "@/services/auth";
import { getWalletBalance } from "@/services/wallet";
import { getDashboardOrders } from "@/services/dashboard";

export default function DashboardHeader({ children }: { children?: any }) {
  const isMobile = useMediaQuery("(max-width: 450px)");
  const navigate = useNavigate();
  const dispatch = useStore((state: any) => state.dispatch);
  const { firstname, lastname, email } = useStore((state: any) => state.profile);
  const [open, setOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  let initials = "SJ";
  let displayName = "Franchise User";
  if (firstname && lastname) {
    initials = firstname.slice(0, 1) + lastname.slice(0, 1);
    displayName = firstname + " " + lastname;
  }

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      dispatch(() => toggleLoginStatus(false));
      navigate("/auth/login");
    }
  };

  const location = useLocation();
  useEffect(() => {
    getWalletBalance().then((res) => {
      if (res) {
        dispatch(() => updateWalletBalance(Number(res)));
        setWalletBalance(res);
      }
    });
  }, [location.pathname]);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const [orders, setOrders] = useState<OrderDetails>(initialOrderCounts);
  async function fetchData() {
    const payload = {};
    const response = await getDashboardOrders(payload);
    if (response) {
      if (response.status === 200) {
        setOrders(response.data.data);
      } else {
        console.log(response.data.message);
      }
    }
  }
  useEffect(() => {
    profileDetails().then((res) => {
      dispatch(() => updateProfileDetails(res.data));
    });
  }, [location.pathname]);

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <header className="fixed top-0 left-0 z-10 flex w-full bg-white border-b border-b-gray-150 max-h-15">
      <div className="flex flex-row items-center justify-start">
        <img src={Logo} alt="logo" className="h-full p-4 cursor-pointer" onClick={() => navigate("/dashboard")} />
      </div>
      {children ? (
        children
      ) : (
        <div className="flex flex-row items-center ml-auto">
          {!isMobile && Number(orders?.total_orders) > 0 && (
            <QuickMenu open={isQuickMenuOpen} setOpen={setIsQuickMenuOpen} />
          )}
          <UserWallet isMobile={isMobile} walletBalance={walletBalance} />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="border-l border-l-lightBlue-100">
              <ProfileIcon text={initials} className="mx-4" />
            </PopoverTrigger>
            <PopoverContent className="max-w-xs px-0 mt-1 mr-8 border-0 shadow text-gray">
              <div className="flex items-center px-4 mb-4">
                <ProfileIcon text={initials} className="mr-3 min-w-8" />
                <div>
                  <p className="text-sm font-medium text-black">{displayName}</p>
                  <p className="text-xs font-normal">{email}</p>
                </div>
              </div>
              <Separator className="my-1 bg-gray-150" />
              <div className="px-2">
                <Link
                  to="#"
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                >
                  <MenuItem text="Profile" icon={<User className="w-5 h-5" />} />
                </Link>
                <Link
                  to="#"
                  onClick={() => {
                    setOpen(false);
                    navigate("/change-password");
                  }}
                >
                  <MenuItem text="Change Password" icon={<LockKeyhole className="w-5 h-5" />} />
                </Link>
                {/* <MenuItem text="Refer and Earn" icon={<Forward className="w-5 h-5" />} /> */}
                {/* <Separator className="my-1 bg-gray-150" />
              <MenuItem text="Rate Us" icon={<ThumbsUp className="w-5 h-5" />} />
              <Separator className="my-1 bg-gray-150" /> */}
                <Link
                  to="#"
                  onClick={() => {
                    setOpen(false);
                    logoutOtherDevices();
                  }}
                >
                  <MenuItem text="Logout all other devices" icon={<LogOut className="w-5 h-5" />} />
                </Link>
                <Separator className="my-1 bg-gray-150" />
                <Link to="https://shipglobal.in/blogs/" target="blank" rel="noreferrer">
                  <MenuItem text="Resource Center" icon={<CircleHelp className="w-5 h-5" />} />
                </Link>
                <Separator className="my-1 bg-gray-150" />
                <Link to="#" onClick={handleLogout}>
                  <MenuItem text="Sign Out" icon={<LogOut className="w-5 h-5" />} />
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </header>
  );
}

const MenuItem = ({ text, icon }: { text: string; icon: any }) => (
  <div className="flex items-center p-2 space-x-4 hover:bg-blue-200">
    {icon}
    <p className="text-sm font-medium">{text}</p>
  </div>
);
