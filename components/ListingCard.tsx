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

  const handleContact = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push("/login");
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push(`/signup?redirect=${encodeURIComponent(`/listing/${listing.id}`)}`);
    }
  };

  return (
    <div
      className="card-lift"
      style={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* ── Image Section ── */}
      <div style={{ position: "relative", height: "210px", width: "100%", overflow: "hidden" }}>
        <Image
          src={listing.images[0] || "https://picsum.photos/seed/placeholder/800/600"}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover", transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
          className="listing-card-img"
        />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)", pointerEvents: "none" }} />

        {/* Top badges */}
        <div style={{ position: "absolute", top: "0.875rem", left: "0.875rem", display: "flex", gap: "0.5rem", zIndex: 2 }}>
          <span className={`badge badge-${listing.availability}`}>
            {listing.availability === "available" ? "● " : ""}{listing.availability.charAt(0).toUpperCase() + listing.availability.slice(1)}
          </span>
          <span className="badge" style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>
            {roomTypeLabels[listing.roomType]}
          </span>
        </div>

        {/* Save button */}
        {onToggleSave && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleSave(listing.id); }}
            style={{
              position: "absolute",
              top: "0.875rem",
              right: "0.875rem",
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 2,
              fontSize: "1rem",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          >
            {isSaved ? "❤️" : "🤍"}
          </button>
        )}

        {/* Bottom price overlay */}
        <div style={{
          position: "absolute",
          bottom: "0.875rem",
          left: "0.875rem",
          zIndex: 2,
        }}>
          <div className="price-tag">
            {formatPrice(listing.price)}
          </div>
        </div>
      </div>

      {/* ── Info Section ── */}
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {/* Title & Location */}
        <div>
          <h3 style={{
            fontSize: "1.0625rem",
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.3,
            marginBottom: "0.375rem",
            letterSpacing: "-0.02em",
          }}>
            {listing.title}
          </h3>
          <p style={{
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
          }}>
            <span style={{ color: "var(--primary)" }}>📍</span> {listing.location}
          </p>
        </div>

        {/* Meta chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="chip">
            🚶 {listing.distanceFromCampus} min
          </span>
          {listing.roomNumber && (
            <span className="chip">🚪 {listing.roomNumber}</span>
          )}
          {listing.floor && (
            <span className="chip">🏢 {listing.floor}</span>
          )}
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Contact buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleContact}
            className="btn btn-sm btn-whatsapp"
          >
            <span style={{ fontSize: "0.9rem" }}>💬</span> WhatsApp
          </a>
          <a
            href={`tel:${listing.landlord.phone}`}
            onClick={handleContact}
            className="btn btn-sm btn-outline"
          >
            <span style={{ fontSize: "0.9rem" }}>📞</span> Call Now
          </a>
        </div>

        {/* View details link */}
        <Link
          href={`/listing/${listing.id}`}
          onClick={handleViewDetails}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            textDecoration: "none",
            padding: "0.5rem",
            borderRadius: "var(--radius-sm)",
            transition: "var(--transition)",
            background: "transparent",
            border: "1px solid transparent",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary-light)";
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(59,130,246,0.05)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(59,130,246,0.2)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent";
          }}
        >
          View Full Details
          <span style={{ transition: "transform 0.2s ease" }}>→</span>
        </Link>
      </div>

      <style>{`
        .listing-card-img { transform-origin: center; }
        .card-lift:hover .listing-card-img { transform: scale(1.06); }
      `}</style>
    </div>
  );
}
