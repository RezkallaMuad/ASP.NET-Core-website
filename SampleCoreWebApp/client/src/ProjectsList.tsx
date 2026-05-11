import React, { useEffect, useState } from "react";

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string;
  gitHubUrl: string;
  demo: string;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/Projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ color: "#6b6760" }}>Loading projects...</p>;
  }

  if (projects.length === 0) {
    return <p style={{ color: "#6b6760" }}>No projects found in the database.</p>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: "#e2ddd7", border: "1px solid #e2ddd7", borderRadius: 8, overflow: "hidden", marginTop: "40px" }}>
      {projects.map((p, index) => {
        const num = (index + 1).toString().padStart(2, "0");
        const tags = p.technologies ? p.technologies.split(",").map(t => t.trim()) : [];
        return (
          <div key={p.id} style={{ background: "#faf9f6", padding: "28px 24px" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a09c96", marginBottom: 16 }}>{num}</p>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 10 }}>{p.name}</h3>
            <p style={{ fontSize: 13, color: "#6b6760", lineHeight: 1.6, marginBottom: 18 }}>{p.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {tags.map(t => (
                <span key={t} style={{ fontFamily: "monospace", fontSize: 11, background: "#ede9e3", color: "#6b6760", padding: "3px 9px", borderRadius: 3 }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {p.demo && (
                <a href={p.demo} style={{ fontSize: 12, color: "#c85a2a", textDecoration: "none", borderBottom: "1px solid #e8d5c4" }}>Live Demo ↗</a>
              )}
              {p.gitHubUrl && (
                <a href={p.gitHubUrl} style={{ fontSize: 12, color: "#c85a2a", textDecoration: "none", borderBottom: "1px solid #e8d5c4" }}>Source ↗</a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}