"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@heroui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("code@shopead.com");
  const [password, setPassword] = useState("shopead.com");
  const [formError, setFormError] = useState(""); // backend error
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError("");

    // Don't submit if blank fields
    if (!email || !password) return;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/admin");
    } else {
      setFormError(data.error || "Invalid email or password");
    }
  };

  const emailInvalid = submitted && !email;
  const passwordInvalid = submitted && !password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 border-b-2 border-indigo-400">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

        <form className="flex flex-col gap-5 mt-5" onSubmit={handleLogin}>
          <Input
            type="email"
            label="Email"
            labelPlacement="outside"
            color="secondary"
            placeholder="code@shopead.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={emailInvalid}
            errorMessage={emailInvalid ? "Email is required" : ""}
          />

          <Input
            type="password"
            label="Password"
            labelPlacement="outside"
            color="secondary"
            placeholder="shopead.com"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={passwordInvalid}
            errorMessage={passwordInvalid ? "Password is required" : ""}
          />

          {formError && <div className="text-red-600 text-sm -mt-3">{formError}</div>}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
