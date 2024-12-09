import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmailLoginForm from "@/components/templates/forms/EmailLogin";
import { SGLogo } from "@/components/elements/SGLogo";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="w-full h-screen">
      <div className="grid h-screen bg-cover bg-auth">
        <Link to="/">
          <SGLogo />
        </Link>
        <div className="flex flex-col items-center justify-center m-4">
          <Card className="w-full max-w-md mb-18 lg:mb-32 h-128">
            <CardHeader>
              <CardTitle className="text-xl text-center">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <EmailLoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
