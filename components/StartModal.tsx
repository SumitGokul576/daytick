"use client";

import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import {
  IconArrowRight,
  IconArrowsExchange,
  IconX,
  IconLoader2,
} from "@tabler/icons-react";

import TravelCard from "./TravelCard";
import { createRequest } from "@/lib/request";
import { supabase } from "@/lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StartModal({
  open,
  onClose,
}: Props) {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const options = [
    {
      title: "One Way",
      description: "Travel only once today",
      icon: <IconArrowRight size={34} className="text-indigo-400" />,
    },
    {
      title: "Two Way",
      description: "Going and returning",
      icon: <IconArrowsExchange size={34} className="text-indigo-400" />,
    },
    {
      title: "Not Applicable",
      description: "No travel today",
      icon: <IconX size={34} className="text-indigo-400" />,
    },
  ];

  async function handleSubmit() {
    if (!selected) return;

    setLoading(true);

    const user = JSON.parse(
      localStorage.getItem("daytick-user") || "{}"
    );

    const sender = user.username;

    // Find the other user automatically
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("username");

    if (userError || !users) {
      setLoading(false);
      toast.error("Unable to load users.");
      return;
    }

    const otherUser = users.find(
      (u: any) => u.username !== sender
    );

    if (!otherUser) {
      setLoading(false);
      toast.error("No receiver account found.");
      return;
    }

    const receiver = otherUser.username;

    const { error } = await createRequest(
      sender,
      receiver,
      selected
    );

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Request Sent Successfully!");

    setSelected("");

    onClose();
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950/95 p-8 shadow-2xl backdrop-blur-xl">

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="text-4xl font-bold text-white">
                    Today's Entry
                  </h1>

                  <p className="mt-2 text-zinc-400">
                    Choose today's travel type
                  </p>
                </motion.div>

                <div className="mt-8 space-y-5">
                  {options.map((option) => (
                    <TravelCard
                      key={option.title}
                      title={option.title}
                      description={option.description}
                      icon={option.icon}
                      selected={selected === option.title}
                      onClick={() => setSelected(option.title)}
                    />
                  ))}
                </div>

                <div className="mt-10 flex justify-end gap-4">

                  <button
                    onClick={onClose}
                    className="rounded-xl border border-white/10 px-6 py-3 text-white hover:bg-white/5"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={!selected || loading}
                    onClick={handleSubmit}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {loading && (
                      <IconLoader2
                        className="animate-spin"
                        size={18}
                      />
                    )}

                    {loading
                      ? "Submitting..."
                      : "Submit"}
                  </button>

                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}