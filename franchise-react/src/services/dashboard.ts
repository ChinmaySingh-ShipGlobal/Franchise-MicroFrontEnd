import { OrderDetailsPeriod } from "@/interfaces/dashboard";
import api from "@/lib/api";
import { AxiosError } from "axios";

export const getDashboardOrders = async (data: OrderDetailsPeriod) => {
  try {
    return await api.post("/dashboard", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};
