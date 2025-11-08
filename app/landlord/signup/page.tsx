<<<<<<< HEAD
=======
// app/landlord/signup/page.tsx

>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

<<<<<<< HEAD
export default function LandlordSignupPage() {
=======
/**
 * Landlord Signup Page
 *
 * Dedicated signup page for landlords to create a new account.
 * Creates a user with LANDLORD role and redirects to onboarding.
 */
const LandlordSignupPage = () => {
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
<<<<<<< HEAD
    phone: "",
    companyName: "",
=======
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

<<<<<<< HEAD
=======
    // Validation
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
<<<<<<< HEAD
      const response = await fetch("/api/auth/landlord/signup", {
=======
      // Call the signup API with role
      const response = await fetch("/api/auth/signup", {
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
<<<<<<< HEAD
          phone: formData.phone,
          companyName: formData.companyName,
=======
          role: "LANDLORD",
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
        }),
      });

      const data = await response.json();

      if (!response.ok) {
<<<<<<< HEAD
        throw new Error(data.error || "Failed to create landlord account");
      }

      // Redirect to landlord signin page with success message instead of auto-login
      router.push("/landlord/signin?message=Account created successfully. Please log in.");
=======
        throw new Error(data.error || "Failed to create account");
      }

      // Auto-login after successful signup
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // If auto-login fails, redirect to login page
        router.push(
          "/landlord/login?message=Account created successfully. Please log in."
        );
      } else {
        // If auto-login succeeds, redirect to onboarding
        router.push("/landlord/onboarding");
        router.refresh();
      }
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during signup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

<<<<<<< HEAD
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
=======
  // Handle Google OAuth signup
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/landlord/onboarding" });
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
    } catch (error) {
      setError("An error occurred with Google signup");
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
=======
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="rounded-full bg-indigo-600 p-3">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create Landlord Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
<<<<<<< HEAD
            Already have an account?{" "}
            <Link
              href="/landlord/signin"
=======
            Start managing your properties today
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/landlord/login"
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
<<<<<<< HEAD
          <p className="mt-2 text-center text-sm text-gray-600">
            Are you a tenant?{" "}
            <Link
              href="/tenant/signup"
              className="font-medium text-green-600 hover:text-green-500"
=======
          <p className="mt-4 text-center text-xs text-gray-500">
            Are you a tenant?{" "}
            <Link
              href="/tenant/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
            >
              Create tenant account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
            <div>
<<<<<<< HEAD
              <label htmlFor="phone" className="sr-only">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label htmlFor="companyName" className="sr-only">
                Company name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                className="relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Company name (optional)"
              />
            </div>
            <div>
=======
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password (min. 8 characters)"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="relative block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
<<<<<<< HEAD
              {isLoading ? "Creating account..." : "Create Landlord Account"}
=======
              {isLoading ? "Creating account..." : "Create landlord account"}
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
            </button>
          </div>
        </form>

<<<<<<< HEAD
=======
        {/* Divider */}
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
<<<<<<< HEAD
            <span className="bg-gray-50 px-2 text-gray-500">
=======
            <span className="bg-gradient-to-br from-blue-50 to-indigo-100 px-2 text-gray-500">
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
              Or sign up with
            </span>
          </div>
        </div>

<<<<<<< HEAD
=======
        {/* Google OAuth Signup */}
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
        <div>
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
};

export default LandlordSignupPage;
>>>>>>> 89d17f5e1d4587184003867fa0bd93e1fe1869f2
