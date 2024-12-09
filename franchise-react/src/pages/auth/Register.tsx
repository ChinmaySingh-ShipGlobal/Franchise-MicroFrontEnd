import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ListItem from "@/components/elements/List";
import RegistrationForm from "@/components/templates/forms/Registration";
import LogoPNG from "/logo.png";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="w-full bg-cover bg-auth">
      <div className="flex flex-col items-center justify-center">
        <div className="grid h-screen grid-cols-1 md:grid-cols-2">
          <LeftColumn />
          <RightColumn />
        </div>
      </div>
    </div>
  );
}

export const LeftColumn = () => {
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="max-w-2xl m-10">
        <div className="flex justify-center py-4 md:mr-auto md:justify-start">
          <Link to="/">
            <img src={LogoPNG} className="h-12 2xl:h-14" />
          </Link>
        </div>
        <h1 className="text-2xl font-semibold text-center text-primary md:text-left md:my-10 lg:text-4xl 2xl:text-5xl 2xl:leading-snug">
          Join Us and Unlock Endless Possibilities!
        </h1>
        <div className="hidden space-y-8 md:block">
          <ul className="space-y-4">
            <h6 className="text-xl font-semibold text-primary xl:text-2xl">Benefits</h6>
            <ListItem
              text={
                "Establishing the franchise requires a minimal initial investment, making it accessible for aspiring entrepreneurs"
              }
            />
            <ListItem
              text={"Earn a profit margin on every parcel booked, ensuring a steady and reliable income stream"}
            />
          </ul>
          <br />
          <ul className="space-y-4">
            <h6 className="text-xl font-semibold text-primary xl:text-2xl">Eligibility</h6>
            <ListItem
              text={
                "A premises of 80-100 sqft located on a main road is required to ensure visibility and accessibility"
              }
            />
            <ListItem
              text={
                "Strong communication skills are essential to effectively interact with customers and provide excellent service"
              }
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

export const RightColumn = () => {
  return (
    <div className="flex flex-col justify-center lg:items-center">
      <Card>
        <CardHeader className="p-0 my-4">
          <CardTitle className="text-xl text-center">Please Enter the Details</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
};
