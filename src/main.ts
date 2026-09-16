import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Environment } from './Environment'
import { Map } from './Map'
import { Player } from './Player'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { Physics } from './Physics'


const stats = new Stats()
document.body.appendChild(stats.dom)

const orbitCamera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight)
orbitCamera.position.set(-32, 16, -32)
orbitCamera.lookAt(0, 0, 0)

// Renderer Setup
const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(innerWidth, innerHeight)
renderer.setClearColor(0x80a0e0)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
document.body.appendChild(renderer.domElement)


const orbitControls = new OrbitControls(orbitCamera, renderer.domElement)
orbitControls.target.set(0, 0, 0)
orbitControls.update()


// Scene and others Setup
const scene = new THREE.Scene()
const player = new Player(scene)
const physics = new Physics()
Environment.generate(scene)
const map = await Map.generate(scene)


// Render Loop
let previousTime = performance.now()


const animate = () => {
  requestAnimationFrame(animate)

  const timeElapsedS = (performance.now() - previousTime) / 1000

  physics.update(timeElapsedS, player, map.worldOctree)

  renderer.render(scene, !document.pointerLockElement ? orbitCamera : player.camera)
  stats.update()

  previousTime = performance.now()
}


// Resize Observer
window.addEventListener('resize', () => {
  orbitCamera.aspect = window.innerWidth / window.innerHeight
  orbitCamera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})


// Run
animate()

