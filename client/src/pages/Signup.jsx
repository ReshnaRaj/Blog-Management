import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Ellipsis } from "lucide-react";
import { signupUser } from "@/api/axios/auth";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Signup() {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const res = await signupUser(values);
      toast.success("Signup successful");
      if (res.status === 201) navigate("/login");
    } catch (err) {
      setFieldError("general", err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <div className="w-full max-w-5xl h-auto md:h-[80vh] flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl bg-white">
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-[#003b5c] text-white relative">
          <div className="absolute -left-20 -bottom-10 w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute right-14 top-6 w-8 h-8 rotate-45 bg-white/10" />
          <div className="absolute left-16 bottom-20 w-4 h-4 rotate-45 bg-white/10" />

          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
            Welcome Back!
          </h2>
          <p className="text-center text-xs sm:text-sm mb-6 sm:mb-8 max-w-[220px] leading-relaxed">
            To keep connected with us please login with your personal info
          </p>
          <Button onClick={() => navigate("/login")}>
            SIGN IN
          </Button>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-8 md:px-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#d89e00] mb-6 sm:mb-8 text-center">
            Create Account
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-5">
                {/* NAME */}
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Field
                      as={Input}
                      className={`pl-10 bg-gray-100/80 focus:bg-white text-sm sm:text-base ${
                        errors.name && touched.name ? "border border-red-500 focus:border-red-500" : ""
                      }`}
                      name="name"
                      placeholder="Name"
                      autoComplete="off"
                    />
                  </div>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs mt-1 ml-1"
                  />
                </div>
                {/* EMAIL */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Field
                      as={Input}
                      className={`pl-10 bg-gray-100/80 focus:bg-white text-sm sm:text-base ${
                        errors.email && touched.email ? "border border-red-500 focus:border-red-500" : ""
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
                      className={`pl-10 bg-gray-100/80 focus:bg-white text-sm sm:text-base ${
                        errors.password && touched.password ? "border border-red-500 focus:border-red-500" : ""
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
                  <div className="text-red-500 text-sm text-center">{errors.general}</div>
                )}

                <Button
                  className="w-full bg-[#d89e00] hover:bg-[#c58900]"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      Signing Up
                      <Ellipsis className="w-4 h-4" />
                    </span>
                  ) : (
                    "SIGN UP"
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-xs sm:text-sm">
            Already have an account?{" "}
            <span
              className="text-[#d89e00] font-medium cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
