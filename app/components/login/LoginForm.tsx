"use client";
import { login } from "@/actions/authActions";
import {
  coloredToast,
  forgetPasswordToast,
  successToast,
} from "@/lib/sweetAlerts";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import { object, string } from "yup";

const LoginForm = () => {
  const loginSchema = object({
    email: string()
      .email("Please enter a valid email address!")
      .required("Email is required!"),
    password: string()
      .required("This field is required.")
      .min(8, "At least 8 characters must be entered.")
      .max(16, "Maximum 16 characters must be entered.")
      .matches(/\d+/, "It must contain at least one digit.")
      .matches(/[a-z]/, "It must contain at least one lowercase letter.")
      .matches(/[A-Z]/, "It must contain at least one uppercase letter.")
      .matches(
        /[!,?{}><%&$#£+-.]+/,
        "It must contain at least one special character."
      ),
  });

  const router = useRouter();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          login(values)
            .then((data) => {
              if (data?.error) {
                setSubmitting(false);
                resetForm();
                coloredToast("danger", data.error.trim());
              } else {
                router.push("/");
                successToast("Signed in successfully.");
                setSubmitting(false);
              }
            })
            .catch((error) => {
              setSubmitting(false);
              resetForm();
              coloredToast("danger", "Something went wrong.");
            });
        }, 400);
      }}
    >
      {({ touched, errors, isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter Email"
                className={`form-input ${
                  touched.email && errors.email ? "border-red-500" : ""
                } placeholder:text-gray-400 `}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm "
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter Password"
                className={`form-input placeholder:text-gray-400 ${
                  touched.password && errors.password ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm "
              />
              <div className="flex justify-end mt-2">
                <span
                  onClick={forgetPasswordToast}
                  className="text-sm text-gray-500 font-normal cursor-pointer"
                >
                  Forget Your password ?
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle mr-4"></span>
              )}
              {isSubmitting ? "LOADING.." : "SIGN IN"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
