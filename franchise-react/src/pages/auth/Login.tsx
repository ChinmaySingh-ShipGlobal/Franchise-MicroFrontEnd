import { lazy } from "react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const Card = lazy(() => import("@/components/ui/card"));
const PublicPages = lazy(() => import("@/layouts/PublicPages"));
const EmailLoginForm = lazy(() => import("@/components/templates/forms/EmailLogin"));

export default function Login() {
  return (
    <PublicPages>
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
    </PublicPages>
  );
}
