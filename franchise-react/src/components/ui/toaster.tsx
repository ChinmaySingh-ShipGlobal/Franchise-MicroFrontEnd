import { DestructiveIcon, InfoIcon, SuccessIcon, WarningIcon, CustomIcon } from "@/assets/ToastIcons";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { TOAST_REMOVE_DELAY, useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={TOAST_REMOVE_DELAY}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              <div className="flex gap-x-2 items-center">
                <ToastTitle className="font-normal flex gap-x-2">
                  {props.variant === "success" && <SuccessIcon />}
                  {props.variant === "destructive" && <DestructiveIcon />}
                  {props.variant === "info" && <InfoIcon />}
                  {props.variant === "custom" && <CustomIcon />}
                  {props.variant === "warning" && <WarningIcon />}
                </ToastTitle>
                {title && <p className="text-sm font-normal">{title}</p>}
              </div>
              {description && <ToastDescription className="font-normal ml-8">{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
