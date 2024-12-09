import { resetConsigneeLocation, resetCustomerID, resetOrderForm } from "@/zustand/actions";
import { useStore } from "@/zustand/store";
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface FranchisePageProps {
  children: ReactNode;
  className?: string;
}

export default function FranchisePage({ children, className = "" }: FranchisePageProps) {
  const location = useLocation();
  const dispatch = useStore((state: any) => state.dispatch);

  useEffect(() => {
    if (
      location.pathname !== "/add-order" &&
      location.pathname !== "/edit-order/:orderId" &&
      location.pathname !== "/add-csbv-order"
    ) {
      dispatch(() => resetOrderForm());
      dispatch(() => resetConsigneeLocation());
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== "/add-csbv-details") {
      dispatch(() => resetCustomerID());
    }
  }, []);

  return (
    <section className={`bg-gray-50 ${className}`}>
      <div className="pb-8 pt-6 mx-4 lg:mx-5 2xl:mx-56">{children}</div>
    </section>
  );
}
