"use client";

import { RecaptchaProvider } from "./RecaptchaProvider";
import AuthForm from "./AuthForm";

interface AuthFormWrapperProps {
  type: "sign-in" | "sign-up";
}

const AuthFormWrapper = ({ type }: AuthFormWrapperProps) => {
  return (
    <RecaptchaProvider>
      <AuthForm type={type} />
    </RecaptchaProvider>
  );
};

export default AuthFormWrapper;
