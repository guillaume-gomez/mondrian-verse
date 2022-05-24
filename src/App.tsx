import React from 'react';
import './App.css';
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import MondrianCanvas from "./components/MondrianCanvas";

const githubUrl = "https://github.com/guillaume-gomez/mondrian-verse";

function App() {
  return (
    <div>
      <header>
          <NavBar githubUrl={githubUrl} />
          <div className="bg-primary d-flex flex-col justify-center items-center gap-5">
            <h1 className="text-3xl font-bold underline">
              Hello world!
            </h1>
            <MondrianCanvas />
          </div>
          <Footer githubUrl={githubUrl} />
      </header>
    </div>
  );
}

export default App;
