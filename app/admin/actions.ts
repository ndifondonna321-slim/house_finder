"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { type Listing, type Profile, type ProfileStatus } from "@/lib/data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We use the SERVICE_ROLE_KEY here because it bypasses RLS
// This is safe because this code only runs on the server
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function updateLandlordStatusAction(id: string, status: ProfileStatus) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { 
      success: false, 
      error: "SUPABASE_SERVICE_ROLE_KEY is missing from your .env.local file." 
    };
  }

  console.log("Server Action: Updating landlord status...", { id, status });

  try {
    const { data, error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ status })
      .eq("id", id)
      .select();

    if (profileError) return { success: false, error: profileError.message };
    if (!data || data.length === 0) return { success: false, error: "Landlord not found." };

    // If approved, also approve their pending listings
    if (status === "approved") {
      await supabaseAdmin
        .from("listings")
        .update({ status: "approved" })
        .eq("owner_id", id)
        .eq("status", "pending");
    }

    revalidatePath("/admin");
    revalidatePath("/admin/landlords");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveLandlordAction(id: string) {
  return updateLandlordStatusAction(id, "approved");
}
export async function getAdminDataAction() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { 
      success: false, 
      error: "SUPABASE_SERVICE_ROLE_KEY is missing." 
    };
  }
  try {
    const [listingsResult, landlordsResult] = await Promise.all([
      supabaseAdmin.from("listings").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("profiles").select("*").eq("role", "landlord").order("created_at", { ascending: false })
    ]);

    if (listingsResult.error) throw listingsResult.error;
    if (landlordsResult.error) throw landlordsResult.error;

    return { 
      success: true, 
      listings: listingsResult.data.map(l => ({ ...l, createdAt: l.created_at })), 
      landlords: landlordsResult.data.map(p => ({ ...p, createdAt: p.created_at }))
    };
  } catch (error: any) {
    console.error("Fetch Admin Data Error:", error);
    return { success: false, error: error.message };
  }
}
