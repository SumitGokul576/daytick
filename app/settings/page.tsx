"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

import { updatePassword } from "@/lib/users";

import {
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

export default function SettingsPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("daytick-user") || "{}"
    );

    if (!user.username) {
      router.push("/login");
      return;
    }

    setUsername(user.username);
  }, [router]);

  async function savePassword() {
    if (password.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }

    const { error } = await updatePassword(
      username,
      password
    );

    if (error) {
      alert(error.message);
      return;
    }

    setPassword("");

    alert("Password Updated Successfully");
  }

  function logout() {
    localStorage.removeItem("daytick-user");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex flex-1 flex-col">

          <Navbar username={username} />

          <div className="mx-auto w-full max-w-3xl space-y-8 p-8">

            {/* Change Password */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

              <h2 className="mb-6 text-3xl font-bold">
                Change Password
              </h2>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter New Password"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 pr-14 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <IconEyeOff size={22} />
                  ) : (
                    <IconEye size={22} />
                  )}
                </button>

              </div>

              <button
                onClick={savePassword}
                className="mt-6 rounded-2xl bg-green-600 px-8 py-3 font-semibold hover:bg-green-500"
              >
                Update Password
              </button>

            </div>

            {/* Logout */}

            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 backdrop-blur-xl">

              <h2 className="mb-6 text-3xl font-bold text-red-400">
                Logout
              </h2>

              <button
                onClick={logout}
                className="rounded-2xl bg-red-600 px-8 py-3 font-semibold hover:bg-red-500"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}