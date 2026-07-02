import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProjectsCarousel from "./ProjectsCarousel";
import ProjectPage from "./ProjectPage";
import BlogPostPage from "./BlogPostPage";
import { Project, BlogPost, Skill, Experience } from "./types";
import profileImg from "./assets/ProfilePic.jpeg"; 
import githubIcon from "./assets/Github.png";
import emailIcon from "./assets/Email.svg";
import numberIcon from "./assets/Phone.svg";

const PALETTE = {
  bg: "#f8fafc",     // slate-50
  text: "#0f172a",   // slate-900
  muted: "#475569",  // slate-600
  border: "#e2e8f0",  // slate-200
  accent: "#1d4ed8",  // blue-700
  cardBg: "#ffffff",
};

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: "'Instrument Sans', sans-serif", background: PALETTE.bg, color: PALETTE.text, minHeight: "100vh" }}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function Nav() {
  return (
    <nav
      className="nav-container"
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: `1px solid ${PALETTE.border}`,
        position: "sticky",
        top: 0,
        background: "rgba(248,250,252,0.92)",
        backdropFilter: "blur(8px)",
        zIndex: 10,
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            ...navLinkStyle,
            fontWeight: 700,
            fontSize: 14,
            color: PALETTE.text,
          }}
        >
          Home
        </Link>
      </div>

      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...navLinkStyle,
            color: "#ffffff",
            background: PALETTE.accent,
            padding: "8px 16px",
            borderRadius: "20px",
            fontWeight: 600,
            boxShadow: "0 2px 4px rgba(29, 78, 216, 0.15)",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1e40af";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = PALETTE.accent;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Resume
        </a>
      </div>
    </nav>
  );
}

const navLinkStyle: React.CSSProperties = {
  fontSize: 13,
  color: PALETTE.muted,
  textDecoration: "none",
  letterSpacing: "0.03em",
};

function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/Projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <TopSection />
      <ExperienceSection />
      <section id="projects" className="section-padding" style={{ borderBottom: `1px solid ${PALETTE.border}` }}>
        <h2 className="section-title" style={{ fontFamily: "'DM Serif Display', serif", marginBottom: 16, color: PALETTE.text }}>
          Projects
        </h2>
        {loading ? (
          <p style={{ color: PALETTE.muted }}>Loading projects...</p>
        ) : (
          <ProjectsCarousel projects={projects} />
        )}
      </section>

      <section id="blog" className="section-padding">
        <h2 className="section-title" style={{ fontFamily: "'DM Serif Display', serif", marginBottom: 16, color: PALETTE.text }}>
          Blog
        </h2>
        <BlogPostsSection />
      </section>
    </div>
  );
}

function BlogPostsSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/BlogPosts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blog posts");
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog posts:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ color: PALETTE.muted }}>Loading thoughts...</p>;
  }

  if (posts.length === 0) {
    return <p style={{ color: PALETTE.muted, fontSize: 14 }}>No blog posts found.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 30,
        marginTop: 20,
      }}
    >
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  const [hovered, setHovered] = useState(false);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      to={`/blog/${post.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        background: PALETTE.cardBg,
        border: `1px solid ${hovered ? PALETTE.accent : PALETTE.border}`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: hovered ? "0 10px 20px rgba(29,78,216,0.06)" : "0 2px 8px rgba(0,0,0,0.02)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {post.imageUrl && (
        <div style={{ height: 180, overflow: "hidden", borderBottom: `1px solid ${PALETTE.border}` }}>
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.5s ease",
            }}
          />
        </div>
      )}
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 11, fontFamily: "monospace", color: PALETTE.accent, fontWeight: 600, marginBottom: 8 }}>
          {formattedDate}
        </div>
        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: PALETTE.text,
            lineHeight: 1.3,
            marginBottom: 8,
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: PALETTE.muted,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.summary}
        </p>
      </div>
    </Link>
  );
}

function TopSection() {
  return (
    <div className="top-section-grid" style={{ borderBottom: `1px solid ${PALETTE.border}` }}>
      {/* Left: photo + contact links */}
      <div className="top-section-left">
        <img
          src={profileImg}
          alt="Profile"
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            objectFit: "cover",
            border: `3px solid ${PALETTE.accent}`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 190 }}>
          {[
            { icon: githubIcon , label: "github.com/RezkallaMuad", href: "https://github.com/RezkallaMuad" },
            { icon: emailIcon , label: "rezkallam@mymacewan.ca", href: "mailto:rezkallam@mymacewan.ca" },
            { icon: numberIcon, label: "(825) 343-2487", href: "tel:8253432487" },
          ].map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: PALETTE.bg,
                border: `1px solid ${PALETTE.border}`,
                borderRadius: 40,
                padding: "8px 14px",
                fontSize: 12,
                color: PALETTE.muted,
                textDecoration: "none",
              }}
            >
              <img src={icon} alt="" style={{ width: 16, height: 16 }} />
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="top-section-right">
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 20,
            color: PALETTE.accent,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Software Developer
        </p>
        <h1 className="top-section-name" style={{ fontFamily: "'DM Serif Display', serif", lineHeight: 1.2, marginBottom: 20, color: PALETTE.text }}>
          Muad Rezkalla
        </h1>
        <p style={{ fontSize: 15, color: PALETTE.muted, lineHeight: 1.7, maxWidth: 640 }}>
         Software developer with experience across full-stack applications, embedded systems, cybersecurity, and AI integration. Built projects including a Discord bot deployed to 100+ concurrent users, a secure messaging protocol, a distributed sensor network, and database-driven desktop and web apps. Comfortable working solo or within a team.
        </p>
        <SkillsSection />
      </div>
    </div>
  );
}

function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetch("/api/Skills")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSkills(data))
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

  if (skills.length === 0) return null;

  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="skills-list">
      {Object.entries(categories).map(([category, names]) => (
        <div key={category} className="skills-row">
          <span className="skills-category" style={{ color: PALETTE.accent }}>
            {category}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {names.map((name) => (
              <span
                key={name}
                style={{
                  fontSize: 12,
                  background: PALETTE.cardBg,
                  border: `1px solid ${PALETTE.border}`,
                  color: PALETTE.text,
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: 500,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/Experiences")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching experiences:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="section-padding" style={{ borderBottom: `1px solid ${PALETTE.border}` }}>
        <h2 className="section-title" style={{ fontFamily: "'DM Serif Display', serif", marginBottom: 16, color: PALETTE.text }}>
          Experience
        </h2>
        <p style={{ color: PALETTE.muted }}>Loading work experience...</p>
      </section>
    );
  }

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="section-padding" style={{ borderBottom: `1px solid ${PALETTE.border}` }}>
      <h2 className="section-title" style={{ fontFamily: "'DM Serif Display', serif", marginBottom: 32, color: PALETTE.text }}>
        Experience
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 800 }}>
        {experiences.map((exp) => (
          <div key={exp.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, margin: 0, color: PALETTE.text }}>
                {exp.position}{" "}
                <span style={{ color: "#94a3b8", fontWeight: 400 }}>|</span>{" "}
                <span style={{ color: PALETTE.accent, fontWeight: 500 }}>{exp.company}</span>
              </h3>
              <div style={{ fontSize: 13, color: PALETTE.muted, fontWeight: 500, fontFamily: "monospace" }}>
                {exp.startDate} – {exp.endDate}
              </div>
            </div>
            <div style={{ fontSize: 13, color: PALETTE.accent, fontWeight: 600, marginTop: -4 }}>
              {exp.city}, {exp.country}
            </div>
            {exp.description && (
              <ul style={{ margin: "8px 0 0 0", paddingLeft: 0, listStyle: "none", color: PALETTE.muted, fontSize: 14, lineHeight: 1.6 }}>
                {exp.description.split("\n").filter(line => line.trim().length > 0).map((line, i) => {
                  const cleanLine = line.replace(/^[•\-*\s]+/, "");
                  return (
                    <li key={i} style={{ marginBottom: 6, display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: PALETTE.accent, fontWeight: "bold" }}>-</span>
                      <span>{cleanLine}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "40px", textAlign: "center", color: PALETTE.muted }}>
      <p style={{ margin: 0, fontSize: 13, marginBottom: 6 }}>
        &copy; {new Date().getFullYear()} Muad Rezkalla. All rights reserved.
      </p>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.03em", opacity: 0.8 }}>
        Hosted on Microsoft Azure | CI/CD via GitHub Actions
      </p>
    </footer>
  );
}

export default App;