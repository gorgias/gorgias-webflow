// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import ThreeGlobe from 'three-globe';
// import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

// window.Webflow ||= [];
// window.Webflow.push(() => {
//   console.log("Webflow script initialized");
  
//   const globeEl = document.querySelector('.globe');
//   if (!globeEl) {
//     console.error("Globe element not found!");
//     return;
//   }
  
//   console.log("Globe element found", globeEl);
  
//   var renderer, camera, scene, controls;
//   var Globe;

//   init();
//   onWindowResize();
//   animate();
//   initGlobe();

//   function init() {
//     console.log("Initializing scene");
//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(globeEl.clientWidth, globeEl.clientHeight);
//     globeEl.appendChild(renderer.domElement);

//     scene = new THREE.Scene();
    
//     var ambientLight = new THREE.AmbientLight(0xffffff, 1);
//     scene.add(ambientLight);

//     camera = new THREE.PerspectiveCamera();
//     camera.aspect = globeEl.clientWidth / globeEl.clientHeight;
//     camera.updateProjectionMatrix();

//     var dLight = new THREE.DirectionalLight(0xffffff, 1);
//     dLight.position.set(0, 800, 0);
//     camera.add(dLight);
    
//     camera.position.set(200, 0, 0);
//     scene.add(camera);
//     scene.fog = new THREE.Fog(0xe2e0e2, 400, 2000);
    
//     controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dynamicDampingFactor = 0.01;
//     controls.enablePan = false;
//     controls.minDistance = 300;
//     controls.maxDistance = 200;
//     controls.rotateSpeed = 0.3;
//     controls.autoRotate = false;
//     controls.enableZoom = false;
    
//     console.log("Scene initialized");
//     window.addEventListener('resize', onWindowResize, false);
//   }

//   async function loadJSON(filePath) {
//     console.log(`Loading JSON file: ${filePath}`);
//     try {
//       const response = await fetch(filePath);
//       if (!response.ok) {
//         throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
//       }
//       console.log(`Successfully loaded ${filePath}`);
//       return response.json();
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async function initGlobe() {
//     try {
//       console.log("Initializing globe");
//       const countries = await loadJSON('../../files/countries.json');
//       const map = await loadJSON('../../files/map.json');

//       if (!countries || !map) {
//         console.error("Error loading data files");
//         return;
//       }

//       console.log("Country and map data loaded", countries, map);

//       Globe = new ThreeGlobe({
//         waitForGlobeReady: true,
//       })
//       .hexPolygonsData(countries.features)
//       .hexPolygonResolution(3)
//       .hexPolygonUseDots(true)
//       .hexPolygonMargin(0.7)
//       .hexPolygonColor(() => '#524873')
//       .showAtmosphere(true)
//       .atmosphereColor('#E2DAF4')
//       .atmosphereAltitude(0);

//       setTimeout(() => {
//         console.log("Adding labels");
//         Globe.labelsData(map.maps)
//           .labelColor(() => '#5910F5')
//           .labelDotRadius(0.5)
//           .labelSize((e) => e.size)
//           .labelText('city')
//           .labelResolution(6)
//           .labelAltitude(0.005);
//       }, 1000);

//       Globe.rotateY(10.8);
//       Globe.rotateX(-9.8);
//       Globe.rotateZ(3);
//       console.log("Globe rotation set");

//       const globeMaterial = Globe.globeMaterial();
//       globeMaterial.color = new THREE.Color(0xe2daf4);
//       globeMaterial.emissive = new THREE.Color(0xe2daf4);
//       globeMaterial.emissiveIntensity = 0.9;
//       globeMaterial.shininess = 0.63;

//       scene.add(Globe);
//       console.log("Globe added to scene");
//     } catch (error) {
//       console.error("Error initializing globe", error);
//     }
//   }

//   function onWindowResize() {
//     console.log("Resizing window");
//     camera.aspect = globeEl.clientWidth / globeEl.clientHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(globeEl.clientWidth, globeEl.clientHeight);
//   }

//   function animate() {
//     requestAnimationFrame(animate);
//     camera.lookAt(scene.position);
//     controls.update();
//     renderer.render(scene, camera);
//   }

