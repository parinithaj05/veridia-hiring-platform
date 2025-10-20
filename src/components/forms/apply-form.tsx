"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApplicationSchema, type Application } from "../../types/application";
import { useAuthStore } from "../../store/auth";
import { useApplicationsStore } from "../../store/applications";
import { uid } from "../../lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
Form,
FormField,
FormItem,
FormLabel,
FormControl,
FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

export default function ApplyForm() {
const { user } = useAuthStore();
const upsert = useApplicationsStore((s) => s.upsert);

const form = useForm<z.infer<typeof ApplicationSchema>>({
resolver: zodResolver(ApplicationSchema),
defaultValues: {
id: uid(),
userId: user?.id || "",
position: "Frontend Developer",
firstName: user?.name || "",
lastName: "",
email: user?.email || "",
phone: "",
motivation: "",
status: "Draft",
},
mode: "onChange",
});

function saveDraft() {
const data = form.getValues();
upsert({ ...(data as Application), status: "Draft" });
toast.success("Draft saved");
}

function onSubmit(values: z.infer<typeof ApplicationSchema>) {
upsert({ ...values, status: "Submitted", submittedAt: new Date().toISOString() });
toast.success("Application submitted");
}

return (
<div className="max-w-2xl mx-auto space-y-6">
<h1 className="text-2xl font-semibold">Apply for {form.watch("position")}</h1>
<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
<div className="grid md:grid-cols-2 gap-4">
<FormField
control={form.control}
name="firstName"
render={({ field }) => (
<FormItem>
<FormLabel>First name</FormLabel>
<FormControl><Input {...field} /></FormControl>
<FormMessage />
</FormItem>
)}
/>
<FormField
control={form.control}
name="lastName"
render={({ field }) => (
<FormItem>
<FormLabel>Last name</FormLabel>
<FormControl><Input {...field} /></FormControl>
<FormMessage />
</FormItem>
)}
/>
</div>


      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position</FormLabel>
            <FormControl><Input placeholder="Frontend Developer" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="motivation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Why do you want this role?</FormLabel>
            <FormControl><Textarea rows={5} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={saveDraft}>
          Save draft
        </Button>
        <Button type="submit" disabled={!form.formState.isValid}>
          Submit application
        </Button>
      </div>
    </form>
  </Form>
</div>
);
}