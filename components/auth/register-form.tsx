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
import { RegisterSchema } from "@/types/register-schema";
import Link from "next/link";
import { emailRgister } from "@/server/actions/email-register";
import { FormError } from "./form-error";
import { FormSuccess } from "./form.success";

export default function RegisterForm() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    execute(values)
  }
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(emailRgister, {
    onSuccess(data) {
        if (data.data?.success !== undefined) {
            setSuccess(data.data.success);
          }
          if (data.data?.error !== undefined) {
            setError(data.data.error);
          }

    },
  });
  
  return (
    <div>
      <AuthCard
        cardTitle="Create an account"
        backButtonHref="/auth/login"
        backButtonLabel="Already have an account?"
        showSocials
      >
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Abderaouf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Abderaouf@gmail.com"
                        {...field}
                      />
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
                      <Input type="text" placeholder="*******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                Register
              </Button>
            </form>
          </Form>
        </div>
      </AuthCard>
    </div>
  );
}
