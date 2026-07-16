"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { getCalendarEntries, Request } from "@/lib/request";

export default function CalendarView() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selected, setSelected] = useState<Request | null>(null);

  useEffect(() => {
    async function load() {
      const user = JSON.parse(
        localStorage.getItem("daytick-user") || "{}"
      );

      if (!user.username) return;

      const { data } = await getCalendarEntries(user.username);

      setRequests((data as Request[]) || []);
    }

    load();
  }, []);

  function getRequest(date: Date) {
    const day = date.toISOString().split("T")[0];

    return requests.find((r) => r.request_date === day);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px,1fr]">

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

        <Calendar
          onClickDay={(date) => {
            const req = getRequest(date);

            if (req) setSelected(req);
            else setSelected(null);
          }}
          tileContent={({ date }) => {
            const req = getRequest(date);

            if (!req) return null;

            let color = "bg-yellow-500";

            if (req.status === "Accepted")
              color = "bg-green-500";

            if (req.status === "Declined")
              color = "bg-red-500";

            return (
              <div className="mt-1 flex justify-center">
                <div
                  className={`h-2 w-2 rounded-full ${color}`}
                />
              </div>
            );
          }}
        />

      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        {!selected ? (

          <div>

            <h2 className="text-3xl font-bold text-white">
              Select a Date
            </h2>

            <p className="mt-3 text-zinc-400">
              Click a highlighted day to see travel details.
            </p>

          </div>

        ) : (

          <div>

            <h2 className="text-4xl font-bold text-white">
              {selected.request_date}
            </h2>

            <div className="mt-8 space-y-6">

              <div>

                <p className="text-zinc-400">
                  Travel Type
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-indigo-400">
                  {selected.travel_type}
                </h3>

              </div>

              <div>

                <p className="text-zinc-400">
                  Sender
                </p>

                <h3 className="mt-2 text-2xl text-white">
                  {selected.sender}
                </h3>

              </div>

              <div>

                <p className="text-zinc-400">
                  Receiver
                </p>

                <h3 className="mt-2 text-2xl text-white">
                  {selected.receiver}
                </h3>

              </div>

              <div>

                <p className="text-zinc-400">
                  Status
                </p>

                <h3
                  className={`mt-2 text-2xl font-bold ${
                    selected.status === "Accepted"
                      ? "text-green-400"
                      : selected.status === "Declined"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {selected.status}
                </h3>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}