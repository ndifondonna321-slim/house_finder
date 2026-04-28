import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getListingById, formatPrice, roomTypeLabels } from "@/lib/data";
import SaveButton from "./SaveButton";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) notFound();

  const whatsappUrl = `https://wa.me/${listing.landlord.whatsapp}?text=${encodeURIComponent(
    `Hello ${listing.landlord.name}, I found your listing on BambiHomes: "${listing.title}". Is it still available?`
  )}`;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Breadcrumb */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
          color: "var(--text-muted)",
          marginBottom: "1.5rem",
        }}
      >
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Home
        </Link>
        <span>›</span>
        <Link href="/listings" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Listings
        </Link>
        <span>›</span>
        <span style={{ color: "var(--text-subtle)" }}>{listing.title}</span>
      </nav>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
        {/* ── Left column ── */}
        <div>
          {/* Image gallery */}
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              marginBottom: "1.5rem",
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gridTemplateRows: "280px 140px",
              gap: "0.5rem",
              height: "430px",
            }}
          >
            {listing.images.map((img, i) => (
              <div
                key={img}
                style={{
                  position: "relative",
                  gridRow: i === 0 ? "1 / 3" : "auto",
                  overflow: "hidden",
                  background: "var(--bg-elevated)",
                }}
              >
                <Image
                  src={img}
                  alt={`${listing.title} — photo ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Title + badges */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "0.75rem",
              }}
            >
              <h1
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                {listing.title}
              </h1>
              <SaveButton listingId={listing.id} />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.625rem",
                alignItems: "center",
              }}
            >
              <span className={`badge badge-${listing.availability}`}>
                {listing.availability === "available" && "● "}
                {listing.availability.charAt(0).toUpperCase() +
                  listing.availability.slice(1)}
              </span>
              <span
                className="badge"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-subtle)",
                  border: "1px solid var(--border-light)",
                }}
              >
                🏠 {roomTypeLabels[listing.roomType]}
              </span>
              <span
                className="badge"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-subtle)",
                  border: "1px solid var(--border-light)",
                }}
              >
                🚶 {listing.distanceFromCampus} min from campus
              </span>
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                marginBottom: "0.875rem",
                color: "var(--text-subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              About this listing
            </h2>
            <p
              style={{
                color: "var(--text-subtle)",
                lineHeight: 1.75,
                fontSize: "0.9375rem",
              }}
            >
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div
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
                marginBottom: "1rem",
                color: "var(--text-subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Amenities & Features
            </h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.625rem",
              }}
            >
              {listing.amenities.map((a) => (
                <span
                  key={a}
                  style={{
                    background: "rgba(20,184,166,0.08)",
                    border: "1px solid rgba(20,184,166,0.2)",
                    color: "var(--primary)",
                    padding: "0.375rem 0.875rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  ✓ {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ position: "sticky", top: "80px" }}>
          {/* Price card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              padding: "1.75rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "var(--primary)",
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                }}
              >
                {listing.price.toLocaleString("fr-CM")} FCFA
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                per month
              </div>
            </div>

            <div className="divider" style={{ marginBottom: "1.25rem" }} />

            {/* Quick info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.25rem" }}>
              {[
                { icon: "📍", label: "Location", value: listing.location },
                { icon: "🚶", label: "Campus distance", value: `${listing.distanceFromCampus} min walk` },
                { icon: "🏠", label: "Room type", value: roomTypeLabels[listing.roomType] },
                {
                  icon: "📅",
                  label: "Listed on",
                  value: new Date(listing.createdAt).toLocaleDateString("en-CM", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {row.icon} {row.label}
                  </span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text)", fontWeight: 500, textAlign: "right" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="divider" style={{ marginBottom: "1.25rem" }} />

            {/* Landlord */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginBottom: "0.625rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                Landlord
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {listing.landlord.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9375rem" }}>
                    {listing.landlord.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {listing.landlord.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id={`whatsapp-btn-${listing.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem",
                  borderRadius: "var(--radius)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  color: "#fff",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>💬</span>
                WhatsApp Landlord
              </a>
              <a
                href={`tel:${listing.landlord.phone}`}
                id={`call-btn-${listing.id}`}
                className="btn btn-outline"
                style={{ justifyContent: "center" }}
              >
                📞 Call {listing.landlord.phone}
              </a>
            </div>
          </div>

          <Link
            href="/listings"
            className="btn btn-ghost btn-sm"
            style={{ width: "100%", justifyContent: "center" }}
          >
            ← Back to all listings
          </Link>
        </div>
      </div>
    </div>
  );
}
