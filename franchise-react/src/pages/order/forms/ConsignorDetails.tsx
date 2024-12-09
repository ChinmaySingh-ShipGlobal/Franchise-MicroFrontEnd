import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useStore } from "@/zustand/store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { addCustomerID, updateActiveOrderStep, updateOrderConsignorID } from "@/zustand/actions";
import { getCustomerDetails, searchCustomers } from "@/services/customers";
import ErrorMessage from "@/components/elements/ErrorMessage";
import { initialSelectedConsignorDetails, SelectedConsignorDetails } from "@/zustand/interfaces";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AddCustomer, Customer } from "@/interfaces/add-order";
import { documents } from "@/lib/constants";
import CSBIVAddCustomerPopup from "@/pages/customer/CSBIVCustomerAdd";

export default function ConsignorDetails({ edit = false, csbv = false }: { edit?: boolean; csbv?: boolean }) {
  const dispatch = useStore((state: any) => state.dispatch);
  const consignor = useStore((state: any) => state.order.selectedConsignorDetails);
  const [searchParams, setSearchParams] = useSearchParams();

  const [customerPopupOpen, setCustomerPopupOpen] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openUpgradePopup, setOpenUpgradePopup] = useState(false);
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [selectedConsignor, setSelectedConsignor] = useState<SelectedConsignorDetails>(initialSelectedConsignorDetails);
  const [customers, setCustomers] = useState<AddCustomer[]>([]);

  async function getCustomersList(search_term: string) {
    return await searchCustomers(search_term.trim()).then((res) => {
      setCustomers([]);
      if (res.data.length > 0) {
        setCustomersList(res.data);
        res.data.forEach((customer: Customer) => {
          setCustomers((prev) => [
            ...prev,
            {
              label: customer.mobile + " / " + customer.firstname + " " + customer.lastname + " / " + customer.email,
              value: customer.customer_id,
              csb5_status: customer.csb5_status,
            },
          ]);
        });
      }
    });
  }

  useEffect(() => {
    getCustomersList(customerSearchTerm).then(() => {
      if (searchParams.get("customer_id")) {
        form.setValue("customer", searchParams.get("customer_id") as string);
        setConsignorDetails(searchParams.get("customer_id") as string);
      }
    });
  }, []);

  async function setConsignorDetails(customer_id: string) {
    const response = await getCustomerDetails(customer_id);
    if (response) {
      const consignor = {
        consignor_id: response.data.customer_id,
        name: response.data.firstname + " " + response.data.lastname,
        email: response.data.email,
        mobile: response.data.mobile,
        address: response.data.meta_data?.address,
        location: "location",
        document_type: documents.find((doc) => doc.key === response.data.meta_data?.document_type)?.value || "",
        documentNumber: response.data.meta_data?.id_number,
        csb5_status: response.data.csb5_status,
      };
      setSelectedConsignor(consignor);
      dispatch(() => updateOrderConsignorID(consignor));
    }
  }

  useEffect(() => {
    if (customerSearchTerm.trim().length >= 2) {
      getCustomersList(customerSearchTerm);
    }
  }, [customerSearchTerm]);

  const form = useForm();

  useEffect(() => {
    setSelectedConsignor(consignor);
  }, [consignor]);

  function selectConsignor(consignor_id: string) {
    // filter selected customer details from customers list
    setError("");
    const customerSelected = customersList.find((customer) => customer.customer_id === consignor_id);
    if (customerSelected) {
      const { mobile, email, firstname, lastname, meta_data, csb5_status } = customerSelected;
      const { address, state, city, pincode, id_number, document_type } = meta_data;

      const consignorDetails = {
        consignor_id,
        name: `${firstname} ${lastname}`,
        email,
        mobile,
        address,
        location: `${state}, ${city}, ${pincode}`,
        documentNumber: id_number,
        document_type: document_type,
        csb5_status,
      };

      setSelectedConsignor(consignorDetails);
      dispatch(() => updateOrderConsignorID(consignorDetails));
    } else {
      setError("Selected customer not found.");
    }
  }

  function nextStep(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (selectedConsignor.consignor_id === "") {
      setError("Please select a customer");
      return;
    } else if (csbv && selectedConsignor.csb5_status !== "completed") {
      setOpenUpgradePopup(true);
    } else dispatch(() => updateActiveOrderStep(2));
  }

  return (
    <>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-2">Search Customer</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl className="flex justify-between">
                      <Button
                        variant="outline"
                        role="combobox"
                        className="overflow-hidden text-muted-foreground hover:text-muted-foreground hover:border-gray-400 max-w-144"
                        disabled={edit}
                      >
                        {field.value
                          ? customers.find((customer) => customer.value === field.value)?.label
                          : "Select Customer"}
                        <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
                    <Command>
                      <div className="mx-4 mt-1 border rounded-xl">
                        <CommandInput
                          placeholder="Search by Mobile Number Or Customer Name or Email id"
                          value={customerSearchTerm}
                          onValueChange={setCustomerSearchTerm}
                        />
                      </div>
                      <CommandList className="px-0">
                        <CommandEmpty>No Customer found.</CommandEmpty>
                        <CommandGroup className="px-0">
                          {customers.map((customer) => (
                            <CommandItem
                              key={customer.value}
                              value={`${customer.value} ${customer.label}`}
                              className="px-0 cursor-pointer"
                              onSelect={() => {
                                form.setValue("customer", customer.value);
                                selectConsignor(customer.value);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  customer.value === field.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {customer.label.length > 50 ? customer.label.substring(0, 50) + "..." : customer.label}
                              {csbv && (
                                <Badge
                                  className={`ml-2 h-4 md:w-auto text-nowrap ${
                                    customer.csb5_status === "completed"
                                      ? "border-constructive text-constructive"
                                      : "border-destructive text-destructive"
                                  }`}
                                  variant="outline"
                                >
                                  CSB-V
                                  {customer.csb5_status === "completed" ? (
                                    <CircleCheck className="w-3 h-3 ml-1 text-white fill-constructive" />
                                  ) : (
                                    <CircleX className="w-3 h-3 ml-1 text-white fill-destructive" />
                                  )}
                                </Badge>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                      <div
                        className="flex items-center py-2 pl-4 text-sm font-medium cursor-pointer text-primary hover:bg-blue-150"
                        onClick={() => {
                          setOpen(false);
                          setCustomerPopupOpen(true);
                        }}
                      >
                        <span className="ml-5 mr-2 text-xl font-medium">+</span>
                        Add new Customer
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <div className="flex flex-col justify-around w-5/6 space-y-2 text-xs md:flex-row md:space-y-0">
              {selectedConsignor?.name && (
                <>
                  <div>
                    <p className="font-semibold">{selectedConsignor.name}</p>
                    <p className="leading-6">{selectedConsignor.email}</p>
                    <p className="whitespace-nowrap">{"+91-" + selectedConsignor.mobile}</p>
                  </div>
                  <div className="md:mx-4">
                    <p className="font-medium text-gray-700">Address</p>
                    <p className="leading-5">{selectedConsignor.address}</p>
                    {selectedConsignor.document_type === "GST" && <p>{selectedConsignor.location}</p>}{" "}
                  </div>
                  <div className="min-w-32">
                    <p className="font-medium text-gray-700">Document Type</p>
                    <p className="leading-6">{selectedConsignor.document_type}</p>
                    <p>{selectedConsignor.documentNumber}</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-end justify-end">
              {error && <ErrorMessage error={error} />}
              <Button type="submit" onClick={nextStep}>
                {/* validate data and next step */}
                Continue
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <CSBIVAddCustomerPopup open={customerPopupOpen} setOpen={setCustomerPopupOpen} />
      <UpgradeCSBVPopup
        openUpgradePopup={openUpgradePopup}
        setOpenUpgradePopup={setOpenUpgradePopup}
        consignor_id={selectedConsignor.consignor_id}
      />
    </>
  );
}

const UpgradeCSBVPopup = ({
  openUpgradePopup,
  setOpenUpgradePopup,
  consignor_id,
}: {
  openUpgradePopup: boolean;
  setOpenUpgradePopup: Dispatch<SetStateAction<boolean>>;
  consignor_id: string;
}) => {
  const navigate = useNavigate();
  const dispatch = useStore((state: any) => state.dispatch);
  const handleUpgradeCSBV = () => {
    dispatch(() => addCustomerID(String(consignor_id)));
    navigate("/add-csbv-details/" + consignor_id);
  };
  return (
    <AlertDialog open={openUpgradePopup} onOpenChange={setOpenUpgradePopup}>
      <AlertDialogContent className="rounded-lg lg:w-152 lg:max-w-152">
        <h4 className="text-xl font-medium text-center">Please upgrade the consignor to CSB-V to place order</h4>
        <AlertDialogFooter>
          <div className="flex justify-center pt-4 space-x-4">
            <Button
              variant="outline"
              type="button"
              className="font-normal border-primary text-primary"
              onClick={() => setOpenUpgradePopup(false)}
            >
              Cancel
            </Button>
            <Button className="font-normal" type="submit" onClick={handleUpgradeCSBV}>
              Proceed
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
