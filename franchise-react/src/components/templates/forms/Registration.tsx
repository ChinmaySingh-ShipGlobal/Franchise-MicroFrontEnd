import { Controller, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { z } from "zod";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import SGFormField from "@/components/elements/SGFormField";
import LoadingButton from "@/components/elements/LoadingButton";
import { createLead, getLeadDetails } from "@/services/auth";
import { getCities, getStates } from "@/services/locations";
import { initialLeadFormValues, leadFormSchema } from "@/schemas/Authentication";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegistrationForm() {
  const form = useForm<z.infer<typeof leadFormSchema>>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: initialLeadFormValues,
  });

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [avgDailyOrders, setDailyOrders] = useState([]);

  useEffect(() => {
    getStates().then((res) => {
      if (res.data.states.length > 0) setStates(res.data.states);
    });
    getLeadDetails().then((res) => {
      if (res.data.avg_daily_orders.length > 0) setDailyOrders(res.data.avg_daily_orders);
    });
  }, []);

  const stateFieldValue = form.watch("state");

  useEffect(() => {
    if (!stateFieldValue) return;
    getCities(stateFieldValue).then((res) => {
      if (res.data.length > 0) setCities(res.data);
    });
  }, [form.watch("state")]);

  const onSubmit = (data: z.infer<typeof leadFormSchema>) => {
    setLoading(true);
    setError(false);
    console.log(form.getValues("toc"));
    createLead(data).then((res) => {
      if (res) {
        setOpen(true);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
          <div className="lg:mr-6">
            <SGFormField type="text" name="firstName" required label="First Name" form={form} />
          </div>
          <div className="mt-3 lg:mt-0">
            <SGFormField type="text" name="lastName" required label="Last Name" form={form} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="lg:mr-6">
            <SGFormField type="email" name="email" required label="Business Email" form={form} />
          </div>
          <div className="mt-3 lg:mt-0">
            <SGFormField type="mobile" name="mobile" required label="Contact Number" form={form} />
          </div>
        </div>
        <SGFormField type="text" name="address" required label="Business Address" form={form} />
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="lg:mr-6">
            <SGFormField type="text" name="pincode" required label="Pincode" form={form} />
          </div>
          <div className="mt-3 lg:mt-0">
            <SGFormField
              type="select-avgDailyOrder"
              required
              name="avgDailyOrder"
              label="Average Daily Order"
              form={form}
              selectValues={avgDailyOrders}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="lg:mr-6">
            <SGFormField type="select-state" name="state" required label="State" form={form} selectValues={states} />
          </div>
          <div className="mt-3 lg:mt-0">
            <SGFormField type="select-city" name="city" required label="City" form={form} selectValues={cities} />
          </div>
        </div>
        <SGFormField type="textarea" name="description" label="Description" form={form} />
        <FormItem className="flex flex-row items-start space-y-0 w-full">
          <FormControl>
            <Controller
              name="toc"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center">
                  <Checkbox id="toc" checked={field.value} onCheckedChange={(checked) => field.onChange(checked)} />
                  <FormLabel className="text-xs ml-2 leading-2 cursor-pointer" htmlFor="toc">
                    I consent to ShipGlobal contacting me by phone and email.
                  </FormLabel>
                </div>
              )}
            />
          </FormControl>
        </FormItem>
        {error && <span className="text-xs font-medium text-destructive">Something went wrong. Please try again</span>}
        {form.formState.errors.toc && (
          <span className="text-xs font-medium text-destructive">{form.formState.errors.toc.message}</span>
        )}
        <LoadingButton loading={loading} size="xl" />
        <AlertPopup open={open} setOpen={setOpen} />
      </form>
    </Form>
  );
}

const AlertPopup = ({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) => (
  <AlertDialog open={open}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <div className="flex justify-end align-middle">
          <Link to="/auth/login">
            <Icon
              icon="lucide:circle-x"
              width="1.5rem"
              height="1.5rem"
              className="cursor-pointer text-blue"
              onClick={() => setOpen(false)}
            />
          </Link>
        </div>
        <AlertDialogTitle className="text-center text-primary">
          Thank you for registering with ShipGlobal
        </AlertDialogTitle>
        <AlertDialogDescription className="text-center">
          Your details have been received and we will reach out to you within 24 hrs to discuss further steps and
          account enablement.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogTitle className="font-semibold text-center text-primary">Stay tuned!!</AlertDialogTitle>
    </AlertDialogContent>
  </AlertDialog>
);
