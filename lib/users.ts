import { supabase } from "./supabase";

export async function updatePassword(
  username: string,
  password: string
) {
  return await supabase
    .from("users")
    .update({
      password,
    })
    .eq("username", username)
    .select();
}