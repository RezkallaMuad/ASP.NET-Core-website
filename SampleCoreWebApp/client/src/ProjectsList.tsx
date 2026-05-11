const projects = [
  {
    num: "01",
    title: "Project Alpha",
    desc: "A web app that solves X by doing Y. Reduced load time by 40% through optimized queries and caching.",
    tags: ["React", "Node.js", "PostgreSQL"],
    demo: "https://...",
    source: "https://github.com/...",
  },
  // add more...
];

function ProjectsList() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: "#e2ddd7", border: "1px solid #e2ddd7", borderRadius: 8, overflow: "hidden" }}>
      {projects.map(p => (
        <div key={p.num} style={{ background: "#faf9f6", padding: "28px 24px" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a09c96", marginBottom: 16 }}>{p.num}</p>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 10 }}>{p.title}</h3>
          <p style={{ fontSize: 13, color: "#6b6760", lineHeight: 1.6, marginBottom: 18 }}>{p.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {p.tags.map(t => (
              <span key={t} style={{ fontFamily: "monospace", fontSize: 11, background: "#ede9e3", color: "#6b6760", padding: "3px 9px", borderRadius: 3 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href={p.demo} style={{ fontSize: 12, color: "#c85a2a", textDecoration: "none", borderBottom: "1px solid #e8d5c4" }}>Live Demo ↗</a>
            <a href={p.source} style={{ fontSize: 12, color: "#c85a2a", textDecoration: "none", borderBottom: "1px solid #e8d5c4" }}>Source ↗</a>
          </div>
        </div>
      ))}
    </div>
  );
}