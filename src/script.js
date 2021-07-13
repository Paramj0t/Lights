import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { SpotLightHelper } from "three";

// console.log(THREE.PerspectiveCamera);

//Cursor
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

//Scene
const scene = new THREE.Scene();

//Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

//Objects
const sphere = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 32, 32),
	material
);

sphere.position.x = -1.5;

const cube = new THREE.Mesh(
	new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
	material
);

const torus = new THREE.Mesh(
	new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
	material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(
	0x78ff00,
	0.5,
	10,
	Math.PI * 0.1,
	0.25,
	1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

//Helper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
	hemisphereLight,
	0.2
);
scene.add(hemisphereLightHelper);

const spotLighHelper = new THREE.SpotLighHelper(spotLight);
scene.add(spotLighHelper);
window.requestAnimationFrame(() => {
	SpotLightHelper.update();
});

//sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	//Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	//Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	//Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

//Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	1,
	100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
// camera.lookAt(mesh.position);
scene.add(camera);

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	// canvas: canvas
	canvas,
});
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

renderer.setSize(sizes.width, sizes.height);

// //Clock
const clock = new THREE.Clock();

//Animation
const tick = () => {
	//clock sec
	const elapsedTime = clock.getElapsedTime();

	//Update Objects
	sphere.rotation.y = 0.1 * elapsedTime;
	torus.rotation.y = 0.1 * elapsedTime;
	sphere.rotation.x = 0.15 * elapsedTime;
	torus.rotation.x = 0.15 * elapsedTime;

	//Update controls
	controls.update();

	//Renderer
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
