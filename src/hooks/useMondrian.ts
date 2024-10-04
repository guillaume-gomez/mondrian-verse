import { useState } from 'react'; 
import { CustomRect, heightRect, widthRect, randInt } from "../utils";

export const BlackColor = "#2b2b2b";
export const RedColor = "#e90018";
export const BlueColor = "#0e63b7";
export const YellowColor = "#f9da00";
export const WhiteColor = "white";

export type possibleColorsType = "#2b2b2b"|"#e90018"|"#0e63b7"|"#f9da00"|"white";

const possibleColors = [
    BlackColor,
    RedColor,
    BlueColor,
    YellowColor
]

const defaultColors = [
    WhiteColor,
    WhiteColor,
    WhiteColor,
    WhiteColor,
    ...possibleColors
];

const Phi = 1.618003987;

function useMondrian() {
  const [rects, setRects] = useState<CustomRect[]>([]);
  const [colors, setColors] = useState<string[]>(defaultColors);


  function generateMondrian(
      rect: CustomRect,
      xPad: number,
      yPad: number,
      accRects: CustomRect[],
      depth: number = 0,
      limit: number = 1,
    ) {
    if (depth === limit) {
      // dangerous :)
      accRects.push(rect);
      return;
    }

    const rectsArray = splitRects(rect, xPad, yPad);
    if(rectsArray.length === 2) {
      generateMondrian(rectsArray[0], xPad, yPad, accRects, depth + 1, limit);
      generateMondrian(rectsArray[1], xPad, yPad, accRects, depth + 1, limit);
    } else {
      accRects.push(rect);
    }
  }

  function generateMondrianGoldenSquare(
      rect: CustomRect,
      xPad: number,
      yPad: number,
      accRects: CustomRect[],
      depth: number = 0,
      limit: number = 1
  ) {
      if (depth === limit) {
        // dangerous :)
        accRects.push(rect);
        return;
      }

      if(limit === 1) {
        // initial step
        const rectsArray = splitRects(rect, xPad, yPad);
        if(rectsArray.length === 2) {
          generateMondrianGoldenSquare(rectsArray[0], xPad, yPad, accRects, depth + 1, limit);
          generateMondrianGoldenSquare(rectsArray[1], xPad, yPad, accRects, depth + 1, limit);
        } else {
          accRects.push(rect);
        }
      } else {
        const rectsArray = splitRectsGoldenSquare(rect, xPad, yPad);
        if(rectsArray.length === 2 ) {
          generateMondrianGoldenSquare(rectsArray[0], xPad, yPad, accRects, depth + 1, limit);
          generateMondrianGoldenSquare(rectsArray[1], xPad, yPad, accRects, depth + 1, limit);
        } else {
          accRects.push(rect);
        }
      }
  }

    function splitRectsGoldenSquare(rect: CustomRect, xPad: number, yPad: number) : [CustomRect, CustomRect] | [] {
     // Check the rectangle is enough large and tall
     const width = widthRect(rect);
     const height = heightRect(rect);
      if (width < 2 * xPad || height < 2 * yPad) {
          return [];
      }
      const { x1, x2, y1, y2 } = rect;


      // If the rectangle is wider than it's height do a left/right split
      if (width > height) {
          const x = Math.ceil(width / Phi);
          const r1 = { x1, y1, x2: cut, y2, color: randomColor() };
          const r2 = { x1: cut, y1, x2, y2, color: randomColor() };
          return [r1, r2];
      // Else do a top/bottom split
      } else {
          const y = Math.ceil(height / Phi);
          const r1 = { x1, y1, x2, y2: cut, color: randomColor() };
          const r2 = { x1, y1: cut, x2, y2, color: randomColor() };
          return [r1, r2];
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
          const r1 = { x1, y1, x2: x, y2, color: randomColor() };
          const r2 = { x1: x, y1, x2, y2, color: randomColor() };
          return [r1, r2];
      // Else do a top/bottom split
      } else {
          const y = randInt(rect.y1 + yPad, rect.y2 - yPad);
          const r1 = { x1, y1, x2, y2: y, color: randomColor() };
          const r2 = { x1, y1: y, x2, y2, color: randomColor() };
          return [r1, r2];
      }
  }


  function generate(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    // magic number to avoid to little rects
    const xPad = Math.max(10, canvasWidth * 0.01);
    const yPad = Math.max(10, canvasHeight * 0.01);
    let accRects : CustomRect[] = [];
    generateMondrian(
       {x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight, color: "#000000"},
       xPad,
       yPad,
       accRects,
       0,
       nbIterations
      );
    setRects(accRects.slice());
    return accRects;
  }

  function randomColor() {
    return colors[randInt(0, colors.length)];
  }

  function setHasBlack(hasBlack: boolean) {
    const newColors = 
      hasBlack ?
        defaultColors :
        [
          WhiteColor,
          WhiteColor,
          WhiteColor,
          WhiteColor,
          RedColor,
          BlueColor,
          YellowColor
        ]
   ;
    setColors(newColors);
  }

  return { generate, rects, setHasBlack };

}

export default useMondrian;