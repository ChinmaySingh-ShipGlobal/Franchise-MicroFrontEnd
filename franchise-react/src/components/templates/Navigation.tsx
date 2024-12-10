import { RefObject, Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Calculator,
  Layers3,
  LayoutDashboard,
  List,
  Package2,
  Pin,
  PinOff,
  Settings,
  Truck,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useStore } from "@/zustand/store";
import { SideBarItems } from "@/interfaces/dashboard";

const MobileMenuItems = (is_sg_city: boolean) => [
  {
    key: "/orders",
    label: "Orders",
    icon: <Box width="1.25rem" height="1.25rem" />,
    id: 2,
    other_keys: ["/order-summary", "/add-order", "/add-csbv-order", "/edit-order", "/add-bulk-order", "/view-order"],
  },
  {
    key: "/customers",
    label: "Customers",
    id: 3,
    icon: <Users width="1.25rem" height="1.25rem" />,
    other_keys: ["/add-csbv-details"],
  },
  {
    key: "/manifest-listing",
    label: "Manifests",
    icon: <Package2 width="1.25rem" height="1.25rem" />,
    id: 4,
    other_keys: ["/manifests"],
  },
  ...(is_sg_city
    ? [
        {
          key: "/pickup-listing",
          label: "Pickups",
          id: 5,
          icon: <Truck width="1.25rem" height="1.25rem" />,
          other_keys: ["/view-pickup"],
        },
      ]
    : []),
];

const MenuItems = (is_sg_city: boolean) => [
  {
    key: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard width="1.25rem" height="1.25rem" />,
    id: 1,
  },
  ...MobileMenuItems(is_sg_city),

  {
    key: "/calculator",
    label: "Rate Calculator",
    icon: <Calculator width="1.25rem" height="1.25rem" />,
    id: 6,
  },
  { key: "/wallet", label: "Wallet", id: 7, icon: <Wallet width="1.25rem" height="1.25rem" /> },
  {
    key: "/bulk-report",
    label: "Bulk Report",
    icon: <Layers3 width="1.25rem" height="1.25rem" />,
    id: 9,
  },
  {
    key: "#",
    label: "Settings",
    icon: <Settings width="1.25rem" height="1.25rem" />,
    id: 8,
    subMenu: [
      {
        key: "/profile",
        label: "Profile",
      },
      {
        key: "/change-password",
        label: "Password",
      },
    ],
  },
];

export const WebSidebar = ({
  setHover,
  hover,
  activeSubMenuId,
  setActiveSubMenuId,
  sidebarChildren,
}: {
  setHover: Dispatch<SetStateAction<boolean>>;
  hover: boolean;
  activeSubMenuId: number | null;
  setActiveSubMenuId: Dispatch<SetStateAction<number | null>>;
  sidebarChildren?: any;
}) => {
  const handleMenuClick = (id: number) => {
    setActiveSubMenuId((prevId) => (prevId === id ? null : id));
  };
  const profile = useStore((state: any) => state.profile);
  // console.log(profile, "profile");
  const [pinned, setPinned] = useState(false);

  return (
    <nav
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => !pinned && setHover(false)}
      className={`fixed left-0 z-10  h-screen overflow-y-auto border-r border-r-gray-150 top-15 hover:w-52 ${
        !pinned && !hover ? "w-18" : "w-52"
      }`}
    >
      <div className="absolute top-0 right-0 m-2">
        {hover &&
          (pinned ? (
            <PinOff className="w-4 h-4 text-gray-800 cursor-pointer" onClick={() => setPinned(false)} />
          ) : (
            <Pin className="w-4 h-4 text-gray-800 cursor-pointer" onClick={() => setPinned(true)} />
          ))}
      </div>
      {sidebarChildren ? (
        sidebarChildren
      ) : (
        <ul className="flex flex-col mx-4 mt-6 text-center">
          {MenuItems(profile.is_sg_city)?.map((item: MenuItem) => (
            <SidebarListItem
              key={item.key}
              item={item}
              hover={hover}
              isActive={activeSubMenuId === item.id}
              onClick={() => handleMenuClick(item.id)}
            />
          ))}
        </ul>
      )}
    </nav>
  );
};

interface MenuItem {
  key: string;
  label: string;
  icon: any;
  subMenu?: SubMenuItem[];
  id: number;
}

export const MobileSidebar = ({
  open = false,
  setOpen,
  sidebarRef,
  activeSubMenuId,
  setActiveSubMenuId,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  sidebarRef: RefObject<HTMLDivElement>;
  activeSubMenuId: number | null;
  setActiveSubMenuId: Dispatch<SetStateAction<number | null>>;
}) => {
  const variants = {
    open: { opacity: 1, x: 0, zIndex: 20 },
    closed: { opacity: 0, x: "-100%" },
  };
  const backgroundOverlay = {
    open: { opacity: 1, zIndex: 10 },
    closed: { opacity: 0 },
  };

  const handleMenuClick = (id: number) => {
    setActiveSubMenuId((prevId) => (prevId === id ? null : id));
  };
  const { firstname } = useStore((state: any) => state.profile);
  const profile = useStore((state: any) => state.profile);
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-0 w-full h-screen bg-black/60"
        animate={open ? "open" : "closed"}
        variants={backgroundOverlay}
        transition={{
          opacity: { ease: "easeOut" },
          layout: { duration: 0.5 },
        }}
        initial={false}
      />
      <motion.nav
        className="fixed top-0 left-0 w-full h-screen"
        animate={open ? "open" : "closed"}
        variants={variants}
        transition={{
          opacity: { ease: "easeInOut" },
          layout: { duration: 0.2 },
        }}
        initial={false}
      >
        <div className="fixed top-0 left-0 w-56 h-screen overflow-y-auto bg-white shadow" ref={sidebarRef}>
          <div className="flex flex-row items-start justify-center p-5 text-white bg-primary">
            <div className="w-5 h-5 ml-1 mr-3 rounded-full">
              <User width="1.25rem" height="1.25rem" />
            </div>
            <div className="flex-1 h-5 text-sm font-normal text-left rounded left-18">{firstname}</div>
          </div>
          <ul className="flex flex-col mx-4 mt-8 text-center">
            {MenuItems(profile.is_sg_city)?.map((item: SideBarItems) => (
              <SidebarListItem
                key={item.key}
                item={item}
                hover={true}
                isActive={activeSubMenuId === item.id}
                onClick={() => {
                  handleMenuClick(item.id);
                  !item.subMenu && setOpen(false);
                }}
                setOpen={setOpen}
              />
            ))}
          </ul>
        </div>
        <X width="1.5rem" height="1.5rem" className="absolute top-4 left-60 text-gray-150" />
      </motion.nav>
    </>
  );
};

export const MobileNavigationBar = ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const profile = useStore((state: any) => state.profile);
  const menuItems = MobileMenuItems(profile.is_sg_city);
  return (
    <nav className="fixed bottom-0 left-0 z-10 w-full h-16 bg-white border-t border-gray-200">
      <div className={`grid h-full max-w-lg  mx-auto ${profile.is_sg_city ? "grid-cols-5" : "grid-cols-4"}`}>
        {menuItems?.map((item) => (
          <NavLink
            to={item.key}
            key={item.key}
            className={`inline-flex flex-col items-center justify-center px-5 text-gray-700 hover:bg-gray-100 ${
              location.pathname === item.key && "bg-orange-50"
            } `}
          >
            {item.icon} <span className="pt-1 text-xs text-gray-800">{item.label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 text-gray-700 hover:bg-gray-100"
          onClick={() => setOpen(true)}
        >
          <List width="1.25rem" height="1.25rem" />
          <span className="pt-1 text-xs text-gray-800">Menu</span>
        </button>
      </div>
    </nav>
  );
};

interface ListItem {
  item: any;
  hover: boolean;
  isActive?: boolean;
  onClick?: () => void;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const SidebarListItem = ({ item, hover, isActive, onClick, setOpen }: ListItem) => {
  const location = useLocation();
  const activeSideBar =
    (location.pathname === item.key ||
      (item.other_keys && item.other_keys.find((key: string) => location.pathname.startsWith(key)))) &&
    !item.subMenu;
  return (
    <>
      <NavLink
        to={item.key}
        onClick={onClick}
        className={`${isActive && item.subMenu ? "mb-0" : "mb-3"}  ${
          activeSideBar ? "bg-orange-50 rounded-[8px] border border-orange-300 text-orange" : "text-gray"
        } `}
      >
        <li
          className={`flex flex-row items-center justify-center py-2.5 px-2 rounded h-9 w-10 ${
            item.subMenu && isActive ? "text-orange" : ""
          }`}
        >
          {/* Icon Menu Item */}
          <div className="fixed w-5 h-5 left-[25px]">{item.icon}</div>
          {/* Menu Label */}
          <div
            className={`fixed flex-1 font-normal text-left text-sm left-14 ${
              item.subMenu && (isActive ? "sidebar-nav-item-open" : "sidebar-nav-item-close")
            } ${hover ? "block" : "hidden"}`}
          >
            {item.label}
          </div>
        </li>
      </NavLink>
      {isActive &&
        hover &&
        item.subMenu?.map((subitem: { key: string; label: string }) => (
          <SidebarSubMenuItem key={subitem.key} item={subitem} hover={hover} setOpen={setOpen} />
        ))}
    </>
  );
};

interface SubMenuItem {
  key: string;
  label: string;
}

const SidebarSubMenuItem = ({
  item,
  hover,
  setOpen,
}: {
  item: SubMenuItem;
  hover: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const location = useLocation();
  const isActive = location.pathname + location.search === item.key;

  return (
    <NavLink
      to={item.key}
      onClick={() => setOpen && setOpen(false)}
      className={`ml-10 my-1 motion-safe:ease-out  ${isActive && "bg-orange-50"} `}
    >
      <li
        className={`flex flex-row items-center space-x-2 p-2 text-gray rounded h-8 delay-75 ${
          isActive && "border border-orange-300 rounded-lg text-orange"
        }`}
      >
        <div className={`w-1 h-1 bg-gray rounded left-6 ${isActive ? "bg-orange" : "bg-gray"}`}></div>
        <div
          className={` flex-1 font-normal text-left text-sm left-14 whitespace-nowrap ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        >
          {item.label}
        </div>
      </li>
    </NavLink>
  );
};
