import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BlogPost } from "./types";

const PALETTE = {
  bg: "#f8fafc",
  text: "#0f172a",
  muted: "#475569",
  border: "#e2e8f0",
  accent: "#1d4ed8",
  cardBg: "#ffffff",
};

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`/api/BlogPosts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blog post");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: isMobile ? "40px 20px" : "60px 40px", textAlign: "center" }}>
        <p style={{ color: PALETTE.muted }}>Loading blog post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: isMobile ? "40px 20px" : "60px 40px", textAlign: "center" }}>
        <p style={{ color: PALETTE.muted }}>Blog post not found.</p>
        <Link to="/" style={{ color: PALETTE.accent }}>← Back home</Link>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ padding: isMobile ? "40px 20px" : "60px 40px", maxWidth: 800, margin: "0 auto" }}>
      <Link to="/#blog" style={{ fontSize: 13, color: PALETTE.muted, textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
        ← Back to blog
      </Link>

      <article>
        <header style={{ marginBottom: 30 }}>
          <div style={{ fontSize: 13, color: PALETTE.accent, fontWeight: 600, marginBottom: 8, fontFamily: "monospace" }}>
            {formattedDate}
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: isMobile ? 30 : 40, color: PALETTE.text, lineHeight: 1.2, marginBottom: 16 }}>
            {post.title}
          </h1>
          <p style={{ fontSize: isMobile ? 16 : 18, color: PALETTE.muted, lineHeight: 1.5, fontStyle: "italic" }}>
            {post.summary}
          </p>
        </header>

        {post.imageUrl && (
          <div style={{ width: "100%", maxHeight: isMobile ? 280 : 450, borderRadius: 12, overflow: "hidden", marginBottom: 36, border: `1px solid ${PALETTE.border}` }}>
            <img src={post.imageUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div 
          style={{ 
            fontSize: 16, 
            color: PALETTE.text, 
            lineHeight: 1.8, 
            whiteSpace: "pre-wrap",
            fontFamily: "'Instrument Sans', sans-serif"
          }}
        >
          {post.content}
        </div>
      </article>
    </div>
  );
}
