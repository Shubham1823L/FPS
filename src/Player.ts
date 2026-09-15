import * as THREE from 'three'
import { Capsule } from 'three/examples/jsm/Addons.js'
import { FirstPersonCamera } from './FirstPersonCamera'

export class Player {
    private spawnPosition = new THREE.Vector3(0, 0, 0) // spawn position of player (feet)
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

    constructor(scene: THREE.Scene) {
        scene.add(this.helper)
        scene.add(this.cameraHelper)
        this.camera.updateMatrixWorld()

        this.updateColliderFromCamera()
        this.updateColliderHelper()
    }

    get camera() {
        return this.fpsCamera.camera
    }

    update(timeElapsedS: number) {
        this.fpsCamera.update(timeElapsedS)
        this.updateColliderFromCamera()
        this.updateColliderHelper()
    }

    updateColliderHelper() {
        this.collider.getCenter(this.helper.position)
    }

    updateColliderFromCamera() {
        this.collider.start.copy(this.camera.position).sub(new THREE.Vector3(0, this.height - this.colliderRadius, 0))
        this.collider.end.copy(this.camera.position).sub(new THREE.Vector3(0, this.colliderRadius, 0))
    }
}