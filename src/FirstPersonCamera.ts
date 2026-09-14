import * as THREE from 'three'
import { InputController, keyMap } from './InputController'
import { clamp } from 'three/src/math/MathUtils.js'


export class FirstPersonCamera {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
    input = new InputController()

    translation = new THREE.Vector3(1, 1, 5)

    yaw = 0
    pitch = 0

    constructor() {
        this.camera.rotation.order = 'YXZ'
        this.camera.rotation.set(this.pitch, this.yaw, 0)

        window.addEventListener('resize', this.onResize.bind(this))
    }

    private onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    update(timeElapsedS: number) {
        this.updateRotation()
        this.updateCamera()
        this.updateTranslation(timeElapsedS)
        this.input.update()
    }

    updateCamera() {
        this.camera.rotation.set(this.pitch, this.yaw, 0)
        this.camera.position.copy(this.translation)
    }

    updateTranslation(timeElapsedS: number) {
        const forwardVelocity = (this.input.activeKeys.has(keyMap.forward) ? 1 : 0) + (this.input.activeKeys.has(keyMap.backward) ? -1 : 0)
        const strafeVelocity = (this.input.activeKeys.has(keyMap.right) ? 1 : 0) + (this.input.activeKeys.has(keyMap.left) ? -1 : 0)

        const forward = new THREE.Vector3(0, 0, -1)
        forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw).multiplyScalar(forwardVelocity * timeElapsedS * 10)
        const strafe = new THREE.Vector3(1, 0, 0)
        strafe.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw).multiplyScalar(strafeVelocity * timeElapsedS * 10)

        this.translation.add(forward)
        this.translation.add(strafe)
    }

    updateRotation() {
        const xh = this.input.mouseDelta.x * this.input.sensitivity
        const yh = this.input.mouseDelta.y * this.input.sensitivity

        this.camera.rotation.y += -xh
        this.camera.rotation.x = clamp(this.camera.rotation.x - yh, - Math.PI / 2, Math.PI / 2)

        let yaw = this.yaw + (- xh) // restricted but unbounded range ---> (-PI,PI] - desired
        const pitch = clamp(this.pitch - yh, - Math.PI / 2, Math.PI / 2) // restricted

        if (yaw > Math.PI) yaw -= (2 * Math.PI)
        else if (yaw <= -Math.PI) yaw += (2 * Math.PI)

        this.yaw = yaw
        this.pitch = pitch
    }
}