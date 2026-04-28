"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, roomTypeLabels, type Listing } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ListingCardProps {
  listing: Listing;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export default function ListingCard({ listing, isSaved, onToggleSave }: ListingCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const whatsappUrl = `https://wa.me/${listing.landlord.whatsapp}?text=Hi, I am interested in your listing: ${listing.title}`;

  const handleContact = (e: React.MouseEvent, type: "whatsapp" | "phone") => {
    if (!user) {
      e.preventDefault();
      if (confirm("You must be logged in to contact landlords. Go to login page?")) {
        router.push("/login");
      }
      return;
    }
    // For phone calls, we don't preventDefault if user exists
    // For WhatsApp, we don't preventDefault if user exists
  };

  return (
    <div
      className="card-lift"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Image Section */}
      <div style={{ position: "relative", height: "200px", width: "100%" }}>
        <Image
          src={listing.images[0] || "https://picsum.photos/seed/placeholder/800/600"}
          alt={listing.title}
          fill
          style={{ objectFit: "cover" }}
        />
        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", display: "flex", gap: "0.5rem" }}>
          <span className={`badge badge-${listing.availability}`} style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
            {listing.availability.charAt(0).toUpperCase() + listing.availability.slice(1)}
          </span>
          <span className="badge" style={{ background: "rgba(0,0,0,0.5)", color: "white", backdropFilter: "blur(4px)" }}>
            {roomTypeLabels[listing.roomType]}
          </span>
        </div>
        {onToggleSave && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleSave(listing.id); }}
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              background: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              color: isSaved ? "#f87171" : "#94a3b8",
              fontSize: "1.2rem"
            }}
          >
            {isSaved ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      {/* Info Section */}
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.3, marginBottom: "0.25rem" }}>
              {listing.title}
            </h3>
            <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--primary)", whiteSpace: "nowrap" }}>
              {formatPrice(listing.price)}
            </span>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            📍 {listing.location}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "0.5rem" }}>
            🚶 {listing.distanceFromCampus} min walk from campus
          </p>
        </div>

        {/* Contact Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "auto" }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleContact(e, "whatsapp")}
            className="btn btn-primary btn-sm"
            style={{ 
              background: "#25D366", 
              borderColor: "#25D366", 
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.8rem"
            }}
          >
            <span>💬</span> WhatsApp
          </a>
          <a
            href={`tel:${listing.landlord.phone}`}
            onClick={(e) => handleContact(e, "phone")}
            className="btn btn-outline btn-sm"
            style={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.8rem"
            }}
          >
            <span>📞</span> Call Now
          </a>
        </div>
        
        <Link 
          href={`/listing/${listing.id}`} 
          style={{ 
            marginTop: "1rem", 
            textAlign: "center", 
            fontSize: "0.8rem", 
            fontWeight: 600, 
            color: "var(--text-muted)",
            textDecoration: "none"
          }}
          className="hover-underline"
        >
          View Full Details →
        </Link>
      </div>
    </div>
  );
}
