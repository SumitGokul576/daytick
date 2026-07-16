"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { exportHistory } from "@/lib/exportHistory";
import { getHistory, Request } from "@/lib/request";

export default function HistoryPage() {
  const [history, setHistory] = useState<Request[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const user = JSON.parse(
      localStorage.getItem("daytick-user") || "{}"
    );

    if (!user.username) return;

    const { data } = await getHistory(user.username);

    setHistory((data as Request[]) || []);
  }

  const filtered = useMemo(() => {
    return history.filter((item) =>
      (
        item.sender +
        item.receiver +
        item.travel_type +
        item.status +
        item.request_date
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [history, search]);

  return (
    <main className="min-h-screen bg-black">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <h1 className="text-5xl font-bold text-white">
            Travel History
          </h1>

          <div className="mt-8 flex justify-end">

  <button
    onClick={() => exportHistory(filtered)}
    className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
  >
    Export PDF
  </button>

</div>
<input
            placeholder="Search history..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none"
          />

          <div className="mt-8 space-y-5">

            {filtered.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400">
                No History Found
              </div>
            )}

            {filtered.map((item) => (

              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-2xl font-bold text-white">
                      {item.travel_type}
                    </h2>

                    <p className="mt-2 text-zinc-400">
                      {item.request_date}
                    </p>

                    <p className="mt-2 text-zinc-500">
                      {item.sender} → {item.receiver}
                    </p>

                  </div>

                  <div>

                    <span
                      className={`rounded-full px-5 py-2 font-semibold
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

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  );
}