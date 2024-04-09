import React, { useMemo, useEffect } from 'react';
import { usePreviousDifferent } from "rooks";
import { useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { CustomRect, heightRect, widthRect } from "../../utils";


interface ColoredBoxProps {
  width: number;
  height: number;
  rect: CustomRect;
  depth: number;
  thickness: number;
  //meshProps: JSX.IntrinsicElements['mesh'];
  position: [number, number, number]
}

function ColoredBox({width, height,rect, thickness, depth, position: targetPosition}: ColoredBoxProps) {
  const widthGeometry = useMemo(() => (widthRect(rect) - thickness) , [rect, thickness]);
  const heightGeometry = useMemo(() => (heightRect(rect) - thickness) , [rect, thickness]);

  const previousValuePosition = usePreviousDifferent(targetPosition);

  const spring = useSpring({
    from: {  position: previousValuePosition },
    to  : { position: targetPosition },
    config: { mass: 5, tension: 500, friction: 150, precision: 0.0001 },
    reset: true,
  });

  // any is for https://github.com/pmndrs/react-spring/discussions/1523
  return (
    <animated.mesh position={spring.position as any} > 
      <boxGeometry args={[widthGeometry, heightGeometry, depth]} />
      <meshStandardMaterial color={rect.color} wireframe={false}/>
    </animated.mesh>
  )
}

export default ColoredBox;