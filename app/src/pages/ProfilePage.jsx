import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { changePasswordSchema, updateProfileSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function ProfileDetailsSection() {
  const { user, updateProfile } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  async function onSubmit(values) {
    setServerError(null);
    setSuccess(false);
    try {
      await updateProfile(values);
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.error ?? "Failed to update profile");
    }
  }

  return (
    <section className="space-y-4 rounded-lg border p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          {user?.role === "admin" && (
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
          )}

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          {success && <p className="text-sm text-green-600">Profile updated successfully.</p>}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </section>
  );
}

export function ProfilePage() {
  const { changePassword } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  async function onSubmit(values) {
    setServerError(null);
    setSuccess(false);
    try {
      const { confirmNewPassword, ...payload } = values;
      await changePassword(payload);
      form.reset();
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.error ?? "Failed to change password");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <ProfileDetailsSection />

        <section className="rounded-lg border p-4">
          <h2 className="mb-4 text-lg font-semibold">Change Password</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
            {success && (
              <p className="text-sm text-green-600">Password changed successfully.</p>
            )}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </section>
      </div>
    </div>
  );
}
