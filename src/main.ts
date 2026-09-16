import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Environment } from './Environment'
import { Map } from './Map'
import { Player } from './Player'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { Physics } from './Physics'
import { FirstPersonCamera } from './FirstPersonCamera'
import { InputController } from './InputController'


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
const fpsCamera = new FirstPersonCamera()
const input = new InputController()


// Render Loop
let previousTime = performance.now()


const animate = () => {
  requestAnimationFrame(animate)
  const timeElapsedS = (performance.now() - previousTime) / 1000


  // We already have updated input from window eventlisteners, lets evaluate them
  input.updateMovementInput(player.onGround)

  // Let's calculate yaw and pitch first
  player.calculateYaw(input.mouseDelta.x, input.sensitivity)
  fpsCamera.calculatePitch(input.mouseDelta.y, input.sensitivity)

  // Now we can run physics loop for player's velocity, collider's position, and collision logic
  physics.update(timeElapsedS, player, input, map.worldOctree)

  // Physics has updated collider's position, now lets update player position and its helper
  player.update()

  // Now we update camera orientation and position from player's position
  fpsCamera.update(player)

  // Since, everything is done, we now reset the input mouseDelta
  input.consumeMouseDelta()

  console.log(player.position.y, player.collider.start.y, fpsCamera.camera.position.y,player.onGround,player.velocity)

  renderer.render(scene, fpsCamera.camera)
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

