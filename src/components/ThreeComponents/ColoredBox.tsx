import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { CustomRect, heightRect, widthRect, centerRect } from "../../utils";

interface ColoredBoxProps {
  rect: CustomRect;
  depth: number;
  thickness: number;
  meshProps?: JSX.IntrinsicElements['mesh'];
}

function ColoredBox({rect, thickness, depth, meshProps}: ColoredBoxProps) {
  const { size: { width, height } } = useThree();
  const widthGeometry = useMemo(() => (widthRect(rect) - thickness)/ width  , [rect, width]);
  const heightGeometry = useMemo(() => (heightRect(rect) - thickness)/ height , [rect, height]);
  const [x, y] = useMemo(() => centerRect(rect), [rect]);
  /* -0.5 and 0.5 in position are here to center the shape*/
  return (
    
    <mesh
      position={[
        (rect.x1 + x)/ width -0.5
        ,-(rect.y1 +y)/height + 0.5,
        0
      ]
     }
      {...meshProps}
    >
      <boxGeometry args={[widthGeometry, heightGeometry, depth]} />
      <meshStandardMaterial color={rect.color} />
    </mesh>
  )
}

export default ColoredBox;