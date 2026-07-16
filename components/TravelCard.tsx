"use client";

import { motion } from "framer-motion";
import React from "react";

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export default function TravelCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        cursor-pointer rounded-2xl border p-6 transition-all duration-300
        backdrop-blur-xl
        ${
          selected
            ? "border-indigo-500 bg-indigo-500/20"
            : "border-white/10 bg-white/5 hover:bg-white/10"
        }
      `}
    >
      <div className="flex items-center gap-5">

        <div className="rounded-xl bg-white/10 p-3">
          {icon}
        </div>


        <div>
          <h3 className="text-xl font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            {description}
          </p>
        </div>

      </div>
    </motion.div>
  );
}