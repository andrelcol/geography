let rendererStats, renderer, scene, camera, trackballControls, light, ambientLight, controls, gui, clock;
let stroke, aneurysm, stenosis, thrombus, highlight, viewpoint, isMouseOut;
let language = 'en-US';

const decoder = new THREE.DRACOLoader()
decoder.setDecoderPath('../libs/three/build/js/libs/draco/');

const ASSETS = {
    textures: {
        helper: {
            path: 'assets/textures/loader-helper.jpg',
            fileSize: 7749 + 515 + 143 + 3323,
        }
    },
    geometries: {
        sphereGeometry: new THREE.SphereGeometry(1, 20, 20),
    },
    materials: {
        sphereMaterial: new THREE.MeshPhongMaterial({ color: 0x0D8CFF, transparent: true, opacity: 0.5, wireframe: false })
    },

    objects: {
        stroke: {
            path: 'assets/models/vascular-diseases/stroke.glb',
            fileSize: 7749,
            draco: decoder // the first model needs to set the draco decoder
        },
        aneurysm: {
            path: 'assets/models/vascular-diseases/aneurysm.glb',
            fileSize: 515,
        },
        stenosis: {
            path: 'assets/models/vascular-diseases/stenosis.glb',
            fileSize: 143,
            // draco: decoder
        },
        thrombus: {
            path: 'assets/models/vascular-diseases/thrombus.glb',
            fileSize: 3.323,
        },
        highlight: {
            geometry: 'sphereGeometry',
            material: 'sphereMaterial',
        }
    }
};

setRenderer();

const ls = new LoadScreen(renderer, { type: 'stepped-circular', progressColor: '#447' })
    .onComplete(init)
    .start(ASSETS);

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

    light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 0, 100);
    scene.add(light);

    trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.minDistance = 10;
    trackballControls.maxDistance = 120;
    trackballControls.rotateSpeed = 4;

    stroke = ASSETS.objects.stroke;
    stroke.scale.set(0.45, 0.45, 0.45);
    stroke.position.set(0, 15, 0);
    stroke.rotation.set(0, -Math.PI / 12, 0);
    stroke.visible = true;
    content.stroke.model = stroke;
    scene.add(stroke);

    aneurysm = ASSETS.objects.aneurysm;
    aneurysm.scale.set(200, 200, 200);
    aneurysm.position.set(-5, -35, 10);
    aneurysm.visible = false;
    content.aneurysm.model = aneurysm;
    scene.add(aneurysm)

    stenosis = ASSETS.objects.stenosis;
    stenosis.scale.set(0.6, 0.6, 0.6);
    stenosis.position.set(0, -10, 0);
    stenosis.visible = false;
    content.stenosis.model = stenosis;
    scene.add(stenosis)

    thrombus = ASSETS.objects.thrombus;
    thrombus.scale.set(600, 600, 600);
    thrombus.position.set(0, -20, 0);
    thrombus.rotation.set(0, -Math.PI / 6, 0);
    thrombus.visible = false;
    content.thrombus.model = thrombus;
    scene.add(thrombus)

    highlight = ASSETS.objects.highlight;
    highlight.position.set(-3.5, -2, 7.5);
    highlight.scale.set(4.2, 4.2, 4.3);
    highlight.pointView = new THREE.Vector3(2, 4, -8);
    scene.add(highlight)

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
    stroke: {
        whatis: 'A stroke occurs when the blood supply to part of your brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients. Brain cells begin to die in minutes. A stroke is a medical emergency, and prompt treatment is crucial. Early action can reduce brain damage and other complications.',
        risk: 'The main risk factors are high blood pressure, or hypertension, nicotine and carbon monoxide in cigarette smoke, physical inactivity and a unhealthy diet that results in diabetes or high blood cholesterol.',
        symptoms: 'Trouble speaking and understanding what others are saying, paralysis or numbness of the face, arm or leg, problems seeing in one or both eyes, headache and trouble walking are the most common symptoms.',
        whatisPT: 'Um derrame cerebral ocorre quando o suprimento de sangue para parte do c??rebro ?? interrompido ou reduzido, impedindo que o tecido cerebral obtenha oxig??nio e nutrientes. As c??lulas cerebrais come??am a morrer em minutos. Um derrame cerebral ?? uma emerg??ncia m??dica, e o tratamento imediato ?? crucial. A a????o precoce pode reduzir os danos cerebrais e outras complica????es.',
        riskPT: 'Os principais fatores de risco s??o press??o arterial alta, ou hipertens??o, nicotina e mon??xido de carbono na fuma??a do cigarro, inatividade f??sica e uma dieta pouco saud??vel que resulta em diabetes ou colesterol alto no sangue.',
        symptomsPT: 'Problemas para falar e entender o que os outros est??o dizendo, paralisia ou dorm??ncia do rosto, bra??o ou perna, problemas para ver em um ou ambos os olhos, dor de cabe??a e problemas para andar s??o os sintomas mais comuns.',
        source: `<a href="https://www.nhlbi.nih.gov/health-topics/stroke" target="_blank" rel="noopener external">NHLBI</a><br/>
        <a href="https://www.stroke.org/en/about-stroke/stroke-risk-factors/stroke-risk-factors-you-can-control-treat-and-improve" target="_blank" rel="noopener external">Stroke.org</a><br/>
        <a href="https://www.mayoclinic.org/diseases-conditions/stroke/symptoms-causes/syc-20350113" target="_blank" rel="noopener external">Mayo Clinic</a>`,
        credits: `<a href="https://3dprint.nih.gov/discover/3DPX-001564" target="_blank" rel="noopener external">3D Print
        for Health</a>`,

        highlight: {
            position: new THREE.Vector3(-3.5, -2, 7.5),
            scale: new THREE.Vector3(4.2, 4.2, 4.3),
            pointView: new THREE.Vector3(4, 2, -8),
        }
    },
    aneurysm: {
        whatis: 'An aneurysm occurs when part of an artery wall weakens, allowing it to balloon out or widen abnormally.Aneurysms can occur anywhere, but the most common are: Aortic aneurysm occurs in the major artery from the heart; Cerebral aneurysm occurs in the brain; Popliteal artery aneurysm occurs in the leg behind the knee; Mesenteric artery aneurysm occurs in the intestine; Splenic artery aneurysm occurs in an artery in the spleen;',
        risk: 'SmokingHigh blood pressure (hypertension), strong family history of brain aneurysms (familial aneurysms), age (over 40), presence of an arteriovenous malformation (AVM), congenital abnormality in the artery wall, drug use, particularly cocaine ,excessive alcohol use and severe head trauma are some of the main rik factors.',
        symptoms: 'If an aneurysm expands quickly or ruptures, symptoms may develop suddenly and include: pain, clammy skin, dizziness, nausea and vomiting, rapid heart rate, shock, low blood pressure.',
        whatisPT: 'Um aneurisma ocorre quando parte da parede de uma art??ria se enfraquece, permitindo que se forme uma bolha ou que ela se amplie anormalmente. Aneurismas podem acontecer em qualquer lugar, mas o mais comuns s??o: Aneurisma a??rtico ocorre na art??ria principal do cora????o; Aneurisma cerebral ocorre no c??rebro; Aneurisma de art??ria popl??tea ocorre na perna atr??s do joelho; Aneurisma de art??ria mesent??rica ocorre no intestino; Aneurisma de art??ria espl??nica ocorre em uma art??ria no ba??o;',
        riskPT: 'Fumo, press??o arterial elevada (hipertens??o), forte hist??rico familiar de aneurismas cerebrais (aneurismas familiares), idade (acima de 40 anos), presen??a de uma malforma????o arteriovenosa (AVM), anormalidade cong??nita na parede arterial, uso de drogas, particularmente coca??na, uso excessivo de ??lcool e traumatismo craniano severo s??o alguns dos principais fatores de risco.',
        symptomsPT: 'Se um aneurisma se expande rapidamente ou se rompe, os sintomas podem se desenvolver repentinamente e incluir: dor, pele ??mida, tonturas, n??useas e v??mitos, ritmo card??aco acelerado, choque, press??o sangu??nea baixa.',
        source: `<a href="https://bafound.org/about-brain-aneurysms/brain-aneurysm-basics/risk-factors/" target="_blank" rel="noopener external">Brain Aneurysm Foundantion</a><br/>
        <a href="https://www.heart.org/en/health-topics/aortic-aneurysm/what-is-an-aneurysm" target="_blank" rel="noopener external">Heart.org</a>`,
        credits: '<a href="https://sketchfab.com/3d-models/abdominal-aortic-aneurysm-e951550381ad49739a38f9ffb2370899" target="_blank" rel="noopener external">laurenwahl</a> (adapted)',
        highlight: {
            position: new THREE.Vector3(-3, 2, 2),
            scale: new THREE.Vector3(10.2, 10.2, 10.2),
            pointView: new THREE.Vector3(2, -10, -30),
        }
    },
    stenosis: {
        whatis: 'Stenosis is an abnormal narrowing of blood vessels, arterys, or other type of opening in the body. The 3D model represents a renal artery stenosis, which may damage the kidney tissues due the lack of the correct amount of oxygen-rich blood.',
        risk: 'Risk factors of narrowed arteries from the kidneys and from other parts of the body includes:  aging, high blood pressure, diabetes, obesity, tobacco usage, family history of early heart disease, and lack of exercise.',
        symptoms: 'Often there are no symptoms of renal artery stenosis until it???s advanced, but once the disease progresses there could be high blood pressure that is hard to control, elevated levels of protein in the urine, worsening of kidneys function during treatment for high blood pressure, fluid overload and swelling in your body???s tissues, and treatment-resistant heart failure.',
        whatisPT: 'A estenose ?? um estreitamento anormal dos vasos sangu??neos, art??rias, ou outro tipo de abertura no corpo. O modelo 3D representa uma estenose da art??ria renal, que pode danificar os tecidos renais devido ?? falta da quantidade correta de sangue rico em oxig??nio.',
        riskPT: 'Fatores de risco de estreitamento das art??rias dos rins e de outras partes do corpo incluem: envelhecimento, press??o alta, diabetes, obesidade, uso de tabaco, hist??rico familiar de doen??as card??acas precoces e falta de exerc??cio.',
        symptomsPT: 'Muitas vezes n??o h?? sintomas de estenose da art??ria renal at?? que ela esteja avan??ada, mas uma vez que a doen??a progrida pode haver press??o sangu??nea alta que ?? dif??cil de controlar, n??veis elevados de prote??na na urina, piora da fun????o dos rins durante o tratamento para press??o sangu??nea alta, sobrecarga de l??quidos e incha??o nos tecidos de seu corpo, e insufici??ncia card??aca resistente ao tratamento.',
        source: `<a href="https://www.mayoclinic.org/diseases-conditions/renal-artery-stenosis/symptoms-causes/syc-20352777#" target="_blank" rel="noopener external">Mayo Clinic</a><br>
        <a href="https://www.health.harvard.edu/medical-dictionary-of-health-terms/q-through-z#S-terms" target="_blank" rel="noopener external">Harvad Health</a> `,
        credits: `<a href="https://sketchfab.com/3d-models/transplant-renal-artery-stenosis-d296be9d273d452db34ef651befd4e6d" target="_blank" rel="noopener external">tl0615</a> (adapted)`,
        highlight: {
            position: new THREE.Vector3(1, -5, 3),
            scale: new THREE.Vector3(3, 3, 3),
            pointView: new THREE.Vector3(4, -5, -8),
        }
    },
    thrombus: {
        whatis: 'Deep vein thrombosis (DVT) occurs when a blood clot (thrombus) forms in one or more of the deep veins in your body, usually in your legs. Deep vein thrombosis can cause leg pain or swelling, but also can occur with no symptoms.',
        risk: 'Deep vein thrombosis can develop if you have certain medical conditions that affect how your blood clots. It can also happen if you don\'t move for a long time, such as after surgery or an accident, or when you\'re confined to bed.',
        symptoms: 'Deep vein thrombosis signs and symptoms can include:Swelling in the affected leg. Rarely, there\'s swelling in both legs, pain in the leg( the pain often starts in your calf and can feel like cramping or soreness), red or discolored skin on the leg, a feeling of warmth in the affected leg.Deep vein thrombosis can occur without noticeable symptoms.',
        whatisPT: 'A trombose venosa profunda (TVP) ocorre quando um co??gulo de sangue (trombo) se forma em uma ou mais veias profundas de seu corpo, geralmente em suas pernas. A trombose venosa profunda pode causar dor ou incha??o nas pernas, mas tamb??m pode ocorrer sem sintomas.',
        riskPT: 'A trombose venosa profunda pode se desenvolver se voc?? tiver certas condi????es m??dicas que afetam como seu sangue coagula. Tamb??m pode acontecer se voc?? n??o se mexer por muito tempo, como ap??s uma cirurgia ou um acidente, ou quando voc?? estiver confinado ?? cama',
        symptomsPT: 'Os sinais e sintomas de trombose venosa profunda podem incluir: Incha??o na perna afetada. Raramente, h?? incha??o em ambas as pernas, dor na perna (a dor muitas vezes come??a na panturrilha e pode parecer c??lica ou dor), pele vermelha ou descolorida na perna afetada, uma sensa????o de calor na perna afetada.',
        source: `<a href="https://www.mayoclinic.org/diseases-conditions/deep-vein-thrombosis/symptoms-causes/syc-20352557#:~:text=Blood%20clot%20in%20leg%20vein,-A%20blood%20clot&text=Deep%20vein%20thrombosis%20(DVT)%20occurs,can%20occur%20with%20no%20symptoms" target="_blank" rel="noopener external">Mayo Clinic</a><br>
        <a href="https://natfonline.org/patients/what-is-thrombosis/" target="_blank" rel="noopener external">NAFT</a>`,
        credits: '<a href="https://sketchfab.com/3d-models/thrombus-left-atrial-appendage-d552d0f38eb74e46837c718fede257f0" target="_blank" rel="noopener external">tl0615</a> (adapted)',
        highlight: {
            position: new THREE.Vector3(5, -8, 18.5),
            scale: new THREE.Vector3(11, 11, 11),
            pointView: new THREE.Vector3(1, -6, 43),
        }
    },
}

const contentPT = {
    stroke: {
        whatisPT: 'Um derrame cerebral ocorre quando o suprimento de sangue para parte do c??rebro ?? interrompido ou reduzido, impedindo que o tecido cerebral obtenha oxig??nio e nutrientes. As c??lulas cerebrais come??am a morrer em minutos. Um derrame cerebral ?? uma emerg??ncia m??dica, e o tratamento imediato ?? crucial. A a????o precoce pode reduzir os danos cerebrais e outras complica????es.',
        riskPT: 'Os principais fatores de risco s??o press??o arterial alta, ou hipertens??o, nicotina e mon??xido de carbono na fuma??a do cigarro, inatividade f??sica e uma dieta pouco saud??vel que resulta em diabetes ou colesterol alto no sangue.',
        symptomsPT: 'Problemas para falar e entender o que os outros est??o dizendo, paralisia ou dorm??ncia do rosto, bra??o ou perna, problemas para ver em um ou ambos os olhos, dor de cabe??a e problemas para andar s??o os sintomas mais comuns.',
    },
    aneurysm: {
        whatisPT: 'Um aneurisma ocorre quando parte da parede de uma art??ria se enfraquece, permitindo que se forme uma bolha ou que ela se amplie anormalmente. Aneurismas podem acontecer em qualquer lugar, mas o mais comuns s??o: Aneurisma a??rtico ocorre na art??ria principal do cora????o; Aneurisma cerebral ocorre no c??rebro; Aneurisma de art??ria popl??tea ocorre na perna atr??s do joelho; Aneurisma de art??ria mesent??rica ocorre no intestino; Aneurisma de art??ria espl??nica ocorre em uma art??ria no ba??o;',
        riskPT: 'Fumo, press??o arterial elevada (hipertens??o), forte hist??rico familiar de aneurismas cerebrais (aneurismas familiares), idade (acima de 40 anos), presen??a de uma malforma????o arteriovenosa (AVM), anormalidade cong??nita na parede arterial, uso de drogas, particularmente coca??na, uso excessivo de ??lcool e traumatismo craniano severo s??o alguns dos principais fatores de risco.',
        symptomsPT: 'Se um aneurisma se expande rapidamente ou se rompe, os sintomas podem se desenvolver repentinamente e incluir: dor, pele ??mida, tonturas, n??useas e v??mitos, ritmo card??aco acelerado, choque, press??o sangu??nea baixa.',
    },
    stenosis: {
        whatisPT: 'A estenose ?? um estreitamento anormal dos vasos sangu??neos, art??rias, ou outro tipo de abertura no corpo. O modelo 3D representa uma estenose da art??ria renal, que pode danificar os tecidos renais devido ?? falta da quantidade correta de sangue rico em oxig??nio.',
        riskPT: 'Fatores de risco de estreitamento das art??rias dos rins e de outras partes do corpo incluem: envelhecimento, press??o alta, diabetes, obesidade, uso de tabaco, hist??rico familiar de doen??as card??acas precoces e falta de exerc??cio.',
        symptomsPT: 'Muitas vezes n??o h?? sintomas de estenose da art??ria renal at?? que ela esteja avan??ada, mas uma vez que a doen??a progrida pode haver press??o sangu??nea alta que ?? dif??cil de controlar, n??veis elevados de prote??na na urina, piora da fun????o dos rins durante o tratamento para press??o sangu??nea alta, sobrecarga de l??quidos e incha??o nos tecidos de seu corpo, e insufici??ncia card??aca resistente ao tratamento.',
    },
    thrombus: {
        whatisPT: 'A trombose venosa profunda (TVP) ocorre quando um co??gulo de sangue (trombo) se forma em uma ou mais veias profundas de seu corpo, geralmente em suas pernas. A trombose venosa profunda pode causar dor ou incha??o nas pernas, mas tamb??m pode ocorrer sem sintomas.',
        riskPT: 'A trombose venosa profunda pode se desenvolver se voc?? tiver certas condi????es m??dicas que afetam como seu sangue coagula. Tamb??m pode acontecer se voc?? n??o se mexer por muito tempo, como ap??s uma cirurgia ou um acidente, ou quando voc?? estiver confinado ?? cama',
        symptomsPT: 'Os sinais e sintomas de trombose venosa profunda podem incluir: Incha??o na perna afetada. Raramente, h?? incha??o em ambas as pernas, dor na perna (a dor muitas vezes come??a na panturrilha e pode parecer c??lica ou dor), pele vermelha ou descolorida na perna afetada, uma sensa????o de calor na perna afetada.',
    },
}

function changeContent() {
    let value = document.querySelector('#selector').value;
    let info = content[value];

    if (language === 'pt-BR') {
        document.querySelector('#whatis').innerHTML = info.whatisPT;
        document.querySelector('#risk').innerHTML = info.riskPT;
        document.querySelector('#symptoms').innerHTML = info.symptomsPT;
    }
    else {
        document.querySelector('#whatis').innerHTML = info.whatis;
        document.querySelector('#risk').innerHTML = info.risk;
        document.querySelector('#symptoms').innerHTML = info.symptoms;
    }
    document.querySelector('#source').innerHTML = info.source;
    document.querySelector('#credits').innerHTML = info.credits;

    stroke.visible = false;
    aneurysm.visible = false;
    stenosis.visible = false;
    thrombus.visible = false;

    trackballControls.reset();

    highlight.position.copy(info.highlight.position);
    highlight.scale.copy(info.highlight.scale);
    highlight.pointView.copy(info.highlight.pointView);
    camera.lookAt(info.highlight.position);
    trackballControls.update();

    info.model.visible = true;
}

function changeLanguage(newLang) {
    console.log('Change', newLang, language)
    if (newLang !== language) {
        let info
        let value = document.querySelector('#selector').value;

        if (newLang === 'pt-BR') {
            info = content[value];
            console.log(newLang)

            document.querySelector('#whatis').innerHTML = info.whatisPT;
            document.querySelector('#risk').innerHTML = info.riskPT;
            document.querySelector('#symptoms').innerHTML = info.symptomsPT;

            document.querySelector('#whatis-title').innerHTML = 'O que ???';
            document.querySelector('#risk-title').innerHTML = 'Fatores de risco';
            document.querySelector('#symptoms-title').innerHTML = 'Sintomas';
            document.querySelector('#source-title').innerHTML = 'Fontes';
            document.querySelector('#credits-title').innerHTML = 'Cr??ditos Modelo 3D';

            document.querySelector('#opt-stroke').innerHTML = "Derrame";
            document.querySelector('#opt-aneurism').innerHTML = "Aneurimsa";
            document.querySelector('#opt-stenosis').innerHTML = "Estenose";
            document.querySelector('#opt-thrombus').innerHTML = "Trombose";

            document.querySelector('#label-highlight').innerHTML = "Ativar/Desativar destaque";
            document.querySelector('#lookClose').value = "Olhar de perto";
            document.querySelector('#resetCamera').value = "Resetar Camera"

            language = newLang;
        }
        else {
            info = content[value];
            console.log(newLang, ' !')

            document.querySelector('#whatis').innerHTML = info.whatis;
            document.querySelector('#risk').innerHTML = info.risk;
            document.querySelector('#symptoms').innerHTML = info.symptoms;

            document.querySelector('#whatis-title').innerHTML = 'What is';
            document.querySelector('#risk-title').innerHTML = 'Risk Factors';
            document.querySelector('#symptoms-title').innerHTML = 'Symptoms';
            document.querySelector('#source-title').innerHTML = 'Source';
            document.querySelector('#credits-title').innerHTML = 'Model 3D Credits';

            document.querySelector('#opt-stroke').innerHTML = "Stroke";
            document.querySelector('#opt-aneurism').innerHTML = "Aneurism";
            document.querySelector('#opt-stenosis').innerHTML = "Stenosis";
            document.querySelector('#opt-thrombus').innerHTML = "Thrombus";

            document.querySelector('#label-highlight').innerHTML = "Toggle Highlight";
            document.querySelector('#lookClose').value = "Look Closer";
            document.querySelector('#resetCamera').value = "Reset Camera"

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

function toggleHighlight() {
    highlight.visible = !highlight.visible;
}

function LookClose() {
    camera.position.copy(highlight.pointView);
    camera.lookAt(highlight.position);
    trackballControls.update();
}

function ResetCamera() {
    camera.position.set(0, 0, 100);
    camera.lookAt(highlight.position);
    trackballControls.reset();
    trackballControls.update();
}