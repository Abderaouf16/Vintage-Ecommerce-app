"use client";
import React, { useState } from "react";
import AuthCard from "./auth-card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { LoginSchema } from "@/types/login-schema";

import { useAction } from "next-safe-action/hooks";
import { emailSignin } from "@/server/actions/email-signin";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FormError } from "./form-error";
import { FormSuccess } from "./form.success";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function LoginForm() {

  
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    execute(values);
  }

  const { execute, status } = useAction(emailSignin, {
    onSuccess(data) {
      if (data.data?.success !== undefined) {
        setSuccess(data.data.success);
      }
      if (data.data?.error !== undefined) {
        setError(data.data.error);
      }
      if (data.data?.twoFactor) setShowTwoFactor(true)
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  return (
    <div>
      <AuthCard
        cardTitle="Welcome back!"
        backButtonHref="/auth/register"
        backButtonLabel="Create   new account"
        showSocials
      >
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div>
            {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="Code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        We have sent you a two factor code to your email.
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          disabled={status === "executing"}
                          {...field}
                          maxLength={6}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            {!showTwoFactor && (
              <>
               <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Email</FormLabel>
                   <FormControl>
                     <Input placeholder=".....@gmail.com" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />

             <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Password</FormLabel>
                   <FormControl>
                     <Input placeholder="*******" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
             </>
            )}
             
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button variant={"link"} className=" px-1">
                <Link href="/auth/reset">Forgot your password ?</Link>
              </Button>
              <Button
                className={cn(
                  "w-full p-5",
                  status === "executing" ? "animate-pulse" : ""
                )}
                type="submit"
              >
                {showTwoFactor ? "Verify" : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>
      </AuthCard>
    </div>
  );
}
