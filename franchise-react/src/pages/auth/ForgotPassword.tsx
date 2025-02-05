import { lazy, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
const Card = lazy(() => import("@/components/ui/card"));

import SGFormField from "@/components/elements/SGFormField";
import LoadingButton from "@/components/elements/LoadingButton";
import ErrorMessage from "@/components/elements/ErrorMessage";
import PublicPages from "@/layouts/PublicPages";

import successImg from "@/assets/success.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "@/services/auth";

export const emailSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address" }),
});

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(data: z.infer<typeof emailSchema>) {
    setLoading(true);
    setError("");
    const response = await forgotPassword(data);
    if (response) {
      if (response.status === 200) setEmailSent(true);
      else setError(response.data.message);
    }
    setLoading(false);
  }

  return (
    <PublicPages>
      <div className="flex flex-col items-center justify-center m-4">
        <Card className="w-full max-w-md mb-18 lg:mb-32 h-128">
          {isEmailSent ? (
            <ForgotPasswordSuccess />
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-xl text-center">Forgot Your Password?</CardTitle>
                <CardDescription className="pt-6 text-sm text-center text-black">
                  Enter email address associated with your account and you will receive an email to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <SGFormField type="email" required name="email" label="Email" form={form} />
                    <ErrorMessage error={error} />
                    <LoadingButton loading={loading} size="xl" className="mt-12" />
                  </form>
                </Form>
              </CardContent>
              <div className="font-medium text-center hover:underline text-primary">
                <Link to="/auth/login">Return to login</Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </PublicPages>
  );
}

function ForgotPasswordSuccess() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <img src={successImg} alt="success" height="96px" width="96px" />
      <CardTitle className="mt-4 text-xl text-center">Link sent Successfully</CardTitle>
      <CardDescription className="px-2 pt-4 text-sm text-center text-black">
        Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam
        folder.
      </CardDescription>
      <Button
        size="xl"
        className="flex items-center justify-center mt-12 font-medium text-center"
        onClick={() => navigate("/auth/login")}
      >
        Return to login
      </Button>
    </div>
  );
}
