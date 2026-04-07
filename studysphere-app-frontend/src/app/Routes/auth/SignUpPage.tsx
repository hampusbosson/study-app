import React from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../../../components/ui/Header/Logo";
import { signup } from "../../../lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { paths } from "../../../config/paths";

const schema = z
  .object({
    email: z.string().email("Please provide a valid email address."),
    password: z
      .string()
      .min(7, "Password must be at least 7 characters long.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter."),
    repeatedPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: "Passwords must match.",
    path: ["repeatedPassword"], // Points to the field with the issue
  });

type FormFields = z.infer<typeof schema>;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const inputClassName =
    "w-full rounded-lg border border-border bg-surface px-3 py-3 text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]";
  const primaryButtonClassName =
    "w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white transition duration-200 hover:bg-accentHover disabled:cursor-not-allowed disabled:opacity-70";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { email, password } = data;
    try {
      await signup(email, password);
      
      navigate(paths.auth.verify.getHref(), {state: { email, password } });

    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.message) {
        // Use the backend error message
        setError("root", {
          type: "server",
          message: axiosError.message, // Display the backend error message
        });
      } else {
        // Fallback for unexpected errors
        setError("root", {
          type: "server",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  const loginRedirect = () => navigate(paths.auth.login.getHref());

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <div className="absolute top-4 left-4 p-2">
        <Logo clickable={true} size={48} />
      </div>
      <div className="w-full max-w-md rounded-lg border border-border bg-surface px-6 py-8 shadow-sm sm:px-8">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold text-text md:text-5xl">Let&apos;s get you set up</h1>
          <h2 className="font-semibold text-muted">
            Create your account to start building your study workspace.
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <input
          {...register("email")}
          type="text"
          placeholder="Email"
          className={inputClassName}
        />
        {errors.email && (
          <div className="-mt-2 w-full text-left text-xs text-red-500">
            {errors.email.message}
          </div>
        )}
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className={inputClassName}
        />
        {errors.password && (
          <div className="-mt-2 w-full text-left text-xs text-red-500">
            {errors.password.message}
          </div>
        )}
        <input
          {...register("repeatedPassword")}
          type="password"
          placeholder="Repeat Password"
          className={inputClassName}
        />
        {errors.repeatedPassword && (
          <div className="-mt-2 w-full text-left text-xs text-red-500">
            {errors.repeatedPassword?.message}
          </div>
        )}

        {errors.root && (
          <div className="-mt-2 w-full text-left text-xs text-red-500">
            {errors.root.message}
          </div>
        )}
        <button disabled={isSubmitting} type="submit" className={primaryButtonClassName}>
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
      </form>
        <button
          className="group mt-4 flex flex-row gap-1 text-sm text-muted transition hover:text-text"
          onClick={loginRedirect}
        >
          Already have an account?
          <p className="font-semibold underline group-hover:text-accent">Login</p>
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
