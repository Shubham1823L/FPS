import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/Addons.js'



export class Player {
    // Body Structure
    radius = 0.5
    height = 1.75
    boundsHelper: THREE.Mesh

    // Movement
    velocity = new THREE.Vector3() // local velocity
    jumpSpeed = 5
    isOnGround = false
    maxSpeed = 10

    // Camera and Controls
    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100)
    controls = new PointerLockControls(this.camera, document.body)
    cameraHelper = new THREE.CameraHelper(this.camera)

    constructor(scene: THREE.Scene) {
        this.camera.position.set(0, this.height, 0)
        scene.add(this.camera)
        // scene.add(this.cameraHelper)

        const playerGeometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16)
        const playerMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
        this.boundsHelper = new THREE.Mesh(playerGeometry, playerMaterial)
        // scene.add(this.boundsHelper)

        window.addEventListener('keydown', () => {
            if (!this.controls.isLocked) this.controls.lock()
        })
    }

    get position() {
        return this.camera.position
    }

    applyInputs(input: THREE.Vector3) {
        // Update velocity
        this.velocity.copy(input).setY(0)
        this.velocity.normalize().multiplyScalar(this.maxSpeed)

        // if (this.isOnGround) this.velocity.setY(input.y * this.jumpSpeed)
    }
}