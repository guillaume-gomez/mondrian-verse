import React, { useState } from 'react';
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

function MondrianThreeJs({width , height, thickness, rects} : MondrianThreeJsProps ): React.ReactElement {
  const [depthColoredBox, setDepthColoredBox] = useState<number>(0.1);
  const [depthBorder, setDepthBorder] = useState<number>(0.1);

  // vue explode
  // vue border plus grande
  // vue de l'algo 3D
  return (
     <>
     <Canvas  camera={{ position: [-0.15, 0.15, 0.90], fov: 75 }} style={{background: "#191D24", width, height }}>
        <Borders rects={rects} thickness={thickness} depth={depthBorder} />
        {
          rects.map((rect, index) => <ColoredBox key={index} rect={rect} thickness={thickness} depth={depthColoredBox} />)
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