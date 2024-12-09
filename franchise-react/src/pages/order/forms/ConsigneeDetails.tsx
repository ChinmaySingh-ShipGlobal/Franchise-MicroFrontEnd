import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SGFormField from "@/components/elements/SGFormField";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useStore } from "@/zustand/store";
import { initialConsigneeDetails, ShipmentType } from "@/zustand/interfaces";
import { getCountries, getStatesByCountryId } from "@/services/locations";
import { ConsigneeDetailsSchema, Country, States } from "@/schemas/Order";
import { updateActiveOrderStep, updateConsigneeLocation, updateOrderConsigneeDetails } from "@/zustand/actions";

export default function ConsigneeDetails({
  csbv,
  setIsBillingSameAsShipping,
}: {
  csbv?: boolean;
  setIsBillingSameAsShipping?: Dispatch<SetStateAction<boolean>>;
}) {
  const consigneeDetails = useStore((state: any) => state.order.consigneeDetails);
  const dispatch = useStore((state: any) => state.dispatch);
  const consigneeDetailsForm = useForm<z.infer<typeof ConsigneeDetailsSchema>>({
    resolver: zodResolver(ConsigneeDetailsSchema),
    defaultValues: consigneeDetails ? consigneeDetails : initialConsigneeDetails,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [billingCountries, setBillingCountries] = useState([]);
  const [billingStates, setBillingStates] = useState([]);

  const consigneeLocation = useStore((state: any) => state.consigneeLocation);
  useEffect(() => {
    getCountries().then((res) => {
      if (res.data.countries.length > 0) {
        setCountries(res.data.countries);
        setBillingCountries(res.data.countries);
      }
    });
  }, []);

  useEffect(() => {
    dispatch(() =>
      updateConsigneeLocation({
        ...consigneeLocation,
        country: countries.find((country: Country) => country.country_iso2 === consigneeDetailsForm.watch("country"))
          ?.country_name,
      }),
    );
  }, [consigneeDetailsForm.watch("country")]);
  useEffect(() => {
    dispatch(() =>
      updateConsigneeLocation({
        ...consigneeLocation,
        state: states.find((state: States) => state.state_id === consigneeDetailsForm.watch("state"))?.state_name,
      }),
    );
  }, [consigneeDetailsForm.watch("state")]);
  useEffect(() => {
    if (!consigneeDetailsForm.watch("isBillingSameAsShipping")) {
      dispatch(() =>
        updateConsigneeLocation({
          ...consigneeLocation,
          country_billing: countries.find(
            (country: Country) => country.country_iso2 === consigneeDetailsForm.watch("country_billing"),
          )?.country_name,
        }),
      );
    }
  }, [consigneeDetailsForm.watch("country_billing")]);

  useEffect(() => {
    if (!consigneeDetailsForm.watch("isBillingSameAsShipping")) {
      dispatch(() =>
        updateConsigneeLocation({
          ...consigneeLocation,
          state_billing: billingStates.find(
            (state: States) => state.state_id === consigneeDetailsForm.watch("state_billing"),
          )?.state_name,
        }),
      );
    }
  }, [consigneeDetailsForm.watch("state_billing")]);

  const countryFieldValue = consigneeDetailsForm.watch("country");
  useEffect(() => {
    if (!countryFieldValue) return;
    if (consigneeDetails.country !== countryFieldValue) {
      consigneeDetailsForm.setValue("state", "");
    }
    getStatesByCountryId(countryFieldValue).then((res) => {
      if (res.data.states.length > 0) setStates(res.data.states);
    });
  }, [countryFieldValue]);

  const countryBillingFieldValue = consigneeDetailsForm.watch("country_billing");
  useEffect(() => {
    if (!countryBillingFieldValue) return;
    if (consigneeDetails.country_billing !== countryBillingFieldValue) {
      consigneeDetailsForm.setValue("state_billing", "");
    }
    getStatesByCountryId(countryBillingFieldValue).then((res) => {
      if (res.data.states.length > 0) setBillingStates(res.data.states);
    });
  }, [countryBillingFieldValue]);

  function nextStep(data: z.infer<typeof ConsigneeDetailsSchema>) {
    if (csbv) {
      dispatch(() => updateOrderConsigneeDetails({ ...data, shipmentType: ShipmentType.CSBV }));
    } else {
      dispatch(() => updateOrderConsigneeDetails(data));
    }
    dispatch(() => updateActiveOrderStep(3));
  }

  useEffect(() => {
    setIsBillingSameAsShipping && setIsBillingSameAsShipping(consigneeDetailsForm.watch("isBillingSameAsShipping"));
  }, [consigneeDetailsForm.watch("isBillingSameAsShipping")]);
  return (
    <Form {...consigneeDetailsForm}>
      <form onSubmit={consigneeDetailsForm.handleSubmit(nextStep)} className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Personal Details</h3>
          <div className="grid grid-cols-1 gap-y-1 md:grid-cols-3">
            <div className="md:mr-6">
              <SGFormField type="text" name="firstName" required label="First Name" form={consigneeDetailsForm} />
            </div>
            <div className="mt-3 md:mt-0 md:mr-6">
              <SGFormField type="text" name="lastName" required label="Last Name" form={consigneeDetailsForm} />
            </div>
            <div className="mt-3 md:mt-0">
              <SGFormField type="text" name="mobile" required label="Mobile Number" form={consigneeDetailsForm} />
            </div>
            <div className="mt-3 md:mr-6">
              <SGFormField type="email" name="email" required label="Email Address" form={consigneeDetailsForm} />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Shipping Address</h3>
          <div className="grid grid-cols-1 gap-y-1 md:grid-cols-3">
            <div className="md:mr-6">
              <SGFormField type="text" name="address1" required label="Address 1" form={consigneeDetailsForm} />
            </div>
            <div className="mt-3 md:mt-0 md:mr-6">
              <SGFormField type="text" name="address3" required label="Address 2" form={consigneeDetailsForm} />
            </div>
            <div className="mt-3 md:mt-0">
              <SGFormField type="text" name="address2" label="Landmark" form={consigneeDetailsForm} />
            </div>
            <div className="mt-3 md:mr-6">
              <SGFormField
                type="select-country"
                name="country"
                required
                label="Country"
                form={consigneeDetailsForm}
                selectValues={countries}
              />
            </div>
            <div className="mt-3 md:mr-6">
              <SGFormField
                type="select-state"
                name="state"
                required
                label="State"
                form={consigneeDetailsForm}
                selectValues={states}
              />
            </div>
            <div className="mt-3 ">
              <SGFormField type="text" name="city" required label="City" form={consigneeDetailsForm} />
            </div>
            <div className="mt-3 md:mr-6">
              <SGFormField type="text" name="pincode" required label="Pincode" form={consigneeDetailsForm} />
            </div>
          </div>
        </div>

        <FormField
          name="isBillingSameAsShipping"
          control={consigneeDetailsForm.control}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start ">
              <FormControl className="flex flex-row-reverse">
                <div className="flex items-center">
                  <FormLabel htmlFor="isBillingSameAsShipping" className="ml-2 leading-5 cursor-pointer">
                    Billing address is same as shipping address
                  </FormLabel>
                  <Checkbox
                    id="isBillingSameAsShipping"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!consigneeDetailsForm.watch("isBillingSameAsShipping") && (
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:mr-6">
                <SGFormField
                  type="text"
                  required
                  name="address1_billing"
                  label="Address 1"
                  form={consigneeDetailsForm}
                />
              </div>
              <div className="mt-3 md:mt-0 md:mr-6">
                <SGFormField
                  type="text"
                  name="address3_billing"
                  required
                  label="Address 2"
                  form={consigneeDetailsForm}
                />
              </div>
              <div className="mt-3 md:mt-0">
                <SGFormField type="text" name="address2_billing" label="Landmark" form={consigneeDetailsForm} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:mr-6">
                <SGFormField
                  type="select-country"
                  required
                  name="country_billing"
                  label="Country"
                  form={consigneeDetailsForm}
                  selectValues={billingCountries}
                />
              </div>
              <div className="mt-3 md:mt-0 md:mr-6">
                <SGFormField
                  type="select-state"
                  name="state_billing"
                  required
                  label="State"
                  form={consigneeDetailsForm}
                  selectValues={billingStates}
                />
              </div>
              <div className="mt-3 md:mt-0">
                <SGFormField type="text" name="city_billing" required label="City" form={consigneeDetailsForm} />
              </div>
              <div className="mt-3 md:mr-6">
                <SGFormField type="text" required name="pincode_billing" label="Pincode" form={consigneeDetailsForm} />
              </div>
            </div>
          </div>
        )}
        <div className="flex items-end justify-end">
          <Button type="submit" onClick={consigneeDetailsForm.handleSubmit(nextStep)}>
            {/* validate data and next step */}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
