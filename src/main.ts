import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Player } from './player/Player'
import { Physics } from './physics/Physics'
import { Map } from './world/Map'



const stats = new Stats()
document.body.appendChild(stats.dom)


// Renderer Setup
const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(innerWidth, innerHeight)
renderer.setClearColor(0x80a0e0)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)


// Camera Setup
const orbitCamera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight)
orbitCamera.position.set(-32, 16, -32)
orbitCamera.lookAt(0, 0, 0)

const controls = new OrbitControls(orbitCamera, renderer.domElement)
controls.target.set(16, 0, 16)
controls.update()


// Scene and others Setup
const scene = new THREE.Scene()
const player = new Player(scene)
const physics = new Physics()
Map.load('/ghost_city_map.glb', scene)

const setupLights = () => {
  const sun = new THREE.DirectionalLight(0xFFFFFF, 2.5)
  sun.position.set(50, 50, 50)
  sun.castShadow = true
  sun.shadow.camera.near = 0.1
  sun.shadow.camera.far = 200
  sun.shadow.camera.left = -30
  sun.shadow.camera.right = 30
  sun.shadow.camera.top = 30
  sun.shadow.camera.bottom = -30
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.bias = -.001
  scene.add(sun)

  const fillLight1 = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5);
  fillLight1.position.set(2, 1, 1);
  scene.add(fillLight1);

  // const shadowHelper = new THREE.CameraHelper(sun.shadow.camera)
  // scene.add(shadowHelper)

  const ambientLight = new THREE.AmbientLight('white', .1)
  scene.add(ambientLight)

  // scene.add(new THREE.AxesHelper(100))
}

// Render Loop
let previousTime = performance.now()
const animate = () => {
  const currentTime = performance.now()
  const deltaTime = (currentTime - previousTime) / 1000
  previousTime = currentTime

  requestAnimationFrame(animate)

  physics.update(deltaTime, player)
  renderer.render(scene, player.controls.isLocked ? player.camera : orbitCamera)
  stats.update()
}


// Resize Observer
window.addEventListener('resize', () => {
  orbitCamera.aspect = innerWidth / innerHeight
  orbitCamera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)
})


// Run
setupLights()
animate()