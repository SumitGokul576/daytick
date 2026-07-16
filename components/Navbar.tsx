"use client";

import { useEffect, useState } from "react";
import { IconBell, IconLogout } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface NavbarProps {
  username?: string;
}

export default function Navbar({ username }: NavbarProps) {
  const router = useRouter();

  const [userName, setUserName] = useState(username || "");
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("daytick-user") || "{}"
    );

    const currentUser = username || user.username || "";

    setUserName(currentUser);

    loadNotifications(currentUser);

    const channel = supabase
      .channel("navbar-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
        },
        () => {
          loadNotifications(currentUser);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadNotifications(user: string) {
    if (!user) return;

    const { data } = await supabase
      .from("requests")
      .select("*")
      .eq("receiver", user)
      .eq("status", "Pending");

    setPending(data?.length || 0);
  }

  function logout() {
    localStorage.removeItem("daytick-user");
    router.push("/login");
  }

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between border-b border-white/10 bg-black/30 px-10 py-6 backdrop-blur-xl"
    >
      <div>
        <h2 className="text-3xl font-bold text-white">
          Welcome Back 👋
        </h2>

        <p className="mt-1 text-zinc-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-5">

        <button className="relative rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10">

          <IconBell size={22} />

          {pending > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {pending}
            </span>
          )}

        </button>

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
            {(userName || "?").charAt(0).toUpperCase()}
          </div>

          <div>

            <p className="font-semibold text-white">
              {userName}
            </p>

            <p className="text-sm text-green-400">
              Online
            </p>
 

          </div>

        </div>

        <button
          onClick={logout}
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          <IconLogout size={22} />
        </button>

      </div>

    </motion.div>
  );
}