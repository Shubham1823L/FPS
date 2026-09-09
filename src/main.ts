import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Player } from './player/Player'
import { Physics } from './physics/Physics'



const stats = new Stats()
document.body.appendChild(stats.dom)


// Renderer Setup
const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(innerWidth, innerHeight)
renderer.setClearColor(0x80a0e0)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
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
animate()