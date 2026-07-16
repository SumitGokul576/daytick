"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Props {
  onStart: () => void;
}

export default function StatusCard({ onStart }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("No Activity Yet");

  useEffect(() => {
    load();

    const channel = supabase
      .channel("status-card")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
        },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function load() {
    const user = JSON.parse(
      localStorage.getItem("daytick-user") || "{}"
    );

    if (!user.username) return;

    const today = new Date().toISOString().split("T")[0];

    // Request sent by this user today
    const { data: sent } = await supabase
      .from("requests")
      .select("*")
      .eq("sender", user.username)
      .eq("request_date", today);

    // Request received by this user today
    const { data: received } = await supabase
      .from("requests")
      .select("*")
      .eq("receiver", user.username)
      .eq("request_date", today);

    // User has sent a request
    if (sent && sent.length > 0) {
      setSubmitted(true);

      switch (sent[0].status) {
        case "Pending":
          setStatus("🟡 Waiting for Approval");
          break;
        case "Accepted":
          setStatus("🟢 Request Accepted");
          break;
        case "Declined":
          setStatus("🔴 Request Declined");
          break;
      }

      return;
    }

    // User accepted someone else's request
    if (
      received &&
      received.length > 0 &&
      received[0].status === "Accepted"
    ) {
      setSubmitted(true);
      setStatus("✅ Today's Entry Completed");
      return;
    }

    // User declined someone else's request
    if (
      received &&
      received.length > 0 &&
      received[0].status === "Declined"
    ) {
      setSubmitted(false);
      setStatus("❌ Request Declined");
      return;
    }

    // User has a pending request to accept
    if (
      received &&
      received.length > 0 &&
      received[0].status === "Pending"
    ) {
      setSubmitted(false);
      setStatus("📩 Pending Request");
      return;
    }

    setSubmitted(false);
    setStatus("No Activity Yet");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <h2 className="text-3xl font-bold text-white">
        Today's Status
      </h2>

      <p className="mt-4 text-lg text-zinc-400">
        {status}
      </p>

      <button
        disabled={submitted}
        onClick={onStart}
        className={`mt-8 rounded-2xl px-10 py-4 text-lg font-semibold text-white transition ${
          submitted
            ? "cursor-not-allowed bg-zinc-700 opacity-50"
            : "bg-indigo-600 hover:bg-indigo-500"
        }`}
      >
        {submitted ? "Completed" : "START"}
      </button>
    </motion.div>
  );
}