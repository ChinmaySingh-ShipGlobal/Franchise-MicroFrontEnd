import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { rateCalculator } from "@/services/orders";
import { getCountries } from "@/services/locations";
import SGFormField from "@/components/elements/SGFormField";
import { DisplayBox } from "@/pages/order/forms/ShippingPartner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import FranchisePage from "@/layouts/FranchisePage";
import { Country, rateCalculatorSchema } from "@/schemas/Order";
import { Icon } from "@iconify/react";
import { RateCalculatorData, Shipper } from "@/zustand/interfaces";
import { getSortedRates } from "@/lib/utils";
import QuickTips from "./QuickTips";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
export default function RateCalculator() {
  const initialValues = {
    destCountry: "",
    destPincode: "",
  };

  const form = useForm({ resolver: zodResolver(rateCalculatorSchema), defaultValues: initialValues });
  const [showCalculatedWeight, setShowCalculatedWeight] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RateCalculatorData | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  // const [sortOption, setSortOption] = useState<string>("cheapest");

  useEffect(() => {
    getCountries().then((res) => {
      if (res.data.countries.length > 0) setCountries(res.data.countries);
    });
  }, []);

  function reset() {
    setShowCalculatedWeight(false);
    form.reset();
    setLoading(false);
    form.reset(initialValues);
  }

  async function onSubmit(data: z.infer<typeof rateCalculatorSchema>) {
    setLoading(true);
    const response = await rateCalculator(data);
    if (response && response.errors.length === 0) {
      setData(response.data);
      setShowCalculatedWeight(true);
    } else {
      setData({ pickup_fee: 0, package_weight: 0, volume_weight: 0, bill_weight: 0, notices: [], rate: [] });
      setShowCalculatedWeight(true);
    }
    setLoading(false);
  }
  console.log(data);
  return (
    <FranchisePage className="h-full min-h-screen">
      {/* <BreadcrumbNav parent="Rate Calculator" pageTitle="Rate Calculator" /> */}
      <BreadcrumbNav pageTitle="Rate Calculator" />
      <div className="lg:flex lg:flex-row">
        <Card className="pb-4 mx-0 mt-0 lg:w-2/3 px-0 shadow-none">
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row gap-x-2 md:gap-x-10">
                  <div className="md:w-1/2">
                    <SGFormField
                      type="select-country"
                      name="destCountry"
                      required
                      label="Destination Country"
                      form={form}
                      selectValues={countries}
                    />
                  </div>
                  <div className="md:w-1/2">
                    <SGFormField type="text" name="destPincode" required label="Destination Pincode" form={form} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="md:mr-10">
                    <SGFormField type="input-weight" name="deadWeight" required label="Dead Weight" form={form} />
                  </div>
                  <div className="mt-3 md:mt-0 md:mr-5">
                    <SGFormField type="input-size" name="packageLength" label="Length" form={form} />
                  </div>
                  <div className="mt-3 md:mt-0 md:mr-5">
                    <SGFormField type="input-size" name="packageBreadth" label="Breadth" form={form} />
                  </div>
                  <div className="mt-3 md:mt-0">
                    <SGFormField type="input-size" name="packageHeight" label="Height" form={form} />
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-6 lg:justify-end">
                  <Button variant="outline" type="reset" className="border-primary text-primary" onClick={reset}>
                    Reset
                  </Button>
                  <div className="flex items-center justify-center">
                    {loading ? (
                      <Button type="submit" disabled>
                        Calculate
                        <Icon icon="lucide:loader" className={"self-center ml-2 animate-spin"} />
                      </Button>
                    ) : (
                      <Button type="submit">Calculate</Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
            {showCalculatedWeight && data && (
              <>
                {data.rate.length > 0 && (
                  <div className="flex justify-center gap-2 mt-5">
                    <DisplayBox text={data.package_weight / 1000 + " KG"} label="Dead Weight" />
                    <DisplayBox text={data.volume_weight / 1000 + " KG"} label="Volumetric Weight" />
                    <DisplayBox text={data.bill_weight / 1000 + " KG"} label="Billed Weight" active />
                  </div>
                )}
                <div className="flex flex-row justify-between mt-5">
                  <span className="self-center font-semibold">Showing {data.rate.length} Results</span>
                  {/* <Select onValueChange={(value) => setSortOption(value)} defaultValue={sortOption}>
                    <SelectTrigger className="font-semibold w-fit">
                      <Label className="mr-1">Sort by :</Label>
                      <SelectValue placeholder="Cheapest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cheapest">Cheapest</SelectItem>
                      <SelectItem value="fastest">Fastest</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-normal text-gray-900">Courier Partner</TableHead>
                      <TableHead className="font-normal text-gray-900">Estimated Delivery Time</TableHead>
                      <TableHead className="font-normal text-gray-900">Shipment Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.rate.length > 0 ? (
                      getSortedRates(data.rate, "cheapest").map((item: Shipper, idx: number) => (
                        <>
                          {item.helper_text && (
                            <TableCell
                              className="absolute w-full py-0 m-0 border border-b-0 rounded-t bg bg-blue-50"
                              colSpan={3}
                            >
                              <div className="py-0.5 text-xs" dangerouslySetInnerHTML={{ __html: item.helper_text }} />
                            </TableCell>
                          )}
                          <TableRow key={idx} className={`${item.helper_text !== "" && "border-t-0"}`}>
                            <TableCell className={`font-medium ${item.helper_text !== "" && "pt-5"}`}>
                              {item.display_name}
                            </TableCell>
                            <TableCell className={`${item.helper_text !== "" && "pt-5"}`}>
                              {item.transit_time}
                            </TableCell>
                            <TableCell className={`${item.helper_text !== "" && "pt-5"}`}>Rs. {item.rate}</TableCell>
                          </TableRow>
                        </>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell className="font-medium">No Data Found</TableCell>
                        <TableCell className="font-medium">No Data Found</TableCell>
                        <TableCell className="font-medium">No Data Found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="hidden pt-0 mt-0 px-5 lg:w-1/3 lg:block shadow-none h-176">
          <QuickTips />
        </Card>
      </div>
    </FranchisePage>
  );
}
