"use client";

import { AuthTokenResponse } from "@supabase/supabase-js";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Please enter a valid password.",
  }),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { t } = useTranslation();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, error } = await signIn(values.email, values.password);
    if (error) {
      form.setError("email", {
        message: error.message,
      });
      form.setError("password", {
        message: error.message,
      });
      return;
    }
  }

  const signIn = (
    email: string,
    password: string
  ): Promise<AuthTokenResponse> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");

    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  return (
    <div className="grid grid-rows-2 px-8 sm:px-20 lg:grid-cols-2 lg:grid-rows-1 lg:px-0 items-stretch">
      <div className="flex items-center justify-center gap-2">
        <Icons.logo className="h-12 w-12 text-foreground" />
        <span className="font-bold text-xl">{t(siteConfig.displayName)}</span>
      </div>
      <div className="lg:border-l lg:border-l-muted lg:px-28 flex flex-col items-stretch justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col items-stretch"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState, formState }) => (
                <FormItem>
                  <FormLabel>{t("Email")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="user@example.com"
                      disabled={
                        form.formState.isSubmitting ||
                        form.formState.isSubmitSuccessful
                      }
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState, formState }) => (
                <FormItem>
                  <FormLabel>{t("Password")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      disabled={
                        form.formState.isSubmitting ||
                        form.formState.isSubmitSuccessful
                      }
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting || form.formState.isSubmitSuccessful
              }
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
