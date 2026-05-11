import React from "react";
import ProjectsList from "./ProjectsList";

function App() {
  return (
    <div style={{ fontFamily: "'Instrument Sans', sans-serif", background: "#faf9f6", color: "#1a1814", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <ProjectsSection />
      <SkillsSection />
      <AboutSection />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #e2ddd7", position: "sticky", top: 0, background: "rgba(250,249,246,0.92)", backdropFilter: "blur(8px)", zIndex: 10 }}>
      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18 }}>Your Name</span>
      <div style={{ display: "flex", gap: 28 }}>
        {["About", "Projects", "Skills", "Contact"].map(link => (
          <a key={link} href={`#${link.toLowerCase()}`} style={{ fontSize: 13, color: "#6b6760", textDecoration: "none", letterSpacing: "0.03em" }}>{link}</a>
        ))}
      </div>
    </nav>
  );
}
function ProjectsSection() {
  return (
    <section id="projects" style={{ padding: "60px 40px", borderBottom: "1px solid #e2ddd7" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, marginBottom: 16 }}>Projects</h2>
      <p style={{ fontSize: 15, color: "#6b6760", lineHeight: 1.7, maxWidth: 680 }}>
        A selection of recent projects showcasing experience in web development and security.
      </p>
      <ProjectsList />
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" style={{ padding: "60px 40px", borderBottom: "1px solid #e2ddd7" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, marginBottom: 16 }}>Skills</h2>
      <p style={{ fontSize: 15, color: "#6b6760", lineHeight: 1.7, maxWidth: 680 }}>
        Front-end, back-end, and security skills with experience in React, ASP.NET Core, and more.
      </p>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" style={{ padding: "60px 40px", borderBottom: "1px solid #e2ddd7" }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, marginBottom: 16 }}>About</h2>
      <p style={{ fontSize: 15, color: "#6b6760", lineHeight: 1.7, maxWidth: 680 }}>
        I am a computing science student passionate about building useful applications and learning new technologies.
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "40px", textAlign: "center", color: "#6b6760" }}>
      <p style={{ margin: 0, fontSize: 13 }}>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
    </footer>
  );
}
function Hero() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 420, borderBottom: "1px solid #e2ddd7" }}>
      {/* Left */}
      <div style={{ padding: "60px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#c85a2a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
          Computing Science Student
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 52, lineHeight: 1.1, marginBottom: 20 }}>
          Building things<br />that <em style={{ color: "#c85a2a" }}>actually</em><br />work.
        </h1>
        <p style={{ fontSize: 15, color: "#6b6760", lineHeight: 1.7, maxWidth: 380, marginBottom: 32 }}>
          I'm a computing science student with a passion for web development,
          security, and building useful applications.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="#projects" style={{ background: "#1a1814", color: "#faf9f6", padding: "10px 22px", borderRadius: 4, fontSize: 13, textDecoration: "none" }}>
            View Projects
          </a>
          <a href="/resume.pdf" style={{ border: "1px solid #e2ddd7", color: "#6b6760", padding: "10px 22px", borderRadius: 4, fontSize: 13, textDecoration: "none" }}>
            Download CV
          </a>
        </div>
      </div>
      {/* Right */}
      <div style={{ background: "#f0ede6", borderLeft: "1px solid #e2ddd7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, gap: 20 }}>
        <img
          src="/profile.jpg"
          alt="Profile"
          style={{ width: 180, height: 180, borderRadius: "50%", objectFit: "cover", border: "3px solid #c85a2a" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 260 }}>
          {[
            { icon: "📧", label: "your.email@example.com", href: "mailto:your.email@example.com" },
            { icon: "💻", label: "github.com/yourusername", href: "https://github.com/yourusername" },
            { icon: "📱", label: "(555) 555-5555", href: "tel:5555555555" },
          ].map(({ icon, label, href }) => (
            <a key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 10, background: "#faf9f6", border: "1px solid #e2ddd7", borderRadius: 40, padding: "8px 14px", fontSize: 12, color: "#6b6760", textDecoration: "none" }}>
              <span>{icon}</span>{label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;