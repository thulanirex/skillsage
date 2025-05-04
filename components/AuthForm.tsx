"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import TextLogo from "./TextLogo";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      // Handle Firebase auth errors with user-friendly messages
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error("Invalid email or password");
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error("Email already in use. Please sign in instead.");
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8">
      <div className="flex items-center justify-center mb-2">
        <TextLogo />
      </div>
      
      <div className="w-full bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              {isSignIn ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-gray-400">
              {isSignIn 
                ? "Sign in to continue your interview practice" 
                : "Start your interview preparation journey"}
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  type="text"
                />
              )}

              <FormField
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="you@example.com"
                type="email"
              />

              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="••••••••"
                type="password"
              />
              
              {isSignIn && (
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm text-primary-200 hover:text-primary-100 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-dark-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSignIn ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isSignIn ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                href={isSignIn ? "/sign-up" : "/sign-in"}
                className="text-primary-200 hover:text-primary-100 font-medium transition-colors"
              >
                {isSignIn ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} SkillSage. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AuthForm;
