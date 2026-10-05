import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { registrationApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(() => z.object({
    fullName: z.string().min(2, t("register.fieldRequired")),
    email: z.string().email(t("register.fieldEmail")),
    phone: z.string().min(6, t("register.fieldRequired")),
    church: z.string().min(2, t("register.fieldRequired")),
    country: z.string().min(2, t("register.fieldRequired")),
    tiktokUsername: z.string().min(2, t("register.fieldRequired")),
    contentType: z.array(z.string()).min(1, t("register.fieldMinContent")),
    otherPlatforms: z.string().optional(),
    contribution: z.string().min(10, t("register.fieldMinContribution")),
    availability: z.enum(["available100", "dependsCircumstances", "cannotCommit"]),
    ethicsStatement: z.string().optional(),
    agreeToCovenant: z.literal(true, {
      errorMap: () => ({ message: t("register.mustAgree") })
    })
  }), [t]);

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      contentType: [],
      availability: "available100",
      agreeToCovenant: false as any
    }
  });

  const steps = useMemo(
    () => [
      {
        title: t("register.personalInfo"),
        fields: ["fullName", "email", "phone", "church", "country"] as const
      },
      {
        title: t("register.socialMedia"),
        fields: ["tiktokUsername", "contentType"] as const
      },
      {
        title: t("register.responsibility"),
        fields: ["contribution", "availability"] as const
      },
      {
        title: t("register.ethics"),
        fields: [] as const
      },
      {
        title: t("register.covenant"),
        fields: ["agreeToCovenant"] as const
      }
    ],
    [t]
  );

  const contentOptions = useMemo(
    () => [
      { value: "familyGames", label: t("register.familyGames") },
      { value: "dailyVlogs", label: t("register.dailyVlogs") },
      { value: "bibleTeaching", label: t("register.bibleTeaching") },
      { value: "parentingAdvice", label: t("register.parentingAdvice") },
      { value: "worship", label: t("register.worship") },
      { value: "other", label: t("register.other") }
    ],
    [t]
  );

  const availabilityOptions = useMemo(
    () => [
      { value: "available100", label: t("register.availability100") },
      { value: "dependsCircumstances", label: t("register.availabilityDepends") },
      { value: "cannotCommit", label: t("register.availabilityCannot") }
    ],
    [t]
  );

  const nextStep = async () => {
    const currentFields = steps[step].fields;
    const isValid = await form.trigger(currentFields, { shouldFocus: true });
    if (isValid) setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await registrationApi.create({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        church: values.church,
        country: values.country,
        tiktokUsername: values.tiktokUsername,
        contentType: values.contentType,
        otherPlatforms: values.otherPlatforms
          ? values.otherPlatforms.split(",").map((item) => item.trim())
          : [],
        contribution: values.contribution,
        availability: values.availability,
        agreeToCovenant: values.agreeToCovenant,
        ethicsStatement: values.ethicsStatement
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container section-compact">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="section-title text-2xl md:text-3xl">{t("register.title")}</h1>
          <p className="text-muted-foreground">{t("register.subtitle")}</p>
        </div>

        {/* Visual step progress indicator */}
        <div className="flex items-center gap-2" aria-label={`Step ${step + 1} of ${steps.length}`}>
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300 flex-1",
                  i < step && "bg-accent",
                  i === step && "bg-primary",
                  i > step && "bg-muted"
                )}
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold">{steps[step].title}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Step {step + 1} of {steps.length}
            <Separator className="mx-2 w-6" />
            <span>{t("register.subtitle")}</span>
          </div>
        </div>

        {submitted ? (
          <div className="space-y-2 text-center">
            <p className="text-lg font-semibold text-primary" role="status" aria-live="polite">
              {t("register.success")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("register.successFollowup")}
            </p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit as any)}>
                {submitError && (
                  <p className="text-sm text-destructive" role="alert">
                    {submitError}
                  </p>
                )}
                {step === 0 && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t("register.fullName")}</Label>
                      <Input id="fullName" autoComplete="name" {...form.register("fullName")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("register.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        {...form.register("email")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("register.phone")}</Label>
                      <Input id="phone" autoComplete="tel" {...form.register("phone")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="church">{t("register.church")}</Label>
                      <Input id="church" autoComplete="organization" {...form.register("church")} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="country">{t("register.country")}</Label>
                      <Input id="country" autoComplete="country-name" {...form.register("country")} />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tiktokUsername">{t("register.tiktokUsername")}</Label>
                      <Input
                        id="tiktokUsername"
                        autoComplete="username"
                        {...form.register("tiktokUsername")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("register.contentType")}</Label>
                      <div className="grid gap-2 md:grid-cols-2">
                        {contentOptions.map((option) => (
                          <label key={option.value} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={form.watch("contentType").includes(option.value)}
                              onCheckedChange={(checked) => {
                                const current = form.getValues("contentType");
                                if (checked) {
                                  form.setValue("contentType", [...current, option.value], {
                                    shouldValidate: true
                                  });
                                } else {
                                  form.setValue(
                                    "contentType",
                                    current.filter((item) => item !== option.value),
                                    { shouldValidate: true }
                                  );
                                }
                              }}
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherPlatforms">{t("register.otherPlatforms")}</Label>
                      <Input id="otherPlatforms" placeholder="YouTube, Instagram" {...form.register("otherPlatforms")} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contribution">{t("register.contribution")}</Label>
                      <Textarea id="contribution" {...form.register("contribution")} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("register.availability")}</Label>
                      <div className="grid gap-2">
                        {availabilityOptions.map((opt) => (
                          <label key={opt.value} className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              value={opt.value}
                              className="accent-primary"
                              {...form.register("availability")}
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ethicsStatement">{t("register.ethicsLabel")}</Label>
                      <Textarea
                        id="ethicsStatement"
                        placeholder={t("register.ethicsPlaceholder")}
                        {...form.register("ethicsStatement")}
                      />
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">{t("covenant.title")}</p>
                      <ul className="mt-2 list-disc pl-5">
                        {(t("covenant.rules", { returnObjects: true }) as string[])
                          .slice(0, 4)
                          .map((rule) => (
                            <li key={rule}>{rule}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">{t("covenant.title")}</p>
                      <ul className="mt-2 list-disc pl-5">
                        {(t("covenant.rules", { returnObjects: true }) as string[]).map(
                          (rule) => (
                            <li key={rule}>{rule}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={form.watch("agreeToCovenant")}
                        onCheckedChange={(checked) => {
                          form.setValue("agreeToCovenant", Boolean(checked) as any, {
                            shouldValidate: true
                          });
                        }}
                      />
                      {t("register.agreeToCovenant")}
                    </label>
                  </div>
                )}

            <div className="flex items-center justify-between pt-2">
              <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 0}>
                {t("common.previous")}
              </Button>
              {step < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  {t("common.next")}
                </Button>
              ) : (
                <Button type="submit" disabled={submitting}>
                  {submitting ? t("register.submitting") : t("register.submit")}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default RegisterPage;
