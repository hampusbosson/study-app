import React from "react";
import Logo from "../../../components/ui/Header/Logo";
import { login, getUserFromSession } from "../../../lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/auth/useAuth";
import { AxiosError } from "axios";
import { paths } from "../../../config/paths";

const schema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string(),
});

type FormFields = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
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
      await login(email, password); // Backend login request

      const userData = await getUserFromSession();
      setUser(userData);

      navigate(paths.app.home.getHref()); // Redirect only on success
    } catch (error) {
      // Handle errors and set them in the form
      if (error instanceof AxiosError && error.response?.data?.message) {
        const backendErrorMessage = error.response.data.message;
        setError("root", {
          type: "server",
          message: backendErrorMessage,
        });
      } else {
        // Handle other errors or unexpected cases
        setError("root", {
          type: "server",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  const signupRedirect = () => navigate(paths.auth.signup.getHref());

  const resetPasswordRedirect = () => navigate(paths.auth.resetPassword.getHref());

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <div className="absolute top-4 left-4 p-2">
        <Logo clickable={true} size={48} />
      </div>
      <div className="w-full max-w-md rounded-lg border border-border bg-surface px-6 py-8 shadow-sm sm:px-8">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold text-text md:text-5xl">Welcome back</h1>
          <h2 className="font-semibold text-muted">Log in to continue studying.</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
          <input
            {...register("email")}
            type="text"
            placeholder="Email Address"
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

          {errors.root && (
            <div className="-mt-2 w-full text-left text-xs text-red-500">
              {errors.root.message}
            </div>
          )}
          <div className="-mt-2">
            <button
              className="pl-1 text-left text-sm font-medium text-muted underline transition hover:text-text"
              onClick={resetPasswordRedirect}
              type="button"
            >
              Forgot your password?
            </button>
          </div>

          <button disabled={isSubmitting} type="submit" className={primaryButtonClassName}>
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </form>
        <button
          className="group mt-4 flex flex-row gap-1 text-sm text-muted transition hover:text-text"
          onClick={signupRedirect}
        >
          Dont have an account?
          <p className="font-semibold underline group-hover:text-accent">Sign Up</p>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
