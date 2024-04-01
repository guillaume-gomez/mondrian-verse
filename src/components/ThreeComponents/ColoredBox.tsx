import React, { useMemo, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { CustomRect, heightRect, widthRect } from "../../utils";


interface ColoredBoxProps {
  width: number;
  height: number;
  rect: CustomRect;
  depth: number;
  thickness: number;
  meshProps: JSX.IntrinsicElements['mesh'];
}

function ColoredBox({width, height,rect, thickness, depth, meshProps}: ColoredBoxProps) {
  const widthGeometry = useMemo(() => (widthRect(rect) - thickness) , [rect, thickness]);
  const heightGeometry = useMemo(() => (heightRect(rect) - thickness) , [rect, thickness]);
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

  console.log(rect);

  return (
    <animated.mesh position={[rect.x1 + widthRect(rect)/2, -(rect.y1 + heightRect(rect)/2), 0]} >
      <boxGeometry args={[(widthRect(rect) - thickness), (heightRect(rect) - thickness), depth]} />
      <meshStandardMaterial color={rect.color} wireframe={true}/>
    </animated.mesh>
  )
}

export default ColoredBox;