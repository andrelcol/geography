//-- Imports -------------------------------------------------------------------------------------
import * as THREE from "../libs/three-127/build/three.module.js";
import { VRButton } from "../libs/three-127/build/jsm/webxr/VRButton.js";
import { GLTFLoader } from '../libs/three-127/build/jsm/loaders/GLTFLoader.js';
import Stats from '../libs/util/stats.module.js';

//-----------------------------------------------------------------------------------------------
//-- MAIN SCRIPT --------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

//-- Renderer settings ---------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color("#9C7747"));
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//-- Stats settings ---------------------------------------------------------------------------
const stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

// Align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.getElementById('stats').appendChild(stats.domElement);

//-- Setting scene and camera -------------------------------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .1, 1000);
let moveCamera; // Move when a button is pressed 

camera.position.set(0, 0, 0);

//-- 'Camera Holder' to help moving the camera
const cameraHolder = new THREE.Object3D();
cameraHolder.position.set(0, 2, 0)
cameraHolder.add(camera);
scene.add(cameraHolder);

// controllers
const controller1 = renderer.xr.getController(0);
controller1.addEventListener('selectstart', onSelectStart);
controller1.addEventListener('selectend', onSelectEnd);
camera.add(controller1);

//--  General globals ---------------------------------------------------------------------------
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//-- Global objects ----------------------------------------------------
const DETECTING_DELAY = 1; // defines how many seconds it take to processa a rock
const INTERSECT_DELAY = 0.5; // defines how many seconds to wait to raycast

const clock = new THREE.Clock(); // used to get time between render calls
let delta; // store result of clock
let passedTime = 0; // sum of deltas to get total time passed

let loadingBar, outline; // they store loading bar mesh and outline mesh (initialized in create scene) 
let detectingTime = 0, isDetecting = false; // helpers to detecing animation

const vecOrigin2d = new THREE.Vector2(0, 0); // origin for raycaster
const quaternion = new THREE.Quaternion(); // aux quaternion to movement

let raycaster, intersection, groundIntersection, lastRock = null;

const rocks = []; // receives rock meshes in createScene()
const ground = []; // receives ground meshes in createScene()

let counterText, counterTextGeo, count = 0;

var winText, font; // using var allocating variables in global scope for using in change language function

const winSoud = new Howl({
    src: ['assets/sounds/win.wav'], // Mativve https://freesound.org/people/Mativve/sounds/391539/
    volume: 1,
});
Howler.pos(0, 1.6, 0); // Sound listener position

//-- Language variables ---------------------------------------------------------------------------
var appCurrentLang = new URLSearchParams(window.location.search).get('lang') || 'en-US';
console.log(appCurrentLang);

var winMessage = {
    'en-US': 'Task Completed',
    'pt-BR': 'Missão cumprida'
}
var instructionsMesasge = {
    'en-US': `
    <h2>Instructions:</h2>
    <p>You are piloting a fictional drone in Mars and searching for special rocks that might store register of
        ancient life.
    </p>
    <p>Follow the path and find 3 reddish rocks.</p>
    `,
    'pt-BR': `
    <h2>Instruções:</h2>
    <p>Você é o piloto de um dronce fictício em Marte e está a procura de rochas especias que podem guardar registros de vida antiga.
    </p>
    <p>Siga o caminho e encontre 3 pedras avermelhadas!</p>
    `
}


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
    delta = clock.getDelta();
    move();
    stats.update();
    detectRocks(delta);
    renderer.render(scene, camera);
}

function move() {
    raycaster.setFromCamera(vecOrigin2d, camera);
    if (moveCamera) {

        groundIntersection = raycaster.intersectObjects(ground)[0];

        if (!groundIntersection || groundIntersection.distance > 2) {
            // Get Camera Rotation
            quaternion.copy(camera.quaternion);

            // Get direction to translate from quaternion
            var moveTo = new THREE.Vector3(0, 0, -0.1);
            moveTo.applyQuaternion(quaternion);

            // Move the camera Holder to the computed direction
            cameraHolder.translateX(moveTo.x);
            cameraHolder.translateY(moveTo.y);
            cameraHolder.translateZ(moveTo.z);
        }
    }
}

function detectRocks(delta) {
    passedTime += delta;

    if (isDetecting) {
        detectingTime += delta;
        loadingAnimation(detectingTime);
    }

    if (passedTime > INTERSECT_DELAY) {
        // console.log(renderer.info.render.triangles);
        passedTime = 0;
        intersection = raycaster.intersectObjects(rocks)[0];

        if (intersection) {
            isDetecting = true;
            outline.visible = true;
            loadingBar.visible = true;

            if (intersection.object != lastRock) {
                detectingTime = 0;
                loadingBar.scale.x = 0;
                lastRock = intersection.object;
            }
        }
        else if (lastRock != null) {
            lastRock = null;
            isDetecting = false;
            outline.visible = false;
            loadingBar.visible = false;
        }
    }
}

function loadingAnimation(passedTime) {
    if (passedTime < DETECTING_DELAY) {
        loadingBar.scale.x = passedTime;
    }
    else {
        if (/special*/.test(lastRock.name)) {
            count++;
            counterTextGeo = new THREE.TextBufferGeometry(count + '/3', {
                font: font,
                size: 0.05,
                height: 0,
            });
            counterText.geometry = counterTextGeo;
            counterText.geometry.needsUpdate = true;

            if (count === 3) {
                winText.visible = true;
                winSoud.play();
            }
        }

        lastRock.material.emissive.setRGB(1, 1, 1);
        lastRock.material.emissiveIntensity = 0.1;

        let rockIndex = rocks.indexOf(lastRock);
        rocks.splice(rockIndex, 1);
        isDetecting = false;
    }
}

function onSelectStart() {
    moveCamera = true;
}

function onSelectEnd() {
    moveCamera = false;
}

function changeLanguage(lang) {
    if (appCurrentLang != lang) {

        document.querySelector('#instructions').innerHTML = instructionsMesasge[lang];

        if (font) {
            console.log('hey font')
            const winTextGeo = new THREE.TextBufferGeometry(winMessage[lang], {
                font: font,
                size: 0.05,
                height: 0,
            });
            const greenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, depthWrite: false, depthTest: false });


            winText.geometry = winTextGeo;
            winText.geometry.needsUpdate = true;
        }

        appCurrentLang = lang;
    }
}
window.changeLanguage = changeLanguage; // adding function to global scope

//------------------------------------------------------------------------------------------------
//-- Scene and auxiliary functions ---------------------------------------------------------------
//------------------------------------------------------------------------------------------------

//-- Create Scene --------------------------------------------------------------------------------
async function createScene() {
    //-------- fog creation --------
    let fogColor = new THREE.Color(0xB77700);
    scene.background = fogColor;
    scene.fog = new THREE.Fog(fogColor, 0.025, 100);

    //-------- setting lights up --------
    const light = new THREE.SpotLight(0xaaaaaa);
    light.position.set(20, 100, 200);
    scene.add(light);

    const hemisphereLight = new THREE.HemisphereLight(0x605500, 0x080820, 1);
    hemisphereLight.position.y = 100;
    scene.add(hemisphereLight);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 5);

    //-- Setting curve
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(1, 1, -10),
        new THREE.Vector3(-12, 1, -25),
        new THREE.Vector3(2, 1, -32),
        new THREE.Vector3(-30, 1, -40),
        new THREE.Vector3(0, 2, -55),
        new THREE.Vector3(3, 10, -60),
        new THREE.Vector3(10, 15, -70)
    ])

    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    // Create the final object to add to the scene
    const curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);

    //-------- loading external objects --------

    const loadingText = document.querySelector('#loader-text');

    // loading terrain and rocks
    await asyncLoader(
        'assets/models/mars/mars.glb', // model url
        (gltf) => { // on load scene
            loadingText.innerHTML = 'Processing...';

            gltf.scene.traverse(child => {
                child.matrixAutoUpdate = false;
                child.updateMatrix();

                if (/ground*/.test(child.name)) {
                    child.receiveShadow = true;
                    ground.push(child);
                }
                else {
                    child.castShadow = true;
                    rocks.push(child);
                }

                if (/special*/.test(child.name)) {
                    child.material.emissive.setRGB(8, 2, 2)
                    child.material.emissiveIntensity = 0.01;
                }
            });

            scene.add(gltf.scene);

            window.setTimeout(createCameraElements, 500)
        },
        (xhr) => { // on progress fuction
            if (!isNaN(xhr.loaded) && !isNaN(xhr.total) && xhr.total > 0) {
                console.log('Terrain: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                loadingText.innerHTML = (xhr.loaded / xhr.total * 100).toFixed(0) + '% loaded';
            }
        },
        (error) => { // on error function
            console.log('An error happened', error);
        }
    );

    //-------- loading rover --------
    await asyncLoader(
        'assets/models/mars/perseverance.glb',
        function (gltf) {
            const rover = gltf.scene;

            rover.rotation.y = Math.PI;
            rover.position.z = -5;
            rover.castShadow = true;
            rover.matrixAutoUpdate = false
            rover.updateMatrix();

            scene.add(rover);

        },
        function (xhr) {
            console.log('Rover: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened', error)
        }
    );

    //-- Changin instruciions language ---------------------------------------------------------------
    document.querySelector('#instructions').innerHTML = instructionsMesasge[appCurrentLang];

    //-- Create VR button and settings ---------------------------------------------------------------
    loadingText.style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('#instructions').style.display = 'block';
    document.body.appendChild(VRButton.createButton(renderer));
}


function createCameraElements() {
    //-------- Green material used by different meshes below --------
    const greenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, depthWrite: false, depthTest: false });

    //-------- creating aim cross --------
    const barGeo = new THREE.PlaneBufferGeometry(0.025, 0.00625);

    const horiBar = new THREE.Mesh(barGeo, greenMat);
    horiBar.position.set(0, 0, -1);
    camera.add(horiBar);

    const vertiBar = horiBar.clone();
    vertiBar.rotation.z = Math.PI / 2;
    camera.add(vertiBar);

    //-------- Creating loading bar meshes --------
    const loadingGeo = new THREE.PlaneBufferGeometry(0.15, 0.02);

    loadingBar = new THREE.Mesh(loadingGeo, greenMat);
    loadingBar.position.set(0, -0.05, -1);
    loadingBar.visible = false;
    camera.add(loadingBar);

    const outlineGeo = new THREE.EdgesGeometry(loadingGeo);
    const outlineMat = new THREE.LineBasicMaterial({ color: 0x00ff00, depthWrite: false, depthTest: false });

    outline = new THREE.LineSegments(outlineGeo, outlineMat);
    outline.position.copy(loadingBar.position);
    outline.scale.set(1.1, 1.5, 1);
    outline.visible = false;
    camera.add(outline);

    //-------- Creating corner bars --------
    const cornerBarGeo = new THREE.PlaneBufferGeometry(0.25, 0.01);

    const horiCornerBar = new THREE.Mesh(cornerBarGeo, greenMat);
    horiCornerBar.position.set(0.125, 0, 0);
    const vertiCornerBar = horiCornerBar.clone();
    vertiCornerBar.rotation.set(0, 0, Math.PI / 2);
    vertiCornerBar.position.set(0.006, 0.13, 0)

    const corner = new THREE.Object3D();
    corner.add(horiCornerBar);
    corner.add(vertiCornerBar);

    const corner1 = corner.clone();
    corner1.position.set(-0.45, -0.45, -1);
    camera.add(corner1);

    const corner2 = corner.clone();
    corner2.rotation.set(0, 0, Math.PI / 2);
    corner2.position.set(0.45, -0.45, -1);
    camera.add(corner2);

    const corner3 = corner.clone();
    corner3.rotation.set(0, 0, -Math.PI / 2);
    corner3.position.set(-0.45, 0.45, -1);
    camera.add(corner3);

    const corner4 = corner.clone();
    corner4.rotation.set(0, 0, -Math.PI);
    corner4.position.set(0.45, 0.45, -1);
    camera.add(corner4);

    //-------- Creating corner bars --------
    const loader = new THREE.FontLoader();

    loader.load('assets/fonts/Roboto_Regular.json', function (e) {
        font = e;

        counterTextGeo = new THREE.TextBufferGeometry('0/3', {
            font: font,
            size: 0.05,
            height: 0,
        });

        counterText = new THREE.Mesh(counterTextGeo, greenMat);
        counterText.position.set(0.3, 0.35, -1);
        camera.add(counterText);

        const winTextGeo = new THREE.TextBufferGeometry(winMessage[appCurrentLang], {
            font: font,
            size: 0.05,
            height: 0,
        });
        winText = new THREE.Mesh(winTextGeo, greenMat);
        winText.position.set(-0.225, 0.1, -1);
        winText.visible = false;
        camera.add(winText);

    });
}

function asyncLoader(url, onLoad, onProgress, onError) {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            url,
            // on load function
            (gltf) => {
                onLoad(gltf);
                resolve(gltf);
            },
            // on progress function
            onProgress,
            // on error function
            (error) => {
                if (typeof onError === 'function') {
                    oneError(error);
                }
                reject;
            }
        );
    });
};