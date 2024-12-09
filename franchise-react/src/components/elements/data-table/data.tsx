export const data = Array.from({ length: 1000 }, (_) => ({
  orderDate: "2024-05-14",
  orderId: "SG32405074",
  customerDetails: "mukesharrora@gmail.com",
  packageDetails: "Package Volume: 0.012",
  shipping: "SG12323287272",
  status: "In Progress",
}));

export type TableData = {
  orderDate: string;
  orderId: string;
  customerDetails: string;
  packageDetails: string;
  shipping: string;
  status: string;
};
