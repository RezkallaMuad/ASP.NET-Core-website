import React from "react";
import ProjectsList from "./ProjectsList";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* Header / Profile Section */}
      <header className="App-header" style={{ display: "flex", alignItems: "flex-start", padding: "20px" }}>
        {/* Profile picture */}
        <img 
          src="/profile.jpg" // place your profile picture in /public/profile.jpg
          alt="Profile"
          style={{ width: "200px", height: "200px", borderRadius: "50%", marginRight: "20px" }}
        />

        {/* Contact Info */}
        <div style={{ textAlign: "left" }}>
          <h1 style={{ margin: 0 }}>Your Name</h1>
          <p style={{ margin: "5px 0" }}>
            📱 (555) 555-5555 <br />
            📧 your.email@example.com <br />
            🌐 <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">GitHub</a>
          </p>
        </div>
      </header>

      {/* About Section */}
      <section style={{ padding: "20px", textAlign: "left" }}>
        <h2>About Me</h2>
        <p>
          I am a computing science student with a passion for web development,
          security, and building useful applications. I enjoy solving complex problems
          and creating clean, functional designs.
        </p>
      </section>

      {/* Projects Section */}
      <section style={{ padding: "20px", textAlign: "left" }}>
        <h2>Projects</h2>
        <ProjectsList />
      </section>

      {/* Fun Section */}
      <section style={{ padding: "20px", textAlign: "left" }}>
        <h2>What I Like to Do for Fun</h2>
        <p>
          Outside of coding, I enjoy gaming, painting, and exploring new tech.  
          I also like playing basketball and hanging out with friends.
        </p>
      </section>
    </div>
  );
}

export default App;
