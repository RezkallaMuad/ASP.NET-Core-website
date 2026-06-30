import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Project } from "./types";

const PALETTE = {
  bg: "#f8fafc",
  text: "#0f172a",
  muted: "#475569",
  border: "#e2e8f0",
  accent: "#1d4ed8",
  cardBg: "#ffffff",
};

const ITEMS_PER_PAGE = 3;

interface Props {
  projects: Project[];
}

export default function ProjectsCarousel({ projects }: Props) {
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPage = isMobile ? 1 : 3;
  const pageCount = Math.max(1, Math.ceil(projects.length / itemsPerPage));

  const goNext = () => setPage((p) => (p + 1) % pageCount);
  const goPrev = () => setPage((p) => (p - 1 + pageCount) % pageCount);

  if (projects.length === 0) {
    return <p style={{ color: PALETTE.muted }}>No projects found.</p>;
  }

  const currentPage = Math.min(page, pageCount - 1);
  const visible = projects.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage);

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 16 : 20, flexDirection: isMobile ? "column" : "row" }}>
        {!isMobile && pageCount > 1 && (
          <button onClick={goPrev} aria-label="Previous projects" style={arrowButtonStyle}>
            <ArrowIcon direction="left" />
          </button>
        )}

        <div
          style={{
            flex: 1,
            width: "100%",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : `repeat(${Math.min(3, visible.length)}, 1fr)`,
            gap: 24,
          }}
        >
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        {!isMobile && pageCount > 1 && (
          <button onClick={goNext} aria-label="Next projects" style={arrowButtonStyle}>
            <ArrowIcon direction="right" />
          </button>
        )}

        {isMobile && pageCount > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 8 }}>
            <button onClick={goPrev} aria-label="Previous projects" style={arrowButtonStyle}>
              <ArrowIcon direction="left" />
            </button>
            <span style={{ fontSize: 13, color: PALETTE.muted, fontWeight: 500 }}>
              {currentPage + 1} / {pageCount}
            </span>
            <button onClick={goNext} aria-label="Next projects" style={arrowButtonStyle}>
              <ArrowIcon direction="right" />
            </button>
          </div>
        )}
      </div>

      {!isMobile && pageCount > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: i === currentPage ? PALETTE.accent : PALETTE.border,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      style={{
        background: PALETTE.cardBg,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: 8,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,24,20,0.06)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ height: 160, background: "#f0ede6", overflow: "hidden" }}>
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: PALETTE.muted,
              fontSize: 12,
            }}
          >
            No preview image
          </div>
        )}
      </div>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, marginBottom: 8, color: PALETTE.text }}>
          {project.name}
        </h3>
        <p style={{ fontSize: 13, color: PALETTE.muted, lineHeight: 1.6, flexGrow: 1, marginBottom: 16 }}>
          {project.description}
        </p>
        <Link
          to={`/projects/${project.id}`}
          style={{
            alignSelf: "flex-start",
            fontSize: 12,
            fontWeight: 500,
            color: PALETTE.accent,
            textDecoration: "none",
            border: `1px solid ${PALETTE.border}`,
            padding: "8px 16px",
            borderRadius: 4,
          }}
        >
          View Project →
        </Link>
      </div>
    </div>
  );
}

const arrowButtonStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: `1px solid ${PALETTE.border}`,
  background: PALETTE.bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: direction === "left" ? "rotate(180deg)" : "none" }}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="#1a1814"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
