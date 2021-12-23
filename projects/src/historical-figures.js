function main(language) {
    const scene = new THREE.Scene();
    let clock = new THREE.Clock();
    const textureLoader = new THREE.TextureLoader();
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById("webgl-output").appendChild(renderer.domElement);
    
    let sizeButton = 1.75;

    // Translation attributes
	let texts, nameFiles;
	switch(language){
		case "en-US":            
			texts = {
				menu: ["MAIN MENU", "FAILS: ", "HITS: ", "TIMER: "],
			};
			nameFiles = {
				retry: "retry.png", messageVictory: "messageVictory.png",
                messageLoose: "messageLoose.png", read: "read.png",
				back: "back.png", zoomin: "zoomin-2.png", 
                zoomout: "zoomout.png",
			};
			break;
		case "pt-BR":            
			texts = {
				menu: ["MENU PRINCIPAL", "FALHAS: ", "ACERTOS: ", "TEMPO: "],
			};
			nameFiles = {
				retry: `retry-(${language}).png`, messageVictory: `messageVictory-(${language}).png`, messageLoose: `messageLoose-(${language}).png`, read: `read-(${language}).png`, back: `back-(${language}).png`,
				zoomin: `zoomin-(${language}).png`, zoomout: `zoomout-(${language}).png`
			};
			break;
	}

    // Load all elements before the execution 
    const ASSETS = {
        geometries: {
            backButtonGeometry: new THREE.PlaneGeometry(sizeButton, sizeButton, 1, 1),
			messageLooseGeometry: new THREE.PlaneGeometry(26, 8, 1, 1),
			messageVictoryGeometry: new THREE.PlaneGeometry(26, 8, 1, 1),
			panelGeometry: new THREE.BoxGeometry(30, 19.5, 5),
            readButtonGeometry: new THREE.PlaneGeometry(sizeButton, sizeButton, 1, 1),
            retryButtonGeometry: new THREE.PlaneGeometry(3.5, 1.75, 1, 1),
            skyboxGeometry: new THREE.SphereGeometry(200, 128, 128),
            zoomInButtonGeometry: new THREE.PlaneGeometry(sizeButton + 0.65, sizeButton + 0.65, 1, 1),
            zoomOutButtonGeometry: new THREE.PlaneGeometry(sizeButton + 0.65, sizeButton + 0.65, 1, 1),
        },
        textures: {
            backButtonMap: { 
                path: `./assets/icons/${nameFiles.back}`, fileSize: 21,
            }, 
            messageVictoryMap:{
                path: `./assets/textures/historical-figures/${nameFiles.messageVictory}`, 
				fileSize: 74
            },
			messageLooseMap:{
                path: `./assets/textures/historical-figures/${nameFiles.messageLoose}`, 
				fileSize: 74
            },
			panelMap:{
				path: "./assets/textures/wood-2.jpg", fileSize: 164
			},
            readButtonMap: {
                path: `./assets/icons/${nameFiles.read}`, fileSize: 28
            },
            retryButtonMap: {
                path: `./assets/icons/${nameFiles.retry}`, 
                fileSize: 25
            }, 
            skyboxMap:{
                path: "./assets/textures/amir-timur-museum.jpeg", fileSize: 3457
            },
            zoomInButtonMap:{
                path: `./assets/icons/${nameFiles.zoomin}`, fileSize: 25,
            },
            zoomOutButtonMap: {
                path: `./assets/icons/${nameFiles.zoomout}`, 
                fileSize: 25,
            }
        },
        materials: {
            backButtonMaterial: new THREE.MeshBasicMaterial({side: THREE.DoubleSide}),
			panelMaterial: new THREE.MeshBasicMaterial({
				transparent: true,
				opacity: 0.5,
				side: THREE.DoubleSide,
			}),
            messageLooseMaterial: new THREE.MeshBasicMaterial({side: THREE.DoubleSide}),
			messageVictoryMaterial: new THREE.MeshBasicMaterial({side: THREE.DoubleSide}),
            readButtonMaterial: new THREE.MeshBasicMaterial({side: THREE.DoubleSide}),
            retryButtonMaterial: new THREE.MeshBasicMaterial({side: THREE.DoubleSide}),
            skyboxMaterial: new THREE.MeshBasicMaterial({side: THREE.DoubleSide}),
            zoomInButtonMaterial: new THREE.MeshBasicMaterial({side: THREE.DoubleSide}),
            zoomOutButtonMaterial: new THREE.MeshBasicMaterial({side: THREE.DoubleSide}),
        },
		objects:{  
            backButton: {
                type: 'mesh',
				geometry: 'backButtonGeometry',
				material: 'backButtonMaterial',
				map: 'backButtonMap',
            },
            messageLoose: {
				type: 'mesh',
				geometry: 'messageLooseGeometry',
				material: 'messageLooseMaterial',
				map: 'messageLooseMap',
			},
			messageVictory: {
				type: 'mesh',
				geometry: 'messageVictoryGeometry',
				material: 'messageVictoryMaterial',
				map: 'messageVictoryMap',
			},
			panel: {
				type: 'mesh',
				geometry: 'panelGeometry',
				material: 'panelMaterial',
				map: 'panelMap',
			},
			readButton: {
				type: 'mesh',
				geometry: 'readButtonGeometry',
				material: 'readButtonMaterial',
				map: 'readButtonMap',
			},
            retryButton: {
                type: 'mesh',
				geometry: 'retryButtonGeometry',
				material: 'retryButtonMaterial',
				map: 'retryButtonMap',
            },
            skyBox: {
                type: 'mesh',
                geometry: 'skyboxGeometry', // assing attribute with geometry stored on assets
                material: 'skyboxMaterial',
                map: 'skyboxMap',
            },
            zoomInButton: {
                type: 'mesh',
				geometry: 'zoomInButtonGeometry',
				material: 'zoomInButtonMaterial',
				map: 'zoomInButtonMap',
            },
            zoomOutButton: {
                type: 'mesh',
				geometry: 'zoomOutButtonGeometry',
				material: 'zoomOutButtonMaterial',
				map: 'zoomOutButtonMap',
            },
        },
    };

    // Loading Screen
	const styleLoad = {
		type:'stepped-circular-fancy-offset', 
		progressColor:'#f80',
		infoStyle:{ 
			padding:'0',
		}
	};
    const loadscreen = new LoadScreen(renderer, styleLoad).onComplete(setScene).start(ASSETS);

    function setScene(){
        console.log("Elements loaded");

        let rotationCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); 
        rotationCamera.up.set(0, 1, 0);
        rotationCamera.position.set(0, 15, 31);
        let bookCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        bookCamera.position.set(0, 25, 0);
        bookCamera.up.set(0, 1, 0);
        bookCamera.lookAt(0, 0, 0);
        let pictureCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        pictureCamera.position.set(0, 10.7, 15);
        pictureCamera.up.set(0, 1, 0);
        pictureCamera.lookAt(0, 10.7, -12);
        let defaultCamera = rotationCamera;
        // Enable mouse rotation, pan, zoom etc.
        let orbitControls = new THREE.OrbitControls(rotationCamera, renderer.domElement);
        orbitControls.target.set(0, 8, 0);
        orbitControls.minDistance = 10;
        orbitControls.maxDistance = 60;

        // Time controlling
        let timeAfter = 0;
        let dt = 0;

        // Creating raycaster objects
        let raycaster = new THREE.Raycaster();
        let raycasterPictures = new THREE.Raycaster();      // To create a ghost image when the picture is moving from the wall
        let mouse = new THREE.Vector2();

        // Animation pages
        let animationList = [];
        let speedAnimation = 1.8;   // 1.5

        // Raycaster and mouse Controllers 
        let objectRaycaster = [], objectRaycasterClonePictures = [];
        let objectLooked = null, objectImagePlane = null, selectedImage = null;
        let dragControls;

        // Controls of sidebar
        const controls = {
            book: new THREE.Group(),

            // Game Attributes
            fails: 0,
            hits: 0,
            /**************************
             *          States        *
             *  0 => Game Running     * 
             *  1 => Victory          * 
             *  2 => Loose            * 
             *                        *
             **************************/
            state: 0,         
            timer: {
                minutes: 0,
                seconds: 0,
                updateTime: function(dt){
                    this.seconds += (dt);
                    if(this.seconds > 59){
                        this.seconds = 0;
                        this.minutes++;
                    }
                }
            },
            menu: {
                object: null,
                canvas: null,
                ctx: null,          // Context
                drawMenu: function(){
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeStyle = "black";
                    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.font = "Bold 38px Arial";
                    this.ctx.fillStyle = "rgb(255, 255, 0)";
                    this.ctx.fillText(texts.menu[0], 280, 45);
                    this.ctx.fillText(texts.menu[1] + controls.fails, 15, 100);
                    this.ctx.fillText(texts.menu[2] + controls.hits, 235, 100);
                    this.ctx.fillText(
                        `${texts.menu[3]} ${controls.timer.minutes.toLocaleString(undefined, {minimumIntegerDigits: 2,})} :  ${controls.timer.seconds.toFixed(0).toLocaleString(undefined, { minimumIntegerDigits: 2 })}`,
                        490,
                        100
                    );
                    this.object.material.map.needsUpdate = true;        //Update the canvas texture
                },
                clearMenu: function(){
                    this.ctx.fillStyle = "rgba(10, 10, 10)";
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    this.object.material.map.needsUpdate = true;        //Update the canvas texture
                },
            },

            // Pictures and Painting Wall
            pictures: [],
            imageClone: null,
            orderPicturesBook: [],
            messageVictory: null,
            messageLoose: null,

            // bookAttributes
            angleBeginPage: 0,        
            angleFinishPage: 180,        
            angleRatePage: 0.75,     

            // page and sheet attributes
            widthPage: 12,         
            lengthPage: 14,        
            heightBook: 0.5,
            amountSheets: 0,
            currentSheet: 0,
            amountPages: 0,

            // Button Read / Exit
            buttons: [],              // Read(Left sheet, Right sheet), Exit, ZoomIn, ZoomOut
            cameraOption: 0,                // 0 => rotationCamera, 1 => bookCamera, 2 => pictureCamera

            // Functions
            adjustbuttons: function(){
                if(this.cameraOption === 0){
                    if(this.currentSheet < this.amountSheets){ 
                        if(this.currentSheet > 0){
                            this.buttons[0].visible = true;
                            this.buttons[1].visible = true;
                        }
                        else{
                            this.buttons[0].visible = false;
                            this.buttons[1].visible = true;
                        }
                    }
                    else{                                   // End of book
                        this.buttons[0].visible = true;
                        this.buttons[1].visible = false;
                    }
                    this.buttons[3].visible = true;
                    this.buttons[4].visible = false;
                }
                else{
                    this.buttons[0].visible = false;
                    this.buttons[1].visible = false;
                }
            },
            animationBook: function(){
                for (let i = 0; i < animationList.length; i++) {
                    if(animationList[i].sideOption === 1){
                        if(animationList[i].animationAngle > animationList[i].angleFinish){
                            animationList[i].animationAngle = 0;
                            animationList.splice(i, 1);
                            continue;
                        }
                        animationList[i].animationAngle = animationList[i].animationAngle + speedAnimation;
                        animationList[i].rotateZ(THREE.Math.degToRad(speedAnimation));
                    }
                    else{
                        if(animationList[i].animationAngle < (-animationList[i].angleFinish)){
                            animationList[i].animationAngle = 0;
                            animationList.splice(i, 1);
                            continue;
                        }
                        animationList[i].animationAngle = animationList[i].animationAngle - speedAnimation;
                        animationList[i].rotateZ(THREE.Math.degToRad(- speedAnimation));
                    }
                }
            },
            animationScenary: function(){
                this.menu.clearMenu();
                this.menu.drawMenu();
                this.animationBook();
            },
            createBook: function(){
                for (let index = 0; index < this.pictures.length; index++) {
                    this.createPage(this.orderPicturesBook[index]);  
                }
                scene.add(this.book);
            },
            createButtons: function(){
                let readButton = ASSETS.objects.readButton.clone();
                readButton.position.set(-this.widthPage/2, this.book.position.y + 0.5, this.book.position.z + this.lengthPage/2 + 0.25 + sizeButton/2);
                this.buttons.push(readButton);
                this.buttons[0].objectType = 3;
                this.buttons[0].visible = false;
                this.buttons[0].rotateX(THREE.Math.degToRad(-70));
                scene.add(this.buttons[0]);
                readButton = ASSETS.objects.readButton.clone();
                readButton.position.set(this.widthPage/2, this.book.position.y + 0.5, this.book.position.z + this.lengthPage/2 + 0.25 + sizeButton/2);
                this.buttons.push(readButton);
                this.buttons[1].visible = false;
                this.buttons[1].objectType = 4;
                this.buttons[1].rotateX(THREE.Math.degToRad(-70));
                scene.add(this.buttons[1]);
                let backButton = ASSETS.objects.backButton.clone();
                backButton.position.set(0, this.book.position.y + 1.5, 0);
                backButton.rotateX(THREE.Math.degToRad(-90));
                this.buttons.push(backButton);
                this.buttons[2].visible = false;
                this.buttons[2].objectType = 5;
                scene.add(this.buttons[2]);
                if(this.amountSheets > 0){
                    this.buttons[1].visible = true;
                }
                let zoomInButton = ASSETS.objects.zoomInButton.clone();
                this.buttons.push(zoomInButton);
                this.buttons[3].position.set(9.5, 20.38, -11.8);
                this.buttons[3].objectType = 6;
                scene.add(this.buttons[3]);
                let zoomOutButton = ASSETS.objects.zoomOutButton.clone()
                this.buttons.push(zoomOutButton);
                this.buttons[4].position.set(9.5, 20.38, -11.9);
                this.buttons[4].objectType = 7;
                this.buttons[4].visible = false;
                scene.add(this.buttons[4]);
                let retryButton = ASSETS.objects.retryButton.clone();
                this.buttons.push(retryButton);
                this.buttons[5].position.set(12.7, 20.25, -11.9);
                this.buttons[5].objectType = 8;
                scene.add(this.buttons[5]); 
            },
            createImageClone: function(){
                let panelGeometry = new THREE.PlaneGeometry(8, 4, 1, 1);
                let panelMaterial = new THREE.MeshStandardMaterial({
                    color: "rgb(255,255,255)", side: THREE.DoubleSide
                });
                this.imageClone = new THREE.Mesh(panelGeometry, panelMaterial);
                this.imageClone.position.set(-100, -100, -100);
                scene.add(this.imageClone);
            },
            createMenu: function(){
                // create a canvas element
                let canvas1 = document.createElement('canvas');
                let context1 = canvas1.getContext('2d');
                canvas1.width = 1024;
                canvas1.height = 128;   //Set dimensions of the canvas texture to adjust aspect ratio
                
                // canvas contents will be used for a texture
                let texture1 = new THREE.Texture(canvas1);
                texture1.needsUpdate = true;
                
                let material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
                material1.transparent = true;
                let mesh1 = new THREE.Mesh( new THREE.PlaneGeometry(29.5, 3), material1);
                mesh1.position.set(0, 20.4, -12.1);
                this.menu.object = mesh1;
                this.menu.canvas = canvas1;
                this.menu.ctx = context1;
                scene.add(mesh1);
            },
            createMessages: function(){       // Victory and Loose
                // Victory and Loose
				this.messageVictory = ASSETS.objects.messageVictory.clone();
				this.messageVictory.position.set(0, 9, -11.9);
				this.messageVictory.visible = false;
				scene.add(this.messageVictory); 
				this.messageLoose = ASSETS.objects.messageLoose.clone();
				this.messageLoose.position.set(0, 9, -11.9);
				this.messageLoose.visible = false;
				scene.add(this.messageLoose); 
            },
            createPage: function (indexPicture){
                if(this.amountPages % 2 == 0){   //Pair pages on the book
                    // Adjust of rotation of the sheets inside of book
                    for(let i = 0; i < this.book.children.length; i++){
                        let sheetAux = this.book.children[i];
                        sheetAux.angleBegin = sheetAux.angleBegin + this.angleRatePage;
                        sheetAux.angleFinish = 180 - i * this.angleRatePage; //- sheetAux.angleBegin;     //this.angleBeginPage;
                        sheetAux.rotateZ(THREE.Math.degToRad(this.angleRatePage));  // rotation default of page
                    }

                    let sheet = new THREE.Group();          // Support the elements -- Center of rotation page

                    // Page Background
                    let pageGeometry = new THREE.PlaneGeometry(this.widthPage, this.lengthPage, 1, 1);
                    let pageMaterial = new THREE.MeshBasicMaterial({
                        transparent: true, //opacity: 0.5,
                        map: textureLoader.load("./assets/textures/page.png"), side:THREE.DoubleSide
                    });
                    let page = new THREE.Mesh(pageGeometry, pageMaterial);
                    page.name = "page_" + this.amountPages;
                    page.position.set(this.widthPage / 2, 0, 0);
                    page.rotateX(THREE.Math.degToRad(-90));
                    sheet.add(page);
                    sheet.position.set(0, this.heightBook, 0);
                    sheet.sideOption = 0;              //0 => Right, 1 => Left
                    page.sheet = sheet;
                    page.objectType = 0;               // Page type
                    page.indexPicture = indexPicture;

                    // Image plane
                    let imageGeometry = new THREE.PlaneGeometry(9, 4.5, 1, 1);
                    let imageMaterial = new THREE.MeshBasicMaterial({color:"rgb(255, 255, 255)", side: THREE.DoubleSide});
                    let imagePlane = new THREE.Mesh(imageGeometry, imageMaterial);
                    imagePlane.position.set(0, this.lengthPage/4.5, 0.01);
                    imagePlane.objectType = 2;
                    imagePlane.name = "imageBlock-Page_"+this.amountPages;
                    page.add(imagePlane);
                    imagePlane.indexPicture = indexPicture;

                    // Informations block
                    let informationGeometry = new THREE.PlaneGeometry(9.6, 6.08, 1, 1);
                    let informationMaterial = new THREE.MeshBasicMaterial({
                        transparent: true,
                        side: THREE.DoubleSide,
                        map: textureLoader.load("./assets/textures/historical-figures/pictures/information/"+language+"/"+indexPicture+".png")
                    });
                    let informationPlane = new THREE.Mesh(informationGeometry, informationMaterial);
                    informationPlane.name = "informationBlock-Page_"+this.amountPages;
                    informationPlane.position.set(0, -this.lengthPage/5, 0.01);
                    page.add(informationPlane);
                    this.amountSheets++;
                    this.book.add(sheet);       // Added sheet with page on the book
                    sheet.angleBegin = this.angleBeginPage;
                    sheet.angleFinish = this.angleFinishPage;
                    sheet.animationAngle = 0;

                    // Adjust finish angle
                    for(let i = 0; i < this.book.children.length; i++){
                        let sheetAux = this.book.children[i];
                        sheetAux.angleFinish = 180 - i * this.angleRatePage - sheetAux.angleBegin;     //this.angleBeginPage;
                    }
                }
                else{
                    let sheet = this.book.children[this.book.children.length - 1]; // Take a sheet to insert a page on the book
                    
                    // Page Background
                    let pageGeometry = new THREE.PlaneGeometry(this.widthPage, this.lengthPage, 1, 1);
                    let pageMaterial = new THREE.MeshBasicMaterial({
                        transparent: true,
                        map: textureLoader.load("./assets/textures/page.png"), side:THREE.DoubleSide
                    });
                    let page = new THREE.Mesh(pageGeometry, pageMaterial);
                    page.name = "page_" + this.amountPages;
                    page.position.set(this.widthPage / 2, -0.005, 0);
                    page.rotateX(THREE.Math.degToRad(-90));
                    sheet.add(page);
                    sheet.position.set(0, this.heightBook, 0);
                    sheet.sideOption = 0;              // 0 => Right, 1 => Left
                    page.sheet = sheet;
                    page.objectType = 0;               // Page type
                    page.indexPicture = indexPicture;

                    // Image plane
                    let imageGeometry = new THREE.PlaneGeometry(this.widthPage/1.5, this.lengthPage/3, 1, 1);
                    let imageMaterial = new THREE.MeshBasicMaterial({color:"rgb(255, 255, 255)", side:THREE.DoubleSide});
                    let imagePlane = new THREE.Mesh(imageGeometry, imageMaterial);
                    imagePlane.position.set(0, this.lengthPage/4.5, -0.01);
                    imagePlane.rotateY(THREE.Math.degToRad(180));
                    imagePlane.objectType = 2;
                    imagePlane.indexPicture = indexPicture;
                    imagePlane.name = "imageBlock-Page_"+this.amountPages;
                    page.add(imagePlane);

                    // Informations block
                    let informationGeometry = new THREE.PlaneGeometry(9.6, 6.08, 1, 1);
                    let informationMaterial = new THREE.MeshBasicMaterial({
                        transparent: true,
                        side: THREE.DoubleSide,
                        map: textureLoader.load("./assets/textures/historical-figures/pictures/information/"+language+"/"+indexPicture+".png")
                    });
                    let informationPlane = new THREE.Mesh(informationGeometry, informationMaterial);
                    informationPlane.name = "informationBlock-Page_"+this.amountPages;
                    informationPlane.position.set(0, -this.lengthPage/5, -0.01);
                    informationPlane.rotateY(THREE.Math.degToRad(180));
                    page.add(informationPlane);
                    this.book.add(sheet);       // Added sheet with page on the book
                }
                this.amountPages++;
            },
            createPicturesPanel: function(scene){
                let panelPlane = ASSETS.objects.panel.clone();
				panelPlane.position.set(0, 9.75, -15.1);
				scene.add(panelPlane);
				let skybox = ASSETS.objects.skyBox.clone();
				skybox.rotateY(60);
				skybox.position.set(0, 0, 50);
				scene.add(skybox);
        
                /** Pictures */
        
                let pictureGeometry = new THREE.PlaneGeometry(8, 4, 1, 1);
                let pictureMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/1.jpg"), side: THREE.DoubleSide});
                let picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
                picture.position.set(-10, 4.5, -12);
                picture.objectType = 1;          //Image type
                picture.indexPicture = 1;
                picture.name = "picture_01";
                scene.add(picture);
                this.pictures.push(picture);
                this.orderPicturesBook.push(picture.indexPicture);
                let nameBoxGeometry = new THREE.PlaneGeometry(8, 1, 1, 1);
                let nameBoxMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/name/1.png"), side: THREE.DoubleSide});
                let nameBox = new THREE.Mesh(nameBoxGeometry, nameBoxMaterial);
                nameBox.position.set(-10, 1.5, -12);
                scene.add(nameBox);
                pictureGeometry = new THREE.PlaneGeometry(8, 4, 1, 1);
                pictureMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/2.jpg"), side: THREE.DoubleSide});
                picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
                picture.name = "picture_02";
                picture.position.set(0, 4.5, -12);
                picture.objectType = 1;          //Image type
                picture.indexPicture = 2;
                scene.add(picture);
                this.pictures.push(picture);
                this.orderPicturesBook.push(picture.indexPicture);
                nameBoxGeometry = new THREE.PlaneGeometry(8, 1, 1, 1);
                nameBoxMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/name/2.png"), side: THREE.DoubleSide});
                nameBox = new THREE.Mesh(nameBoxGeometry, nameBoxMaterial);
                nameBox.position.set(0, 1.5, -12);
                scene.add(nameBox);
                pictureGeometry = new THREE.PlaneGeometry(8, 4, 1, 1);
                pictureMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/3.jpg"), side: THREE.DoubleSide});
                picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
                picture.position.set(10, 4.5, -12);
                picture.objectType = 1;          //Image type
                picture.indexPicture = 3;
                picture.name = "picture_03";
                scene.add(picture);
                this.pictures.push(picture);
                this.orderPicturesBook.push(picture.indexPicture);
                nameBoxGeometry = new THREE.PlaneGeometry(8, 1, 1, 1);
                nameBoxMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/name/3.png"), side: THREE.DoubleSide});
                nameBox = new THREE.Mesh(nameBoxGeometry, nameBoxMaterial);
                nameBox.position.set(10, 1.5, -12);
                scene.add(nameBox);
                pictureGeometry = new THREE.PlaneGeometry(8, 4, 1, 1);
                pictureMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/4.jpg"), side: THREE.DoubleSide});
                picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
                picture.position.set(-10, 10.5, -12);
                picture.objectType = 1;          //Image type
                picture.indexPicture = 4;
                picture.name = "picture_04";
                scene.add(picture);
                this.pictures.push(picture);
                this.orderPicturesBook.push(picture.indexPicture);
                nameBoxGeometry = new THREE.PlaneGeometry(8, 1, 1, 1);
                nameBoxMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/name/4.png"), side: THREE.DoubleSide});
                nameBox = new THREE.Mesh(nameBoxGeometry, nameBoxMaterial);
                nameBox.position.set(-10, 7.5, -12);
                scene.add(nameBox);
                pictureGeometry = new THREE.PlaneGeometry(8, 4, 1, 1);
                pictureMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/5.jpg"), side: THREE.DoubleSide});
                picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
                picture.name = "picture_05";
                picture.position.set(0, 10.5, -12);
                picture.objectType = 1;          //Image type
                picture.indexPicture = 5;
                scene.add(picture);
                this.pictures.push(picture);
                this.orderPicturesBook.push(picture.indexPicture);
                nameBoxGeometry = new THREE.PlaneGeometry(8, 1, 1, 1);
                nameBoxMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/name/5.png"), side: THREE.DoubleSide});
                nameBox = new THREE.Mesh(nameBoxGeometry, nameBoxMaterial);
                nameBox.position.set(0, 7.5, -12);
                scene.add(nameBox);
                pictureGeometry = new THREE.PlaneGeometry(8, 4, 1, 1);
                pictureMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/6.jpg"), side: THREE.DoubleSide});
                picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
                picture.position.set(10, 10.5, -12);
                picture.objectType = 1;          //Image type
                picture.indexPicture = 6;
                picture.name = "picture_06";
                scene.add(picture);
                this.pictures.push(picture);
                this.orderPicturesBook.push(picture.indexPicture);
                nameBoxGeometry = new THREE.PlaneGeometry(8, 1, 1, 1);
                nameBoxMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/name/6.png"), side: THREE.DoubleSide});
                nameBox = new THREE.Mesh(nameBoxGeometry, nameBoxMaterial);
                nameBox.position.set(10, 7.5, -12);
                scene.add(nameBox);
                pictureGeometry = new THREE.PlaneGeometry(8, 4, 1, 1);
                pictureMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/7.jpg"), side: THREE.DoubleSide});
                picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
                picture.position.set(-10, 16.5, -12);
                picture.objectType = 1;          //Image type
                picture.indexPicture = 7;
                picture.name = "picture_07";
                scene.add(picture);
                this.pictures.push(picture);
                this.orderPicturesBook.push(picture.indexPicture);
                nameBoxGeometry = new THREE.PlaneGeometry(8, 1, 1, 1);
                nameBoxMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/name/7.png"), side: THREE.DoubleSide});
                nameBox = new THREE.Mesh(nameBoxGeometry, nameBoxMaterial);
                nameBox.position.set(-10, 13.5, -12);
                scene.add(nameBox);
                pictureGeometry = new THREE.PlaneGeometry(8, 4, 1, 1);
                pictureMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/8.jpg"), side: THREE.DoubleSide});
                picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
                picture.name = "picture_08";
                picture.position.set(0, 16.5, -12);
                picture.objectType = 1;          //Image type
                picture.indexPicture = 8;
                scene.add(picture);
                this.pictures.push(picture);
                this.orderPicturesBook.push(picture.indexPicture);
                nameBoxGeometry = new THREE.PlaneGeometry(8, 1, 1, 1);
                nameBoxMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/name/8.png"), side: THREE.DoubleSide});
                nameBox = new THREE.Mesh(nameBoxGeometry, nameBoxMaterial);
                nameBox.position.set(0, 13.5, -12);
                scene.add(nameBox);
                pictureGeometry = new THREE.PlaneGeometry(8, 4, 1, 1);
                pictureMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/9.jpg"), side: THREE.DoubleSide});
                picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
                picture.position.set(10, 16.5, -12);
                picture.objectType = 1;          //Image type
                picture.indexPicture = 9;
                picture.name = "picture_09";
                scene.add(picture);
                this.pictures.push(picture);
                this.orderPicturesBook.push(picture.indexPicture);
                nameBoxGeometry = new THREE.PlaneGeometry(8, 1, 1, 1);
                nameBoxMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/textures/historical-figures/pictures/name/9.png"), side: THREE.DoubleSide});
                nameBox = new THREE.Mesh(nameBoxGeometry, nameBoxMaterial);
                nameBox.position.set(10, 13.5, -12);
                scene.add(nameBox);
            },
            createScenary: function(){
                let spotLight = new THREE.SpotLight(0xffffff);
                spotLight.position.copy(new THREE.Vector3(0, 15, 15));
                spotLight.shadow.mapSize.width = 2048;
                spotLight.shadow.mapSize.height = 2048;
                spotLight.shadow.camera.fov = 15;
                spotLight.castShadow = true;
                spotLight.decay = 2;
                spotLight.penumbra = 0.05;
                spotLight.name = "spotLight";
                scene.add(spotLight);
                let ambientLight = new THREE.AmbientLight(0x343434);
                ambientLight.name = "ambientLight";
                scene.add(ambientLight);
                let groundPlane = createGroundPlane(30, 30); // width and height
                groundPlane.rotateX(THREE.Math.degToRad(-90));
                scene.add(groundPlane);
                this.createMenu();
                this.createImageClone();
                this.createPicturesPanel(scene);
                this.orderPicturesBook = this.shuffleList(this.orderPicturesBook);
                this.createBook();
                this.createButtons();
                this.createMessages();

                pictureLooked = null;
                animationList = [];
                objectRaycaster = [];
                objectRaycasterClonePictures = [];

                // Recreate DragControls
                dragControls = new THREE.DragControls([controls.imageClone], rotationCamera, renderer.domElement );
                dragControls.addEventListener ( 'drag', function( event ){
                    if(event.object.position.y < 1){        // Stay about the page
                        event.object.position.y = 1.45;
                    }
                    event.object.position.z = -3.35; // This will prevent moving z axis, but will be on -3.35 line. change this to your object position of z axis.
                });
                // Pages of book
                for (let i = 0; i < this.book.children.length; i++) {
                    let pageGroupRotation = this.book.children[i];
                    for(let j = 0; j < pageGroupRotation.children.length; j++){
                        objectRaycaster.push(pageGroupRotation.children[j]);        //Put inside only page without the group rotation
                        objectRaycaster.push(pageGroupRotation.children[j].children[0]);        // Image Block
                    }
                }
                // Adding the images of paintwall
                for(let i = 0; i < this.pictures.length; i++){
                    objectRaycaster.push(this.pictures[i]);
                    objectRaycasterClonePictures.push(this.pictures[i]);
                }
                // Buttons
                for(let i = 0; i < this.buttons.length; i++){
                    objectRaycaster.push(this.buttons[i]);
                }
                // Raycaster and mouse Controllers 
                objectLooked = null;
                selectedImage = null;  
            },
            emptyScene: function(){
                //console.log("Empty Scene");
                while(scene.children.length > 0){       //OU scene.remove.apply(scene, scene.children);
                    scene.remove(scene.children[0]); 
                }
                this.fails = 0;
                this.hits = 0;
                this.state = 0;
                this.timer.seconds = 0;
                this.timer.minutes = 0;
                this.amountSheets = 0;
                this.currentSheet = 0;
                this.amountPages = 0;
                this.buttons = [];
                this.pictures = [];
                this.orderPicturesBook = [];
                objectLooked = null;
                selectedImage = null;
                pictureLooked = null;
                objectRaycaster = [];
                objectRaycasterClonePictures = [];
                this.imageClone = null;
                this.book = new THREE.Group;
            },
            removeEntity: function(object){
                let selected = scene.getObjectByName(object.name);
                scene.remove(selected);
            },
            removePictureFromWall: function(image, imagePlane){
                for (let i = 0; i < this.pictures.length; i++) {
                    if(this.pictures[i].indexPicture == image.indexPicture){
                        this.pictures.splice(i, 1);
                        break;
                    }
                }

                for (let j = 0; j < objectRaycaster.length; j++) {
                    if(objectRaycaster[j].objectType == 1){         // picture of the wall
                        if(objectRaycaster[j].indexPicture == image.indexPicture){
                            objectRaycaster.splice(j, 1);
                            break;
                        }
                    }
                }
                for (let j = 0; j < objectRaycaster.length; j++) {  
                    if(objectRaycaster[j] == imagePlane){   // Remove imageBlock of the page
                        objectRaycaster.splice(j, 1);
                        break;
                    }
                }
                
                for (let j = 0; j < objectRaycasterClonePictures.length; j++) {
                    if(objectRaycasterClonePictures[j].indexPicture == image.indexPicture){
                        objectRaycasterClonePictures.splice(j, 1);
                        break;
                    }
                }
                this.removeEntity(image);
                objectLooked = null;
                selectedImage = null;
                controls.imageClone.position.set(-100, -100, -100);
                controls.imageClone.rotateX(THREE.Math.degToRad(90));
            },
            removeAllPictures: function(){
                for (let i = 0; i < this.pictures.length; i++) {
                    this.removeEntity(this.pictures[i]);
                }
                objectRaycasterClonePictures = [];
                objectLooked = null;
                selectedImage = null;
                controls.imageClone.position.set(-100, -100, -100);
                controls.imageClone.rotateX(THREE.Math.degToRad(90));
            },
            shuffleList: function(list){
                let auxOrderList = [];
                let auxList = [];
                for(let i = 0; i < list.length; i++){
                    auxList.push(list[i]);
                }
                for(let i = 0; i < auxList.length; i++){
                    let randomIndex = Math.floor(Math.random() * auxList.length);
                    auxOrderList.push(auxList[randomIndex]);
                    auxList.splice(randomIndex, 1);
                    i--;                    // FIX index when 'remove' works with ".length"
                };
                return auxOrderList;
            }
        }
        controls.createScenary();
        
        // Reajuste da renderização com base na mudança da janela
        function onResize(){
            rotationCamera.aspect = window.innerWidth / window.innerHeight;  //Atualiza o aspect da camera com relação as novas dimensões
            rotationCamera.updateProjectionMatrix();                         //Atualiza a matriz de projeção
            bookCamera.aspect = window.innerWidth / window.innerHeight;  
            bookCamera.updateProjectionMatrix();                         
            pictureCamera.aspect = window.innerWidth / window.innerHeight;  
            pictureCamera.updateProjectionMatrix();                         
            renderer.setSize(window.innerWidth, window.innerHeight); //Define os novos valores para o renderizador
        }

        window.addEventListener('resize', onResize, false);         // Ouve os eventos de resize

        clearPickPosition();
        // Se o mouse sai da tela
        function clearPickPosition() {
            // unlike the mouse which always has a position
            // if the user stops touching the screen we want
            // to stop picking. For now we just pick a value
            // unlikely to pick something
            mouse.x = -100000;
            mouse.y = -100000;
        }

        window.addEventListener( 'mousemove', onMouseMove, false );

        function onMouseMove(event) {
            event.preventDefault();
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        }

        window.addEventListener('mouseup', function up(event){
            //console.log(event);
            if(event.button === 0){              // Left Button
                if(controls.cameraOption === 0){
                    if((objectLooked !== null) && (objectLooked.objectType === 2)){
                        if(selectedImage !== null){
                            if(objectLooked.indexPicture === selectedImage.indexPicture){
                                objectLooked.material = selectedImage.material.clone(); // Generate a clone of material and replace on image plane   
                                controls.hits++;
                                controls.removePictureFromWall(selectedImage, objectLooked);   // Remove imagePlane and picture of panel
                                if(controls.pictures.length == 0){
                                    controls.state = 1;
                                    controls.messageVictory.visible = true;
                                } 
                            }
                            else{
                                controls.fails++;
                                if(controls.fails > 2){
                                    controls.state = 2;
                                    controls.removeAllPictures();
                                    controls.messageLoose.visible = true;

                                } 
                            }
                            objectImagePlane.material.color = new THREE.Color("rgb(255,255,255)");
                            objectImagePlane = null;
                        }
                    }
                    if(selectedImage !== null){       // Drop the picture
                        selectedImage.visible = true;
                        controls.imageClone.position.set(-100, -100, -100);
                        controls.imageClone.rotateX(THREE.Math.degToRad(90));
                    }
                    selectedImage = null;
                    orbitControls.enableRotate = true;      // Enable rotation on camera
                }
            }
        });
        window.addEventListener('mouseout', clearPickPosition);       // Mouse sai da tela
        window.addEventListener('mouseleave', clearPickPosition);
        window.addEventListener('mousedown', raycasterController);
        function raycasterController(event){
            //console.log(event);
            if(event.button === 0){              // Left Button
                if(objectLooked !== null){
                    switch(controls.cameraOption){
                        case 0:
                        {
                            orbitControls.enableRotate = false;         // Disable the rotation on camera when raycasting detect an object
                            switch(objectLooked.objectType){
                                case 0:
                                    if(objectLooked.sheet.animationAngle === 0){     //Don't rotate if the page is moving
                                        if(objectLooked.sheet.sideOption === 0){
                                            objectLooked.sheet.sideOption = 1;
                                            controls.currentSheet++;
                                        }
                                        else{
                                            objectLooked.sheet.sideOption  = 0;
                                            controls.currentSheet--;
                                        }
                                        controls.adjustbuttons();
                                        animationList.push(objectLooked.sheet);
                                    }
                                    break;
                                case 1:     // Collide with image
                                    selectedImage = objectLooked;
                                    selectedImage.visible = false;
                                    controls.imageClone.position.x = pointCollisionRayCaster.x;
                                    controls.imageClone.position.y = pointCollisionRayCaster.y;
                                    controls.imageClone.position.z = -3.35; //pointCollisionRayCaster.z;  
                                    controls.imageClone.rotateX(THREE.Math.degToRad(-90));
                                    //controls.imageClone.position.copy(pointCollisionRayCaster);
                                    break;
                                case 2:     // Collide with imagePlane on Page 
                                    //
                                    //
                                    break;
                                case 3:     // Read Left page Button
                                    controls.cameraOption = 1;      // Turn camera option
                                    defaultCamera = bookCamera;
                                    controls.adjustbuttons();
                                    controls.buttons[2].visible = true;
                                    defaultCamera.position.set(-controls.widthPage/2, 17, 0);   // Y = 25
                                    controls.buttons[2].position.set(-controls.widthPage - sizeButton/2, controls.buttons[2].position.y, 0);   
                                    break;
                                case 4:     // Read Right page Button
                                    controls.cameraOption = 1;      // Turn camera option
                                    defaultCamera = bookCamera;
                                    controls.adjustbuttons();
                                    controls.buttons[2].visible = true;
                                    bookCamera.position.set(controls.widthPage/2, 17, 0);
                                    controls.buttons[2].position.set(controls.widthPage + sizeButton/2, controls.buttons[2].position.y, 0);   
                                    break;
                                case 6:     // Zoom In
                                    controls.cameraOption = 2;
                                    defaultCamera = pictureCamera;
                                    controls.buttons[3].position.z = -11.9;
                                    controls.buttons[4].position.z = -11.8;
                                    controls.buttons[3].visible = false;
                                    controls.buttons[4].visible = true;
                                    break;
                                case 8:     // Retry Button
                                    controls.emptyScene();
                                    controls.createScenary();
                                    break;
                            }
                        }
                            break;
                        case 1:
                        {
                            orbitControls.enableRotate = false;         // Disable the rotation on camera when raycasting detect an object
                            switch(objectLooked.objectType){
                                case 4:     // Read Right page Button
                                    controls.cameraOption = 1;      // Turn camera option
                                    defaultCamera = bookCamera;
                                    controls.adjustbuttons();
                                    controls.buttons[2].visible = true;
                                    defaultCamera.position.set(controls.widthPage/2, 17, 0);
                                    controls.buttons[2].position.set(controls.widthPage + sizeButton/2, controls.buttons[2].position.y, 0);   
                                    break;
                                case 5:     // Exit Button
                                    controls.cameraOption = 0;
                                    defaultCamera = rotationCamera;
                                    controls.adjustbuttons();
                                    controls.buttons[2].visible = false;
                                    break;
                            }
                        }
                            break;
                        case 2:
                        {
                            orbitControls.enableRotate = false;         // Disable the rotation on camera when raycasting detect an object
                            switch(objectLooked.objectType){
                                case 6:     // Zoom In
                                    controls.cameraOption = 2;
                                    defaultCamera = pictureCamera;
                                    controls.buttons[3].position.z = -11.9;
                                    controls.buttons[4].position.z = -11.8;
                                    controls.buttons[3].visible = false;
                                    controls.buttons[4].visible = true;
                                    break;
                                case 7:     // Zoom Out
                                    controls.cameraOption = 0;
                                    defaultCamera = rotationCamera;
                                    controls.buttons[3].position.z = -11.8;
                                    controls.buttons[4].position.z = -11.9;
                                    controls.buttons[3].visible = true;
                                    controls.buttons[4].visible = false;
                                    break;
                                case 8:     // Retry Button
                                    controls.emptyScene();
                                    controls.cameraOption = 0;
                                    defaultCamera = rotationCamera;
                                    controls.createScenary();
                                    break;
                            }
                        }
                            break;
                    }
                }
            }
        }    

        function checkRaycaster(){
            // update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, defaultCamera);
            console.log(objectRaycaster);
            let intersects = raycaster.intersectObjects(objectRaycaster);
            if(intersects.length > 0){
                objectLooked = intersects[0].object;
                pointCollisionRayCaster = intersects[0].point;
                if(!objectLooked.visible){ // Object is not visible
                    objectLooked = null;
                    pointCollisionRayCaster = null;   
                }
            }
            else{
                objectLooked = null;
                pointCollisionRayCaster = null;
            }
        }

        //Only verify if has a collision with the pictures
        function checkRaycasterClonePictures(){        
            if(selectedImage === null){                       // FIX the bug of change the picture when moving above another picture
                raycasterPictures.setFromCamera(mouse, defaultCamera);
                let intersects = raycasterPictures.intersectObjects(objectRaycasterClonePictures);            
                if(intersects.length > 0){
                    let pictureLooked = intersects[0].object;
                    if(pictureLooked.visible && objectLooked.visible){      // picture is not visible, only the clone it is
                        controls.imageClone.position.x = pictureLooked.position.x;
                        controls.imageClone.position.y = pictureLooked.position.y;
                        controls.imageClone.position.z = pictureLooked.position.z + 0.2;
                        controls.imageClone.material = pictureLooked.material.clone();
                    }
                }
            }
        }

        function checkRaycasterOnImageAtPages(){
            if(objectLooked != null && selectedImage != null && objectLooked.objectType == 2){
                objectImagePlane = objectLooked;
                objectImagePlane.material.color = new THREE.Color("rgb(0,180,0)");
            }
            else{
                if(objectImagePlane != null){
                    objectImagePlane.material.color = new THREE.Color("rgb(255,255,255)");
                    objectImagePlane = null;
                }
            }
        }

        requestAnimationFrame(render);

        function render(t) {
            dt = (t - timeAfter) / 1000;
            orbitControls.update(clock.getDelta());
            checkRaycaster();
            controls.animationScenary();
            switch(controls.state){
                case 0:         // Game Running
                    controls.timer.updateTime(dt);
                    if(controls.cameraOption === 0){
                        checkRaycasterOnImageAtPages();
                        checkRaycasterClonePictures();
                    }
                    break;
                case 1:         // Victory
                    break;
                case 2:         // Loose
                    break;
            }
            renderer.render(scene, defaultCamera);
            timeAfter = t;
            requestAnimationFrame(render);
        }

        // Add a small and simple ground plane
        function createGroundPlane(width, height) {
            // create the ground plane
            var planeGeometry = new THREE.PlaneGeometry(width, height, 10, 10);
            var planeMaterial = new THREE.MeshStandardMaterial({
                side: THREE.DoubleSide, 
                map: textureLoader.load("./assets/textures/floor-wood.jpg")
            });
            var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;
            return plane;
        }

        // Remove the interface of loading and play loop of render
		// And begin time with zero value
		loadscreen.remove(render(0));

    }
}