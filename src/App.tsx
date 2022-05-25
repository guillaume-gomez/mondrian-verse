import React, { useState, useEffect, useRef } from 'react';
import { format } from "date-fns";
import './App.css';
import useMondrian from "./hooks/useMondrian";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import SliderWithLabel from "./components/SliderWithLabel";
import MondrianCanvas, { ExternalActionInterface } from "./components/MondrianCanvas";

const githubUrl = "https://github.com/guillaume-gomez/mondrian-verse";

function App() {
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(800);
  const [nbIterations, setNbIteration] = useState<number>(3);
  const [thickness, setThickness] = useState<number>(10);
  const { generate, rects } = useMondrian();
  
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const refSave = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    generate(width, height, nbIterations);
  }, [/*generate*/width, height, nbIterations, thickness]);
  // adding generate create a pleaseant glitch :p

  function resetDefaultValues() {
    setWidth(800);
    setHeight(800);
    setNbIteration(3);
    setThickness(10)
  }

  function saveImage() {
    if(canvasActionsRef.current && refSave.current) {
      const dataUrl = canvasActionsRef.current.getImage();
      if(dataUrl) {
         const dateString = format(new Date(), "dd-MM-yyyy-hh-mm");
        (refSave.current as any).download = `${dateString}-mondrian.png`;
        refSave.current.href = dataUrl.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      }
    }
  }
  
  return (
    <div>
      <header>
          <NavBar githubUrl={githubUrl} />
      </header>
      <div className="flex flex-col justify-center items-center gap-5 py-5">
        <MondrianCanvas ref={canvasActionsRef} width={width} height={height} thickness={thickness} rects={rects} />
        <div className="w-1/4 ">
          <div className="flex flex-col justify-center gap-5">
            <button className="btn btn-secondary btn-lg" onClick={() => generate(width, height, nbIterations)}> Regenerate</button>
            <SliderWithLabel label="Thickness" min={2} max={100} value={thickness} step={2} onChange={(value) => setThickness(parseInt(value))}/>
            <SliderWithLabel label="Nb Iteration" min={2} max={15} value={nbIterations} step={1} onChange={(value) => setNbIteration(parseInt(value))}/>
            <SliderWithLabel label="Width" min={400} max={1200} value={width} step={5} onChange={(value) => setWidth(parseInt(value))}/>
            <SliderWithLabel label="Height" min={400} max={1200} value={height} step={5} onChange={(value) => setHeight(parseInt(value))}/>
            <button className="btn btn-secondary btn-xs" onClick={resetDefaultValues}> Set Default Values</button>
            <div className="flex flex-row self-end">
              <a ref={refSave} className="btn btn-primary" onClick={saveImage}>Save</a>
            </div>
          </div>
         </div>
      </div>
      <Footer githubUrl={githubUrl} />
    </div>
  );
}

export default App;
