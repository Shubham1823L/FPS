import * as THREE from 'three'
import { clamp } from 'three/src/math/MathUtils.js'
import type { Player } from './Player'


export class FirstPersonCamera {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
    pitch = 0

    constructor() {
        this.camera.rotation.order = 'YXZ'
        window.addEventListener('resize', this.onResize.bind(this))
    }

    private onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    update({ yaw, position, height }: Player) {
        this.camera.rotation.set(this.pitch, yaw, 0)
        this.camera.position.copy(position).add(new THREE.Vector3(0, height, 0))
    }


    calculatePitch(mouseDeltaY: number, sensitivity: number) {
        const yh = mouseDeltaY * sensitivity
        this.pitch = clamp(this.pitch - yh, - Math.PI / 2, Math.PI / 2) // restricted to [-PI / 2, PI / 2]
    }
}