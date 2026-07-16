"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconCalendar,
  IconHistory,
  IconSettings,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const menu = [
  {
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Calendar",
    icon: IconCalendar,
    href: "/calendar",
  },
  {
    title: "History",
    icon: IconHistory,
    href: "/history",
  },
  {
    title: "Settings",
    icon: IconSettings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -70, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-72 border-r border-white/10 bg-zinc-950/90 backdrop-blur-xl"
    >
      <div className="flex h-full flex-col">

        <div className="border-b border-white/10 p-8">

          <h1 className="text-4xl font-bold tracking-wide text-white">
            DayTick
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Every Day. Every Decision.
          </p>

        </div>

        <nav className="flex-1 px-5 py-8">

          <div className="space-y-3">

            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                      active
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={24} />

                    <span className="text-lg font-medium">
                      {item.title}
                    </span>
                  </motion.div>
                </Link>
              );
            })}

          </div>

        </nav>

      </div>
    </motion.aside>
  );
}