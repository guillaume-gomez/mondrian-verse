import * as THREE from 'three';
import React, { useMemo } from 'react';
import {  useThree } from '@react-three/fiber';
import { CustomRect, heightRect, widthRect, centerRect } from "../../utils";

interface BorderProps {
  rect: CustomRect;
  thickness: number;
  depth: number;
  meshProps?: JSX.IntrinsicElements['mesh'];
}

const material = new THREE.MeshStandardMaterial( { color: "black" } );

function Border({rect, thickness, depth, meshProps}: BorderProps) {
  const widthGeometry = useMemo(() => new THREE.BoxGeometry( widthRect(rect) + thickness, thickness, depth ) , [rect, thickness, depth]);
  const heightGeometry = useMemo(() => new THREE.BoxGeometry( thickness, heightRect(rect), depth ) , [rect, thickness, depth]);
  const [centerX, centerY] = useMemo(() => centerRect(rect), [rect]);
  return (
    <>
    {/*UP*/}
    <mesh
      material={material}
      geometry={widthGeometry}
      position={[
        (rect.x1 + centerX),
        -(rect.y1),
        0
      ]
     }
      {...meshProps}
    />
    {/*DOWN*/}
    <mesh
      material={material}
      geometry={widthGeometry}
      position={[
        (rect.x1 + centerX),
        -(rect.y2),
        0
      ]
     }
      {...meshProps}
    />
    {/*LEFT*/}
    <mesh
      material={material}
      geometry={heightGeometry}
      position={[
        (rect.x1),
         -(rect.y1 + centerY),
         0
        
      ]
     }
      {...meshProps}
    />
    {/*RIGHT*/}
    <mesh
      material={material}
      geometry={heightGeometry}
      position={[
        (rect.x2) ,
        -(rect.y1 + centerY),
        0
      ]
     }
      {...meshProps}
    />
    </>

  )
}

export default Border;