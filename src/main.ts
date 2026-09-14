import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Environment } from './Environment'
import { FirstPersonCamera } from './FirstPersonCamera'
import { Map } from './Map'


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


// Scene and others Setup
const scene = new THREE.Scene()
const fpsCamera = new FirstPersonCamera()
Environment.generate(scene)
Map.generate(scene)


// Render Loop
let previousTime = performance.now()
const animate = () => {
  requestAnimationFrame(animate)

  const timeElapsedS = (performance.now() - previousTime) / 1000
  fpsCamera.update(timeElapsedS)

  renderer.render(scene, fpsCamera.camera)
  stats.update()
}


// Resize Observer
window.addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight)
})


// Run
animate()