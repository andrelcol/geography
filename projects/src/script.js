//-- Imports -------------------------------------------------------------------------------------
import * as THREE from '../libs/vr/three.module-orbi.js'
import { VRButton } from '../libs/vr/VRButton.js';
import { Orbi } from '../libs/orbixr.js';
import { GLTFLoader } from '../libs/loaders/GLTFLoader.module.js';

// import {
//   onWindowResize,
// } from "../../libs/util/util.js";

//-----------------------------------------------------------------------------------------------
//-- MAIN SCRIPT --------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

//-- Renderer settings ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(new THREE.Color("#232323"));
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.xr.cameraAutoUpdate = false;
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

let ASSETS, calcario, basalto, granito, ardosia, marmore;
/*
let dracoLoade = new DRACOLoader();

const dracoLoader = new three.DRACOLoader().setDecoderPath('../libs/draco/gltf/');
*/
/*
ASSETS = {
  textures: {
      helper: {
          path: 'assets/textures/loader-helper.jpg',
          fileSize: 1627 + 2095 + 2350 + 1799 + 2310, 
      }
  },


  objects: {
      calcario: {
          path: 'assets/models/rocks/limestone_low.glb',
          fileSize: 1627,
          //draco: dracoLoader,
      },
      basalto: {
          path: 'assets/models/rocks/basalt_low.glb',
          fileSize: 2095,
      },
      granito: {
          path: 'assets/models/rocks/granite_low.glb',
          fileSize: 2350,
      },
      ardosia: {
          path: 'assets/models/rocks/slate_low.glb',
          fileSize: 1799,
      },
      marmore: {
          path: 'assets/models/rocks/marble_low.glb',
          fileSize: 2310,
      }
  }
};
*/
calcario = new THREE.Object3D();

var loader = new GLTFLoader();
loader.load('assests/models/rocks/limestone_low.glb', function(object) {
  calcario = object.scene;
  scene.add(calcario);
});
//loader.load('assets/models/rocks/limestone_low.glb');

//var ls = new LoadScreen(renderer,{type:'stepped-circular-fancy-offset', progressColor:'#fff',infoStyle:{padding:'0'}}).onComplete(init).start(ASSETS);
A
//-- Setting scene and camera -------------------------------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .1, 1000);

// camera.position.set(0, 1.6, 0);

// let xrCamera = renderer.xr.getCamera();
// console.log(xrCamera);
console.log(renderer.xr.getSession());

//-- 'Camera Holder' to help moving the camera
const cameraHolder = new THREE.Object3D();
// cameraHolder.position.set(0, 1.6, 0)
cameraHolder.add(camera);
scene.add(cameraHolder);
scene.add(loader);
// controllers
const controller1 = renderer.xr.getController(0);
camera.add(controller1);
const config = {
  display: new THREE.Vector2(2, 2),
  orbits: [1, 2, 3],
  rotation: {
    theta: 0,
  },
  button: {
    transparent: true,
    opacity: 0.95
  },
  gap: new THREE.Vector2(0.003, 0.003),
  border: {
    enabled: true
  },
  font: {
    path: '../libs/fonts/Roboto_Regular.json'
  }
}

//calcario = ASSETS.objects.calcario;
/*calcario.scale.set(2, 2, 2);
calcario.position.set(0, -20, 0);
calcario.rotation.set(0, -Math.PI / 12, 0);
calcario.visible = false;*/
//scene.add(calcario);
/*
basalto = ASSETS.objects.basalto;
basalto.scale.set(2, 2, 2);
basalto.position.set(0, -20, 0);
basalto.visible = true;
scene.add(basalto)

granito = ASSETS.objects.granito;
granito.scale.set(30, 30, 30);
granito.position.set(0, 0, 0);
granito.rotation.set(0, -Math.PI / 12, 0);
granito.visible = false;
scene.add(granito)

ardosia = ASSETS.objects.ardosia;
ardosia.scale.set(20, 20, 20);
ardosia.position.set(0, 0, 0);
ardosia.rotation.set(0, -Math.PI / 6, 0);
ardosia.visible = false;
scene.add(ardosia)

marmore = ASSETS.objects.marmore;
marmore.scale.set(1.5, 1.5, 1.5);
marmore.position.set(0, 1, 0);
marmore.visible = false;
scene.add(marmore)
*/

const orbi = new Orbi(camera, config);
cameraHolder.add(orbi);

orbi.addButton('1', '../img/icons/alert.png', () => { orbi.showMessage('button 1'), orbi.showText('Olá') });
orbi.addButton('2', '../img/icons/alert.png', () => { orbi.showMessage('button 2') });
orbi.addButton('3', '../img/icons/alert.png', () => { orbi.showMessage('button 3') });
orbi.addButton('4', '../img/icons/alert.png', () => { orbi.showMessage('button 4') });
orbi.addButton('5', '../img/icons/alert.png', () => { orbi.showMessage('button 5') });
orbi.addButton('6', '../img/icons/alert.png', () => { orbi.showMessage('button 6') });




//--  General globals ---------------------------------------------------------------------------
// window.addEventListener('resize', onWindowResize);


//-- Creating Scene and calling the main loop ----------------------------------------------------
createScene();
animate();

//------------------------------------------------------------------------------------------------
//-- FUNCTIONS -----------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

//-- Main loop -----------------------------------------------------------------------------------
function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.xr.updateCamera(camera);
  orbi.update();
  renderer.render(scene, camera);
}


//------------------------------------------------------------------------------------------------
//-- Scene and auxiliary functions ---------------------------------------------------------------
//------------------------------------------------------------------------------------------------

//-- Create Scene --------------------------------------------------------------------------------
function createScene() {
  var axesHelper = new THREE.AxesHelper(12);
  scene.add(axesHelper);

  var planeGeometry = new THREE.PlaneGeometry(20, 20);
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  plane.position.y = -0.01;
  scene.add(plane);

  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  var cubeMaterial = new THREE.MeshNormalMaterial();
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  camera.add(cube);

  document.body.appendChild(VRButton.createButton(renderer));
}

