import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FranchisePage from "@/layouts/FranchisePage";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import SGFormField from "@/components/elements/SGFormField";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { initialPickupAddressFormValues, pickupAddressSchema } from "@/schemas/PickUp";
import { getStates } from "@/services/locations";
import { toast } from "@/components/ui/use-toast";
import { addPickupAddress } from "@/services/pickup";
import { useNavigate } from "react-router-dom";
import { updateProfileDetails } from "@/zustand/actions";
import { profileDetails } from "@/services/auth";
import { useStore } from "@/zustand/store";

export default function AddPickUpAddress() {
  const pickupAddressForm = useForm({
    resolver: zodResolver(pickupAddressSchema),
    defaultValues: initialPickupAddressFormValues,
  });
  const dispatch = useStore((state: any) => state.dispatch);
  const [states, setStates] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getStates().then((res) => {
      if (res.data.states.length > 0) setStates(res.data.states);
    });
  }, []);

  async function onPickUpAddressSubmit(data: z.infer<typeof pickupAddressSchema>) {
    const response = await addPickupAddress({
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      mobile: data.mobile,
      address_nickname: data.addressNickName,
      address: data.houseNumber + " " + data.landmark,
      locality: data.locality,
      landmark: data.landmark,
      postcode: data.pincode,
      city: data.city,
      state_id: data.state,
    });

    if (response && response.status === 200) {
      toast({
        title: "Pickup Address Added Successfully",
        variant: "success",
      });
      profileDetails().then((success) => {
        console.log(success.data, "check sg city here");
        dispatch(() => updateProfileDetails(success.data));
      });
      navigate("/profile");
    } else {
      toast({
        title: "Uh oh! Something went wrong.",
        variant: "destructive",
      });
    }
  }

  const PersonalInformation = [
    {
      label: "Address Nick Name",
      name: "addressNickName",
      type: "text",
    },
    {
      label: "First Name",
      name: "firstName",
      type: "text",
    },
    {
      label: "Last Name",
      name: "lastName",
      type: "text",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
    },
    {
      label: "Mobile Number",
      name: "mobile",
      type: "mobile",
    },
  ];

  const PickupDetails = [
    {
      label: "Plot No. / Street Name",
      name: "houseNumber",
      required: true,
    },
    {
      label: "Locality",
      name: "locality",
      required: true,
    },
    {
      label: "Landmark",
      name: "landmark",
      required: false,
    },
    {
      label: "Pin code",
      name: "pincode",
      required: true,
    },
    {
      label: "City",
      name: "city",
      required: true,
    },
  ];

  return (
    <FranchisePage>
      <BreadcrumbNav pageTitle="Pickup Address" />
      {/* <BreadcrumbNav
        parent="Settings"
        parentLink="/pickup-address"
        title="Pickup Address"
        titleLink="/pickup-address"
        tabName="Add Pickup Address"
      /> */}
      <Card className="w-full p-6 mx-0">
        <Form {...pickupAddressForm}>
          <CardContent className="p-0">
            <form onSubmit={pickupAddressForm.handleSubmit(onPickUpAddressSubmit)} className="p-0 mb-5">
              {/* Personal Information Fields */}
              <div className="flex mb-4">
                <p className="text-sm font-semibold">Personal Information</p>
              </div>
              <div className="space-y-2 text-left gap-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-16 md:items-center">
                {PersonalInformation.map((item, index) => (
                  <SGFormField
                    key={index}
                    type={item.type}
                    name={item.name}
                    required
                    label={item.label}
                    form={pickupAddressForm}
                  />
                ))}
              </div>
              {/* Pickup Address Fields */}
              <div className="flex mt-8 mb-4">
                <p className="text-sm font-semibold">Pickup Details</p>
              </div>
              <div className="space-y-2 text-left gap-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-16 md:items-center">
                {PickupDetails.map((item, index) => (
                  <SGFormField
                    key={index}
                    type="text"
                    name={item.name}
                    required={item.required}
                    label={item.label}
                    form={pickupAddressForm}
                  />
                ))}
                <SGFormField
                  type="select-state"
                  name="state"
                  required
                  label="State"
                  form={pickupAddressForm}
                  selectValues={states}
                />
              </div>
            </form>
          </CardContent>
        </Form>
        <CardFooter className="flex justify-center mt-8 md:justify-end md:mt-14">
          <div className="flex justify-center gap-4 mt-6 md:justify-end">
            <Button
              className="text-xs font-normal bg-transparent border hover:bg-transparent text-blue border-blue"
              onClick={() => {
                navigate(-1);
                pickupAddressForm.reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="text-xs font-normal"
              onClick={pickupAddressForm.handleSubmit(onPickUpAddressSubmit)}
            >
              Save
            </Button>
          </div>
        </CardFooter>
      </Card>
    </FranchisePage>
  );
}
