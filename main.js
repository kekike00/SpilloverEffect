
import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'; //move around with mouse
import { Loader } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

//setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
scene.background = new THREE.Color( 0xffffff ),

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(0);

renderer.render(scene, camera);   //render == draw

//post processing
const composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

// const glitchPass = new GlitchPass();
// composer.addPass( glitchPass );

const bloomPass = new UnrealBloomPass(
  1,    // strength
  25,   // kernel size
  4,    // sigma ?
  256,  // blur render target resolution
);
composer.addPass(bloomPass);

const effectFilm = new FilmPass(5, 0.325, 256, false);  //not a constructor
effectFilm.renderToScreen = true;
composer.addPass( effectFilm );


var clock = new THREE.Clock()
function render() {
    var delta = clock.getDelta();
    composer.render(delta); //parameter must be set with render
    requestAnimationFrame(render);
}
render();




//Box
// const geometry = new THREE.BoxGeometry( 10,10,10);
// const material = new THREE.MeshStandardMaterial( { color: 0xFF6347, wireframe: false } );   //wrapping paper + light
// const box = new THREE.Mesh( geometry, material);
// scene.add(box);

//lights
// const pointLight = new THREE.PointLight(0xff0000); //hex decimal type
// pointLight.position.set( 0,0,0);
const ambientLight = new THREE.AmbientLight(0xff0000,0.8);
// const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
// const directionLight = new THREE.DirectionalLight(0xff0000,0.8);
// directionLight.position.set(200,50,50)
// const directionHelper = new THREE.DirectionalLightHelper(directionLight,50,0x0000ff)
scene.add(ambientLight,gridHelper);

const controls = new OrbitControls(camera, renderer.domElement); //listen to the dom elememt of mouse and pass to the camera movement
controls.minDistance = 1;
controls.maxDistance = 1000;





//load all JZ raw images
// var jzloader = new THREE.TextureLoader();
// // var jzImg = new THREE.MeshBasicMaterial({ map: jzloader.load('images/jz/image'+ THREE.Math.ranInt(1,10)+'.jpg')});
// var jzImg = new THREE.MeshBasicMaterial({ map: jzloader.load('images/jz/image1.jpg'));

//addBox in random location
function addBox(){
  const boxGeo = new THREE.BoxGeometry(1,1,1);
  const boxEdges = new THREE.EdgesGeometry( boxGeo ); // or WireframeGeometry( geometry )
  var boxLines = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 1 } );
  var boxWireframe = new THREE.LineSegments( boxEdges, boxLines );

  var jzloader = new THREE.TextureLoader().load('images/jz/image' + THREE.Math.randInt(1,46) + '.jpg');


  const planeGeo = new THREE.PlaneGeometry(9.5,9.5,9.5);
  const planeMesh = new THREE.MeshBasicMaterial({ map:jzloader});  // color: 0xe78be7  map:jzImg
  var randomPlane = new THREE.Mesh (planeGeo,planeMesh);

  const [xx,yy,zz] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));  //distribution of boxes

    boxWireframe.position.set(xx,yy,zz);
    boxWireframe.rotation.x = 50;

    randomPlane.position.set(xx,yy-5,zz);
    randomPlane.rotation.x = 90;
    
    scene.add( boxWireframe, randomPlane );

  }
  Array(55).fill().forEach(addBox);
  


//background picture
// const spaceTexture = new THREE.TextureLoader().load('intro.jpg');
// scene.background = spaceTexture;


// change camera position as scrolling
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = 30 + (t * -0.01);
  camera.position.x = (t * -0.0002);
  camera.rotation.y = (t * -0.0002);
  
}

document.body.onscroll = moveCamera;
moveCamera();


//---------------------------------》mouse move tracker
var mouse = {x: 0, y: 0};
//make a mouse circle 
var mouseGeometry = new THREE.SphereGeometry(0.5, 50, 70);
var mouseMaterial = new THREE.MeshBasicMaterial({
   color: 0x0000ff
});
var mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
mouseMesh.position.z = -5;
scene.add(mouseMesh);

// When the mouse moves, call the given function
document.addEventListener('mousemove', onMouseMove, false);

// Follows the mouse event
function onMouseMove(event) {
   // Update the mouse variable
   event.preventDefault();
   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
   mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  // Make the sphere follow the mouse
  var vector = new THREE.Vector3(mouse.x, mouse.y, 5);
   vector.unproject( camera );
   var dir = vector.sub( camera.position ).normalize();
   var distance = - camera.position.z / dir.z;
   var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
  
   mouseMesh.position.copy(pos); // Make the sphere follow the mouse
   
}

animatee();
renderr();

function animatee() {
  requestAnimationFrame(animate);
  renderr();
}
// Rendering function
function renderr() {
 renderer.autoClear = false;
 renderer.clear();
 renderer.render(scene, camera);
};

//---------------------------------》load image

// const loader = new THREE.ImageLoader();
// loader.load(
//   'images/jiaozhuo.png' ,

//   function (image){
//     const canvas = document.createElement('canvas');
//     canvas.width = image.width;
//     canvas.height = image.height;

//     const context = canvas.getContext('2d');
//     context.drawImage(image,0,0);
//     document.getElementById("context").appendChild(canvas);
//     scene.add(canvas);
    
//   },

//     undefined,
//     function(){
//     console.error( 'An error happened.' );
//   })

  //---------------------------------》load image as box
  var jzboxTexture = new THREE.TextureLoader().load( 'images/jiaozhuo2.png' );
  var jzboxGeometry = new THREE.BoxBufferGeometry( 250, 250, 250 );
  var jzboxMaterial = new THREE.MeshBasicMaterial( { map: jzboxTexture } );

  var jzboxfloor = new THREE.Mesh( jzboxGeometry, jzboxMaterial );
  // floor.position.set(10,10,10);
  scene.add( jzboxfloor );

    //---------------------------------》load image as floor
  var jzTexture = new THREE.TextureLoader().load( 'images/jiaozhuo.png' );
  const jzGeometry = new THREE.PlaneGeometry( 50, 100 );
  const jzMaterial = new THREE.MeshBasicMaterial( {map: jzTexture, side: THREE.DoubleSide} );
  const jzPlane = new THREE.Mesh( jzGeometry, jzMaterial );
  scene.add( jzPlane ); 
  jzPlane.rotation.x = - Math.PI/2; 
  jzPlane.position.set(-60,0,-40)


// rotate
function animate(){
  requestAnimationFrame( animate );  
	composer.render();  //for post processing
  jzboxfloor.rotation.y +=0.0005;
  jzboxfloor.rotation.x +=0.000;
  jzboxfloor.rotation.z +=0.000;
  controls.update();
  renderer.render( scene, camera);
}
animate();
 
//----------------> music
// create an AudioListener and add it to the camera
const bgM = new THREE.AudioListener();
camera.add( bgM );

// create a global audio source
const sound = new THREE.Audio( bgM );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( '/sounds/rain.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
  alert("move your mouse to kiss the words; explore this wonderful 3D world")
});



