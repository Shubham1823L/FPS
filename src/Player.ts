import * as THREE from 'three'
import { Capsule } from 'three/examples/jsm/Addons.js'
import { FirstPersonCamera } from './FirstPersonCamera'

export class Player {
    private spawnPosition = new THREE.Vector3(6, 0, 6) // spawn position of player (feet)
    position = this.spawnPosition.clone() // position of player (feet)

    colliderRadius = .35
    height = 1.8 // total height of player (feet to head)
    collider = new Capsule(
        this.spawnPosition.clone().add(new THREE.Vector3(0, this.colliderRadius, 0)),
        this.spawnPosition.clone().add(new THREE.Vector3(0, this.height - this.colliderRadius))
    )
    helper = new THREE.Mesh(
        new THREE.CapsuleGeometry(this.colliderRadius, this.height - (2 * this.colliderRadius)),
        new THREE.MeshBasicMaterial({ wireframe: true, color: 'white' })
    )

    fpsCamera = new FirstPersonCamera(this.spawnPosition, this.height)
    cameraHelper = new THREE.CameraHelper(this.camera)

    onGround = false
    velocity = new THREE.Vector3()

    constructor(scene: THREE.Scene) {
        scene.add(this.helper)
        scene.add(this.cameraHelper)
        const s = new THREE.Mesh(new THREE.SphereGeometry(.25), new THREE.MeshBasicMaterial({ wireframe: true, color: 'red' }))
        s.position.copy(this.spawnPosition)
        scene.add(s)
        this.camera.updateMatrixWorld()
    }

    get camera() {
        return this.fpsCamera.camera
    }

    update(timeElapsedS: number) {
        this.fpsCamera.update(timeElapsedS)
        this.updateColliderFromCamera()
    }

    updateColliderHelper() {
        this.collider.getCenter(this.helper.position)
    }

    updateColliderFromCamera() {
        this.collider.start.copy(this.camera.position).sub(new THREE.Vector3(0, this.height - this.colliderRadius, 0))
        this.collider.end.copy(this.camera.position).sub(new THREE.Vector3(0, this.colliderRadius, 0))
    }

    updateCameraFromCollider() {
        this.camera.position.copy(this.collider.end)
        this.camera.position.add(new THREE.Vector3(0, this.colliderRadius, 0))
    }
}