import React from 'react';
import { useThree } from '@react-three/fiber';
import { CustomRect } from "../../utils";
import Border from "./Border";

interface BordersProps {
  rects: CustomRect[];
  thickness: number;
}

function Borders({rects, thickness }: BordersProps) {
  const { size: { width, height } } = useThree();

  return (
   <group
     position={[-0.5, 0.5, 0]}
   >
      {rects.map((rect, index) => <Border key={index} rect={rect} thickness={thickness} />) }
      <Border key={"paintingBorder"} rect={{x1: 0, y1: 0, x2: width, y2: height, color: "#000000"}} thickness={thickness}/>
   </group>
  )
}

export default Borders;