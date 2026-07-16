"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IconCheck,
  IconX,
  IconCalendar,
  IconUser,
} from "@tabler/icons-react";

import { getHistory, Request } from "@/lib/request";

export default function HistoryCard() {
  const [history, setHistory] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    const user = JSON.parse(
      localStorage.getItem("daytick-user") || "{}"
    );

    if (!user.username) {
      setLoading(false);
      return;
    }

    const { data, error } = await getHistory(user.username);

    if (!error && data) {
      setHistory(data as Request[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-zinc-400">
        Loading History...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h2 className="text-3xl font-bold text-white">
          History
        </h2>

        <p className="mt-6 text-center text-zinc-400">
          No History Yet
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <h2 className="text-3xl font-bold text-white">
        History
      </h2>

      <div className="mt-8 space-y-5">

        {history.map((item) => (

          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6"
          >

            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <IconUser size={18} />

                  <span className="text-lg font-semibold text-white">
                    {item.sender}
                  </span>

                </div>

                <div className="mt-3 text-indigo-400">
                  {item.travel_type}
                </div>

                <div className="mt-2 flex items-center gap-2 text-zinc-500">

                  <IconCalendar size={16} />

                  {item.request_date}

                </div>

              </div>

              <div>

                {item.status === "Accepted" ? (

                  <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-green-400">

                    <IconCheck size={18} />

                    Accepted

                  </div>

                ) : (

                  <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-red-400">

                    <IconX size={18} />

                    Declined

                  </div>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </motion.div>
  );
}