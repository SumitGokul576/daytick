import { supabase } from "./supabase";

export interface Request {
  id: number;
  sender: string;
  receiver: string;
  request_date: string;
  travel_type: string;
  status: string;
  created_at: string;
}

// Create Request
export async function createRequest(
  sender: string,
  receiver: string,
  travelType: string
) {
  const today = new Date().toISOString().split("T")[0];

  // Check if a request from this sender already exists today
  const { data: existing, error: checkError } = await supabase
    .from("requests")
    .select("*")
    .eq("sender", sender)
    .eq("request_date", today);

  if (checkError) {
    return { data: null, error: checkError };
  }

  if (existing && existing.length > 0) {
    return {
      data: null,
      error: {
        message: "You have already submitted today's request.",
      },
    };
  }

  return await supabase
    .from("requests")
    .insert([
      {
        sender,
        receiver,
        request_date: today,
        travel_type: travelType,
        status: "Pending",
      },
    ])
    .select();
}

// Pending Requests
export async function getPendingRequests(receiver: string) {
  return await supabase
    .from("requests")
    .select("*")
    .eq("receiver", receiver)
    .eq("status", "Pending")
    .order("created_at", {
      ascending: false,
    });
}

// Accept Request
export async function acceptRequest(id: number) {
  return await supabase
    .from("requests")
    .update({
      status: "Accepted",
    })
    .eq("id", id)
    .select();
}

// Decline Request
export async function declineRequest(id: number) {
  return await supabase
    .from("requests")
    .update({
      status: "Declined",
    })
    .eq("id", id)
    .select();
}

// History
export async function getHistory(username: string) {
  return await supabase
    .from("requests")
    .select("*")
    .or(`sender.eq.${username},receiver.eq.${username}`)
    .neq("status", "Pending")
    .order("request_date", {
      ascending: false,
    });
}

// Calendar
export async function getCalendarEntries(username: string) {
  return await supabase
    .from("requests")
    .select("*")
    .or(`sender.eq.${username},receiver.eq.${username}`);
}