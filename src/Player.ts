import * as THREE from 'three'
import { Capsule } from 'three/examples/jsm/Addons.js'
import type { InputController } from './InputController'

export class Player {
    private spawnPosition = new THREE.Vector3(6, 0, 6) // spawn position of player (feet)
    position = this.spawnPosition.clone() // position of player (feet)

    colliderRadius = .35
    height = 1.35 // total height of player (feet to head)
    collider = new Capsule(
        this.spawnPosition.clone().add(new THREE.Vector3(0, this.colliderRadius, 0)),
        this.spawnPosition.clone().add(new THREE.Vector3(0, this.height - this.colliderRadius)),
        this.colliderRadius
    )
    helper = new THREE.Mesh(
        new THREE.CapsuleGeometry(this.colliderRadius, this.height - (2 * this.colliderRadius)),
        new THREE.MeshBasicMaterial({ wireframe: true, color: 'white' })
    )

    onGround = false
    velocity = new THREE.Vector3()

    yaw = 0

    speed = 10
    jumpSpeed = 15

    constructor(scene: THREE.Scene) {
        scene.add(this.helper)
    }

    calculateYaw(mouseDeltaX: number, sensitivity: number) {
        const xh = mouseDeltaX * sensitivity
        let yaw = this.yaw + (- xh) // restricted but unbounded range ---> (-PI,PI] - desired

        if (yaw > Math.PI) yaw -= (2 * Math.PI)
        else if (yaw <= -Math.PI) yaw += (2 * Math.PI)

        this.yaw = yaw
    }

    calculateVelocity(input: InputController, gravity: number, timeElapsedS: number) {
        const inputVelocity = input.movementDirection.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw).multiplyScalar(this.speed)
        this.velocity.x = inputVelocity.x
        this.velocity.z = inputVelocity.z

        if (this.onGround && input.jumpRequested) {
            this.velocity.y += this.jumpSpeed
            input.consumeJumpRequest()
        }

        if (!this.onGround) this.velocity.y -= gravity * timeElapsedS
    }

    update() {
        this.collider.getCenter(this.position)
        this.position.y -= this.height / 2

        this.collider.getCenter(this.helper.position)
    }
}