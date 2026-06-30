import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProjectsCarousel from "./ProjectsCarousel";
import ProjectPage from "./ProjectPage";
import BlogPostPage from "./BlogPostPage";
import { Project, BlogPost } from "./types";
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
      style={{
        display: "flex",
        justifyContent: "right",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: `1px solid ${PALETTE.border}`,
        position: "sticky",
        top: 0,
        background: "rgba(248,250,252,0.92)",
        backdropFilter: "blur(8px)",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", gap: 28 }}>
        <Link to="/" style={navLinkStyle}>Home</Link>
        <a href="/#projects" style={navLinkStyle}>Projects</a>
        <a href="/#blog" style={navLinkStyle}>Blog</a>
        <a href="/resume.pdf" style={navLinkStyle}>Resume</a>
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
      <section id="projects" style={{ padding: "60px 40px", borderBottom: `1px solid ${PALETTE.border}` }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, marginBottom: 16, color: PALETTE.text }}>
          Projects
        </h2>
        {loading ? (
          <p style={{ color: PALETTE.muted }}>Loading projects...</p>
        ) : (
          <ProjectsCarousel projects={projects} />
        )}
      </section>

      <section id="blog" style={{ padding: "60px 40px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, marginBottom: 16, color: PALETTE.text }}>
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: 360,
        borderBottom: `1px solid ${PALETTE.border}`,
      }}
    >
      {/* Left: photo + contact links */}
      <div
        style={{
          background: PALETTE.cardBg,
          borderRight: `1px solid ${PALETTE.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 18px",
          gap: 14,
        }}
      >
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

      <div style={{ padding: "40px 40px", display: "flex", flexDirection: "column", justifyContent: "" }}>
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
          Computing Science Student
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, lineHeight: 1.2, marginBottom: 20, color: PALETTE.text }}>
          hey.
        </h1>
        <p style={{ fontSize: 15, color: PALETTE.muted, lineHeight: 1.7, maxWidth: 640 }}>
          Software developer with a passion for building web applications and exploring new technologies. 
          I enjoy working on projects that challenge me to learn and grow as a developer.
        </p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "40px", textAlign: "center", color: PALETTE.muted }}>
      <p style={{ margin: 0, fontSize: 13 }}>&copy; {new Date().getFullYear()} Muad Rezkalla. All rights reserved.</p>
    </footer>
  );
}

export default App;