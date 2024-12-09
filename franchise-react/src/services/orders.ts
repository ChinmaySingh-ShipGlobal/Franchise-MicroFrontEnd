import { ProcessDispute, ValidateOrderItems } from "@/interfaces/add-order";
import api, { downloadFile } from "@/lib/api";
import { placeOrderSchema, rateCalculatorSchema } from "@/schemas/Order";
import { AxiosError } from "axios";
import { z } from "zod";

export const rateCalculator = async (data: z.infer<typeof rateCalculatorSchema>) => {
  try {
    const response = await api.post("/orders/get-shipper-rates", {
      customer_shipping_postcode: data.destPincode,
      customer_shipping_country_code: data.destCountry,
      package_weight: data.deadWeight,
      package_length: data.packageLength,
      package_breadth: data.packageBreadth,
      package_height: data.packageHeight,
    });
    if (response.status === 200) return response.data;
    else return response.status;
    //return status code in case of unsuccessful response
  } catch (error) {
    console.error("Error" + error);
  }
};

export const getOrderDetails = (orderId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post("/orders/get-order-details", {
        order_id: orderId,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createOrderId = async (data: z.infer<typeof placeOrderSchema>) => {
  try {
    return await api.post("/orders/add-order", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const validateItemsAmount = async (data: ValidateOrderItems) => {
  try {
    return await api.post("/orders/validate-order-invoice", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const payAndAddOrder = async (order_id: string) => {
  try {
    return await api.post("/orders/pay-order", { order_id, add_to_draft: true });
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};

export const payOrder = (orderId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post("orders/pay-order", {
        order_id: orderId,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const bulkPayOrder = (orderIds: string[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post("orders/bulk-pay-order", {
        orders: orderIds.join(","),
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const bulkProcess = (job: "label" | "invoice", orderIds: string[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post("orders/bulk-process", {
        job,
        order_ids: orderIds,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const generateLabel = (orderId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post(
        "orders/generate-label",
        {
          order_id: orderId,
        },
        {
          responseType: "blob",
        },
      )
      .then((res) => {
        downloadFile(res, "defaultFileName.pdf");
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const generateInvoice = (orderId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post(
        "orders/generate-invoice",
        {
          order_id: orderId,
        },
        {
          responseType: "blob",
        },
      )
      .then((res) => {
        downloadFile(res, "defaultFileName.pdf");
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelOrder = (orderId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post("orders/cancel-order", {
        order_id: orderId,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const processDispute = async (data: ProcessDispute) => {
  try {
    return await api.post("/disputes/process-disputes", data);
  } catch (error) {
    console.error("Error" + error);
    const err = error as AxiosError;
    return err.response;
  }
};
