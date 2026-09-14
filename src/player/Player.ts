import * as THREE from 'three'
import { Capsule, PointerLockControls } from 'three/examples/jsm/Addons.js'



export class Player {
    // Movement
    velocity = new THREE.Vector3() // local velocity
    jumpSpeed = 15
    isOnGround = true
    maxSpeed = 10

    // Camera and Controls
    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100)
    controls = new PointerLockControls(this.camera, document.body)
    cameraHelper = new THREE.CameraHelper(this.camera)

    // Collider
    radius = 0.35
    height = .65
    collider = new Capsule(new THREE.Vector3(0, this.radius, 0), new THREE.Vector3(0, this.height + this.radius, 0), this.radius)

    boundsHelper = new THREE.Mesh(new THREE.CapsuleGeometry(this.radius, this.height), new THREE.MeshBasicMaterial({ wireframe: true, color: 'white' }))

    constructor(scene: THREE.Scene) {
        this.camera.position.copy(this.collider.end).add(new THREE.Vector3(0, this.radius, 0))
        this.camera.rotation.set(0, 0, 0)
        scene.add(this.camera)
        this.collider.getCenter(this.boundsHelper.position)
        scene.add(this.boundsHelper)
        scene.add(this.cameraHelper)

        window.addEventListener('resize', () => {
            this.camera.aspect = innerWidth / innerHeight
            this.camera.updateProjectionMatrix()
        })

    }

    get position() {
        return this.camera.position
    }

    applyInputs(input: THREE.Vector3) {
        // Update velocity
        const horizontalVelocity = this.velocity.clone().copy(input).setY(0)
        horizontalVelocity.normalize().multiplyScalar(this.maxSpeed)
        if (this.isOnGround) this.velocity.y = input.y * this.jumpSpeed

        this.velocity.set(horizontalVelocity.x, this.velocity.y, horizontalVelocity.z)
    }

}