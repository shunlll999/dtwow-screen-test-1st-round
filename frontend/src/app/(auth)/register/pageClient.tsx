'use client';

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { ButtonView, InputView } from "@/components/ui";
import { UserIcon, LockIcon } from "@/components/icons";
import { authApi } from "@/lib/endpoints";
import { ApiError } from "@/lib/api";
import { useAuth } from "../AuthProvider";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialForm: RegisterForm = { name: "", email: "", password: "", confirmPassword: "" };

const RegisterPageClient = () => {
  const { signIn } = useAuth();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm | "form", string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: keyof RegisterForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const response = await authApi.register(form.name, form.email, form.password);
      signIn(response);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(
          Object.keys(error.fieldErrors).length
            ? error.fieldErrors
            : { form: error.message },
        );
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Full name
          </label>
          <InputView
            id="name"
            icon={<UserIcon />}
            placeholder="Enter your Full Name"
            value={form.name}
            onChange={handleChange("name")}
            error={errors.name}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-2">
            Email
          </label>
          <InputView
            id="email"
            type="email"
            icon={<UserIcon />}
            placeholder="Enter your Email Address"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium mb-2">
            Password
          </label>
          <InputView
            id="password"
            isPassword
            icon={<LockIcon />}
            placeholder="Create a Password"
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
            minLength={8}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-medium mb-2">
            Confirm Password
          </label>
          <InputView
            id="confirmPassword"
            isPassword
            icon={<LockIcon />}
            placeholder="Re-enter your Password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={errors.confirmPassword}
            required
          />
        </div>

        {errors.form && <p className="text-danger text-sm text-center">{errors.form}</p>}

        <ButtonView
          type="submit"
          text={submitting ? "Creating account…" : "Create an account"}
          onClick={() => {}}
        />
      </form>

      <p className="text-center text-sm mt-6 text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPageClient;
