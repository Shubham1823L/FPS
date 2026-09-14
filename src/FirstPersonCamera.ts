import * as THREE from 'three'
import { InputController } from './InputController'
import { clamp } from 'three/src/math/MathUtils.js'


export class FirstPersonCamera {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
    input = new InputController()

    rotation = new THREE.Vector3()
    translation = new THREE.Vector3()
    phi = 0
    theta = 0

    yaw = 0
    pitch = 0

    constructor() {
        this.camera.position.set(1, 5, 1)
        this.camera.rotation.order = 'YXZ'
        this.camera.rotation.set(this.pitch, this.yaw, 0)

        window.addEventListener('resize', this.onResize.bind(this))
    }

    private onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    update() {
        this.updateRotation()
        this.updateCamera()
        this.input.update()
    }

    updateCamera() {
        this.camera.rotation.set(this.pitch, this.yaw, 0)
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