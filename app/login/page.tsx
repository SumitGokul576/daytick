"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      setLoading(false);
      setError("Invalid Username or Password");
      return;
    }

    localStorage.setItem("daytick-user", JSON.stringify(data));

    router.push("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl"></div>

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-3xl"></div>

      </div>

      {/* Card */}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-[430px] rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-2xl"
      >
        <h1 className="text-center text-5xl font-semibold text-white">
          DayTick
        </h1>

        <p className="mt-3 text-center text-zinc-400">
          Welcome Back
        </p>

        <div className="mt-10 space-y-5">

          {/* Username */}

          <div className="relative">

            <User className="absolute left-4 top-4 text-zinc-500" />

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/70 py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500"
            />

          </div>

          {/* Password */}

          <div className="relative">

            <Lock className="absolute left-4 top-4 text-zinc-500" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/70 py-4 pl-12 pr-12 text-white outline-none focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-zinc-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>

          </div>

          {/* Error */}

          {error && (
            <p className="text-center text-red-500">
              {error}
            </p>
          )}

          {/* Button */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-4 text-lg font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Logging In..." : "Login"}
          </motion.button>

        </div>

      </motion.div>

    </main>
  );
}