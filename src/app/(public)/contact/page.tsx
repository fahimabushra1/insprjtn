"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { useSubmitContact } from "@/hooks/useContacts";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { useAuth } from "@/hooks/useAuth";
import { trackContact, trackLead, trackPhoneCallClick } from "@/lib/analytics/facebook/events";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { useLanguage } from "@/providers/LanguageProvider";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number must be at least 5 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const { user } = useAuth();
  const submitContact = useSubmitContact();
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const { language } = useLanguage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data) => {
    submitContact.mutate(data, {
      onSuccess: () => {
        trackContact("website_form", { name: data.name, email: data.email, phone: data.phone });
        trackLead("contact_submission", 0, { name: data.name, email: data.email, phone: data.phone });
        successAlert("Message Sent", "We will get back to you as soon as possible!");
        reset();
      },
      onError: (err) => {
        errorAlert("Submission Failed", err.message || "Failed to submit message.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-950/5 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-3">
              {language === "en" ? "Get In Touch" : "যোগাযোগ করুন"}
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl mb-4">
              {language === "en" ? "Contact " : ""}<span className="text-primary">{language === "en" ? "Us" : "যোগাযোগ"}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {language === "en"
                ? "Have questions about our Sundarban tours? Reach out and we will help you plan your journey."
                : "সুন্দরবন ভ্রমণ নিয়ে কোনো প্রশ্ন আছে? আমাদের সাথে যোগাযোগ করুন এবং আমরা আপনার যাত্রা পরিকল্পনা করতে সাহায্য করব।"}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-emerald-950/10 bg-card/65 transition-all hover:border-emerald-600/20 shadow-sm">
              <CardContent className="p-6 flex gap-4 items-start">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <FiPhone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{language === "en" ? "Phone" : "ফোন"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <a href="tel:+8801884545974" onClick={() => trackPhoneCallClick("+8801884545974", user || undefined)}>+880 1884-545974</a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {language === "en" ? "Sat - Thu, 9am - 6pm" : "শনি - বৃহস্পতি, সকাল ৯টা - সন্ধ্যা ৬টা"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-950/10 bg-card/65 transition-all hover:border-emerald-600/20 shadow-sm">
              <CardContent className="p-6 flex gap-4 items-start">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <FiMail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{language === "en" ? "Email" : "ইমেইল"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <a href="mailto:info@insaniatparjatan.com">info@insaniatparjatan.com</a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {language === "en" ? "24/7 online support" : "২৪/৭ অনলাইন সহায়তা"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-950/10 bg-card/65 transition-all hover:border-emerald-600/20 shadow-sm">
              <CardContent className="p-6 flex gap-4 items-start">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <FiMapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{language === "en" ? "Office Location" : "অফিস ঠিকানা"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {language === "en" ? "Khulna Shipyard Road, Khulna, Bangladesh" : "খুলনা শিপইয়ার্ড রোড, খুলনা, বাংলাদেশ"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-emerald-950/10 bg-card/65 shadow-sm">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{language === "en" ? "Full Name" : "পূর্ণ নাম"}</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        {...register("name")}
                        className={errors.name ? "border-destructive focus-visible:ring-destructive" : "border-emerald-950/10 focus-visible:ring-emerald-600"}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{language === "en" ? "Email Address" : "ইমেইল ঠিকানা"}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        className={errors.email ? "border-destructive focus-visible:ring-destructive" : "border-emerald-950/10 focus-visible:ring-emerald-600"}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{language === "en" ? "Phone Number" : "ফোন নম্বর"}</Label>
                    <Input
                      id="phone"
                      type="text"
                      placeholder="+880 17XXXXXXXX"
                      {...register("phone")}
                      className={errors.phone ? "border-destructive focus-visible:ring-destructive" : "border-emerald-950/10 focus-visible:ring-emerald-600"}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{language === "en" ? "Message" : "বার্তা"}</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder={language === "en" ? "Hi, I am interested in booking a Sundarban tour..." : "হ্যালো, আমি সুন্দরবন ট্যুর বুক করতে আগ্রহী..."}
                      {...register("message")}
                      className={errors.message ? "border-destructive focus-visible:ring-destructive" : "border-emerald-950/10 focus-visible:ring-emerald-600"}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto h-11 px-8"
                    disabled={submitContact.isPending}
                  >
                    {submitContact.isPending ? (
                      <>
                        <ButtonLoader className="mr-2 h-4 w-4" />
                        {language === "en" ? "Submitting..." : "পাঠানো হচ্ছে..."}
                      </>
                    ) : (
                      language === "en" ? "Submit Message" : "বার্তা পাঠান"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
