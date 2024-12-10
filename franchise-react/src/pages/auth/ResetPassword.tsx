import { lazy, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
const Card = lazy(() => import("@/components/ui/card"));

import SGFormField from "@/components/elements/SGFormField";
import LoadingButton from "@/components/elements/LoadingButton";
import ErrorMessage from "@/components/elements/ErrorMessage";
import PublicPages from "@/layouts/PublicPages";

import successImg from "@/assets/success.png";
import { resetPassword } from "@/services/auth";
import { initialResetPasswordValues, resetPasswordSchema } from "@/schemas/Authentication";

export default function ResetPassword({ newAccount = false }: { newAccount?: boolean }) {
  const location = useLocation();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: initialResetPasswordValues,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    setLoading(true);
    setError("");
    const response = await resetPassword({
      password: data.password,
      logout_all_devices: data.logout_all_devices ? "1" : "0",
      token: location.search.slice(1),
    });
    if (response) {
      if (response.status === 200) setSuccess(true);
      else setError(response.data.message);
    }
    setLoading(false);
  }

  return (
    <PublicPages>
      <div className="flex flex-col items-center justify-center m-4">
        <Card className="w-full max-w-md mb-18 lg:mb-32 h-128">
          {success ? (
            <ResetPasswordSuccess newAccount={newAccount} />
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{newAccount ? "Create Your" : "Reset"} Password</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <SGFormField
                      type="password"
                      required
                      name="password"
                      label={(newAccount ? "Create" : "") + " New Password"}
                      form={form}
                    />
                    <SGFormField type="password" required name="confirmPassword" label="Confirm Password" form={form} />
                    {!newAccount && (
                      <FormItem className="flex flex-row items-start w-full space-y-0">
                        <FormControl>
                          <Controller
                            name="logout_all_devices"
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center">
                                <Checkbox
                                  id="logout_all_devices"
                                  checked={field.value}
                                  onCheckedChange={(checked) => field.onChange(checked)}
                                />
                                <FormLabel
                                  className="ml-2 text-xs cursor-pointer leading-2"
                                  htmlFor="logout_all_devices"
                                >
                                  Log me out of all devices.
                                </FormLabel>
                              </div>
                            )}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                    <ErrorMessage error={error} />
                    <LoadingButton loading={loading} size="xl" type="submit" className="mt-16" />
                  </form>
                </Form>
              </CardContent>
              {!newAccount && (
                <div className="font-medium text-center hover:underline text-primary">
                  <Link to="/auth/login">Return to login</Link>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </PublicPages>
  );
}

function ResetPasswordSuccess({ newAccount }: { newAccount?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center my-24">
      <img src={successImg} alt="success" height="96px" width="96px" />
      <CardTitle className="mt-4 text-xl text-center">
        {newAccount ? "Account Setup Successful" : "Password Reset Successful"}
      </CardTitle>
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
