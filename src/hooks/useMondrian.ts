import { useState } from 'react'; 
import { CustomRect, heightRect, widthRect, randInt} from "../utils";

function useMondrian() {
  const [rects, setRects] = useState<CustomRect[]>([]);


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
      //drawRect(context, rectsArray[0]);
      //drawRect(context, rectsArray[1]);
      //drawBorderGen(context, rectsArray[0], thickness/2);
      //drawBorderGen(context, rectsArray[1], thickness/2);
      generateMondrian(rectsArray[0], xPad, yPad, accRects, depth + 1, limit);
      generateMondrian(rectsArray[1], xPad, yPad, accRects, depth + 1, limit);
    } else {
      accRects.push(rect);
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


  function generate(canvasWidth: number, canvasHeight: number, nbIterations: number = 3) {
    // magic number to avoid to little rects
    const xPad = canvasWidth * 0.1;
    const yPad = canvasHeight * 0.1;
    let accRects : CustomRect[] = [];
    generateMondrian(
       {x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight},
       xPad,
       yPad,
       accRects,
       0,
       nbIterations
      );
    setRects(accRects.slice());
    return accRects;
  }




  return { generate, rects };

}

export default useMondrian;