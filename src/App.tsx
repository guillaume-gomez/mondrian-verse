import React, { useState, useEffect, useRef } from 'react';
import { format } from "date-fns";
import { useFullscreen } from "rooks";
import './App.css';
import useMondrian from "./hooks/useMondrian";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import SliderWithLabel from "./components/SliderWithLabel";
import MondrianCanvas, { ExternalActionInterface } from "./components/MondrianCanvas";
import MondrianThreeJs from "./components/MondrianThreeJs";
import { useWindowSize } from "rooks";

const githubUrl = "https://github.com/guillaume-gomez/mondrian-verse";

function App() {
  const { innerWidth } = useWindowSize();
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(800);
  const [nbIterations, setNbIteration] = useState<number>(3);
  const [thickness, setThickness] = useState<number>(10);
  const [enableBlack, setEnableBlack] = useState<boolean>(true);
  const [mode, setMode] = useState<"2d"|"3d">("2d");
  const { generate, rects, setHasBlack } = useMondrian();
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasActionsRef = useRef<ExternalActionInterface| null>(null);
  const refSave = useRef<HTMLAnchorElement>(null);
    const {
    toggle,
    isFullscreen,
    element,
  } = useFullscreen();

  useEffect(() => {
    generate(width, height, nbIterations);
  }, [/*generate*/width, height, nbIterations, enableBlack]);
  // adding generate create a pleaseant glitch :p

  useEffect(() => {
    if(canvasContainerRef.current && canvasContainerRef.current.offsetWidth <= width) {
      setWidth(canvasContainerRef.current.offsetWidth - 50);
      setHeight(canvasContainerRef.current.offsetWidth - 50);
    }
  }, [innerWidth, canvasContainerRef])

  function resetDefaultValues() {
    setWidth(800);
    setHeight(800);
    setNbIteration(3);
    setThickness(10);
    setEnableBlack(true);
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
      <div className="flex flex-col justify-center gap-5 py-5">
        <div
          ref={canvasContainerRef}
          className="flex flex-col w-3/4 mx-auto card bg-base-300 p-2"
          style={{overflow: "visible"}}
        >
          <div className="flex flex-col justify-center items-center">
            { mode === "3d" ?
              <MondrianThreeJs
                width={width}
                height={height}
                thickness={thickness}
                rects={rects}
                toggleFullScreen={(target) => toggle(target as any)}
              />
              :
              <MondrianCanvas
                ref={canvasActionsRef}
                width={width}
                height={height}
                thickness={thickness}
                rects={rects}
                toggleFullScreen={(target) => toggle(target as any)}
              />
            }
          </div>
          <div className="form-control self-end">
              <label className="label cursor-pointer gap-2">
              <span className="label-text">3D Version</span>
              <input type="checkbox" className="toggle" checked={mode === "3d"} onChange={() => setMode(mode === "3d" ? "2d" : "3d")} />
            </label>
          </div>
        </div>
        <div className="w-2/4 mx-auto">
          <div className="flex flex-col justify-center gap-5">
            <button className="btn btn-secondary btn-lg" onClick={() => generate(width, height, nbIterations)}> Regenerate</button>
            <SliderWithLabel label="Thickness" min={2} max={100} value={thickness} step={2} onChange={(value) => setThickness(parseInt(value))}/>
            <SliderWithLabel label="Nb Iteration" min={2} max={15} value={nbIterations} step={1} onChange={(value) => setNbIteration(parseInt(value))}/>
            <SliderWithLabel label="Width" min={200} max={1200} value={width} step={5} onChange={(value) => setWidth(parseInt(value))}/>
            <SliderWithLabel label="Height" min={200} max={1200} value={height} step={5} onChange={(value) => setHeight(parseInt(value))}/>
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <span className="label-text">Has Black as possible colors</span>
                <input type="checkbox" className="toggle" checked={enableBlack} onChange={() => {setHasBlack(!enableBlack); setEnableBlack(!enableBlack)}} />
              </label>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={resetDefaultValues}> Set Default Values</button>
            <div
              className={`flex flex-row self-end ${mode === "3d" ? "tooltip" : ""}`}
              data-tip={mode === "3d" ? "Screenshot is not possible in 3D mode" : ""}
            >
              <a ref={refSave} className={`btn btn-accent ${mode === "3d" ? "btn-disabled" : ""}`} onClick={saveImage}>Save</a>
            </div>
          </div>
         </div>
      </div>
      <Footer githubUrl={githubUrl} />
    </div>
  );
}

export default App;
