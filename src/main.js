import * as THREE from 'three';
import islandModelSrc from './models/island.glb';
import cyclistModelSrc from './models/cyclist.glb';

// 附加組件 控制器與載入器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


// 場景 相機 渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
    //視野角度 寬高比 聚焦的近截面 聚焦的遠截面 
    75, window.innerWidth / window.innerHeight, 0.5, 1000 
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.set( 0, 0, 15 );

// 設置環境光 AmbientLight
// let ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

//light
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );

const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
dirLight.position.set( 0, 20, 10 );
scene.add( dirLight );

// 環境背景 設置透明
renderer.setClearColor(0xffffff, 0)

// 創建一個立方體物件在場景中 幾何物件 材質 網格
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// 控制器與載入器
const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
loader.setDRACOLoader( dracoLoader );

let mixer;
async function init() {
    const island = await loader.loadAsync(islandModelSrc,undefined);
    const cyclist = await loader.loadAsync(cyclistModelSrc,undefined);
    scene.add(island.scene);
    scene.add(cyclist.scene);

    //cyclist
    cyclist.scene.position.set(0,0,11.5)
    cyclist.scene.scale.set(0.4,0.4,0.4)
    
    // cyclist AnimationClip
    mixer = new THREE.AnimationMixer( cyclist.scene );
    const clips = cyclist.animations;
    const clip = THREE.AnimationClip.findByName( clips, 'Cycling_Normal_24' );
    const action = mixer.clipAction( clip );
    action.timeScale = 1/1.5;
    action.play();

    //controls
    controls.maxPolarAngle = 1.48;
    controls.minPolarAngle = 1.35;
    controls.enableZoom = false;
    controls.autoRotate = true
    controls.autoRotateSpeed = -1

    function changeControls(){
        const cameraAngle = controls.getAzimuthalAngle();
        const cyclistPositionX = Math.sin(cameraAngle) * 11.5;
        const cyclistPositionZ = Math.cos(cameraAngle) * 11.5;
        cyclist.scene.position.set( cyclistPositionX, 0, cyclistPositionZ );
        cyclist.scene.rotation.y = cameraAngle;

        const info = document.getElementById('info-container');
        info.style.display = 'none'
        if(cameraAngle >= 2 && cameraAngle <= 3 && info.style.display === 'none' ){
            info.style.display = 'block'
        }else if(cameraAngle < 2 && cameraAngle > 3 && info.style.display === 'block'){
            info.style.display = 'none'
        }
        // console.log(
        //     // "getDistance",controls.getDistance(),
        //     // "getPolarAngle 垂直旋转",controls.getPolarAngle(),
        //     "getAzimuthalAngle 水平旋转",controls.getAzimuthalAngle()
        //     // "rotateSpeed" , controls.rotateSpeed
        // )
    }
    controls.addEventListener("change",changeControls, false)

    // console.log(
    //     {island},
    //     {cyclist},
    //     {scene},
    //     controls
    // )
}
init();

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame( animate );
    controls.update();
    if ( mixer ) mixer.update( clock.getDelta() );
    renderer.render( scene, camera );
};
animate();




