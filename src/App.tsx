import React, { useState, useEffect } from 'react';
import './App.css';
import useMondrian from "./hooks/useMondrian";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import MondrianCanvas from "./components/MondrianCanvas";

const githubUrl = "https://github.com/guillaume-gomez/mondrian-verse";

function App() {
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(800);
  const [nbIterations, setNbIteration] = useState<number>(3);
  const [thickness, setThickness] = useState<number>(10);
  const { generate, rects } = useMondrian();

  useEffect(() => {
    generate(width, height, nbIterations);
  }, [/*generate*/width, height, nbIterations]);
  // adding generate create a pleaseant glitch :p
  
  return (
    <div>
      <header>
          <NavBar githubUrl={githubUrl} />
      </header>
      <div className="bg-primary flex flex-col justify-center items-center gap-5 py-5">
        <MondrianCanvas width={width} height={height} thickness={thickness} rects={rects} />
        <div className="">
          <div id="thickness">
            <input type="range" min="2" max="100" value={thickness} className="range" step="2" onChange={(e) => setThickness(parseInt(e.target.value, 10))} />
          </div>
          <div id="nbIterations">
            <input type="range" min="2" max="15" value={nbIterations} className="range" step="1" onChange={(e) => setNbIteration(parseInt(e.target.value, 10))} />
          </div>
          <div id="width">
            <input type="range" min="400" max="1200" value={width} className="range" step="2" onChange={(e) => setWidth(parseInt(e.target.value, 10))} />
          </div>
          <div id="height">
            <input type="range" min="400" max="1200" value={height} className="range" step="2" onChange={(e) => setHeight(parseInt(e.target.value, 10))} />
          </div>

          <button className="btn btn-secondary" onClick={() => generate(width, height, nbIterations)}>Generate</button>
        </div>
      </div>
      <Footer githubUrl={githubUrl} />
    </div>
  );
}

export default App;
