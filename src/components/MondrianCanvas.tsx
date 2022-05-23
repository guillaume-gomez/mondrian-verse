import React, { useRef, useEffect, useState } from 'react';

interface CustomRect{
  x: number;
  y: number;
  x1: number;
  y1: number;
}

interface MondrianCanvasProps {
  width?: number;
  height?: number;
  thickness?: number;

}

function MondrianCanvas({width = 800, height = 800, thickness= 10} : MondrianCanvasProps) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const [rects, setRects] = useState<CustomRect[]>([]);

  useEffect(() => {
    if(refCanvas.current) {
      refCanvas.current.style.background = "white";
      const context = refCanvas.current.getContext("2d");
      if(context) {
        drawBorder(context);
      }
    }
  }, [refCanvas]);

  function drawBorder(context : CanvasRenderingContext2D) {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, thickness);
    context.fillRect(0, height - thickness, width, thickness);

    context.fillRect(0, 0, thickness, height);
    context.fillRect(width - thickness, 0, width, height);

  }

  function generateMondrian(x1: number, y1: number, x2: number, y2: number, depth: number = 1) {
    
  }

  function drawSquare()
  {

  }

  return (
    <canvas ref={refCanvas} width={width} height={height}/>
  );
}

export default MondrianCanvas;
