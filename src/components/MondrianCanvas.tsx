import React, { useRef, useEffect, useState } from 'react';
import useMondrian from "../hooks/useMondrian";
import { CustomRect, heightRect, widthRect, randInt} from "../utils";


const colors = [
    'white',
    'white',
    'white',
    'white',
    //'black',
    '#e90018',
    '#0e63b7',
    '#f9da00'
]

interface MondrianCanvasProps {
  width?: number;
  height?: number;
  thickness?: number;
}

function MondrianCanvas({width = 800, height = 800, thickness= 10} : MondrianCanvasProps) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const { generate } = useMondrian();
  useEffect(() => {
    if(refCanvas.current) {
      // debugging purpose
      //refCanvas.current.style.background = "purple";

      const xPad = Math.floor(width * 0.1);
      const yPad = Math.floor(height * 0.1);

      const context = refCanvas.current.getContext("2d");
      if(context) {
        context.clearRect(0,0, width, height);
        const reacts = generate(width, height, xPad, yPad);
        reacts.forEach(rect => {
          drawRect(context, rect);
          drawBorderGen(context, rect, thickness/2);
        })
        drawBorder(context);
        
      }
    }
  }, [refCanvas]);

  function drawBorder(context : CanvasRenderingContext2D) {
    drawBorderGen(context, {x1: 0, y1: 0, x2: width, y2: height}, thickness);
  }

  function drawBorderGen(context: CanvasRenderingContext2D, rect: CustomRect, thickness: number ) {
    const width = widthRect(rect);
    const height = heightRect(rect);
    const { x1, y1, x2, y2 } = rect;

    context.fillStyle = "black";
    context.fillRect(x1, y1, width, thickness);
    context.fillRect(x1, y2 - thickness, width, thickness);

    context.fillRect(x1, y1, thickness, height);
    context.fillRect(x2 - thickness, y1, thickness, height);
  }

  function drawRect(context: CanvasRenderingContext2D, rect: CustomRect) {
      context.fillStyle = colors[randInt(0, colors.length)]; /*'#' + Math.floor(Math.random()*16777215).toString(16); */
      const width = widthRect(rect);
      const height = heightRect(rect);
      const {x1, y1 } = rect;
      context.fillRect(x1, y1, width, height);
  }

  return (
    <canvas ref={refCanvas} width={width} height={height}/>
  );
}

export default MondrianCanvas;
