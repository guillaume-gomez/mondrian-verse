import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { CustomRect, heightRect, widthRect, randInt} from "../utils";


const colors = [
    'white',
    'white',
    'white',
    'white',
    '#2b2b2b',
    '#e90018',
    '#0e63b7',
    '#f9da00'
]

interface MondrianCanvasProps {
  width: number;
  height: number;
  thickness: number;
  rects: CustomRect[];
}

export interface ExternalActionInterface {
  getImage: () => string |null ;
}

const MondrianCanvas = forwardRef<ExternalActionInterface, MondrianCanvasProps>(({width, height, thickness, rects}, ref) => {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    function drawBorder(context : CanvasRenderingContext2D) {
      drawBorderGen(context, {x1: 0, y1: 0, x2: width, y2: height, color: "#000000"}, thickness);
    }

    if(refCanvas.current) {
      // debugging purpose
      //refCanvas.current.style.background = "purple";
      const context = refCanvas.current.getContext("2d");
      if(context) {
        context.clearRect(0,0, width, height);
        rects.forEach(rect => {
          drawRect(context, rect);
          drawBorderGen(context, rect, thickness/2);
        })
        drawBorder(context);
        
      }
    }
  }, [refCanvas, rects]);

  useImperativeHandle(ref, () => ({
    getImage() {
      if(refCanvas.current) {
        return refCanvas.current.toDataURL('image/png');
      }
      return null;
    }

  }));

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
      context.fillStyle = rect.color; /*'#' + Math.floor(Math.random()*16777215).toString(16); */
      const width = widthRect(rect);
      const height = heightRect(rect);
      const {x1, y1 } = rect;
      context.fillRect(x1, y1, width, height);
  }

  return (
    <canvas ref={refCanvas} width={width} height={height}/>
  );
});

export default MondrianCanvas;
