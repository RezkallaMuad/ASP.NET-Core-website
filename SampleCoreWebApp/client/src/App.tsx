import React from "react";
import ProjectsList from "./ProjectsList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Portfolio</h1>
      </header>
      <main style={{ padding: "20px" }}>
        <ProjectsList />
      </main>
    </div>
  );
}

export default App;
