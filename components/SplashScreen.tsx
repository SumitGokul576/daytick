'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

export default function SplashScreen() {

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 4500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-black">

      <div className="text-center">

        <TypeAnimation
          sequence={[
            "DayTick",
            1500,
          ]}
          wrapper="h1"
          speed={40}
          cursor={true}
          className="text-7xl font-semibold tracking-wide text-white"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{
            delay: 2,
            duration: 1,
          }}
          className="mt-5 text-lg tracking-[6px] text-gray-400 uppercase"
        >
          Every day. Every decision.
        </motion.p>

      </div>

    </main>
  );
}