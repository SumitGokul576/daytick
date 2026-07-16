"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import {
  getPendingRequests,
  acceptRequest,
  declineRequest,
} from "@/lib/request";

interface Request {
  id: number;
  sender: string;
  receiver: string;
  travel_type: string;
  request_date: string;
  status: string;
}

export default function PendingRequests() {
  const [requests, setRequests] = useState<Request[]>([]);

  async function load() {
    const user = JSON.parse(
      localStorage.getItem("daytick-user") || "{}"
    );

    if (!user.username) return;

    const { data } = await getPendingRequests(
      user.username
    );

    setRequests((data as Request[]) || []);
  }

  useEffect(() => {
    load();

    const channel = supabase
      .channel("requests-live")
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

  async function handleAccept(id: number) {
    await acceptRequest(id);
    toast.success("Request Accepted");
  }

  async function handleDecline(id: number) {
    await declineRequest(id);
    toast.success("Request Declined");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h2 className="mb-6 text-3xl font-bold text-white">
        Pending Requests
      </h2>

      {requests.length === 0 && (
        <p className="text-zinc-400">
          No Pending Requests
        </p>
      )}

      <div className="space-y-5">

        {requests.map((item) => (

          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-xl font-semibold text-white">
                  {item.sender}
                </h3>

                <p className="text-zinc-400">
                  {item.travel_type}
                </p>

                <p className="text-zinc-500">
                  {item.request_date}
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    handleAccept(item.id)
                  }
                  className="rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-500"
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    handleDecline(item.id)
                  }
                  className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-500"
                >
                  Decline
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}