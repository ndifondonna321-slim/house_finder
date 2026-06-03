"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  existingImages?: string[];
}

export default function ImageUpload({ onUpload, existingImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingImages.length > 0) {
      setImages(existingImages);
    }
  }, [existingImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError("");
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("listings")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          setError("Failed to upload some images. Check if 'listings' bucket is public.");
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("listings")
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      const updatedImages = [...images, ...newUrls];
      setImages(updatedImages);
      onUpload(updatedImages);
    } catch (err: any) {
      console.error("Image upload failed:", err);
      setError("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onUpload(updatedImages);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        {images.map((url, i) => (
          <div key={url} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border)" }}>
            <Image src={url} alt="Preview" fill sizes="100px" style={{ objectFit: "cover" }} />
            <button
              onClick={() => removeImage(i)}
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                background: "rgba(239, 68, 68, 0.9)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ×
            </button>
          </div>
        ))}
        
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: "100px",
            height: "100px",
            border: "2px dashed var(--border)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: "var(--bg-elevated)",
            color: "var(--text-muted)",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <span style={{ fontSize: "1.5rem" }}>{isUploading ? "⏳" : "➕"}</span>
          <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>{isUploading ? "Uploading..." : "Add Photo"}</span>
        </div>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      
      {error && <p style={{ fontSize: "0.75rem", color: "#ef4444" }}>{error}</p>}
      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
        Upload high-quality photos to attract more students.
      </p>
    </div>
  );
}
