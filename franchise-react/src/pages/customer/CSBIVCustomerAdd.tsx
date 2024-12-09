import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { documents } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CustomerIdentity, DocumentState } from "./CustomerIdentity";
import { addCustomer, verifyCSBIVCustomer } from "@/services/customers";
import ErrorMessage from "@/components/elements/ErrorMessage";
import { toast } from "@/components/ui/use-toast";
import { addCustomerFormSchema, verifyCustomerFormSchema } from "@/schemas/Customer";
import { useStore } from "@/zustand/store";
import { addCustomerID, updateOrderConsignorID } from "@/zustand/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import SGFormField from "@/components/elements/SGFormField";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/elements/LoadingButton";
import { Verified } from "@/components/elements/Verified";
import { getStates } from "@/services/locations";
export default function CSBIVAddCustomerPopup({
  open,
  setOpen,
  fetch,
  setFetch,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  fetch?: boolean;
  setFetch?: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useStore((state: any) => state.dispatch);
  const [customerID, setCustomerID] = useState<string>("");
  const [csbVCustomer, setCsbVCustomer] = useState(false);
  const [customerVerified, setCustomerVerified] = useState<boolean>(false);
  const [documentState, setDocumentState] = useState<DocumentState>({
    docFrontId: "",
    docBackId: "",
    docNumber: "",
  });
  const [customerDetails, setCustomerDetails] = useState({
    mobile: "",
    email: "",
    nickname: "",
    document_type: "aadhar",
    state_id: "",
  });
  const verifyCustomerForm = useForm({
    resolver: zodResolver(verifyCustomerFormSchema),
    defaultValues: customerDetails,
  });
  const addCustomerForm = useForm({
    resolver: zodResolver(addCustomerFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      billing_legal_name: "",
      billing_address: "",
      billing_city: "",
      billing_state: "",
      billing_pin_code: "",
      state_id: "",
    },
  });

  const initialAddCustomerDetails = {
    firstname: "",
    lastname: "",
    customer_id: "",
    email: "",
    mobile: "",
    nickname: "",
    document_type: "",
    document_value: "",
    document_front_file: "",
    document_back_file: "",
    billing_legal_name: "",
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_country: "",
    billing_pin_code: "",
  };
  const [buttonLoading, setButtonLoading] = useState({
    verify: false,
    add: false,
  });
  const [errors, setErrors] = useState({
    verificationError: "",
    addCustomerError: initialAddCustomerDetails,
  });
  async function onVerifyCustomer(data: z.infer<typeof verifyCustomerFormSchema>) {
    setButtonLoading((prev) => ({ ...prev, verify: true }));
    setErrors({ verificationError: "", addCustomerError: initialAddCustomerDetails });
    const consignorData = {
      mobile: data.mobile,
      email: data.email,
      nickname: data.nickname,
      document_type: data.document_type,
      document_value: documentState.docNumber,
      document_front_file: documentState.docFrontId,
      document_back_file: documentState.docBackId,
    };
    const response = await verifyCSBIVCustomer(consignorData);
    if (response) {
      const responseData = response.data.data;
      setCustomerID(responseData.customer_id);
      setCustomerDetails({
        mobile: responseData.mobile,
        email: responseData.email,
        nickname: data.nickname,
        document_type: responseData.document_type,
        state_id: responseData.state_id,
      });
      if (response.status === 200) {
        setCustomerVerified(true);
        addCustomerForm.setValue("firstname", responseData.first_name);
        addCustomerForm.setValue("lastname", responseData.last_name);
        addCustomerForm.setValue("billing_legal_name", responseData.first_name + " " + responseData.last_name);
        addCustomerForm.setValue("billing_address", responseData.address);
        addCustomerForm.setValue("billing_city", responseData.city);
        addCustomerForm.setValue("billing_state", responseData.state);
        addCustomerForm.setValue("state_id", responseData.state_id);
        addCustomerForm.setValue("billing_pin_code", responseData.pincode);

        setButtonLoading((prev) => ({ ...prev, verify: false }));
      } else {
        setButtonLoading((prev) => ({ ...prev, verify: false }));
        setErrors(() => ({ addCustomerError: response.data.errors, verificationError: response.data.message }));
      }
    }
  }
  const navigate = useNavigate();
  function handleCloseForm() {
    setOpen(false);
    verifyCustomerForm.reset();
    addCustomerForm.reset();
    setDocumentState({ docFrontId: "", docBackId: "", docNumber: "" });
    setCustomerDetails({
      mobile: "",
      email: "",
      nickname: "",
      document_type: "",
      state_id: "",
    });
    setCustomerVerified(false);
    setErrors({ verificationError: "", addCustomerError: initialAddCustomerDetails });
    setButtonLoading({ verify: false, add: false });
  }

  const profile = useStore((state: any) => state.profile);
  async function onAddCustomer(data: z.infer<typeof addCustomerFormSchema>) {
    setButtonLoading((prev) => ({ ...prev, add: true }));
    setErrors((prev) => ({ ...prev, addCustomerError: initialAddCustomerDetails }));
    const customerData = {
      firstname: data.firstname,
      lastname: data.lastname,
      billing_legal_name: data.billing_legal_name,
      billing_address: data.billing_address,
      billing_city: data.billing_city,
      billing_state: addCustomerForm.watch("state_id"),
      billing_country: "IN",
      billing_pin_code: data.billing_pin_code,
      mobile: customerDetails.mobile,
      email: customerDetails.email,
      nickname: customerDetails.nickname,
      document_type: customerDetails.document_type,
      document_value: documentState.docNumber,
      document_front_file: documentState.docFrontId,
      document_back_file: documentState.docBackId,
      customer_id: customerID,
    };
    const response = await addCustomer(customerData);
    if (response) {
      if (response.status === 200) {
        const consignorDetails = {
          consignor_id: customerID,
          name: data.firstname + " " + data.lastname,
          email: customerDetails.email,
          mobile: customerDetails.mobile,
          address: data.billing_address,
          location: "location",
          document_type: customerDetails.document_type,
          documentNumber: documentState.docNumber,
          csb5_status: profile.csb5_enabled,
        };
        setButtonLoading((prev) => ({ ...prev, add: false }));
        toast({
          title: response.data.message,
          variant: "success",
        });
        dispatch(() => updateOrderConsignorID(consignorDetails));
        dispatch(() => addCustomerID(String(customerID)));
        if (csbVCustomer) {
          navigate("/add-csbv-details/" + customerID);
        }
        handleCloseForm();
        setOpen(!open);
        setFetch?.(!fetch);
      } else {
        setButtonLoading((prev) => ({ ...prev, add: false }));
        console.log(response);
        setErrors((prev) => ({ ...prev, addCustomerError: response.data.errors }));
      }
    }
  }
  const isVerifiedButtonDisabled =
    documentState.docFrontId === "" ||
    documentState.docBackId === "" ||
    documentState.docNumber === "" ||
    buttonLoading.verify ||
    customerVerified;

  const customerIsVerified = customerVerified || buttonLoading.verify;

  const [states, setStates] = useState([]);
  useEffect(() => {
    getStates().then((response) => {
      setStates(response.data.states);
    });
  }, []);
  const [change, setChange] = useState(false);
  useEffect(() => {
    addCustomerForm.watch("state_id");
    setChange(!change);
  }, [addCustomerForm.watch("state_id")]);
  const stateID = addCustomerForm.watch("state_id");
  console.log(stateID);
  console.log(addCustomerForm.watch("state_id"));
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="rounded-lg pt-0 max-h-screen overflow-auto lg:max-w-max px-0 lg:min-w-152 ">
        <AlertDialogTitle className="text-base py-2 border-b px-6">Add New Customer</AlertDialogTitle>
        <Form {...verifyCustomerForm}>
          <form onSubmit={verifyCustomerForm.handleSubmit(onVerifyCustomer)} className="space-y-1.5 px-6">
            <div className="grid lg:grid-cols-3 mb-4 gap-2 lg:gap-x-8">
              <div className="space-y-1">
                <FormField
                  control={verifyCustomerForm.control}
                  name="nickname"
                  disabled={customerIsVerified}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder={`Enter Username . . .`} {...field} required className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {errors.addCustomerError?.nickname && <ErrorMessage error={errors.addCustomerError.nickname} />}
              </div>
              <div className="space-y-1">
                <FormField
                  control={verifyCustomerForm.control}
                  name="mobile"
                  disabled={customerIsVerified}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          maxLength={10}
                          minLength={10}
                          placeholder={`Enter Number . . .`}
                          {...field}
                          required
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormField
                  control={verifyCustomerForm.control}
                  name="email"
                  disabled={customerIsVerified}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={`Enter Email . . .`} {...field} required className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-3 lg:gap-x-8 gap-y-6 lg:gap-y-3">
              <FormField
                control={verifyCustomerForm.control}
                disabled={customerIsVerified}
                name="document_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10" disabled={customerIsVerified}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documents.map((document) => (
                          <SelectItem value={document.key} key={document.key}>
                            {document.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomerIdentity
                document={verifyCustomerForm.watch("document_type")}
                setDocumentState={setDocumentState}
                disabled={customerIsVerified}
                setCustomerVerified={setCustomerVerified}
              />

              <AlertDialogFooter>
                <div className="my-auto">
                  {errors.verificationError && !errors.addCustomerError?.nickname && (
                    <div>
                      <ErrorMessage error={errors.verificationError} />
                    </div>
                  )}
                  {customerVerified ? (
                    <Verified />
                  ) : (
                    <div className="w-full flex justify-start">
                      <LoadingButton
                        size="xs"
                        variant={isVerifiedButtonDisabled ? "disabled" : "default"}
                        loading={buttonLoading.verify}
                        disabled={isVerifiedButtonDisabled}
                        className={`font-normal ${!errors.verificationError && "mt-8"} mb-2`}
                        onClick={verifyCustomerForm.handleSubmit(onVerifyCustomer)}
                        text="Verify"
                      />
                    </div>
                  )}
                </div>
              </AlertDialogFooter>
            </div>
          </form>
        </Form>
        <Form {...addCustomerForm}>
          <form onSubmit={addCustomerForm.handleSubmit(onAddCustomer)} className="space-y-1.5">
            <div className="grid lg:grid-cols-3 mb-3 gap-x-2 gap-y-3 lg:gap-x-8 px-6">
              <SGFormField type="text" name="firstname" required label="First Name" form={addCustomerForm} />
              <SGFormField type="text" name="lastname" required label="Last Name" form={addCustomerForm} />
              <SGFormField type="text" name="billing_city" required label="City" form={addCustomerForm} />
              <SGFormField type="text" name="billing_pin_code" required label="Pincode" form={addCustomerForm} />
              {/* <SGFormField type="text" name="billing_state" required label="State" form={addCustomerForm} /> */}
              {change ? (
                <div>
                  <SGFormField
                    type="select-state"
                    selectValues={states}
                    name="state_id"
                    required
                    label="State"
                    form={addCustomerForm}
                    disabled
                  />
                </div>
              ) : (
                <SGFormField
                  type="select-state"
                  selectValues={states}
                  name="state_id"
                  required
                  label="State"
                  form={addCustomerForm}
                  disabled
                />
              )}
              <div className="space-y-1 lg:col-span-2">
                <FormField
                  control={addCustomerForm.control}
                  name="billing_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Address</FormLabel>
                      <FormControl>
                        <Textarea required {...field} placeholder={`Enter Billing address . . .`} className="h-10 " />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {profile.csb5_enabled !== "0" && (
              <FormItem className="flex flex-row items-center py-1 px-6 space-y-0 lg:col-span-2">
                <Checkbox id="csbV" checked={csbVCustomer} onCheckedChange={() => setCsbVCustomer(!csbVCustomer)} />
                <FormLabel htmlFor="csbV" className="ml-2 leading-5 text-gray-800 cursor-pointer">
                  CSB V Details (Select if you will be shipping under CSB V)
                </FormLabel>
              </FormItem>
            )}
            <AlertDialogFooter className="border-t px-6">
              <div className="flex justify-end pt-4 space-x-4">
                <div>
                  {errors.addCustomerError?.billing_address && (
                    <ErrorMessage error={errors.addCustomerError.billing_address} />
                  )}
                </div>
                <Button
                  variant="outline"
                  type="button"
                  className="font-normal border-primary text-primary"
                  onClick={() => handleCloseForm()}
                >
                  Cancel
                </Button>
                <Button
                  className="font-normal"
                  type="submit"
                  onClick={addCustomerForm.handleSubmit(onAddCustomer)}
                  disabled={!customerVerified}
                >
                  {profile.csb5_enabled !== "0" && csbVCustomer ? "Continue" : "Submit"}
                  {buttonLoading.add && <Icon icon="lucide:loader" className={"self-center ml-2 animate-spin"} />}
                </Button>
              </div>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
