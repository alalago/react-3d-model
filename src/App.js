import './App.css';
import * as THREE from 'three';
import React, { useEffect } from 'react';
import island from './models/island.glb';
import cyclist from './models/cyclist.glb';

// 附加組件 控制器與載入器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

function App() {

  // 場景 相機 渲染器
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 
    //視野角度 寬高比 聚焦的近截面 聚焦的遠截面 
    75, window.innerWidth / window.innerHeight, 0.1, 1000 
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // 設置環境光 AmbientLight
  let ambientLight = new THREE.AmbientLight(0xffffff)
  scene.add(ambientLight);
 

  // 創建一個立方體物件在場景中 幾何物件 材質 網格
  // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  // const cube = new THREE.Mesh( geometry, material );
  // scene.add( cube );

  // camera.position.z = 5;

  // 控制器與載入器
  const controls = new OrbitControls( camera, renderer.domElement );
  const loader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath( '../node_modules/three/examples/jsm/libs/draco/gltf' );
  // dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  loader.setDRACOLoader( dracoLoader );


useEffect(() => {
    loader.load(
      island,
      function ( gltf ) {
  
        gltf.scene.traverse(function(child){
          if(child.isMesh){
            child.frustumCulled = false;
            child.castShadow = true;
            child.material.emissive = child.material.color;
            child.material.emissiveMap = child.material.map;
          }
        })
  
        gltf.scene.castShadow = true;
        gltf.scene.receiveShadow = true;
        gltf.scene.scale.set(.5,.5,.5);
        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Group
        // gltf.scenes; // Array<THREE.Group>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object

        scene.add( gltf.scene );
        console.log(gltf)
      },undefined,
      // called while loading is progressing
      // function ( xhr ) {
      //   console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      // },
      // called when loading has errors
      function ( error ) {
        console.log( 'An error happened' );
      }
    );

},[])



    // loader.load(island, (gltf) => {
    //   scene.add(gltf.scene);
    // }, undefined, (error) => {
    //   console.error(error);
    // });



  function animate() {
    requestAnimationFrame( animate );
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render( scene, camera );
  };

  animate();



  return (
    <div className="App">
      
    </div>
  );
}

export default App;
