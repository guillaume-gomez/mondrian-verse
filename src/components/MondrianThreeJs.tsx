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
    rects.forEach((rect, index) => {
      const mesh = createPart(rect);
      //mesh.position.setZ(index * 0.1);
      scene.add(mesh);
    });

    // Axe Helper
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    const camera = new THREE.PerspectiveCamera(75, width / height);
    camera.position.z = 3;
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

  return (
    <canvas ref={refCanvas} className="webgl"></canvas>
  );
}

export default MondrianThreeJs;