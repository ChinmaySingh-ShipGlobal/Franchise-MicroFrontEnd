import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import SGFormField from "@/components/elements/SGFormField";
import LoadingButton from "@/components/elements/LoadingButton";

import { initialLoginFormValues, loginSchema } from "@/schemas/Authentication";
import { login } from "@/services/auth";
import { useStore } from "@/zustand/store";
import { toggleLoginStatus, updateProfileDetails, updateWalletBalance } from "@/zustand/actions";

export default function EmailLoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialLoginFormValues,
  });

  const dispatch = useStore((state: any) => state.dispatch);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError(false);
    const success = await login(data);
    if (success) {
      dispatch(() => toggleLoginStatus(true));
      dispatch(() => updateProfileDetails(success.data.vendor_details));
      dispatch(() => updateWalletBalance(success.data.vendor_details.wallet_balance));
      navigate("/dashboard");
    }
    if (!success) setError(true);
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SGFormField type="email" required name="email" label="Email" form={form} />
        <SGFormField type="password" required name="password" label="Password" form={form} className="mt-4" />
        <div className="my-1">
          <Link to="/auth/forgot-password">
            <span className="text-sm font-medium text-primary hover:underline">Forgot Password?</span>
          </Link>
        </div>
        {error && <span className="text-xs font-medium text-destructive">Wrong email or password. Try again</span>}
        <LoadingButton loading={loading} size="xl" className="mt-10" />
        {/* <div className="flex flex-col items-center">
          <p className="my-3 text-sm font-normal text-foreground">
            New User?{" "}
            <Link to="/auth/register">
              <span className="font-medium text-primary hover:underline">Create an account</span>
            </Link>
          </p>
        </div> */}
      </form>
    </Form>
  );
}
