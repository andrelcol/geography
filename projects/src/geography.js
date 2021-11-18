let rendererStats, renderer, scene, camera, trackballControls, light, ambientLight, controls, gui, clock;
let calcario, basalto, granito, ardosia, marmore, highlight, viewpoint, isMouseOut;
let language = 'en-US';

const decoder = new THREE.DRACOLoader().setDecoderPath('../libs/draco/gltf/');

const ASSETS = {
    textures: {
        helper: {
            path: 'assets/textures/loader-helper.jpg',
            fileSize: 7749 + 515 + 143 + 3323 + 3521, 
        }
    },
    geometries: {
        sphereGeometry: new THREE.SphereGeometry(1, 20, 20),
    },
    materials: {
        sphereMaterial: new THREE.MeshPhongMaterial({ color: 0x0D8CFF, transparent: true, opacity: 0.5, wireframe: false })
    },

    objects: {
        calcario: {
            path: 'assets/models/geography/calcita.glb',
            fileSize: 7749,
            draco: decoder // the first model needs to set the draco decoder
        },
        basalto: {
            path: 'assets/models/geography/basalto2.glb',
            fileSize: 515,
        },
        granito: {
            path: 'assets/models/geography/granito.glb',
            fileSize: 143,
        },
        ardosia: {
            path: 'assets/models/geography/ardosia.glb',
            fileSize: 3.323,
        },
        marmore: {
            path: 'assets/models/geography/marmore.glb',
            fileSize: 3.521,
        }
    }
};

setRenderer();

var ls = new LoadScreen(renderer,{type:'stepped-circular-fancy-offset', progressColor:'#fff',infoStyle:{padding:'0'}}).onComplete(init).start(ASSETS);

function init() {
    initStats();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 700);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    onResize();

    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 100);
    scene.add(light);

    trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.minDistance = 10;
    trackballControls.maxDistance = 120;
    trackballControls.rotateSpeed = 4;

    calcario = ASSETS.objects.calcario;
    calcario.scale.set(2, 2, 2);
    calcario.position.set(0, -20, 0);
    calcario.rotation.set(0, -Math.PI / 12, 0);
    calcario.visible = true;
    content.calcario.model = calcario;
    scene.add(calcario);

    basalto = ASSETS.objects.basalto;
    basalto.scale.set(2, 2, 2);
    basalto.position.set(0, -20, 0);
    basalto.visible = false;
    content.basalto.model = basalto;
    scene.add(basalto)

    granito = ASSETS.objects.granito;
    granito.scale.set(10, 10, 10);
    granito.position.set(0, 0, 0);
    granito.visible = false;
    content.granito.model = granito;
    scene.add(granito)

    ardosia = ASSETS.objects.ardosia;
    ardosia.scale.set(20, 20, 20);
    ardosia.position.set(0, 0, 0);
    ardosia.rotation.set(0, -Math.PI / 6, 0);
    ardosia.visible = false;
    content.ardosia.model = ardosia;
    scene.add(ardosia)

    marmore = ASSETS.objects.marmore;
    marmore.scale.set(15, 15, 15);
    marmore.position.set(0, 2, 0);
    marmore.rotation.set(0, -Math.PI / 6, 0);
    marmore.visible = false;
    content.marmore.model = marmore;
    scene.add(marmore)

    window.addEventListener('resize', onResize);

    window.parent.addEventListener('mouseup', (e) => {
        trackballControls.handleParentKeyUp(e);
    });

    ls.remove(() => {
        animate();
    });
}

function animate() {
    requestAnimationFrame(animate);

    trackballControls.update();
    light.position.copy(camera.position);

    rendererStats.update();
    renderer.render(scene, camera);
}

function setRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xA1ACB3);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    if (window.innerWidth >= 768) {
        renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
    } else {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    // document.body.appendChild(renderer.domElement);
    document.querySelector("#output").appendChild(renderer.domElement);
}

function initStats() {
    rendererStats = new Stats();
    rendererStats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    rendererStats.domElement.style.position = 'absolute';
    rendererStats.domElement.style.left = '0px';
    rendererStats.domElement.style.top = '0px';
    document.getElementById('three-stats').appendChild(rendererStats.domElement);
}

function onResize() {
    if (window.innerWidth >= 768) {
        camera.aspect = window.innerWidth * 0.75 / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
    } else {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

const content = {
    calcario: {
        whatis: 'A stroke occurs when the blood supply to part of your brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients. Brain cells begin to die in minutes. A stroke is a medical emergency, and prompt treatment is crucial. Early action can reduce brain damage and other complications.',
        risk: 'The main risk factors are high blood pressure, or hypertension, nicotine and carbon monoxide in cigarette smoke, physical inactivity and a unhealthy diet that results in diabetes or high blood cholesterol.',
        
        whatisPT: 'Um derrame cerebral ocorre quando o suprimento de sangue para parte do cérebro é interrompido ou reduzido, impedindo que o tecido cerebral obtenha oxigênio e nutrientes. As células cerebrais começam a morrer em minutos. Um derrame cerebral é uma emergência médica, e o tratamento imediato é crucial. A ação precoce pode reduzir os danos cerebrais e outras complicações.',
        riskPT: 'Os principais fatores de risco são pressão arterial alta, ou hipertensão, nicotina e monóxido de carbono na fumaça do cigarro, inatividade física e uma dieta pouco saudável que resulta em diabetes ou colesterol alto no sangue.',
        
        source: `<a href="https://www.nhlbi.nih.gov/health-topics/stroke" target="_blank" rel="noopener external">NHLBI</a><br/>
        <a href="https://www.stroke.org/en/about-stroke/stroke-risk-factors/stroke-risk-factors-you-can-control-treat-and-improve" target="_blank" rel="noopener external">Stroke.org</a><br/>
        <a href="https://www.mayoclinic.org/diseases-conditions/stroke/symptoms-causes/syc-20350113" target="_blank" rel="noopener external">Mayo Clinic</a>`,
        credits: `<a href="https://3dprint.nih.gov/discover/3DPX-001564" target="_blank" rel="noopener external">3D Print
        for Health</a>`,

    },
    basalto: {
        whatis: 'An aneurysm occurs when part of an artery wall weakens, allowing it to balloon out or widen abnormally.Aneurysms can occur anywhere, but the most common are: Aortic aneurysm occurs in the major artery from the heart; Cerebral aneurysm occurs in the brain; Popliteal artery aneurysm occurs in the leg behind the knee; Mesenteric artery aneurysm occurs in the intestine; Splenic artery aneurysm occurs in an artery in the spleen;',
        risk: 'SmokingHigh blood pressure (hypertension), strong family history of brain aneurysms (familial aneurysms), age (over 40), presence of an arteriovenous malformation (AVM), congenital abnormality in the artery wall, drug use, particularly cocaine ,excessive alcohol use and severe head trauma are some of the main rik factors.',
        
        whatisPT: 'Um aneurisma ocorre quando parte da parede de uma artéria se enfraquece, permitindo que se forme uma bolha ou que ela se amplie anormalmente. Aneurismas podem acontecer em qualquer lugar, mas o mais comuns são: Aneurisma aórtico ocorre na artéria principal do coração; Aneurisma cerebral ocorre no cérebro; Aneurisma de artéria poplítea ocorre na perna atrás do joelho; Aneurisma de artéria mesentérica ocorre no intestino; Aneurisma de artéria esplênica ocorre em uma artéria no baço;',
        riskPT: 'Fumo, pressão arterial elevada (hipertensão), forte histórico familiar de aneurismas cerebrais (aneurismas familiares), idade (acima de 40 anos), presença de uma malformação arteriovenosa (AVM), anormalidade congênita na parede arterial, uso de drogas, particularmente cocaína, uso excessivo de álcool e traumatismo craniano severo são alguns dos principais fatores de risco.',
        
        source: `<a href="https://bafound.org/about-brain-aneurysms/brain-aneurysm-basics/risk-factors/" target="_blank" rel="noopener external">Brain Aneurysm Foundantion</a><br/>
        <a href="https://www.heart.org/en/health-topics/aortic-aneurysm/what-is-an-aneurysm" target="_blank" rel="noopener external">Heart.org</a>`,
        credits: '<a href="https://sketchfab.com/3d-models/abdominal-aortic-aneurysm-e951550381ad49739a38f9ffb2370899" target="_blank" rel="noopener external">laurenwahl</a> (adapted)',

    },
    granito: {
        whatis: 'Stenosis is an abnormal narrowing of blood vessels, arterys, or other type of opening in the body. The 3D model represents a renal artery stenosis, which may damage the kidney tissues due the lack of the correct amount of oxygen-rich blood.',
        risk: 'Risk factors of narrowed arteries from the kidneys and from other parts of the body includes:  aging, high blood pressure, diabetes, obesity, tobacco usage, family history of early heart disease, and lack of exercise.',
        
        whatisPT: 'A estenose é um estreitamento anormal dos vasos sanguíneos, artérias, ou outro tipo de abertura no corpo. O modelo 3D representa uma estenose da artéria renal, que pode danificar os tecidos renais devido à falta da quantidade correta de sangue rico em oxigênio.',
        riskPT: 'Fatores de risco de estreitamento das artérias dos rins e de outras partes do corpo incluem: envelhecimento, pressão alta, diabetes, obesidade, uso de tabaco, histórico familiar de doenças cardíacas precoces e falta de exercício.',
        
        source: `<a href="https://www.mayoclinic.org/diseases-conditions/renal-artery-stenosis/symptoms-causes/syc-20352777#" target="_blank" rel="noopener external">Mayo Clinic</a><br>
        <a href="https://www.health.harvard.edu/medical-dictionary-of-health-terms/q-through-z#S-terms" target="_blank" rel="noopener external">Harvad Health</a> `,
        credits: `<a href="https://sketchfab.com/3d-models/transplant-renal-artery-stenosis-d296be9d273d452db34ef651befd4e6d" target="_blank" rel="noopener external">tl0615</a> (adapted)`,
 
    },
    ardosia: {
        whatis: 'Deep vein thrombosis (DVT) occurs when a blood clot (thrombus) forms in one or more of the deep veins in your body, usually in your legs. Deep vein thrombosis can cause leg pain or swelling, but also can occur with no symptoms.',
        risk: 'Deep vein thrombosis can develop if you have certain medical conditions that affect how your blood clots. It can also happen if you don\'t move for a long time, such as after surgery or an accident, or when you\'re confined to bed.',
        
        whatisPT: 'A trombose venosa profunda (TVP) ocorre quando um coágulo de sangue (trombo) se forma em uma ou mais veias profundas de seu corpo, geralmente em suas pernas. A trombose venosa profunda pode causar dor ou inchaço nas pernas, mas também pode ocorrer sem sintomas.',
        riskPT: 'A trombose venosa profunda pode se desenvolver se você tiver certas condições médicas que afetam como seu sangue coagula. Também pode acontecer se você não se mexer por muito tempo, como após uma cirurgia ou um acidente, ou quando você estiver confinado à cama',
        
        source: `<a href="https://www.mayoclinic.org/diseases-conditions/deep-vein-thrombosis/symptoms-causes/syc-20352557#:~:text=Blood%20clot%20in%20leg%20vein,-A%20blood%20clot&text=Deep%20vein%20thrombosis%20(DVT)%20occurs,can%20occur%20with%20no%20symptoms" target="_blank" rel="noopener external">Mayo Clinic</a><br>
        <a href="https://natfonline.org/patients/what-is-thrombosis/" target="_blank" rel="noopener external">NAFT</a>`,
        credits: '<a href="https://sketchfab.com/3d-models/thrombus-left-atrial-appendage-d552d0f38eb74e46837c718fede257f0" target="_blank" rel="noopener external">tl0615</a> (adapted)',

    },
    marmore: {
        whatis: 'a',
        risk: 'Deep vein thrombosis can develop if you have certain medical conditions that affect how your blood clots. It can also happen if you don\'t move for a long time, such as after surgery or an accident, or when you\'re confined to bed.',
        
        whatisPT: 'A trombose venosa profunda (TVP) ocorre quando um coágulo de sangue (trombo) se forma em uma ou mais veias profundas de seu corpo, geralmente em suas pernas. A trombose venosa profunda pode causar dor ou inchaço nas pernas, mas também pode ocorrer sem sintomas.',
        riskPT: 'A trombose venosa profunda pode se desenvolver se você tiver certas condições médicas que afetam como seu sangue coagula. Também pode acontecer se você não se mexer por muito tempo, como após uma cirurgia ou um acidente, ou quando você estiver confinado à cama',
        
        source: `<a href="https://www.mayoclinic.org/diseases-conditions/deep-vein-thrombosis/symptoms-causes/syc-20352557#:~:text=Blood%20clot%20in%20leg%20vein,-A%20blood%20clot&text=Deep%20vein%20thrombosis%20(DVT)%20occurs,can%20occur%20with%20no%20symptoms" target="_blank" rel="noopener external">Mayo Clinic</a><br>
        <a href="https://natfonline.org/patients/what-is-thrombosis/" target="_blank" rel="noopener external">NAFT</a>`,
        credits: '<a href="https://sketchfab.com/3d-models/thrombus-left-atrial-appendage-d552d0f38eb74e46837c718fede257f0" target="_blank" rel="noopener external">tl0615</a> (adapted)',

    }
}

const contentPT = {
    calcario: {
        whatisPT: 'Um derrame cerebral ocorre quando o suprimento de sangue para parte do cérebro é interrompido ou reduzido, impedindo que o tecido cerebral obtenha oxigênio e nutrientes. As células cerebrais começam a morrer em minutos. Um derrame cerebral é uma emergência médica, e o tratamento imediato é crucial. A ação precoce pode reduzir os danos cerebrais e outras complicações.',
        riskPT: 'Os principais fatores de risco são pressão arterial alta, ou hipertensão, nicotina e monóxido de carbono na fumaça do cigarro, inatividade física e uma dieta pouco saudável que resulta em diabetes ou colesterol alto no sangue.',
        
    },
    basalto: {
        whatisPT: 'Um aneurisma ocorre quando parte da parede de uma artéria se enfraquece, permitindo que se forme uma bolha ou que ela se amplie anormalmente. Aneurismas podem acontecer em qualquer lugar, mas o mais comuns são: Aneurisma aórtico ocorre na artéria principal do coração; Aneurisma cerebral ocorre no cérebro; Aneurisma de artéria poplítea ocorre na perna atrás do joelho; Aneurisma de artéria mesentérica ocorre no intestino; Aneurisma de artéria esplênica ocorre em uma artéria no baço;',
        riskPT: 'Fumo, pressão arterial elevada (hipertensão), forte histórico familiar de aneurismas cerebrais (aneurismas familiares), idade (acima de 40 anos), presença de uma malformação arteriovenosa (AVM), anormalidade congênita na parede arterial, uso de drogas, particularmente cocaína, uso excessivo de álcool e traumatismo craniano severo são alguns dos principais fatores de risco.',
        
    },
    granito: {
        whatisPT: 'A estenose é um estreitamento anormal dos vasos sanguíneos, artérias, ou outro tipo de abertura no corpo. O modelo 3D representa uma estenose da artéria renal, que pode danificar os tecidos renais devido à falta da quantidade correta de sangue rico em oxigênio.',
        riskPT: 'Fatores de risco de estreitamento das artérias dos rins e de outras partes do corpo incluem: envelhecimento, pressão alta, diabetes, obesidade, uso de tabaco, histórico familiar de doenças cardíacas precoces e falta de exercício.',
        
    },
    ardosia: {
        whatisPT: 'A trombose venosa profunda (TVP) ocorre quando um coágulo de sangue (trombo) se forma em uma ou mais veias profundas de seu corpo, geralmente em suas pernas. A trombose venosa profunda pode causar dor ou inchaço nas pernas, mas também pode ocorrer sem sintomas.',
        riskPT: 'A trombose venosa profunda pode se desenvolver se você tiver certas condições médicas que afetam como seu sangue coagula. Também pode acontecer se você não se mexer por muito tempo, como após uma cirurgia ou um acidente, ou quando você estiver confinado à cama',
        
    },
    marmore: {
        whatisPT: 'a',
        riskPT: 'A trombose venosa profunda pode se desenvolver se você tiver certas condições médicas que afetam como seu sangue coagula. Também pode acontecer se você não se mexer por muito tempo, como após uma cirurgia ou um acidente, ou quando você estiver confinado à cama',
        
    }
}

function changeContent() {
    let value = document.querySelector('#selector').value;
    let info = content[value];

 /*    if (language === 'pt-BR') {
        document.querySelector('#whatis').innerHTML = info.whatisPT;
        document.querySelector('#risk').innerHTML = info.riskPT;
        
    }
    else {
        document.querySelector('#whatis').innerHTML = info.whatis;
        document.querySelector('#risk').innerHTML = info.risk;
        
    }
    document.querySelector('#source').innerHTML = info.source;
    document.querySelector('#credits').innerHTML = info.credits; */

    calcario.visible = false;
    basalto.visible = false;
    granito.visible = false;
    ardosia.visible = false;
    marmore.visible = false;

    trackballControls.reset();

    trackballControls.update();

    info.model.visible = true;
}
console.log(content);
function changeLanguage(newLang) {
    console.log('Change', newLang, language)
    if (newLang !== language) {
        let info
        let value = document.querySelector('#selector').value;

        if (newLang === 'pt-BR') {
            info = content[value];
            console.log(newLang)

/*             document.querySelector('#whatis').innerHTML = info.whatisPT;
            document.querySelector('#risk').innerHTML = info.riskPT;


            document.querySelector('#whatis-title').innerHTML = 'O que é?';
            document.querySelector('#risk-title').innerHTML = 'Fatores de risco';

            document.querySelector('#source-title').innerHTML = 'Fontes';
            document.querySelector('#credits-title').innerHTML = 'Créditos Modelo 3D'; */

            document.querySelector('#opt-calcario').innerHTML = "calcario";
            document.querySelector('#opt-basalto').innerHTML = "basalto";
            document.querySelector('#opt-granito').innerHTML = "granito";
            document.querySelector('#opt-ardosia').innerHTML = "ardosia";
            document.querySelector('#opt-marmore').innerHTML = "Marmore";

            language = newLang;
        }
        else {
            info = content[value];
            console.log(newLang, ' !')
/* 
            document.querySelector('#whatis').innerHTML = info.whatis;
            document.querySelector('#risk').innerHTML = info.risk;


            document.querySelector('#whatis-title').innerHTML = 'What is';
            document.querySelector('#risk-title').innerHTML = 'Risk Factors';

            document.querySelector('#source-title').innerHTML = 'Source';
            document.querySelector('#credits-title').innerHTML = 'Model 3D Credits'; */

            document.querySelector('#opt-calcario').innerHTML = "calcario";
            document.querySelector('#opt-basalto').innerHTML = "basalto";
            document.querySelector('#opt-granito').innerHTML = "granito";
            document.querySelector('#opt-ardosia').innerHTML = "ardosia";
            document.querySelector('#opt-marmore').innerHTML = "Marmore";

            language = 'en-US';
        }
    }
}

window.onload = function () {
    const url = new URLSearchParams(window.location.search);
    const lang = url.get('lang');
    console.log(url, lang);

    if (lang && lang === 'pt-BR') {
        changeLanguage('pt-BR');
    }
}
