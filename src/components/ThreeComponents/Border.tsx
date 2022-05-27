import * as THREE from 'three';
import React, { useMemo } from 'react';
import {  useThree } from '@react-three/fiber';
import { CustomRect, heightRect, widthRect, centerRect } from "../../utils";

interface BorderProps {
  rect: CustomRect;
  thickness: number;
  meshProps?: JSX.IntrinsicElements['mesh'];
}

const material = new THREE.MeshStandardMaterial( {color: "black"} );

function Border({rect, thickness, meshProps}: BorderProps) {
  const { size: { width, height } } = useThree();
  const thicknessWidth = useMemo(() => thickness/width , [thickness, width]);
  const thicknessHeight = useMemo(() => thickness/height , [thickness, height]);
  const widthGeometry = useMemo(() => new THREE.BoxGeometry( widthRect(rect)/ width, thicknessHeight, 0.1 ) , [rect, width, thicknessHeight]);
  const heightGeometry = useMemo(() => new THREE.BoxGeometry( thicknessWidth, heightRect(rect) / height, 0.1 ) , [rect, height, thicknessWidth]);
  const [x, y] = useMemo(() => centerRect(rect), [rect]);
  return (
    <>
    <mesh
      material={material}
      geometry={widthGeometry}
      position={[
        (rect.x1 + x)/ width,
        -(rect.y1 + thicknessHeight)/height,
        0
      ]
     }
      {...meshProps}
    />

    <mesh
      material={material}
      geometry={widthGeometry}
      position={[
        (rect.x1 + x)/ width ,
        -(rect.y2 + thicknessHeight)/height,
        0
      ]
     }
      {...meshProps}
    />

    <mesh
      material={material}
      geometry={heightGeometry}
      position={[
        (rect.x1 + thicknessWidth)/ width,
         -(rect.y1 + y)/height,
         0
        
      ]
     }
      {...meshProps}
    />

     <mesh
      material={material}
      geometry={heightGeometry}
      position={[
        (rect.x2 + thicknessWidth)/ width ,
        -(rect.y1 + y)/height,
        0
      ]
     }
      {...meshProps}
    />
    </>

  )
}

export default Border;