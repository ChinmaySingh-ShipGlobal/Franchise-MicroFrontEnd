import { adminLogin } from "@/services/auth";
import { useEffect } from "react";
import { useStore } from "@/zustand/store";
import { useNavigate } from "react-router-dom";
import { toggleLoginStatus, updateProfileDetails, updateWalletBalance } from "@/zustand/actions";

export const AdminLogin = () => {
  const dispatch = useStore((state: any) => state.dispatch);
  const navigate = useNavigate();

  useEffect(() => {
    const loginAdmin = async () => {
      let token = location.search.slice(1);
      if (!token) {
        navigate("/auth/login");
      }
      try {
        const response = await adminLogin(token);
        if (response) {
          dispatch(() => toggleLoginStatus(true));
          dispatch(() => updateProfileDetails(response.data.vendor_details));
          dispatch(() => updateWalletBalance(response.data.vendor_details.wallet_balance));
          navigate("/dashboard");
        }
      } catch (error) {
        navigate("/auth/login");
      }
    };
    loginAdmin();
  }, []);

  return <></>;
};
