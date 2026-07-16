"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Request {
  id: number;
  sender: string;
  receiver: string;
  travel_type: string;
  request_date: string;
  status: string;
}

export default function ActivityCard() {
  const [activities, setActivities] = useState<Request[]>([]);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    const user = JSON.parse(
      localStorage.getItem("daytick-user") || "{}"
    );

    if (!user.username) return;

    const { data } = await supabase
      .from("requests")
      .select("*")
      .or(`sender.eq.${user.username},receiver.eq.${user.username}`)
      .order("created_at", { ascending: false })
      .limit(5);

    setActivities(data || []);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <h2 className="text-3xl font-bold text-white">
        Recent Activity
      </h2>

      <div className="mt-8 space-y-5">

        {activities.length === 0 && (
          <p className="text-zinc-500">
            No Activity Found
          </p>
        )}

        {activities.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-5"
          >
            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  {item.travel_type}
                </h3>

                <p className="mt-1 text-zinc-400">
                  {item.request_date}
                </p>

              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold
                ${
                  item.status === "Accepted"
                    ? "bg-green-500/20 text-green-400"
                    : item.status === "Declined"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {item.status}
              </span>

            </div>
          </div>
        ))}

      </div>
    </motion.div>
  );
}