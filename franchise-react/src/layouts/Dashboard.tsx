import { Dispatch, SetStateAction, useState, useRef } from "react";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import { Outlet } from "react-router-dom";
import { MobileNavigationBar, MobileSidebar, WebSidebar } from "@/components/templates/Navigation";
import DashboardHeader from "@/components/templates/DashboardHeader";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout() {
  const isMobile = useMediaQuery("(max-width: 450px)");
  const [open, setOpen] = useState(false);
  const [activeSubMenuId, setActiveSubMenuId] = useState<number | null>(null);

  return (
    <main className="w-full h-fit">
      <DashboardHeader />
      {isMobile ? (
        <MobileDashboard
          open={open}
          setOpen={setOpen}
          activeSubMenuId={activeSubMenuId}
          setActiveSubMenuId={setActiveSubMenuId}
        />
      ) : (
        <WebDashboard activeSubMenuId={activeSubMenuId} setActiveSubMenuId={setActiveSubMenuId} />
      )}
      <Toaster />
    </main>
  );
}

export const WebDashboard = ({
  activeSubMenuId,
  setActiveSubMenuId,
}: {
  activeSubMenuId: number | null;
  setActiveSubMenuId: Dispatch<SetStateAction<number | null>>;
}) => {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <>
      <WebSidebar
        hover={hover}
        setHover={setHover}
        activeSubMenuId={activeSubMenuId}
        setActiveSubMenuId={setActiveSubMenuId}
      />
      <aside className={`transition-all ease-out relative mt-15 ${hover ? "ml-52" : "ml-18"}`}>
        <Outlet />
      </aside>
      <div
        className={`bg-white border-t border-t-gray-150 fixed bottom-0 z-10 w-full h-12 left-0 ${
          hover ? "ml-52" : "ml-18"
        }`}
      />
    </>
  );
};

export const MobileDashboard = ({
  open,
  setOpen,
  activeSubMenuId,
  setActiveSubMenuId,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  activeSubMenuId: number | null;
  setActiveSubMenuId: Dispatch<SetStateAction<number | null>>;
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => {
    setOpen(false);
  };

  useOnClickOutside(sidebarRef, handleClickOutside);
  return (
    <>
      <MobileSidebar
        open={open}
        setOpen={setOpen}
        sidebarRef={sidebarRef}
        activeSubMenuId={activeSubMenuId}
        setActiveSubMenuId={setActiveSubMenuId}
      />
      <MobileNavigationBar setOpen={setOpen} />
      <aside className="relative mt-15">
        <Outlet />
      </aside>
    </>
  );
};
