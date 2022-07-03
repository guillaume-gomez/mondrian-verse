import React, { useMemo, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { CustomRect, heightRect, widthRect } from "../../utils";


interface ColoredBoxProps {
  rect: CustomRect;
  depth: number;
  thickness: number;
  meshProps: JSX.IntrinsicElements['mesh'];
}

function ColoredBox({rect, thickness, depth, meshProps}: ColoredBoxProps) {
  const { size: { width, height } } = useThree();
  const widthGeometry = useMemo(() => (widthRect(rect) - thickness)/ width  , [rect, width, thickness]);
  const heightGeometry = useMemo(() => (heightRect(rect) - thickness)/ height , [rect, height, thickness]);
  const [{ position }, api] = useSpring<any>(() =>({
    from: meshProps.position,
    position: meshProps.position,
    config: { mass: 5, tension: 500, friction: 150, precision: 0.0001 }
  }))
  useEffect(() => {
    api.start({ to: {position: meshProps.position}})
  }, [meshProps, api])

  return (
    <animated.mesh position={position as any} >
      <boxGeometry args={[widthGeometry, heightGeometry, depth]} />
      <meshStandardMaterial color={rect.color} wireframe={false}/>
    </animated.mesh>
  )
}

export default ColoredBox;