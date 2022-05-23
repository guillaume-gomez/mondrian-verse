import React from 'react';
import './App.css';
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

const githubUrl = "https://github.com/guillaume-gomez/mondrian-verse";

function App() {
  return (
    <div>
      <header>
          <NavBar githubUrl={githubUrl} />
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
          <Footer githubUrl={githubUrl} />
      </header>
    </div>
  );
}

export default App;
