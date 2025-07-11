import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Ellipsis } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slice/authSlice";
import { loginUser } from "@/api/axios/auth";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await loginUser(values);

      const userData = {
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
        },
        token: response.token,
      };
      dispatch(setCredentials(userData));
      toast.success("Login successful");
      if (response.status === 200) {
        navigate("/");
      }
    } catch (err) {
      setFieldError("general", err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      {/* Card */}
      <div className="w-full max-w-5xl h-auto md:h-[80vh] flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl bg-white">
        {/* LEFT – LOGIN FORM */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 sm:px-12">
          <h2 className="text-3xl font-bold text-[#d89e00] mb-8 leading-tight text-center">
            Sign In to
            <br />
            Your Account
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4 mb-6">
                {/* EMAIL */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Field
                      as={Input}
                      className={`pl-10 bg-gray-100/80 focus:bg-white ${
                        errors.email && touched.email
                          ? "border border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      name="email"
                      type="email"
                      placeholder="Email"
                      autoComplete="off"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1 ml-1"
                  />
                </div>
                {/* PASSWORD */}
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Field
                      as={Input}
                      className={`pl-10 bg-gray-100/80 focus:bg-white ${
                        errors.password && touched.password
                          ? "border border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="off"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1 ml-1"
                  />
                </div>

                {/* General error */}
                {errors.general && (
                  <div className="text-red-500 text-sm text-center">
                    {errors.general}
                  </div>
                )}

                 

                <Button
                  className="w-full bg-[#d89e00] hover:bg-[#c58900]"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      Signing In
                      <Ellipsis className="w-4 h-4" />
                    </span>
                  ) : (
                    "SIGN IN"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        {/* RIGHT – WELCOME PANEL */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-[#003b5c] text-white relative">
          {/* Decorative shapes */}
          <div className="absolute -right-10 -top-12 w-32 h-32 rotate-45 bg-white/10" />
          <div className="absolute left-1/2 top-1/4 w-8 h-8 rounded-full bg-white/10" />
          <div className="absolute right-8 bottom-1/3 w-4 h-4 rotate-45 bg-white/10" />
          <div className="absolute left-4 bottom-6 w-2 h-2 rounded-full bg-white/10" />

          {/* Content */}
          <h2 className="text-3xl font-semibold mb-3 text-center">
            Hello Friend!
          </h2>
          <p className="text-center text-sm mb-8 max-w-[240px] leading-relaxed">
            Enter your personal details and
            <br />
            start your journey with us
          </p>
          <Button
            className="border-white text-white hover:bg-white/10"
            onClick={() => navigate("/signup")}
          >
            SIGN UP
          </Button>
        </div>
      </div>
    </div>
  );
}
