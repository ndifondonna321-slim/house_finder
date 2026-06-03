"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getListingById, roomTypeLabels, type RoomType, type AvailabilityStatus } from "@/lib/data";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import { supabase } from "@/lib/supabase";

const ROOM_TYPES = Object.keys(roomTypeLabels) as RoomType[];
const AMENITY_OPTIONS = [
  "WiFi", "Water", "Electricity", "Furnished", "Desk", "Wardrobe",
  "Kitchen", "Private Bathroom", "Shared Bathroom", "Shared Kitchen",
  "Ceiling Fan", "Generator", "Solar Heater", "CCTV", "Security",
  "Parking", "Garden", "Tiles", "Individual Meter", "Living Room",
];

export default function AdminEditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    roomType: "" as RoomType | "",
    distanceFromCampus: "",
    availability: "available" as AvailabilityStatus,
    description: "",
    landlordName: "",
    landlordPhone: "",
    landlordWhatsApp: "",
    roomNumber: "",
    floor: "",
  });

  useEffect(() => {
    const fetchListing = async () => {
      const { id } = await params;
      const listing = await getListingById(id);
      if (!listing) {
        setNotFound(true);
        return;
      }
      setForm({
        title: listing.title,
        price: String(listing.price),
        location: listing.location,
        roomType: listing.roomType,
        distanceFromCampus: String(listing.distanceFromCampus),
        availability: listing.availability,
        description: listing.description,
        landlordName: listing.landlord.name,
        landlordPhone: listing.landlord.phone,
        landlordWhatsApp: listing.landlord.whatsapp,
        roomNumber: listing.roomNumber || "",
        floor: listing.floor || "",
      });
      setSelectedAmenities(listing.amenities);
      setImages(listing.images);
    };
    fetchListing();
  }, [params]);

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const { id } = await params;
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        title: form.title,
        price: Number(form.price),
        location: form.location,
        room_type: form.roomType,
        distance_from_campus: Number(form.distanceFromCampus),
        availability: form.availability,
        description: form.description,
        landlord_name: form.landlordName,
        landlord_phone: form.landlordPhone,
        landlord_whatsapp: form.landlordWhatsApp,
        amenities: selectedAmenities,
        images: images,
        // room_number: form.roomNumber,
        // floor: form.floor,
      })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setSuccess(true);
  };

  if (notFound) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Listing Not Found
        </h2>
        <Link href="/admin/listings" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          ← Back to Listings
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ maxWidth: "500px", margin: "4rem auto", textAlign: "center" }}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(20,184,166,0.25)",
            borderRadius: "var(--radius-xl)",
            padding: "3rem 2rem",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✅</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.625rem" }}>
            Changes Saved!
          </h2>
          <p style={{ color: "var(--text-subtle)", marginBottom: "2rem", lineHeight: 1.6 }}>
            <strong>{form.title}</strong> has been updated.
            Changes will sync to Supabase once the database is connected.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="btn btn-outline" onClick={() => setSuccess(false)}>
              ✏️ Edit Again
            </button>
            <button className="btn btn-primary" onClick={() => router.push("/admin/listings")}>
              📋 All Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "var(--text-subtle)",
    marginBottom: "0.375rem",
  };

  return (
    <div style={{ maxWidth: "760px" }}>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            Edit Listing
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
            Update listing information below.
          </p>
        </div>
        <Link href="/admin/listings" className="btn btn-ghost btn-sm" style={{ marginLeft: "auto", flexShrink: 0 }}>
          ← Back
        </Link>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Basic Info */}
        <section style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.75rem" }}>
          <h2 style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Basic Information
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Listing Title *</label>
              <input name="title" className="input" value={form.title} onChange={handleChange} required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Price (FCFA/month) *</label>
                <input name="price" type="number" className="input" value={form.price} onChange={handleChange} required min={1000} />
              </div>
              <div>
                <label style={labelStyle}>Distance from Campus (min) *</label>
                <input name="distanceFromCampus" type="number" className="input" value={form.distanceFromCampus} onChange={handleChange} required min={1} max={60} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Location *</label>
              <input name="location" className="input" value={form.location} onChange={handleChange} required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Room Number</label>
                <input name="roomNumber" className="input" value={form.roomNumber} onChange={handleChange} placeholder="e.g. Room 12" />
              </div>
              <div>
                <label style={labelStyle}>Floor</label>
                <input name="floor" className="input" value={form.floor} onChange={handleChange} placeholder="e.g. 2nd Floor" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Room Type *</label>
                <select name="roomType" className="input" value={form.roomType} onChange={handleChange} required>
                  {ROOM_TYPES.map((rt) => (
                    <option key={rt} value={rt}>{roomTypeLabels[rt]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Availability *</label>
                <select name="availability" className="input" value={form.availability} onChange={handleChange}>
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea name="description" className="input" value={form.description} onChange={handleChange} required style={{ minHeight: "120px" }} />
            </div>
          </div>
        </section>

        {/* Images */}
        <section style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.75rem" }}>
          <h2 style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Property Photos *
          </h2>
          <ImageUpload onUpload={(urls) => setImages(urls)} existingImages={images} />
        </section>

        {/* Amenities */}
        <section style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.75rem" }}>
          <h2 style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Amenities & Features
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
            {AMENITY_OPTIONS.map((a) => {
              const active = selectedAmenities.includes(a);
              return (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  style={{ padding: "0.4rem 0.875rem", borderRadius: "9999px", fontSize: "0.875rem", cursor: "pointer", border: `1px solid ${active ? "rgba(20,184,166,0.4)" : "var(--border-light)"}`, background: active ? "rgba(20,184,166,0.12)" : "var(--bg-elevated)", color: active ? "var(--primary)" : "var(--text-subtle)", fontWeight: active ? 600 : 400, transition: "all 0.15s" }}>
                  {active ? "✓ " : ""}{a}
                </button>
              );
            })}
          </div>
        </section>

        {/* Landlord */}
        <section style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.75rem" }}>
          <h2 style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Landlord Contact
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Landlord Name *</label>
              <input name="landlordName" className="input" value={form.landlordName} onChange={handleChange} required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input name="landlordPhone" className="input" value={form.landlordPhone} onChange={handleChange} required />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp Number *</label>
                <input name="landlordWhatsApp" className="input" value={form.landlordWhatsApp} onChange={handleChange} required />
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-outline" onClick={() => router.push("/admin/listings")}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" id="save-listing-btn">
            💾 Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
