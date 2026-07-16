"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IconChartBar,
  IconCheck,
  IconClock,
  IconX,
} from "@tabler/icons-react";
import { supabase } from "@/lib/supabase";

interface Stats {
  total: number;
  accepted: number;
  pending: number;
  declined: number;
}

export default function StatsCard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    accepted: 0,
    pending: 0,
    declined: 0,
  });

  useEffect(() => {
    loadStats();

    const channel = supabase
      .channel("stats-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
        },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadStats() {
    const user = JSON.parse(
      localStorage.getItem("daytick-user") || "{}"
    );

    if (!user.username) return;

    const { data } = await supabase
      .from("requests")
      .select("*")
      .or(`sender.eq.${user.username},receiver.eq.${user.username}`);

    const list = data || [];

    setStats({
      total: list.length,
      accepted: list.filter(
        (i) => i.status === "Accepted"
      ).length,
      pending: list.filter(
        (i) => i.status === "Pending"
      ).length,
      declined: list.filter(
        (i) => i.status === "Declined"
      ).length,
    });
  }

  const cards = [
    {
      title: "Total",
      value: stats.total,
      icon: <IconChartBar size={28} />,
      color: "text-indigo-400",
    },
    {
      title: "Accepted",
      value: stats.accepted,
      icon: <IconCheck size={28} />,
      color: "text-green-400",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <IconClock size={28} />,
      color: "text-yellow-400",
    },
    {
      title: "Declined",
      value: stats.declined,
      icon: <IconX size={28} />,
      color: "text-red-400",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <motion.div
          key={card.title}
          whileHover={{ scale: 1.03 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className={card.color}>
            {card.icon}
          </div>

          <p className="mt-5 text-zinc-400">
            {card.title}
          </p>

          <h2 className="mt-2 text-4xl font-bold text-white">
            {card.value}
          </h2>
        </motion.div>
      ))}
    </div>
  );
}