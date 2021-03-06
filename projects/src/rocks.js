let rendererStats, renderer, scene, camera, trackballControls, light, ambientLight, controls, gui, clock;
let calcario, basalto, granito, ardosia, marmore, highlight, viewpoint, isMouseOut;
let language = 'en-US';
let quality = 0;
let lang = 'en-US';
let ASSETS;

const decoder = new THREE.DRACOLoader().setDecoderPath('../libs/draco/gltf/');

var searchBar = location.search;
        
if(searchBar.length != 0){
    let langPattern = "?lang=";
    let separatorIndex = searchBar.indexOf("&");
    let qualityPattern = "&quality=";
    lang = searchBar.substring(langPattern.length, separatorIndex);
    quality = parseInt(searchBar.substring(separatorIndex + qualityPattern.length, searchBar.length));
}
else{                                     
    quality = 0;
}
console.log(quality)
if(quality == 1)
{
    ASSETS = {
        textures: {
            helper: {
                path: 'assets/textures/loader-helper.jpg',
                fileSize: 23521 + 24647 + 32702 + 13302 + 26344, 
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
                path: 'assets/models/rocks/limestone.glb',
                fileSize: 23521,
                draco: decoder // the first model needs to set the draco decoder
            },
            basalto: {
                path: 'assets/models/rocks/basalt.glb',
                fileSize: 24647,
            },
            granito: {
                path: 'assets/models/rocks/granite.glb',
                fileSize: 32702,
            },
            ardosia: {
                path: 'assets/models/rocks/slate.glb',
                fileSize: 13302,
            },
            marmore: {
                path: 'assets/models/rocks/marble.glb',
                fileSize: 26344,
            }
        }
    };
} else {
    ASSETS = {
        textures: {
            helper: {
                path: 'assets/textures/loader-helper.jpg',
                fileSize: 1627 + 2095 + 2350 + 1799 + 2310, 
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
                path: 'assets/models/rocks/limestone_low.glb',
                fileSize: 1627,
                draco: decoder // the first model needs to set the draco decoder
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
}


setRenderer();

var ls = new LoadScreen(renderer,{type:'stepped-circular-fancy-offset', progressColor:'#fff',infoStyle:{padding:'0'}}).onComplete(init).start(ASSETS);
/*
const ls = new LoadScreen(renderer, { type: 'stepped-circular', progressColor: '#447' })
    .onComplete(init)
    .start(ASSETS);
*/
function init() {
    initStats();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 700);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    onResize();

    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    //scene.add(ambientLight);
    console.log('aaaa')
    light = new THREE.DirectionalLight(0xffffff, 2);
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
    calcario.visible = false;
    content.calcario.model = calcario;
    scene.add(calcario);

    basalto = ASSETS.objects.basalto;
    basalto.scale.set(2, 2, 2);
    basalto.position.set(0, -20, 0);
    basalto.visible = true;
    content.basalto.model = basalto;
    scene.add(basalto)

    granito = ASSETS.objects.granito;
    granito.scale.set(30, 30, 30);
    granito.position.set(0, 0, 0);
    granito.rotation.set(0, -Math.PI / 12, 0);
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
    marmore.scale.set(1.5, 1.5, 1.5);
    marmore.position.set(0, 1, 0);
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
        whatis: 'Limestone is a sedimentary rock that contains minerals with amounts above 30% of calcium carbonate (aragonite or calcite). Limestones are most often formed by the accumulation of lower organisms (eg, cyanobacteria) or calcium carbonate precipitation in the form of bicarbonate, mainly in the marine environment. They can also be found in rivers, lakes and underground (caves).',
        risk: 'Limestone is the main product used to correct soil acidity. Generally speaking, it acts by reducing the amount of harmful elements, increasing the level of Calcium and Magnesium, thus making the soil more aerated, allowing greater water circulation and better root development and, as a result, increasing the activity of microorganisms causing that the fertilization yields more.The benefits generated by the application in crops and pastures start with greater productivity, synonymous with better yields for landowners, regardless of the areas extension.',
        
        whatisPT: 'Calc??rio ?? uma rocha sedimentar que cont??m minerais com quantidades acima de 30% de carbonato de c??lcio (aragonita ou calcita). Os calc??rios, na maioria das vezes, s??o formados pelo ac??mulo de organismos inferiores (por exemplo, cianobact??rias) ou precipita????o de carbonato de c??lcio na forma de bicarbonato, principalmente em meio marinho. Tamb??m podem ser encontrados em rios, lagos e no subsolo (cavernas).',
        riskPT: 'O calc??rio ?? o principal produto utilizado para corrigir a acidez do solo. Em linhas gerais age reduzindo a quantidade dos elementos nocivos, aumentando o n??vel de C??lcio e Magn??sio, tornando assim o solo mais aerado, permitindo maior circula????o de ??gua e melhor desenvolvimento das ra??zes e, em consequ??ncia, proporcionando o aumento da atividade dos microrganismos fazendo com que a aduba????o renda mais. Os benef??cios gerados pela aplica????o na lavoura e nas pastagens come??am pela maior produtividade, sin??nimo de melhores rendimentos para os donos de terra, independente da extens??o da ??rea.',
        
        source: `<a href="https://pt.wikipedia.org/wiki/Calc%C3%A1rio" target="_blank" rel="noopener external">Wikipedia</a><br/>
        <a href="https://agropos.com.br/o-que-e-calcario/" target="_blank" rel="noopener external">Agropos</a><br/>`,
        credits: `<a href="https://sketchfab.com/3d-models/calcite-f842f5c568af4b808ad309ba3a8db538" target="_blank" rel="noopener external">Edurock</a> (adapted)`,

    },
    basalto: {
        whatis: 'Basalt is an eruptive rock, consolidated from magma outside the earths crust. It usually appears in large extensions called "lava rivers". , hard, and rich in iron and magnesium. Basalt is a rock made up of plagioclases (mainly labradorite) and mafic minerals, with secondary components such as rhombic pyroxemes, biotite, magnesite and ilmenite. There is also columnar basalt that comes from certain conditions cooling magma, causing disjunction in prisms.',
        risk: 'Basalt, due to its hardness and resistance to weathering, is used for the production of masonry and construction aggregates and as an ornamental stone for coverings and sidewalks. Basalt fiber production is a booming industry.',
        
        whatisPT: 'O basalto ?? uma rocha eruptiva, consolidada a partir do magma no exterior da crusta terrestre.Geralmente aparece em grandes extens??es denominadas "rios de lava".?? uma rocha b??sica, em geral melanocr??tica, de cor muito escura, de textura porf??rica, muito pesada, dura, e rica em ferro e magn??sio.O basalto ?? uma rocha constitu??da por plagioclases (sobretudo labradorite) e por minerais m??ficos, aparecendo componentes secund??rios como piroxemas r??mbicas, biotite, magnesite e ilmenite.Existe tamb??m o basalto colunar que prov??m de certas condi????es de arrefecimento do magma, originando a disjun????o em prismas.',
        riskPT: 'O basalto, pela sua dureza e resist??ncia ?? meteoriza????o, ?? explorada para a produ????o de alvenarias e de agregados de constru????o civil e como rocha ornamental para revestimentos e cal??adas. A produ????o de fibras de basalto ?? uma ind??stria em expans??o.',
        
        source: `<a href="https://www.infopedia.pt/$basalto#:~:text=O%20basalto%20%C3%A9%20uma%20rocha,rica%20em%20ferro%20e%20magn%C3%A9sio." target="_blank" rel="noopener external">Infopedia</a><br/>
        <a href="https://pt.wikipedia.org/wiki/Basalto" target="_blank" rel="noopener external">Wikipedia</a>`,
        credits: '<a href="https://sketchfab.com/3d-models/basalt-b6fa41f193c94eefa2661bdff7bd71e8" target="_blank" rel="noopener external">Edurock</a> (adapted)',

    },
    granito: {
        whatis: 'Granite is a rock formed by a set of minerals. Its composition is basically as follows: Quartz, a colorless mineral; Feldspar (orthoclase, sanidin and microcline), responsible for the variety of colors (reddish, pinkish and grayish-cream); Mica (biotite and muscovite), which gives the rock shine. The colors of granite most found in nature are gray and reddish tones, however they are found in the colors: white, black, blue, green, yellow and brown. Furthermore, granites can present minerals such as: amphibole (hornblende), pyroxene (augite and hyperstena), olivine, zircon, among others. It has a high degree of hardness, crystalline, varied color.',
        risk: 'The use of granite as a construction material, as an architectural piece, decorative piece and in the creation of many other products, has centuries of history. Granite is used in buildings, bridges, monuments, pavements and many other projects. In interiors, it is used on counters, as tiles on the floor or walls, stairs, columns and other decorative elements. It is considered a prestigious material, used to project elegance and quality.',
        
        whatisPT: 'O Granito ?? uma rocha formada por um conjunto de minerais.Sua composi????o ?? basicamente a seguinte:Quartzo, um mineral incolor;o Feldspato (ortoclase, sanidina e microclina), respons??vel pela variedade de cores (avermelhada, rosada e creme-acinzentada);Mica (biotite e moscovite), que confere o brilho ?? rocha.As cores de granito mais encontradas na natureza s??o as de tons cinzento e avermelhado, contudo encontram-se nas cores: branco, preto, azul, verde, amarelo e marrom.Al??m disso, os granitos podem apresentar minerais como: anf??bolas (hornblenda), piroxenas (augite e hiperstena), olivina, zirc??o, dentre outros.Possui alto grau de dureza, cristalino, colora????o variada.',
        riskPT: 'A utiliza????o do granito como material de constru????o, como pe??a arquitect??nica, pe??a decorativa e na cria????o de muitos outros produtos, tem s??culos de hist??ria.O granito ?? usado em edif??cios, pontes, monumentos, pavimentos e muitos outros projectos. Em interiores ?? usado em balc??es, como ladrilho em pavimento ou paredes, escadarias, colunas e outros elementos decorativas.?? considerado um material de prest??gio, utilizado para projectar eleg??ncia e qualidade.',
        
        source: `<a href="https://www.todamateria.com.br/tipos-de-granito-caracteristicas-e-composicao/" target="_blank" rel="noopener external">TodaMat??ria</a><br>
        <a href="https://gra2003.pt/pt/utilizacao-do-granito/" target="_blank" rel="noopener external">gra2003</a> `,
        credits: `<a href="https://sketchfab.com/3d-models/granite-ed0d206cc713484da07fa6cb645ec875#download" target="_blank" rel="noopener external">Digital Atlas</a> (adapted)`,
 
    },
    ardosia: {
        whatis: 'Slate is a siliceous-clay metamorphic rock formed by the transformation of clay under pressure and temperature, hardened into thin lamellae. Of low metamorphic grade, slate is formed under the lowest pressures and temperatures among metamorphic rocks.',
        risk: 'Currently, its main use is in floor and wall cladding. It is a rock much appreciated by architects, which combines rustic beauty with an affordable price. But in the past it was widely used on school blackboards.',
        
        whatisPT: 'A ard??sia ?? uma rocha metam??rfica s??lico-argilosa formada pela transforma????o da argila sob press??o e temperatura, endurecida em finas lamelas. De baixo grau metam??rfico, a ard??sia ?? formada sob as menores press??es e temperaturas dentre as rochas metam??rficas.',
        riskPT: 'Atualmente o seu maior uso est?? em revestimento de pisos e paredes. ?? uma rocha muito apreciada pelos arquitetos, que alia uma beleza r??stica a um pre??o acess??vel. Mas no passado foi muito utilizada nos quadros negros das escolas.',
        
        source: `<a href="https://pt.wikipedia.org/wiki/Ard%C3%B3sia" target="_blank" rel="noopener external">Wikipedia</a><br>
        <a href="https://www.hydronorth.com.br/blog-e-dicas/7/ja-ouviu-falar-sobre-a-pedra-ardosia.html" target="_blank" rel="noopener external">hydronoth</a>`,
        credits: '<a href="https://sketchfab.com/3d-models/helmsmans-slate-9747d38ca6a048f9a3c8522647affa23" target="_blank" rel="noopener external">Charlie Harper</a> (adapted)',

    },
    marmore: {
        whatis: 'Marble is a metamorphic rock that originates from limestone exposed to high temperatures and low to moderate pressure.[1] For this reason, the largest deposits of marble are found in regions of limestone matrix and where there was volcanic activity. Marble is a rock explored for use in civil construction.',
        risk: 'Marble is used in decorations, in the making of ornamental objects and sculptures. The famous Venus de Milo statue was carved in marble in the 2nd century BC Marble can still be used in civil construction in the manufacture of objects for household use such as sinks, tables and floors.',
        
        whatisPT: 'M??rmore ?? uma rocha metam??rfica originada de calc??rio exposto a altas temperaturas e press??o de baixa a moderada.[1] Por este motivo as maiores jazidas de m??rmore s??o encontradas em regi??es de rocha matriz calc??ria e onde houve atividade vulc??nica. O m??rmore ?? uma rocha explorada para uso em constru????o civil.',
        riskPT: 'O m??rmore ?? usado em decora????es, na confec????o de objetos ornamentais e esculturas. A famosa est??tua V??nus de Milo foi esculpida em m??rmore no s??culo II a.C. O m??rmore pode ainda ser usado em constru????es civis na fabrica????o de objetos para uso domiciliar como pias, mesas e pisos.',
        
        source: `<a href="https://pt.wikipedia.org/wiki/M%C3%A1rmore" target="_blank" rel="noopener external">Wikipedia</a><br>
        <a href="https://mundoeducacao.uol.com.br/quimica/marmore.htm" target="_blank" rel="noopener external">Mundo Educa????o</a>`,
        credits: '<a href="https://sketchfab.com/3d-models/marble-3e6a621e4b084e44b78e71e9eabfad99" target="_blank" rel="noopener external">EduRock</a> (adapted)',

    }
}


function changeContent() {
    let value = document.querySelector('#selector').value;
    let info = content[value];
    var language;
     if (lang === 'pt-BR') {
        document.querySelector('#whatis').innerHTML = info.whatisPT;
        document.querySelector('#risk').innerHTML = info.riskPT;
        
    }
    else {
        document.querySelector('#whatis').innerHTML = info.whatis;
        document.querySelector('#risk').innerHTML = info.risk;
        
    }
    document.querySelector('#source').innerHTML = info.source;
    document.querySelector('#credits').innerHTML = info.credits; 

    calcario.visible = false;
    basalto.visible = false;
    granito.visible = false;
    ardosia.visible = false;
    marmore.visible = false;
    scene.remove(light);
    scene.remove(ambientLight)

    console.log(value)

    if(content[value] == 'granito') {
        light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(0, 0, 100);
        scene.add(light);    
    }
    if(content[value] === calcario) {
        console.log('entrou')
        ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);
    }
    else {
        light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 100);
        scene.add(light);    
    }

    trackballControls.reset();

    trackballControls.update();

    info.model.visible = true;
}
console.log(content);
function changeLanguage(newLang) {
    console.log('Change', newLang, lang)
    if (newLang !== language) {
        let info
        let value = document.querySelector('#selector').value;

        if (newLang === 'pt-BR') {
            info = content[value];
            console.log(newLang)

            document.querySelector('#whatis').innerHTML = info.whatisPT;
            document.querySelector('#risk').innerHTML = info.riskPT;


            document.querySelector('#whatis-title').innerHTML = 'Sobre';
            document.querySelector('#risk-title').innerHTML = 'Aplica????es';

            document.querySelector('#source-title').innerHTML = 'Fontes';
            document.querySelector('#credits-title').innerHTML = 'Cr??ditos Modelo 3D'; 

            document.querySelector('#opt-calcario').innerHTML = "Calc??rio";
            document.querySelector('#opt-basalto').innerHTML = "Basalto";
            document.querySelector('#opt-granito').innerHTML = "Granito";
            document.querySelector('#opt-ardosia').innerHTML = "Ard??sia";
            document.querySelector('#opt-marmore').innerHTML = "M??rmore";

            language = newLang;
        }
        else {
            info = content[value];
            console.log(newLang, ' !')

            document.querySelector('#whatis').innerHTML = info.whatis;
            document.querySelector('#risk').innerHTML = info.risk;


            document.querySelector('#whatis-title').innerHTML = 'About';
            document.querySelector('#risk-title').innerHTML = 'Applications';

            document.querySelector('#source-title').innerHTML = 'Source';
            document.querySelector('#credits-title').innerHTML = 'Model 3D Credits'; 

            document.querySelector('#opt-calcario').innerHTML = "Limestone";
            document.querySelector('#opt-basalto').innerHTML = "Basalt";
            document.querySelector('#opt-granito').innerHTML = "Granite";
            document.querySelector('#opt-ardosia').innerHTML = "Slate";
            document.querySelector('#opt-marmore').innerHTML = "Marble";

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
