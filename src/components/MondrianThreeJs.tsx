import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import Borders from "./ThreeComponents/Borders";
import ColoredBox from "./ThreeComponents/ColoredBox";
import { CustomRect } from "../utils";

interface MondrianThreeJsProps {
  width: number;
  height: number;
  thickness: number;
  rects: CustomRect[];
}

type visualizationType = "basic"| "no-bordered" | "bordered"| "explode"| "cubist";

function MondrianThreeJs({width , height, thickness, rects} : MondrianThreeJsProps ): React.ReactElement {
  const [depthColoredBox, setDepthColoredBox] = useState<number>(0.1);
  const [depthBorder, setDepthBorder] = useState<number>(0.1);
  const [hasBorder, setHasBorder] = useState<boolean>(true);
  const [vizualisation, setVizualisation] = useState<visualizationType>("basic");

  useEffect(() =>{
    switch(vizualisation) {
      case "no-bordered": {
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
      default:
      {
        setDepthBorder(0.1);
        setHasBorder(true);
        break;
      }
      case "explode":{
        setHasBorder(false);
      }
    }
  }, [vizualisation, setDepthBorder])


  // vue explode
  // vue border plus grande
  // vue de l'algo 3D
  return (
     <>
     <div className="flex flex-col gap-4">
       <select className="select w-full max-w-xs" onChange={(event) => setVizualisation(event.target.value as visualizationType)}>
        <option disabled selected>Pick your vizualisation</option>
        <option value="basic">Basic</option>
        <option value="bordered">Bordered</option>
        <option value="no-bordered">No Bordered</option>
        <option value="explode">Explode</option>
        <option value="cubist">Cubist</option>
      </select>
     </div>
     <Canvas  camera={{ position: [-0.15, 0.15, 0.90], fov: 75 }} style={{background: "#191D24", width, height }}>
        { hasBorder && <Borders rects={rects} thickness={thickness} depth={depthBorder} /> }
        {
          rects.map((rect, index) => <ColoredBox key={index} rect={rect} thickness={thickness} depth={depthColoredBox} /*meshProps={{position: [Math.random(), Math.random(), 0]}}*/ />)
        }
        {/*
        <axesHelper args={[2]} />
        <gridHelper/>
        */}
        <ambientLight args={[0xffffff]} intensity={0.5} position={[0, 0.5, 0.5]} />
        <directionalLight position={[0, 0, 5]} intensity={0.5} />
    <OrbitControls />
  </Canvas>
  </>
  );
}

export default MondrianThreeJs;