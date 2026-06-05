"use client";

import { useActionState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { LoginForm } from "@/components/ui/forms/Login/loginForm";
import type { LoginResponse } from "@/types/authTypes";
import { useAuth } from "@/context/useAuth";

const initialState: LoginResponse = {};

export default function LoginLogic() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [state, login] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state?.user) {
      setUser(state.user);
      router.push("/dashboard");
    }
  }, [state?.user, setUser, router]);

  const handleSubmit = (data: { email: string; password: string }) => {
    startTransition(() => {
      login(data);
    });
  };

  return <LoginForm onSubmit={handleSubmit} error={state?.error} />;
}