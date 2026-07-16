"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import StatusCard from "@/components/StatusCard";
import StatsCard from "@/components/StatsCard";
import ActivityCard from "@/components/ActivityCard";
import StartModal from "@/components/StartModal";
import PendingRequests from "@/components/PendingRequests";




export default function Dashboard() {

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const data = localStorage.getItem("daytick-user");

    if (!data) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(data));

  }, [router]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  return (

    <main className="min-h-screen bg-black text-white">

      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex flex-1 flex-col">

          <Navbar/>

          <div className="flex-1 overflow-y-auto">

            <div className="mx-auto max-w-7xl space-y-8 p-8">

              <StatusCard
                onStart={() => setOpen(true)}
              />

               <PendingRequests />

              <StatsCard />


              <ActivityCard />


            </div>

          </div>

        </div>

      </div>

      <StartModal
        open={open}
        onClose={() => setOpen(false)}
      />
      

    </main>

  );
}