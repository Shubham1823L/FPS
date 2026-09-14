import * as THREE from 'three'
import { InputController } from './InputController'
import { clamp } from 'three/src/math/MathUtils.js'


export class FirstPersonCamera {
    camera: THREE.PerspectiveCamera
    input = new InputController()

    rotation = new THREE.Quaternion()
    translation = new THREE.Vector3()
    phi = 0
    theta = 0

    constructor() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
        this.camera.position.set(0, 0, 0)
        this.camera.rotation.set(0, 0, 0)
        
        window.addEventListener('resize', this.onResize)
    }

    private onResize() {
        console.log(this.camera)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    update(timeElapsedS: number) {
        this.updateRotation(timeElapsedS)
        this.updateCamera(timeElapsedS)
    }

    updateCamera(timeElapsedS: number) {
        this.camera.quaternion.copy(this.rotation)
    }

    updateRotation(timeElapsedS: number) {
        const xh = this.input.mouseDelta.x * this.input.sensitivity
        const yh = this.input.mouseDelta.y * this.input.sensitivity

        this.phi += -xh * 5
        this.theta = clamp(this.theta + -yh * 5, -Math.PI / 3, Math.PI / 3)

        const qx = new THREE.Quaternion() // handles rotation around y axis
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)
        const qz = new THREE.Quaternion() // handles rotation around x axis
        qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta)

        const q = new THREE.Quaternion() // final rotation
        q.multiply(qx)
        q.multiply(qz)

        this.rotation.copy(q)
    }
}