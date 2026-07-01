import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Project } from "./types";

const PALETTE = {
  bg: "#f8fafc",     // slate-50
  text: "#0f172a",   // slate-900
  muted: "#475569",  // slate-600
  border: "#e2e8f0",  // slate-200
  accent: "#1d4ed8",  // blue-700
  cardBg: "#ffffff",  // white
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/Projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setActiveMedia(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p style={{ padding: 40, color: PALETTE.muted }}>Loading project...</p>;
  }

  if (!project) {
    return (
      <div style={{ padding: 40 }}>
        <p style={{ color: PALETTE.muted }}>Project not found.</p>
        <Link to="/" style={{ color: PALETTE.accent }}>← Back home</Link>
      </div>
    );
  }

  const media = project.media && project.media.length > 0 ? [...project.media] : [];
  if (media.length === 0) {
    if (project.imageUrl) {
      media.push({ type: "image", url: project.imageUrl });
    }
  }
  const contributors = project.contributors ?? [];

  return (
    <div style={{ padding: isMobile ? "40px 20px" : "60px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <Link to="/#projects" style={{ fontSize: 13, color: PALETTE.muted, textDecoration: "none" }}>
        ← Back to projects
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: isMobile ? 30 : 60, marginTop: 30 }}>
        {/* Left: project summary */}
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: isMobile ? 30 : 36, marginBottom: 20, color: PALETTE.text }}>
            {project.name}
          </h1>
          <p style={{ fontSize: 15, color: PALETTE.muted, lineHeight: 1.8, marginBottom: 24 }}>
            {project.description}
          </p>

          {project.technologies && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              {project.technologies.split(",").map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    background: "#e2e8f0",
                    color: PALETTE.muted,
                    padding: "3px 9px",
                    borderRadius: 3,
                  }}
                >
                  {t.trim()}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            {project.gitHubUrl && (
              <a href={project.gitHubUrl} style={detailLinkStyle}>
                Source ↗
              </a>
            )}
          </div>
        </div>

        {/* Right: media showcase carousel */}
        <div>
          {media.length === 0 ? (
            <div
              style={{
                height: isMobile ? 240 : 320,
                background: PALETTE.cardBg,
                border: `1px solid ${PALETTE.border}`,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: PALETTE.muted,
                fontSize: 13,
              }}
            >
              No media yet for this project.
            </div>
          ) : (
            <>
              <div
                style={{
                  width: "100%",
                  background: PALETTE.cardBg,
                  border: `1px solid ${PALETTE.border}`,
                  borderRadius: 8,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {media[activeMedia].type === "video" ? (
                  isYouTubeUrl(media[activeMedia].url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(media[activeMedia].url)}
                      style={{ width: "100%", aspectRatio: "16/9", border: "none", display: "block" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Project Video"
                    />
                  ) : isGoogleDriveVideoUrl(media[activeMedia].url) ? (
                    <iframe
                      src={getGoogleDriveEmbedUrl(media[activeMedia].url)}
                      style={{ width: "100%", aspectRatio: "16/9", border: "none", display: "block" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Project Video"
                    />
                  ) : (
                    <video
                      src={media[activeMedia].url}
                      controls
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  )
                ) : (
                  <img
                    src={media[activeMedia].url}
                    alt={`${project.name} screenshot`}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                )}
              </div>

              {media.length > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                  {media.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveMedia(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        background: i === activeMedia ? PALETTE.accent : PALETTE.border,
                        transition: "background 0.2s ease",
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Contributors */}
      <div style={{ marginTop: 50, borderTop: `1px solid ${PALETTE.border}`, paddingTop: 30 }}>
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 16, color: PALETTE.text }}>
          Contributors
        </h3>
        {contributors.length === 0 ? (
          <p style={{ color: PALETTE.muted, fontSize: 13 }}>No contributors listed.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {contributors.map((c) => (
              <span
                key={c}
                style={{
                  fontSize: 13,
                  color: PALETTE.text,
                  background: PALETTE.cardBg,
                  border: `1px solid ${PALETTE.border}`,
                  padding: "6px 14px",
                  borderRadius: 40,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const detailLinkStyle: React.CSSProperties = {
  fontSize: 13,
  color: PALETTE.accent,
  textDecoration: "none",
  borderBottom: "1px solid #93c5fd",
};

function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function getYouTubeEmbedUrl(url: string): string {
  let videoId = "";
  if (url.includes("youtube.com/watch")) {
    const searchParams = new URLSearchParams(url.split("?")[1]);
    videoId = searchParams.get("v") || "";
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || "";
  } else if (url.includes("youtube.com/v/")) {
    videoId = url.split("youtube.com/v/")[1]?.split("?")[0] || "";
  }
  return `https://www.youtube.com/embed/${videoId}`;
}

function isGoogleDriveVideoUrl(url: string): boolean {
  return url.includes("drive.google.com") || url.includes("lh3.googleusercontent.com/d/");
}

function getGoogleDriveEmbedUrl(url: string): string {
  let fileId = "";
  if (url.includes("/file/d/")) {
    fileId = url.split("/file/d/")[1]?.split("/")[0] || "";
  } else if (url.includes("id=")) {
    const searchParams = new URLSearchParams(url.split("?")[1]);
    fileId = searchParams.get("id") || "";
  } else if (url.includes("lh3.googleusercontent.com/d/")) {
    fileId = url.split("lh3.googleusercontent.com/d/")[1]?.split("/")[0] || "";
  }
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
