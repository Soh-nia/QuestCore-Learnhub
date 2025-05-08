"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Footer from "@/app/_components/Footer";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { userSchema } from "@/lib/validationSchemas";
import { signIn } from "next-auth/react";
import Spinner from "@/app/_components/Spinner";

type UserFormData = z.infer<typeof userSchema>;

export default function InstructorSignUp() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "instructor",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      setError("");
      const response = await axios.post("/api/signup", data);
      if (response.status === 201) {
        router.push("/auth/signin");
      }
    } catch (err) {
      setIsSubmitting(false);
      setError("Failed to create account. Email might already exist.");
      console.error("Signup error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="max-w-lg px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign Up as Instructor</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                Already have an account?{" "}
                <Link
                  className="text-cyan-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-cyan-500"
                  href="/auth/signin"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard", role: "instructor" })}
                disabled={isSubmitting}
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                  <path
                    d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                    fill="#34A853"
                  />
                  <path
                    d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign up with Google
              </button>

              <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                Or
              </div>

              {error && (
                <div
                  className="mt-2 bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500"
                  role="alert"
                  tabIndex={-1}
                  aria-labelledby="hs-soft-color-danger-label"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-y-4">
                  <input type="hidden" {...register("role")} />
                  <div>
                    <label htmlFor="name" className="block text-sm mb-2 dark:text-white">
                      Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        className="py-2.5 sm:py-3 px-4 block w-full border-2 border-gray-300 rounded-lg sm:text-sm hover:border-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-400 dark:placeholder-neutral-500 dark:hover:border-neutral-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                        {...register("name")}
                        aria-describedby="name-error"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-2" id="name-error">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm mb-2 dark:text-white">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        className="py-2.5 sm:py-3 px-4 block w-full border-2 border-gray-300 rounded-lg sm:text-sm hover:border-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-400 dark:placeholder-neutral-500 dark:hover:border-neutral-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                        {...register("email")}
                        aria-describedby="email-error"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-2" id="email-error">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="hs-toggle-password"
                        type={showPassword ? "text" : "password"}
                        className="py-2.5 sm:py-3 ps-4 pe-10 block w-full border-2 border-gray-300 rounded-lg sm:text-sm hover:border-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-400 dark:placeholder-neutral-500 dark:hover:border-neutral-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                        placeholder="Enter password"
                        {...register("password")}
                        aria-describedby="password-error"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                      >
                        {showPassword ? (
                          <IoEyeOffOutline className="shrink-0 size-3.5" />
                        ) : (
                          <IoEyeOutline className="shrink-0 size-3.5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-2" id="password-error">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm mb-2 dark:text-white">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="confirm-password"
                        className="py-2.5 sm:py-3 px-4 block w-full border-2 border-gray-300 rounded-lg sm:text-sm hover:border-gray-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-400 dark:placeholder-neutral-500 dark:hover:border-neutral-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400"
                        {...register("confirmPassword")}
                        aria-describedby="confirm-password-error"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-2" id="confirm-password-error">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-lime-600 text-white hover:bg-lime-700 focus:outline-hidden focus:bg-lime-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <>
                        Signing up... <Spinner />
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}