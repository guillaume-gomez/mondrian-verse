import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid, Stage } from '@react-three/drei';
import Borders from "./ThreeComponents/Borders";
import ColoredBox from "./ThreeComponents/ColoredBox";
import VisualizationSelect, { visualizationType } from "./VisualizationSelect";
import HasBorder from "./HasBorderInput";
import { CustomRect, centerRect, widthRect, heightRect } from "../utils";
import { possibleColorsType, BlackColor, RedColor, BlueColor, YellowColor, WhiteColor } from "../hooks/useMondrian";
import Help3D from "./Help3D";
import { useFullscreen } from "rooks";
import { useDoubleTap } from 'use-double-tap';

interface MondrianThreeJsProps {
  width: number;
  height: number;
  thickness: number;
  rects: CustomRect[];
}

function randomBetween(min: number, max: number) : number {
  return Math.random() * (max - min + 1) + min;
}

const SCALE = 1000;

function MondrianThreeJs({width , height, thickness, rects} : MondrianThreeJsProps ): React.ReactElement {
  const [depthBorder, setDepthBorder] = useState<number>(0.1);
  const [hasBorder, setHasBorder] = useState<boolean>(true);
  const [vizualisation, setVizualisation] = useState<visualizationType>("basic");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerCanvas = useRef<HTMLDivElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: containerCanvas });
  const doubleTapEvent = useDoubleTap(() => {
      toggleFullscreen();
  });
  const cameraControlRef = useRef<CameraControls|null>(null);
  const ratio = Math.max(width, height)/600;

  useEffect(() => {
    if(cameraControlRef.current) {
      if(vizualisation === "city") {
        cameraControlRef.current.setLookAt(0, -Math.PI/4  * ratio, Math.PI/4, 0, 0.1, 0, true);
      }
      else if(
        vizualisation === "color-bordered" ||
        vizualisation === "randomZ" ||
        vizualisation === "explode" ||
        vizualisation === "cubist"
        ) {
        cameraControlRef.current.setLookAt(0, 0, 1.0 * ratio ,0, 0, 0, true);
      }
      else {
        cameraControlRef.current.setLookAt(0, 0, 0.5 * ratio,0, 0, 0, true);
      }
    }
  }, [vizualisation, cameraControlRef, width, height])

  function computeBorderByColor(color: possibleColorsType) : number {
    if(["basic","bordered", "randomZ", "explode"].includes(vizualisation)) {
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
      case "city":
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
        return [
          rect.x1 + x,
          -(rect.y1 + y),
          0
        ];
      }
      case "randomZ": {
        return [
          rect.x1 + x,
          -(rect.y1 + y),
          (randomBetween(-0.01,0.01) - 0.5) * SCALE
        ];
      }
      case "explode":{
        const middleScreenX = (width/2);
        const middleScreenY = (height/2);
        const vx = ((rect.x1 + x) - middleScreenX);
        const vy = ((rect.y1 + y) - middleScreenY);
        //Offset of 1 in z to make sure the shapes are visible
        return [
          (rect.x1 + x + vx),
          -(rect.y1 + y + vy),
          randomBetween(-0.01,0.01) -1 ];
      }
      case "cubist": {
        return [
          (rect.x1 + x),
          -(rect.y1 +y),
          depth/2 - depthBorder/2
        ]
      }
    case "city": {
        return [
          (rect.x1 + x),
          -(rect.y1 +y),
          depth/2 - depthBorder/2
        ]
      }
    }
  }

  return (
  <div className="flex flex-col justify-center items-center gap-2 w-5/6 h-full">
    <div
      className="w-full h-screen-responsive hover:cursor-grab"
      ref={containerCanvas}
      {...doubleTapEvent}
    >
      <Canvas
        ref={canvasRef}
        camera={{ position:  [0, 0, ratio * 0.5], fov: 75, far: 5 }}
        dpr={window.devicePixelRatio}
      >
        <color attach="background" args={[0x797979]} />
        { import.meta.env.MODE === "development" && <Grid />}
        <Stage adjustCamera={false}>
          <group scale={1/SCALE} position={[-((width/2)/SCALE), (height/2)/SCALE, 0]}>
            { hasBorder && <Borders rects={rects} thickness={thickness} depth={depthBorder * SCALE} width={width} height={height} /> }
            {
              rects.map((rect, index) => {
                const depth = computeBorderByColor(rect.color as possibleColorsType) * SCALE;
                return (
                  <ColoredBox
                    width={width}
                    height={height}
                    key={index}
                    rect={rect}
                    thickness={thickness}
                    depth={depth}
                    position={computePosition(rect, depth)}
                  />
                );
              })
            }
          </group>
          <ambientLight args={[0xffffff]} intensity={0.5} position={[0, 0.5, 0.5]} />
          <directionalLight position={[0, 0, 5]} intensity={1} />
          <CameraControls
              ref={cameraControlRef}
              minPolarAngle={Math.PI/8}
              maxPolarAngle={Math.PI}
              minAzimuthAngle={-Math.PI / 1.8}
              maxAzimuthAngle={Math.PI / 1.8}
              minDistance={0.09}
              maxDistance={4}
          />
        </Stage>
      </Canvas>
    </div>
    <p className="text-xs italic">Double click/tap on the canvas to go full screen</p>
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
        <VisualizationSelect visualization={vizualisation} onChange={(vizualisation) => setVizualisation(vizualisation)} />
        <HasBorder  hasBorder={hasBorder} onChange={setHasBorder}/>
        </div>
        <Help3D />
      </div>
    </div>
  </div>
  );
}

export default MondrianThreeJs;