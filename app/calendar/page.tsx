"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CalendarView from "@/components/CalendarView";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-black">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <h1 className="mb-8 text-5xl font-bold text-white">
            Calendar
          </h1>

          <CalendarView />

        </div>

      </div>

    </main>
  );
}