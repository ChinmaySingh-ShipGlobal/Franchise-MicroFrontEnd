import TextGroup from "@/components/elements/TextGroup";
import { Button } from "@/components/ui/button";
import { ItemDetails, ProductDetails } from "@/zustand/interfaces";
import { useStore } from "@/zustand/store";
import { useState } from "react";

export default function ItemSummary() {
  const { products, packageBreadth, packageLength, packageHeight } = useStore(
    (state: any) => state.order.shipmentDetails,
  );
  const shippingRates = useStore((state: any) => state.order.shippingRates);

  return (
    <>
      <p className="pb-3 text-sm font-semibold">Item Details</p>
      <div className="flex flex-col w-full text-left gap-y-4">
        <BoxMeasurements
          billed_weight={
            shippingRates.package_weight > shippingRates.volume_weight
              ? shippingRates.bill_weight / 1000
              : shippingRates.volume_weight / 1000
          }
          breadth={packageBreadth}
          length={packageLength}
          height={packageHeight}
        />
        <ProductsDetails products={products} />
      </div>
    </>
  );
}

export const BoxMeasurements = ({
  billed_weight,
  length,
  breadth,
  height,
}: {
  billed_weight: number;
  length: number;
  breadth: number;
  height: number;
}) => {
  return (
    <div className="flex justify-between">
      <TextGroup title="Billed Weight" value={billed_weight + " KG"} />
      <TextGroup title="Dimensions" value={`${length} cm x ${breadth} cm x ${height} cm`} />
    </div>
  );
};

export const ProductsDetails = ({ products }: { products: ProductDetails[] }) => {
  console.log(products);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { invoiceCurrency } = useStore((state: any) => state.order.shipmentDetails);
  return (
    <>
      <div className="flex flex-col w-full text-left gap-y-4">
        {showAllProducts ? (
          products &&
          products.map((product) => (
            <Item
              key={product.id}
              productName={product.productName}
              productHSN={product.productHSN}
              productQty={product.productQty}
              productSKU={product.productSKU}
              productUnitPrice={product.productUnitPrice}
              currency={invoiceCurrency}
            />
          ))
        ) : (
          <Item
            key={products[0].id}
            productName={products[0].productName}
            productHSN={products[0].productHSN}
            productSKU={products[0].productSKU}
            productQty={products[0].productQty}
            productUnitPrice={products[0].productUnitPrice}
            currency={invoiceCurrency}
          />
        )}
      </div>
      {products.length > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-orange">
            {showAllProducts ? "" : "+ " + String(Number(products.length) - 1) + " more products . . ."}
          </p>
          <Button variant="link" className="p-0 text-xs" onClick={() => setShowAllProducts(!showAllProducts)}>
            {showAllProducts ? "Hide" : "View"}
          </Button>
        </div>
      )}
    </>
  );
};

export const ItemDetailsView = ({ items, currency }: { items: ItemDetails[]; currency: string }) => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  return (
    <>
      <div className="flex flex-col w-full text-left gap-y-4">
        {showAllProducts ? (
          items &&
          items.map((product) => (
            <Item
              key={product.vendor_order_item_id}
              productName={product.vendor_order_item_name}
              productHSN={product.vendor_order_item_hsn}
              productSKU={product.vendor_order_item_sku}
              productQty={product.vendor_order_item_quantity}
              productUnitPrice={product.vendor_order_item_unit_price}
              currency={currency}
            />
          ))
        ) : (
          <Item
            key={items[0].vendor_order_item_id}
            productName={items[0].vendor_order_item_name}
            productHSN={items[0].vendor_order_item_hsn}
            productQty={items[0].vendor_order_item_quantity}
            productSKU={items[0].vendor_order_item_sku}
            productUnitPrice={items[0].vendor_order_item_unit_price}
            currency={currency}
          />
        )}
      </div>
      {items.length > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-orange">
            {showAllProducts ? "" : "+ " + String(Number(items.length) - 1) + " more products . . ."}
          </p>
          <Button variant="link" className="p-0 text-xs" onClick={() => setShowAllProducts(!showAllProducts)}>
            {showAllProducts ? "Hide" : "View"}
          </Button>
        </div>
      )}
    </>
  );
};

export const Item = ({
  productName,
  productHSN,
  productSKU,
  productQty,
  productUnitPrice,
  currency,
}: {
  productName: string;
  productHSN: string;
  productSKU: string;
  productQty: number | string;
  productUnitPrice: number | string;
  currency: string;
}) => {
  return (
    <div className="gap-y-12">
      <div className="grid grid-cols-3 ">
        <TextGroup title="Product" value={productName} />
        <TextGroup title="HSN" value={productHSN} divClass="ml-2 xl:ml-4" />
        <TextGroup title="SKU" value={productSKU} divClass="ml-2 xl:ml-4" />
      </div>
      <div className="grid grid-cols-3 ">
        <TextGroup title="Qty" value={productQty} />
        <TextGroup
          title="Unit Price"
          value={
            currency
              ? currency + " " + Number(productUnitPrice).toFixed(2)
              : "INR" + " " + Number(productUnitPrice).toFixed(2)
          }
          divClass="ml-2 xl:ml-4"
        />
        <TextGroup
          title="Total"
          value={
            currency
              ? currency + " " + (Number(productUnitPrice) * Number(productQty)).toFixed(2)
              : "INR" + " " + (Number(productUnitPrice) * Number(productQty)).toFixed(2)
          }
          divClass="ml-2 xl:ml-4"
        />
      </div>
    </div>
  );
};
