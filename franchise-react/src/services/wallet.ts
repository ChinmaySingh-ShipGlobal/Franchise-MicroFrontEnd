import api from "@/lib/api";
export const getWalletBalance = async () => {
  try {
    const response = await api.get("/wallet/balance");
    return response.data.data.wallet_balance;
  } catch (error) {
    console.error("Error" + error);
  }
};

export const initiateTransaction = (amount: number, paymentGateway: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post("/wallet/create-transaction", {
        amount: amount,
        payment_gateway: paymentGateway,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getActivePaymentGateways = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .get("payment-gateway/get-active")
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getTransactionDetails = (transactionCode: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post("/wallet/get-transaction-details", {
        transaction_code: transactionCode,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getTransactionHistory = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post("/wallet", {})
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getTransactionStatus = (transactionCode: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    api
      .post("/wallet/get-transaction-status", {
        transaction_code: transactionCode,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
