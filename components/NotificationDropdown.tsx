"use client";

import {
  IconCheck,
  IconX,
} from "@tabler/icons-react";

interface Request {
  id: number;
  sender: string;
  travel_type: string;
  request_date: string;
}

interface Props {
  requests: Request[];
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

export default function NotificationDropdown({
  requests,
  onAccept,
  onDecline,
}: Props) {
  return (
    <div className="absolute right-0 top-16 z-50 w-96 rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">

      <div className="border-b border-white/10 p-5">

        <h2 className="text-xl font-bold text-white">
          Notifications
        </h2>

      </div>

      <div className="max-h-96 overflow-y-auto">

        {requests.length === 0 && (

          <div className="p-8 text-center text-zinc-400">
            No Pending Requests
          </div>

        )}

        {requests.map((item) => (

          <div
            key={item.id}
            className="border-b border-white/10 p-5"
          >

            <p className="font-semibold text-white">
              {item.sender}
            </p>

            <p className="mt-1 text-zinc-400">
              {item.travel_type}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {item.request_date}
            </p>

            <div className="mt-4 flex gap-3">

              <button
                onClick={() =>
                  onAccept(item.id)
                }
                className="flex-1 rounded-xl bg-green-600 py-2 text-white hover:bg-green-500"
              >
                <IconCheck
                  size={18}
                  className="mx-auto"
                />
              </button>

              <button
                onClick={() =>
                  onDecline(item.id)
                }
                className="flex-1 rounded-xl bg-red-600 py-2 text-white hover:bg-red-500"
              >
                <IconX
                  size={18}
                  className="mx-auto"
                />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}