import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { OrbitControls } from '@react-three/drei';
import Borders from "./ThreeComponents/Borders";
import ColoredBox from "./ThreeComponents/ColoredBox";
import VisualizationSelect, { visualizationType } from "./VisualizationSelect";
import HasBorder from "./HasBorderInput";
import { CustomRect, centerRect } from "../utils";
import { possibleColorsType, BlackColor, RedColor, BlueColor, YellowColor, WhiteColor } from "../hooks/useMondrian";

interface MondrianThreeJsProps {
  width: number;
  height: number;
  thickness: number;
  rects: CustomRect[];
}

function randomBetween(min: number, max: number) : number {
  return Math.random() * (max - min + 1) + min;
}


function MondrianThreeJs({width , height, thickness, rects} : MondrianThreeJsProps ): React.ReactElement {
  const [depthBorder, setDepthBorder] = useState<number>(0.1);
  const [hasBorder, setHasBorder] = useState<boolean>(true);
  const [vizualisation, setVizualisation] = useState<visualizationType>("basic");
  const {
    toggle,
    element,
  } = useFullscreen();

  function computeBorderByColor(color: possibleColorsType) : number {
    if((vizualisation !== "color-bordered") && (vizualisation !== "cubist")) {
      // Math.random to avoid z-fighting
      return 0.1 + Math.random() * 0.001;
    }

    switch(color) {
      case BlackColor:
        return 0.1;
      case RedColor:
        return 0.3;
      case BlueColor:
        return 0.4;
      case YellowColor:
        return 0.5;
      case WhiteColor:
        return 0.2;
      default:
        // Math.random to avoid z-fighting
        return 0.1 + Math.random() * 0.001;
    }
  }

  useEffect(() => {
    switch(vizualisation) {
      case "randomZ": {
        setHasBorder(false);
        break;
      }
      case "bordered":
      {
        setDepthBorder(0.2);
        setHasBorder(true);
        break;
      }
      case "cubist":
      case "basic":
      case "color-bordered":
      default:
      {
        setDepthBorder(0.1);
        setHasBorder(true);
        break;
      }
      case "explode":{
        setHasBorder(false);
        break;
      }
    }
  }, [vizualisation, setDepthBorder]);

  function computePosition(rect: CustomRect, depth: number) : [number, number, number] {
    const [x, y] = centerRect(rect);
    switch(vizualisation) {
      case "color-bordered":
      case "bordered":
      case "basic":
      default: {
        /* -0.5 and 0.5 in position are here to center the shape*/
        return [
          (rect.x1 + x)/ width -0.5,
          -(rect.y1 +y)/height + 0.5,
          0
        ];
      }
      case "randomZ": {
        /* -0.5 and 0.5 in position are here to center the shape*/
        return [
          (rect.x1 + x)/ width -0.5,
          -(rect.y1 +y)/height + 0.5,
          randomBetween(-0.01,0.01)
        ]
      }
      case "explode":{
        const middleScreenX = (width/2);
        const middleScreenY = (height/2);
        const vx = ((rect.x1 + x) - middleScreenX);
        const vy = ((rect.y1 + y) - middleScreenY);
        return [(rect.x1 + x + vx)/ width -0.5, -(rect.y1 + y + vy)/height + 0.5, randomBetween(-0.01,0.01)];
      }
      case "cubist": {
        return [
          (rect.x1 + x)/ width -0.5,
          -(rect.y1 +y)/height + 0.5,
          depth/2 - depthBorder/2
        ]
      }
    }
  }

  return (
  <div className="flex flex-col justify-center items-center gap-2">
    <Canvas
      camera={{ position: [-0.15, 0.15, 2], fov: 75, far: 5 }}
      dpr={window.devicePixelRatio}
      style={{width, height }}
      onDoubleClick={e => toggle(e.target as any)}
    >
      <color attach="background" args={[0x595959]} />
      { hasBorder && <Borders rects={rects} thickness={thickness} depth={depthBorder} /> }
      {
        rects.map((rect, index) => {
          const depth = computeBorderByColor(rect.color as possibleColorsType);
          return (
            <ColoredBox
              key={index}
              rect={rect}
              thickness={thickness}
              depth={depth}
              meshProps={{position: computePosition(rect, depth)}}
            />
          );
        })
      }
      <ambientLight args={[0xffffff]} intensity={0.5} position={[0, 0.5, 0.5]} />
      <directionalLight position={[0, 0, 5]} intensity={0.5} />
      <OrbitControls makeDefault />
    </Canvas>
    <div className="flex flex-col gap-4">
      <VisualizationSelect visualization={vizualisation} onChange={(vizualisation) => setVizualisation(vizualisation)} />
      <HasBorder  hasBorder={hasBorder} onChange={setHasBorder}/>
      <div>
        <p>Controls</p>
        <ul>
          <li>Double click to full screen</li>
          <li>Click to rotate the camera</li>
          <li>Scroll Wheel to zoom in/out</li>
        </ul>
      </div>

    </div>
  </div>
  );
}

export default MondrianThreeJs;