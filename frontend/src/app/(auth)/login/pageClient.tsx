'use client';

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { ButtonView, InputView } from "@/components/ui";
import { LockIcon, UserIcon } from "@/components/icons";
import { authApi } from "@/lib/endpoints";
import { ApiError } from "@/lib/api";
import { useAuth } from "../AuthProvider";

interface LoginForm {
  email: string;
  password: string;
}

const initialForm: LoginForm = { email: "", password: "" };

const LoginPageClient = () => {
  const { signIn } = useAuth();
  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm | "form", string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: keyof LoginForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors({});
    setSubmitting(true);
    try {
      const response = await authApi.login(form.email, form.password);
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
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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
            placeholder="Enter your Password"
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
            required
          />
        </div>

        {errors.form && <p className="text-danger text-sm text-center">{errors.form}</p>}

        <ButtonView type="submit" text={submitting ? "Logging in…" : "Login"} onClick={() => {}} />
      </form>

      <p className="text-center text-sm mt-6 text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPageClient;
