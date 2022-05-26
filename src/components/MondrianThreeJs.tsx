import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { CustomRect, heightRect, widthRect, randInt, centerRect } from "../utils";

interface MondrianThreeJsProps {
  width?: number;
  height?: number;
  thickness: number;
  rects: CustomRect[];
}

function MondrianThreeJs({width = 800, height = 800, thickness, rects} : MondrianThreeJsProps ): React.ReactElement {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if(!refCanvas.current) {
      return;
    }

    function tick()
    {
        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x191D24);

    let borders = new THREE.Group();
    const material = new THREE.MeshBasicMaterial( {color: "black"} );
    borders.position.setZ(0.1);
    borders.translateX(-0.5);
    borders.translateY(0.5);


    rects.forEach((rect, index) => {
      const mesh = createPart(rect);
      mesh.translateX(-0.5);
      mesh.translateY(0.5)
      scene.add(mesh);

      const bordersPart = createBorderPart(rect, material);
      borders.add(...bordersPart)
    });

    const paintingBorders= createBorderPart({x1: 0, y1: 0, x2: width, y2: height, color: "#000000"}, material);
    borders.add(...paintingBorders);

    scene.add(borders)

    // Axe Helper
    //const axesHelper = new THREE.AxesHelper(2);
    //scene.add(axesHelper);

    const camera = new THREE.PerspectiveCamera(75, width / height);
    camera.position.z = 0.90;
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: refCanvas.current
    });

    renderer.setSize(width, height);
    renderer.render(scene, camera);

    // Controls
    const controls = new OrbitControls( camera, renderer.domElement );

    tick();
  }, [width, height, rects]);


  function createPart(rect: CustomRect) : THREE.Mesh {
    const widthGeometry = widthRect(rect)/ width;
    const heightGeometry = heightRect(rect) / height;
    const geometry = new THREE.BoxGeometry( widthGeometry, heightGeometry, 0.1 );
    const material = new THREE.MeshBasicMaterial( {color: rect.color} );
    let cube = new THREE.Mesh( geometry, material );
    const [x, y] = centerRect(rect);
    cube.position.set((rect.x1 + x)/ width ,-(rect.y1 +y)/height, 0);
    return cube;
  }

  function createBorderPart(rect: CustomRect, material: THREE.MeshBasicMaterial) : [THREE.Mesh, THREE.Mesh, THREE.Mesh, THREE.Mesh] {
    const widthGeometry = widthRect(rect)/ width;
    const heightGeometry = heightRect(rect) / height;
    const thicknessWidth = thickness/width;
    const thicknessHeight = thickness/height;
    const [x, y] = centerRect(rect);

    const geometryTop = new THREE.BoxGeometry( widthGeometry, thicknessHeight, 0.1 );
    let topMesh = new THREE.Mesh( geometryTop, material );
    topMesh.position.set((rect.x1 + x)/ width ,-(rect.y1 + thicknessHeight)/height, 0);

    const geometryBottom = new THREE.BoxGeometry( widthGeometry, thicknessHeight, 0.1 );
    let bottomMesh = new THREE.Mesh( geometryTop, material );
    bottomMesh.position.set((rect.x1 + x)/ width ,-(rect.y2 + thicknessHeight)/height, 0);

    const geometryLeft = new THREE.BoxGeometry( thicknessWidth, heightGeometry, 0.1 );
    let leftMesh = new THREE.Mesh( geometryLeft, material );
    leftMesh.position.set((rect.x1 + thicknessWidth)/ width , -(rect.y1 + y)/height, 0);

    const geometryRight = new THREE.BoxGeometry( thicknessWidth, heightGeometry, 0.1 );
    let rightMesh = new THREE.Mesh( geometryRight, material );
    rightMesh.position.set((rect.x2 + thicknessWidth)/ width , -(rect.y1 + y)/height, 0);

    return [topMesh, bottomMesh, leftMesh, rightMesh];
  }

  return (
    <canvas ref={refCanvas} className="webgl"></canvas>
  );
}

export default MondrianThreeJs;