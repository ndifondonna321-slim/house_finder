"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { roomTypeLabels, type RoomType, type AvailabilityStatus } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import ImageUpload from "@/components/ImageUpload";

const ROOM_TYPES = Object.keys(roomTypeLabels) as RoomType[];
const AMENITY_OPTIONS = [
  "WiFi", "Water", "Electricity", "Furnished", "Desk", "Wardrobe",
  "Kitchen", "Private Bathroom", "Shared Bathroom", "Shared Kitchen",
  "Ceiling Fan", "Generator", "Solar Heater", "CCTV", "Security",
  "Parking", "Garden", "Tiles", "Individual Meter", "Living Room",
];

export default function AdminNewListingPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

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

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!user) {
      setError("You must be logged in to create a listing");
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("listings").insert([
      {
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
        owner_id: user.id,
        status: (user.role === "admin" || user.status === "approved") ? "approved" : "pending",
        // room_number: form.roomNumber,
        // floor: form.floor,
      },
    ]);

    if (insertError) {
      console.error("Error creating listing:", insertError);
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    // Broadcast a global notification
    supabase.from("notifications").insert([
      {
        message: `New property available: ${form.title} in ${form.location}`,
        link: "/listings",
      }
    ]).then(({ error }) => {
      if (error) console.error("Failed to broadcast notification:", error);
    });

    setIsSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ maxWidth: "560px", margin: "4rem auto", textAlign: "center" }}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(20,184,166,0.25)",
            borderRadius: "var(--radius-xl)",
            padding: "3rem 2rem",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.625rem" }}>
            Listing Created!
          </h2>
          <p style={{ color: "var(--text-subtle)", marginBottom: "2rem", lineHeight: 1.6 }}>
            <strong>{form.title}</strong> has been added successfully.
            This will be saved to Supabase once auth is connected.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                className="btn btn-primary"
                onClick={() => { setSuccess(false); setForm({ title: "", price: "", location: "", roomType: "", distanceFromCampus: "", availability: "available", description: "", landlordName: "", landlordPhone: "", landlordWhatsApp: "", roomNumber: "", floor: "" }); setSelectedAmenities([]); }}
              >
                ➕ Add Another
              </button>
              <button className="btn btn-outline" onClick={() => router.push("/admin/listings")}>
                📋 Manage Listings
              </button>
            </div>
            <div className="divider" style={{ width: "100%", margin: "0.5rem 0" }} />
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn btn-ghost" onClick={() => router.push("/")}>
                🏠 Go to Home
              </button>
              <button className="btn btn-accent" onClick={() => router.push("/listings")}>
                🌐 View on Site
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "760px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          Add New Listing
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
          Fill in the details below to publish a new house listing.
        </p>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          color: "#ef4444",
          padding: "1rem",
          borderRadius: "var(--radius-md)",
          marginBottom: "1.5rem",
          fontSize: "0.9rem"
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Basic Info */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.8125rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
            }}
          >
            Basic Information
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="form-label" style={labelStyle}>Listing Title *</label>
              <input
                name="title"
                className="input"
                placeholder="e.g. Modern Studio Room — HTTTC Area"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Price (FCFA/month) *</label>
                <input
                  name="price"
                  type="number"
                  className="input"
                  placeholder="e.g. 25000"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min={1000}
                />
              </div>
              <div>
                <label style={labelStyle}>Distance from Campus (min walk) *</label>
                <input
                  name="distanceFromCampus"
                  type="number"
                  className="input"
                  placeholder="e.g. 5"
                  value={form.distanceFromCampus}
                  onChange={handleChange}
                  required
                  min={1}
                  max={60}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Location *</label>
              <input
                name="location"
                className="input"
                placeholder="e.g. HTTTC Area, Bambili"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Room Number</label>
                <input
                  name="roomNumber"
                  className="input"
                  placeholder="e.g. Room 12"
                  value={form.roomNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={labelStyle}>Floor</label>
                <input
                  name="floor"
                  className="input"
                  placeholder="e.g. 2nd Floor"
                  value={form.floor}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Room Type *</label>
                <select
                  name="roomType"
                  className="input"
                  value={form.roomType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type…</option>
                  {ROOM_TYPES.map((rt) => (
                    <option key={rt} value={rt}>
                      {roomTypeLabels[rt]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Availability *</label>
                <select
                  name="availability"
                  className="input"
                  value={form.availability}
                  onChange={handleChange}
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Description *</label>
              <textarea
                name="description"
                className="input"
                placeholder="Describe the room, compound, and neighbourhood…"
                value={form.description}
                onChange={handleChange}
                required
                style={{ minHeight: "120px" }}
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
          }}
        >
          <h2 style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Property Photos *
          </h2>
          <ImageUpload onUpload={(urls) => setImages(urls)} />
        </section>

        {/* Amenities */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
          }}
        >
          <h2 style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Amenities & Features
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
            {AMENITY_OPTIONS.map((a) => {
              const active = selectedAmenities.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  style={{
                    padding: "0.4rem 0.875rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    border: `1px solid ${active ? "rgba(20,184,166,0.4)" : "var(--border-light)"}`,
                    background: active ? "rgba(20,184,166,0.12)" : "var(--bg-elevated)",
                    color: active ? "var(--primary)" : "var(--text-subtle)",
                    fontWeight: active ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {active ? "✓ " : ""}{a}
                </button>
              );
            })}
          </div>
        </section>

        {/* Landlord */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
          }}
        >
          <h2 style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Landlord Contact
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Landlord Name *</label>
              <input
                name="landlordName"
                className="input"
                placeholder="e.g. Mr. Fonkem Emmanuel"
                value={form.landlordName}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  name="landlordPhone"
                  className="input"
                  placeholder="+237 6XX XXX XXX"
                  value={form.landlordPhone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp Number *</label>
                <input
                  name="landlordWhatsApp"
                  className="input"
                  placeholder="237XXXXXXXXX (no + or spaces)"
                  value={form.landlordWhatsApp}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => router.push("/listings")}
          >
            ← Back to Listings
          </button>
          <button type="submit" className="btn btn-accent" id="submit-listing-btn" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "🚀 Publish Listing"}
          </button>
        </div>
      </form>
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
