import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/Addons.js'



export class Player {
    // Body Structure
    radius = 0.5
    height = 1.75
    boundsHelper: THREE.Mesh

    // Input and Movement
    input = new THREE.Vector3()
    velocity = new THREE.Vector3()
    jumpSpeed = 10
    isOnGround = false
    maxSpeed = 20

    // Camera and Controls
    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100)
    controls = new PointerLockControls(this.camera, document.body)
    cameraHelper = new THREE.CameraHelper(this.camera)

    constructor(scene: THREE.Scene) {
        this.camera.position.set(32, 16, 32)
        scene.add(this.camera)
        scene.add(this.cameraHelper)

        const playerGeometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16)
        const playerMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
        this.boundsHelper = new THREE.Mesh(playerGeometry, playerMaterial)
        scene.add(this.boundsHelper)

        document.body.addEventListener('keydown', this.handleKeyDown.bind(this))
        document.body.addEventListener('keyup', this.handleKeyUp.bind(this))
    }

    get position() {
        return this.camera.position
    }

    handleKeyDown(e: KeyboardEvent) {
        if (!this.controls.isLocked) this.controls.lock()

        switch (e.code) {
            case 'KeyW':
                this.input.z = Math.min(this.maxSpeed + this.input.z, this.maxSpeed)
                break;
            case 'KeyA':
                this.input.x = Math.max(-this.maxSpeed, this.input.x - this.maxSpeed)
                break;
            case 'KeyS':
                this.input.z = Math.max(-this.maxSpeed, this.input.z - this.maxSpeed)
                break;
            case 'KeyD':
                this.input.x = Math.min(this.maxSpeed + this.input.x, this.maxSpeed)
                break;
            case 'Space':
                if (this.isOnGround) this.input.y += this.jumpSpeed
                break;

            default:
                break;
        }
    }

    handleKeyUp(e: KeyboardEvent) {
        switch (e.code) {
            case 'KeyW':
                this.input.z = Math.max(-this.maxSpeed, this.input.z - this.maxSpeed)
                break;
            case 'KeyA':
                this.input.x = Math.min(this.maxSpeed + this.input.x, this.maxSpeed)
                break;
            case 'KeyS':
                this.input.z = Math.min(this.maxSpeed + this.input.z, this.maxSpeed)
                break;
            case 'KeyD':
                this.input.x = Math.max(-this.maxSpeed, this.input.x - this.maxSpeed)
                break;

            default:
                break;
        }
    }

    applyInputs(deltaTime: number) {
        // Get velocity
        this.velocity.copy(this.input)

        // Apply Inputs and Move Player (Velocity and input is relative to player, not the world, therefore we can do .moveForward())
        this.controls.moveForward(this.velocity.z * deltaTime)
        this.controls.moveRight(this.velocity.x * deltaTime)
        this.position.y += this.velocity.y * deltaTime

        // Update Bounds Helper
        this.boundsHelper.position.copy(this.position)
        this.boundsHelper.position.y -= this.height / 2

        // Update Player Coordinates Display
        const playerCoordinatesDiv = document.getElementById('playerCoordinates')
        if (!playerCoordinatesDiv) return
        playerCoordinatesDiv.textContent = `X: ${this.position.x.toFixed(1)} Y: ${this.position.y.toFixed(1)} Z: ${this.position.z.toFixed(1)}`
    }
}