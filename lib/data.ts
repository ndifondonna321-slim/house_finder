import { supabase } from "./supabase";

export type UserRole = "student" | "landlord" | "admin";
export type ProfileStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  status: ProfileStatus;
  email?: string;
  level?: string;
  faculty?: string;
  createdAt: string;
}

export type RoomType =
  | "single"
  | "studio"
  | "chamber-parlour"
  | "2-bedroom"
  | "3-bedroom";

export type AvailabilityStatus = "available" | "occupied" | "reserved";

export type ListingStatus = "pending" | "approved" | "rejected";

export interface Landlord {
  name: string;
  phone: string;
  whatsapp: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number; // FCFA per month
  location: string;
  description: string;
  images: string[];
  availability: AvailabilityStatus;
  roomType: RoomType;
  distanceFromCampus: number; // minutes walk
  amenities: string[];
  landlord: Landlord;
  createdAt: string;
  status: ListingStatus;
  featured?: boolean;
  rejectionReason?: string;
  ownerId?: string;
}

// Convert Supabase DB listing to Listing interface
const mapListing = (dbListing: any): Listing => ({
  id: dbListing.id,
  title: dbListing.title,
  price: dbListing.price,
  location: dbListing.location,
  description: dbListing.description,
  images: dbListing.images || [],
  availability: dbListing.availability,
  roomType: dbListing.room_type,
  distanceFromCampus: dbListing.distance_from_campus,
  amenities: dbListing.amenities || [],
  landlord: {
    name: dbListing.landlord_name,
    phone: dbListing.landlord_phone,
    whatsapp: dbListing.landlord_whatsapp,
  },
  createdAt: dbListing.created_at,
  status: dbListing.status,
  featured: dbListing.featured,
  rejectionReason: dbListing.rejection_reason,
  ownerId: dbListing.owner_id,
});

export const getListingById = async (id: string): Promise<Listing | undefined> => {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return mapListing(data);
};

export const getFeaturedListings = async (): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(6);

  if (error || !data) return [];
  return data.map(mapListing);
};

export const getAllApprovedListings = async (): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapListing);
};

export const getLandlordListings = async (ownerId: string): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapListing);
};

export const getAllListings = async (): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapListing);
};

export const updateListingStatus = async (id: string, status: ListingStatus, rejectionReason?: string): Promise<boolean> => {
  const { error } = await supabase
    .from("listings")
    .update({ status, rejection_reason: rejectionReason })
    .eq("id", id);

  return !error;
};

export const deleteListing = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id);

  return !error;
};

export const getAllLandlords = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "landlord")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    status: p.status,
    level: p.level,
    faculty: p.faculty,
    createdAt: p.created_at,
  }));
};

export const updateLandlordStatus = async (id: string, status: ProfileStatus): Promise<boolean> => {
  // Update profile status
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", id);

  if (profileError) return false;

  // If approving landlord, also approve all their pending listings
  if (status === "approved") {
    await supabase
      .from("listings")
      .update({ status: "approved" })
      .eq("owner_id", id)
      .eq("status", "pending");
  }

  return true;
};

export const roomTypeLabels: Record<RoomType, string> = {
  single: "Single Room",
  studio: "Studio",
  "chamber-parlour": "Chamber & Parlour",
  "2-bedroom": "2 Bedroom",
  "3-bedroom": "3 Bedroom",
};

export const formatPrice = (price: number): string =>
  `${price.toLocaleString("fr-CM")} FCFA/mo`;
