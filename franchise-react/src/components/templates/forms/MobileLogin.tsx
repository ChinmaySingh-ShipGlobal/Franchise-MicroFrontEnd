// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useForm } from "react-hook-form";
// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function MobileLoginForm() {
//   const form = useForm();
//   const [otp, setOtp] = useState<string | null>(null);
//   const [otpTime, setOtpTime] = useState(30000);

//   const onSubmit = () => {
//     console.log("form submitted");
//   };

//   useEffect(() => {
//     if (!otp) return;
//     if (otpTime === 0) return;
//     const timer = setTimeout(() => {
//       setOtpTime(otpTime - 1000);
//     }, 1000);

//     return () => {
//       clearTimeout(timer);
//     };
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 xl:space-y-4 2xl:space-y-6">
//         <FormField
//           control={form.control}
//           name="mobileNumber"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Mobile Number</FormLabel>
//               <FormControl>
//                 <div className="flex flex-row">
//                   <Select>
//                     <SelectTrigger className="pointer-events-none w-18 focus:ring-white">
//                       <SelectValue placeholder="+91" />
//                     </SelectTrigger>
//                   </Select>
//                   <Input className="ml-4" placeholder="XXXX XXX XXX" {...field} />
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         {/* {otp && (
//             <FormField
//               control={form.control}
//               name="pincode"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>OTP</FormLabel>
//                   <FormControl>
//                     <div className="flex items-center justify-center">
//                       <InputOTP
//                         maxLength={6}
//                         value={00}
//                         onChange={(value) => setValue(value)}
//                       >
//                         <InputOTPGroup>
//                           <InputOTPSlot index={0} />
//                         </InputOTPGroup>
//                         <InputOTPSeparator />
//                         <InputOTPGroup>
//                           <InputOTPSlot index={1} />
//                         </InputOTPGroup>
//                         <InputOTPSeparator />
//                         <InputOTPGroup>
//                           <InputOTPSlot index={2} />
//                         </InputOTPGroup>
//                         <InputOTPSeparator />
//                         <InputOTPGroup>
//                           <InputOTPSlot index={3} />
//                         </InputOTPGroup>
//                         <InputOTPSeparator />
//                         <InputOTPGroup>
//                           <InputOTPSlot index={4} />
//                         </InputOTPGroup>
//                         <InputOTPSeparator />
//                         <InputOTPGroup>
//                           <InputOTPSlot index={5} />
//                         </InputOTPGroup>
//                       </InputOTP>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           )} */}
//         <div className="flex items-center justify-center">
//           <Button type="submit" size="xl" className="mt-4">
//             {otp ? "Validate" : "Get OTP"}
//           </Button>
//         </div>
//         <div className="flex flex-col items-center">
//           <p className="my-2 font-medium text-primary"></p>
//           {otp && otpTime !== 0 && (
//             <p>
//               Resend OTP in
//               <span className="font-semibold"> {otpTime / 1000} sec </span>
//             </p>
//           )}
//           {otpTime === 0 && <p className="font-semibold underline text-primary">Resend OTP</p>}
//         </div>
//       </form>
//     </Form>
//   );
// }
