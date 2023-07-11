import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
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
  toggleFullScreen: (target: EventTarget) => void;
}

function randomBetween(min: number, max: number) : number {
  return Math.random() * (max - min + 1) + min;
}


function MondrianThreeJs({width , height, thickness, rects, toggleFullScreen} : MondrianThreeJsProps ): React.ReactElement {
  const [depthBorder, setDepthBorder] = useState<number>(0.1);
  const [hasBorder, setHasBorder] = useState<boolean>(true);
  const [vizualisation, setVizualisation] = useState<visualizationType>("basic");
  const cameraControlRef = useRef<CameraControls|null>(null);

  useEffect(() => {
    if(cameraControlRef.current) {
      if(vizualisation == "city") {
        cameraControlRef.current.setLookAt(0, -1, 1.75, 0, 0, 1, true);
      }
      else {
        cameraControlRef.current.setLookAt(0, 0, 1.5,0, 0, 0, true);
      }
    }
  }, [vizualisation, cameraControlRef])

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
        /*
          -0.5 and 0.5 in position are here to center the shape
          Offset of 1 in z to make sure the shapes are visible
        */
        return [
          (rect.x1 + x)/ width -0.5,
          -(rect.y1 +y)/height + 0.5,
          0
        ];
      }
      case "randomZ": {
        /*
          -0.5 and 0.5 in position are here to center the shape
          Offset of 1 in z to make sure the shapes are visible
        */
        return [
          (rect.x1 + x)/ width -0.5,
          -(rect.y1 +y)/height + 0.5,
          randomBetween(-0.01,0.01) - 1
        ]
      }
      case "explode":{
        const middleScreenX = (width/2);
        const middleScreenY = (height/2);
        const vx = ((rect.x1 + x) - middleScreenX);
        const vy = ((rect.y1 + y) - middleScreenY);
        //Offset of 1 in z to make sure the shapes are visible
        return [
          (rect.x1 + x + vx)/ width -0.5,
          -(rect.y1 + y + vy)/height + 0.5,
          randomBetween(-0.01,0.01) -1 ];
      }
      case "cubist": {
        return [
          (rect.x1 + x)/ width -0.5,
          -(rect.y1 +y)/height + 0.5,
          depth/2 - depthBorder/2
        ]
      }
    case "city": {
        const forRotation = 0.80;
        return [
          (rect.x1 + x)/ width -0.5,
          -(rect.y1 +y)/height + 0.5 ,
           depth/2 - depthBorder/2 + forRotation
        ]
      }
    }
  }

  return (
  <div className="flex flex-col justify-center items-center gap-2">
    <Canvas
      camera={{ position:  [0,0,1.5], fov: 75, far: 5 }}
      dpr={window.devicePixelRatio}
      style={{width, height }}
      onDoubleClick={(event: any) => {
        // trick to override canvas background color
        event.target.style.background="#313131";
        toggleFullScreen(event.target)
      }}
    >
      <color attach="background" args={[0x797979]} />
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
      <CameraControls
          ref={cameraControlRef}
          minPolarAngle={Math.PI/8}
          maxPolarAngle={Math.PI}
          minAzimuthAngle={-Math.PI / 1.8}
          maxAzimuthAngle={Math.PI / 1.8}
          minDistance={0.09}
          maxDistance={4}
      />
    </Canvas>
    <div className="flex flex-col gap-4" style={{width}}>
      <div className="flex flex-col md:flex-row justify-between">
        <VisualizationSelect visualization={vizualisation} onChange={(vizualisation) => setVizualisation(vizualisation)} />
        <HasBorder  hasBorder={hasBorder} onChange={setHasBorder}/>
      </div>
      <div className="dropdown dropdown-hover">
        <label tabIndex={0} className="btn btn-sm">Help ?</label>
        <div tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box list-disc">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Controls</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>

              <tr>
                <th>Left Click </th>
                <td>Rotate Camera</td>
              </tr>

              <tr>
                <th>Wheel Scroll</th>
                <td>Zoom In/Out</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
}

export default MondrianThreeJs;