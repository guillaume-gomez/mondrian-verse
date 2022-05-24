import React, { useState } from 'react';
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
      </header>
      <div className="bg-primary flex flex-col justify-center items-center gap-5 py-5">
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <MondrianCanvas />
      </div>
      <Footer githubUrl={githubUrl} />
    </div>
  );
}

export default App;
