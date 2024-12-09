import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address" }),
  password: z.string().min(6, { message: "Password must be 6 or more characters long" }).max(18),
});

export const initialLoginFormValues = {
  email: "",
  password: "",
};

export const initialResetPasswordValues = {
  password: "",
  confirmPassword: "",
  logout_all_devices: false,
};

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be 6 or more characters long" }).max(18),
    confirmPassword: z.string().min(6, { message: "Password must be 6 or more characters long" }).max(18),
    logout_all_devices: z.boolean(),
  })
  .superRefine(({ password, confirmPassword }, checkPasswordComplexity) => {
    const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    const countSpecialCharacters = (str: string): number => {
      return [...str].reduce((count, ch) => count + (containsSpecialChar(ch) ? 1 : 0), 0);
    };

    const passwordSpecialCharCount = countSpecialCharacters(password);
    const confirmPasswordSpecialCharCount = countSpecialCharacters(confirmPassword);

    if (confirmPasswordSpecialCharCount < 1) {
      checkPasswordComplexity.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Password must have a special character",
      });
    }
    if (passwordSpecialCharCount < 1) {
      checkPasswordComplexity.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must have a special character",
      });
    }
    if (password !== confirmPassword) {
      checkPasswordComplexity.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords don't match",
      });
    }
  });

export const leadFormSchema = z.object({
  firstName: z.string().min(3, { message: "Must be 3 or more character(s)" }).max(30),
  lastName: z.string().min(3, { message: "Must be 3 or more character(s)" }).max(30),
  email: z.string().email({ message: "Must be a valid email address" }),
  mobile: z.string().length(10, { message: "Must be 10 digits long" }),
  address: z.string().min(2, { message: "Must be a valid business address" }).max(100),
  state: z.string().min(2, { message: "Please select state" }),
  city: z.string().min(1, { message: "Please select city" }),
  avgDailyOrder: z.string().min(1, { message: "Please select" }).max(50),
  pincode: z.string().length(6, { message: "Must be a valid pincode" }),
  description: z.string().optional(),
  toc: z.boolean().refine((val) => val === true, { message: "Please accept the terms and conditions" }),
});

export const initialLeadFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  address: "",
  state: "",
  city: "",
  avgDailyOrder: "",
  pincode: "",
  description: "",
  toc: false,
};
