"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { z } from "zod";
import { submitLead } from "@/app/actions";

const LeadFormSchema = z.object({
  email: z.string().email("Enter a valid email."),
  name: z.string().min(1, "Name is required.").max(120),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

type LeadFormValues = z.infer<typeof LeadFormSchema>;

function InnerLeadForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: { experienceLevel: "intermediate" },
  });

  const onSubmit = (values: LeadFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const token = executeRecaptcha ? await executeRecaptcha("waitlist_submit") : "";
      const result = await submitLead({ ...values, token });
      if (result && !result.ok) {
        setServerError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="lead-name" className="block text-sm font-semibold text-slate-900">
          Your name
        </label>
        <input
          id="lead-name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
          {...register("name")}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        />
        {errors.name && (
          <p id="lead-name-error" className="mt-1 text-sm text-rose-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lead-email" className="block text-sm font-semibold text-slate-900">
          Email
        </label>
        <input
          id="lead-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "lead-email-error" : undefined}
          {...register("email")}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        />
        {errors.email && (
          <p id="lead-email-error" className="mt-1 text-sm text-rose-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="block text-sm font-semibold text-slate-900">
          How experienced are you with health-data tracking?
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {(
            [
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ] as const
          ).map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm has-[:checked]:border-cyan-600 has-[:checked]:bg-cyan-50"
            >
              <input
                type="radio"
                value={value}
                {...register("experienceLevel")}
                className="h-4 w-4 text-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {serverError && (
        <p
          role="alert"
          className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-cyan-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Notify me when enrollment opens"}
      </button>

      <p className="text-xs text-slate-500">
        Protected by Google reCAPTCHA. By submitting you agree to receive course-launch emails. We
        will not share your data.
      </p>
    </form>
  );
}

export function LeadForm({ recaptchaSiteKey }: { recaptchaSiteKey?: string }) {
  if (!recaptchaSiteKey) {
    return <InnerLeadForm />;
  }
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <InnerLeadForm />
    </GoogleReCaptchaProvider>
  );
}
