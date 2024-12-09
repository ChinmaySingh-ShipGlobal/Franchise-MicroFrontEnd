import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Card } from "@/components/ui/card";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";
import LoadingButton from "@/components/elements/LoadingButton";
import SGFormField from "@/components/elements/SGFormField";
import ErrorMessage from "@/components/elements/ErrorMessage";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import FranchisePage from "@/layouts/FranchisePage";

import { initialChangePasswordFormValues, changePasswordSchema } from "@/schemas/Profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@/zustand/store";
import { toggleLoginStatus } from "@/zustand/actions";
import { changePassword } from "@/services/auth";
import successImg from "@/assets/success.png";

export default function ChangePassword() {
  const passwordForm = useForm({
    defaultValues: initialChangePasswordFormValues,
    resolver: zodResolver(changePasswordSchema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useStore((state: any) => state.dispatch);
  const [open, setOpen] = useState(false);

  async function onPasswordSubmit(data: z.infer<typeof changePasswordSchema>) {
    setLoading(true);
    setError("");
    const response = await changePassword(data);
    if (response) {
      if (response.status === 200) {
        setOpen(true);
      } else setError(response.data.errors.current_password);
    }
    setLoading(false);
  }

  function handleContinue() {
    if (passwordForm.watch("logout_all_devices")) {
      dispatch(() => toggleLoginStatus(false));
      navigate("/auth/login");
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <FranchisePage>
      {/* <BreadcrumbNav parent="Settings" parentLink="/change-password" title="Change Password" /> */}
      <BreadcrumbNav pageTitle="Change Password" />
      <Card className="flex items-center justify-center m-0 text-left shadow-none h-144 rounded-xl">
        <Card className="px-8 pt-2 pb-6 border shadow-none border-lightBlue-100 w-136 h-112">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="mt-4 space-y-5">
              <SGFormField type="password" name="oldPassword" required label="Current Password" form={passwordForm} />
              <SGFormField type="password" name="newPassword" required label="New Password" form={passwordForm} />
              <SGFormField
                type="password"
                name="confirmPassword"
                required
                label="Confirm New Password"
                form={passwordForm}
              />
              <FormItem className="flex flex-row items-start w-full space-y-0">
                <FormControl>
                  <Controller
                    name="logout_all_devices"
                    control={passwordForm.control}
                    render={({ field }) => (
                      <div className="flex items-center">
                        <Checkbox
                          id="logout_all_devices"
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                        <FormLabel className="ml-2 text-xs cursor-pointer leading-2" htmlFor="logout_all_devices">
                          Log me out of all devices.
                        </FormLabel>
                      </div>
                    )}
                  />
                </FormControl>
              </FormItem>
              <ErrorMessage error={error} />
              <div className="flex items-center justify-end mt-4 text-xs font-normal gap-x-4">
                <Button
                  variant="outline"
                  className="text-xs font-normal border border-blue text-blue"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <LoadingButton loading={loading} text="Save" className="text-xs font-normal" />
                <AlertDialog open={open}>
                  <AlertDialogContent className="flex flex-col items-center justify-center rounded-lg h-76">
                    <img src={successImg} alt="success" height="96px" width="96px" />
                    <AlertDialogTitle className="my-4 text-xl text-center">
                      Password Changed Successfully
                    </AlertDialogTitle>
                    <Button
                      size="xl"
                      className="flex items-center justify-center font-medium text-center"
                      onClick={handleContinue}
                    >
                      Continue
                    </Button>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </form>
          </Form>
        </Card>
      </Card>
    </FranchisePage>
  );
}
