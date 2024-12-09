import api, { publicApi } from "@/lib/api"; // Import the Axios instance
import { emailSchema } from "@/pages/auth/ForgotPassword";
import { leadFormSchema, loginSchema } from "@/schemas/Authentication";
import { changePasswordSchema } from "@/schemas/Profile";
import { AxiosError } from "axios";
import { z } from "zod";

export const createLead = async (data: z.infer<typeof leadFormSchema>) => {
  try {
    const response = await publicApi.post("/leads/create", {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      address: data.address,
      city: data.city,
      state_id: data.state,
      pincode: data.pincode,
      daily_orders: data.avgDailyOrder,
      description: data.description,
      mobile: data.mobile,
      toc: data.toc ? "1" : "0",
    });
    return response.data;
  } catch (error) {
    console.error("Error" + error);
  }
};

export const getLeadDetails = async () => {
  try {
    const response = await publicApi.get("/leads/lead-form-details");
    return response.data;
  } catch (error) {
    console.error("Error" + error);
  }
};

export const login = async (data: z.infer<typeof loginSchema>) => {
  try {
    const response = await publicApi.post("/auth/login", data);
    if (response.status === 200) {
      localStorage.setItem("token", response.data.data.token_details.token);
      return response.data;
    }
  } catch (error) {
    console.error("Error" + error);
  }
};

export const forgotPassword = async (data: z.infer<typeof emailSchema>) => {
  // get Reset Password Email Link on success
  try {
    return await publicApi.post("/auth/forgot-password", {
      email: data.email,
    });
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const resetPassword = async ({
  password,
  logout_all_devices,
  token,
}: {
  password: string;
  logout_all_devices: string;
  token: string;
}) => {
  // reset Password without login
  try {
    return await publicApi.post("/auth/reset-password", { password, logout_all_devices, token });
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const changePassword = async (data: z.infer<typeof changePasswordSchema>) => {
  // change password after login
  try {
    return await api.post("/auth/change-password", {
      password: data.newPassword,
      current_password: data.oldPassword,
      logout_all_devices: data.logout_all_devices ? "1" : "0",
    });
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const logout = async () => {
  try {
    const response = await api.get("/auth/logout");
    if (response.status === 200) {
      localStorage.removeItem("token");
      return response.data;
    }
  } catch (error) {
    console.error("Error" + error);
  }
};

export const logoutOtherDevices = async () => {
  try {
    const response = await api.get("/auth/logout-all-devices");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error" + error);
  }
};

export const profileDetails = async () => {
  try {
    const response = await api.get("/auth/get-profile");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error" + error);
  }
};

export const adminLogin = async (token: string) => {
  try {
    const response = await api.post("/auth/admin-login", {
      token: token,
    });
    if (response.status === 200) {
      localStorage.setItem("token", response.data.data.token_details.token);
      return response.data;
    }
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};
