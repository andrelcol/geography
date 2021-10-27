function init() {

// use the defaults
var scene = new THREE.Scene(); // Create main scene
//var stats = initStats(); // To show FPS information
var renderer = initRenderer(); // View function in util/utils
//renderer.setClearColor("rgb(30, 30, 40)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); //var camera = initCamera(new THREE.Vector3(0, 10, 20));
camera.lookAt(0, 0, 0);
camera.position.set(5, 15, 30);
camera.up.set(0, 1, 0);

var clock = new THREE.Clock();
var light = initDefaultLighting(scene, new THREE.Vector3(25, 30, 20)); // Use default light

// Show axes (parameter is size of each axis)
var axes = new THREE.AxesHelper(12);
axes.name = "AXES";
axes.visible = false;
scene.add(axes);

var groundPlane = createGroundPlane(30, 30); // width and height
groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Enable mouse rotation, pan, zoom etc.
var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
orbitControls.target.set(0, 0, 0);
orbitControls.minDistance = 25;
orbitControls.maxDistance = 100;

// Object Material for all objects
var objectMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255, 0, 0)" });
var wireframe = new THREE.LineBasicMaterial({ color: "rgb(255, 0, 0)" });

// Add objects to scene
var objectArray = new Array();
scene.add(createTetrahedron(4.0, 0));

var loader = new THREE.GLTFLoader();

var root;

loader.load('assets/models/geography/arenito.glb', function(gltf){
    console.log(gltf);
    root = gltf.scene;
    root.scale.set(10, 10, 10);
    root.position.set(0, 5, 0)
    scene.add(root);
}, function(xhr){
    console.log(xhr.loaded/xhr.total * 100 + "% loaded")
}, function(error){
    console.log("deu ruim")
});


/* var rocks = [
    null,
    loader.load('assets/models/geography/arenito.glb', function(glb){
        console.log(glb);
        const root = glb.scene;
        root.scale.set(10, 10, 10);
        root.position.set(0, 5, 0)
        scene.add(root);
    }, function(xhr){
        console.log(xhr.loaded/xhr.total * 100 + "% loaded")
    }, function(error){
        console.log("deu ruim")
    })
] */


// Controls of sidebar
var controls = new function () {
    var self = this;

    // Axes
    this.axes = false;

    // Inicia a geometria e material de base a serem controlados pelo menu interativo
    //this.appliedMaterial = applyMeshNormalMaterial;

    this.groundPlaneVisible = true;

    //Physics
    this.animation = true;
    this.rotation = 0.015;
    this.wireframe = false;
    this.wireframeStatus = false;
    this.color = "rgb(255, 0, 0)";

    // Geometry
    this.mesh = objectArray[0];
    this.meshNumber = 0;
    this.radius = 10;
    this.detail = 0;
    this.type = 'Tetrahedron';
    this.size = 1.0;

    
}

// GUI de controle e ajuste de valores especificos da geometria do objeto
var gui = new dat.GUI();

var guiFolder = gui.addFolder("Properties");
guiFolder.open(); // Open the folder
guiFolder.add(controls, "animation").listen().onChange(function (e) {
    if (controls.animation) {
        controls.rotation = 0.015;
    }
    else {
        controls.rotation = 0;
    }
});

function createTetrahedron(radius, detail) {
    var geometry = new THREE.TetrahedronGeometry(radius, detail);
    var object = new THREE.Mesh(geometry, objectMaterial);
    object.castShadow = true;
    object.position.set(0.0, radius * 1.1, 0.0);
    object.visible = false;
    object.name = "Tetrahedron";
    objectArray.push(object);
    return object;
}


// Reajuste da renderização com base na mudança da janela
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;  //Atualiza o aspect da camera com relação as novas dimensões
    camera.updateProjectionMatrix();                         //Atualiza a matriz de projeção
    renderer.setSize(window.innerWidth, window.innerHeight); //Define os novos valores para o renderizador
    //console.log('Resizing to %s x %s.', window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize, false);         // Ouve os eventos de resize


render();

function render() {
    //stats.update();
    orbitControls.update();
    // Atualiza o controle da câmera
    //orbitControls.update(clock.getDelta());

    // Rotating the mesh selected

    controls.mesh.rotation.x += controls.rotation;
    controls.mesh.rotation.y += controls.rotation;
    controls.mesh.rotation.z += controls.rotation;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

}