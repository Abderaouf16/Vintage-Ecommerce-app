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
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { FormError } from "./form-error";
import { FormSuccess } from "./form.success";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { newPassword } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";


export default function NewPasswordForm() {


  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    execute({password: values.password, token})
  }

  const { execute,status } = useAction(newPassword, { 
    onSuccess(data) {
      if (data.data?.success !== undefined) {
        setSuccess(data.data.success);
      }
      if (data.data?.error !== undefined) {
        setError(data.data.error);
      }
  } });
 
const [error, setError] = useState('')
const [success, setSuccess] = useState('')


  return (
    <div>
      <AuthCard
        cardTitle="Reset your password "
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
        showSocials
      >
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input placeholder="*******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
              <FormSuccess message={success}/>
              <Button className= { cn('w-full p-5' , status === 'executing' ? "animate-pulse" : "" )} 
              type="submit">Reset Now</Button>
            </form>
          </Form>
        </div>
      </AuthCard>
    </div>
  );
}
