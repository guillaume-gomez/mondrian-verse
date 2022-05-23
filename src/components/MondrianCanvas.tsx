import React, { useRef, useEffect, useState } from 'react';
import { CustomRect, heightRect, widthRect, randInt} from "../utils";


const colors = [
    'white',
    'white',
    'white',
    'white',
    'black',
    'red',
    'blue',
    'yellow'
]

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

      const xPad = Math.floor(width * 0.1);
      const yPad = Math.floor(height * 0.1);

      const context = refCanvas.current.getContext("2d");
      if(context) {
        generateMondrian(context, {x1: 0, y1: 0, x2: width, y2: height}, xPad, yPad, 1, 5);
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

  function generateMondrian(
      context: CanvasRenderingContext2D,
      rect: CustomRect,
      xPad: number,
      yPad: number,
      depth: number = 1,
      limit: number = 1
    ) {
    // Check the level of recursion
    if (depth == limit) {
      return;
    }

    const rectsArray = splitRects(rect, xPad, yPad);
    if(rectsArray.length == 2) {
      drawRect(context, rectsArray[0]);
      drawRect(context, rectsArray[1]);

      generateMondrian(context, rectsArray[0], xPad, yPad, depth + 1, limit);
      generateMondrian(context, rectsArray[1], xPad, yPad, depth + 1, limit);
    }
  }

  function splitRects(rect: CustomRect, xPad: number, yPad: number) : [CustomRect, CustomRect] | [] {
     // Check the rectangle is enough large and tall
     const width = widthRect(rect);
     const height = heightRect(rect);
      if (width < 2 * xPad || height < 2 * yPad) {
          return [];
      }
      const { x1, x2, y1, y2 } = rect;

      // If the rectangle is wider than it's height do a left/right split
      if (width > height) {
          const x = randInt(rect.x1 + xPad, rect.x2 - xPad);
          const r1 = { x1, y1, x2: x, y2 };
          const r2 = { x1: x, y1, x2, y2 };
          return [r1, r2];
      // Else do a top/bottom split
      } else {
          const y = randInt(rect.y1 + yPad, rect.y2 - yPad);
          const r1 = { x1, y1, x2, y2: y };
          const r2 = { x1, y1: y, x2, y2 };
          return [r1, r2];
      }
  }

  function drawRect(context: CanvasRenderingContext2D, {x1, y1, x2, y2}: CustomRect) {
      context.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16); //colors[randInt(0, colors.length)]
      context.fillRect(x1, y1, x2, y2);
  }

  return (
    <canvas ref={refCanvas} width={width} height={height}/>
  );
}

export default MondrianCanvas;
