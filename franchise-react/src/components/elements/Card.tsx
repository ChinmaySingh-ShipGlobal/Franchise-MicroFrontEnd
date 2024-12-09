import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegistrationForm from "@/components/templates/forms/Registration";

export default function CenteredCard() {
  return (
    <Card className="text-center h-fit sm:w-140 md:mx-auto">
      {/* //TODO Make card responsive for all screens */}
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <RegistrationForm />
      </CardContent>
    </Card>
  );
}
