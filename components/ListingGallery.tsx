"use client";

import { useState } from "react";
import Image from "next/image";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const safeImages = images.length > 0 ? images : ["https://picsum.photos/seed/placeholder/800/600"];
  const hasMultiple = safeImages.length > 1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Primary Large Image Display */}
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: "relative",
          height: "400px",
          width: "100%",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          cursor: "zoom-in",
          boxShadow: "var(--shadow-md)",
          transition: "transform 0.3s ease, border-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        <Image
          src={safeImages[activeIndex]}
          alt={`${title} — Image ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          style={{ objectFit: "cover", transition: "filter 0.3s ease" }}
        />

        {/* Hover overlay hint */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.2)",
            opacity: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "0.9375rem",
            fontWeight: 600,
            transition: "opacity 0.2s ease",
            backdropFilter: "blur(2px)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
        >
          🔍 Click to view fullscreen
        </div>

        {/* Navigation Chevrons */}
        {hasMultiple && (
          <>
            <button
              onClick={handlePrev}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 2,
                fontSize: "1.25rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,0,0,0.55)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              ⟨
            </button>
            <button
              onClick={handleNext}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 2,
                fontSize: "1.25rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,0,0,0.55)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              ⟩
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "1rem",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            padding: "0.375rem 0.75rem",
            borderRadius: "20px",
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.1)",
            zIndex: 2,
          }}
        >
          📷 {activeIndex + 1} / {safeImages.length}
        </div>
      </div>

      {/* Thumbnails list */}
      {hasMultiple && (
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {safeImages.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveIndex(i)}
              style={{
                position: "relative",
                width: "76px",
                height: "56px",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: activeIndex === i ? "2px solid var(--primary)" : "2px solid transparent",
                opacity: activeIndex === i ? 1 : 0.65,
                background: "var(--bg-elevated)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (activeIndex !== i) e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                if (activeIndex !== i) e.currentTarget.style.opacity = "0.65";
              }}
            >
              <Image src={img} alt="thumbnail" fill sizes="80px" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(3, 7, 18, 0.95)",
            backdropFilter: "blur(12px)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1.5rem",
              transition: "all 0.2s ease",
              zIndex: 10001,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.9)";
              e.currentTarget.style.borderColor = "transparent";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            ✕
          </button>

          {/* Main Lightbox Frame */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "1024px",
              height: "65vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={safeImages[activeIndex]}
                alt={`${title} — Zoomed Image ${activeIndex + 1}`}
                fill
                sizes="1024px"
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Navigation Chevrons in Lightbox */}
            {hasMultiple && (
              <>
                <button
                  onClick={handlePrev}
                  style={{
                    position: "absolute",
                    left: "-1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "56px",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10000,
                    fontSize: "1.5rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                >
                  ⟨
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    position: "absolute",
                    right: "-1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "56px",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 10000,
                    fontSize: "1.5rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                >
                  ⟩
                </button>
              </>
            )}
          </div>

          {/* Lightbox Footer text and thumbnails */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", zIndex: 10000 }}>
            <span style={{ color: "#94a3b8", fontSize: "0.875rem", fontWeight: 500 }}>
              {activeIndex + 1} of {safeImages.length} — {title}
            </span>

            {hasMultiple && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {safeImages.map((img, i) => (
                  <button
                    key={`lightbox-${img}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                    }}
                    style={{
                      position: "relative",
                      width: "64px",
                      height: "46px",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      border: activeIndex === i ? "2px solid var(--primary)" : "2px solid rgba(255,255,255,0.2)",
                      opacity: activeIndex === i ? 1 : 0.5,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: "transparent",
                    }}
                  >
                    <Image src={img} alt="thumbnail" fill sizes="70px" style={{ objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
