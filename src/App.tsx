import React, { useState, useEffect } from 'react';
import './App.css';
import useMondrian from "./hooks/useMondrian";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import SliderWithLabel from "./components/SliderWithLabel";
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
  }, [/*generate*/width, height, nbIterations, thickness]);
  // adding generate create a pleaseant glitch :p
  
  return (
    <div>
      <header>
          <NavBar githubUrl={githubUrl} />
      </header>
      <div className="flex flex-col justify-center items-center gap-5 py-5">
        <MondrianCanvas width={width} height={height} thickness={thickness} rects={rects} />
        <div className="w-2/4 ">
          <div className="flex flex-col justify-center gap-5">
            <button className="btn btn-secondary" onClick={() => generate(width, height, nbIterations)}> Re Generate</button>
            <SliderWithLabel label="Thickness" min={2} max={100} value={thickness} step={2} onChange={(value) => setThickness(parseInt(value))}/>
            <SliderWithLabel label="Nb Iteration" min={2} max={15} value={nbIterations} step={1} onChange={(value) => setNbIteration(parseInt(value))}/>
            <SliderWithLabel label="Width" min={400} max={1200} value={thickness} step={5} onChange={(value) => setWidth(parseInt(value))}/>
            <SliderWithLabel label="Height" min={400} max={1200} value={thickness} step={5} onChange={(value) => setHeight(parseInt(value))}/>
          </div>
         </div>
      </div>
      <Footer githubUrl={githubUrl} />
    </div>
  );
}

export default App;
