import * as THREE from 'three'
import { Capsule } from 'three/examples/jsm/Addons.js'
import type { InputController } from './InputController'
import type { Map } from './Map'

const SCREEN_CENTER = new THREE.Vector2()

export class Player {
    private spawnPosition = new THREE.Vector3(6, 0, 6) // spawn position of player (feet)
    position = this.spawnPosition.clone() // position of player (feet)

    colliderRadius = .35
    height = 1.75 // total height of player (feet to head)
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
    jumpSpeed = 12

    rayCaster = new THREE.Raycaster()
    hitTarget = new THREE.Mesh(new THREE.SphereGeometry(.05), new THREE.MeshBasicMaterial({ color: 'red' }))

    target = {
        boundingBox: new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: 'blue' })),
        health: 100
    }

    constructor(scene: THREE.Scene) {
        scene.add(this.helper)
        this.helper.visible = false

        this.rayCaster.near = 0.1
        this.rayCaster.far = 50

        scene.add(this.hitTarget)
        this.hitTarget.visible = false

        scene.add(this.target.boundingBox)
        this.target.boundingBox.position.copy(this.spawnPosition).add(new THREE.Vector3(0, 2, 0))
        this.target.boundingBox.name = 'target'
    }

    calculateYaw(mouseDeltaX: number, sensitivity: number) {
        const xh = mouseDeltaX * sensitivity
        let yaw = this.yaw + (- xh) // restricted but unbounded range ---> (-PI,PI] - desired

        if (yaw > Math.PI) yaw -= (2 * Math.PI)
        else if (yaw <= -Math.PI) yaw += (2 * Math.PI)

        this.yaw = yaw
    }

    calculateVelocity(input: InputController, gravity: number, decayConstant: number, timeElapsedS: number) {
        const deltaSpeed = (this.onGround ? 110.5 : 5) * timeElapsedS

        const inputVelocity = input.movementDirection.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw).multiplyScalar(deltaSpeed)
        this.velocity.x += inputVelocity.x
        this.velocity.z += inputVelocity.z

        let damping = Math.exp(-decayConstant * timeElapsedS) - 1;
        if (this.onGround) {
            this.velocity.y = 0

            if (input.jumpRequested) {
                this.velocity.y = this.jumpSpeed
                this.onGround = false
                input.consumeJumpRequest()
            }
        }
        else {
            this.velocity.y -= gravity * timeElapsedS
            damping *= 0.1
        }

        this.velocity.addScaledVector(this.velocity, damping)
    }

    update() {
        this.collider.getCenter(this.position)
        this.position.y -= this.height / 2

        this.collider.getCenter(this.helper.position)
    }

    rayCastFromCrosshair(firing: boolean, camera: THREE.PerspectiveCamera, map: Map) {
        if (!firing) return
        // Update raycaster
        this.rayCaster.setFromCamera(SCREEN_CENTER, camera)

        // Cast ray, and detect intersected object
        const intersection = this.rayCaster.intersectObjects([map.scene, this.target.boundingBox], true)[0]

        if (!(intersection?.object instanceof THREE.Mesh)) return this.hitTarget.visible = false
        this.hitTarget.position.copy(intersection.point)
        this.hitTarget.visible = true

    }
}