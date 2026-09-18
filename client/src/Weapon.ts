import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { HitScanner } from './HitScanner'
import type { InputController } from './InputController'
import * as THREE from 'three'

const loader = new GLTFLoader().setPath('/models/weapons')

export class Weapon {
    rateOfFire = 10 // No. of shots per second
    damage = 10
    magazineCapcity = 30
    currentAmmo = this.magazineCapcity
    reloadTime = 1 // In seconds
    isReloading = false
    lastFire = 0

    fireSound = new Audio('/sounds/weapons/ak47.mp3')
    reloadSound = new Audio('/sounds/weapons/reload.mp3')

    model = new THREE.Group()

    hitScanner: HitScanner

    constructor(hitScanner: HitScanner, camera: THREE.PerspectiveCamera) {
        this.hitScanner = hitScanner

        this.fireSound.volume = .2
        this.reloadSound.volume = .2

        this.loadModel(camera)

    }

    fire() {
        if (this.isReloading) return
        if (this.currentAmmo == 0) return this.reload()

        this.fireSound.currentTime = 0
        this.fireSound.play()
        this.hitScanner.shoot(this.damage)
        this.currentAmmo--

        // Auto reload
        if (this.currentAmmo === 0) this.reload()
    }

    reload() {
        if (this.isReloading || this.currentAmmo === this.magazineCapcity) return
        this.isReloading = true
        this.reloadSound.currentTime = 0
        this.reloadSound.play()
        setTimeout(() => {
            this.currentAmmo = this.magazineCapcity
            this.isReloading = false
            this.reloadSound.pause()
        }, this.reloadTime * 1000);
    }

    update(input: InputController, currentTimeS: number) {
        // Reload if requested
        if (input.reloadRequested) this.reload()

        // Fire if conditions allow
        if (input.isFiring && currentTimeS - this.lastFire > 1 / this.rateOfFire) {
            this.lastFire = currentTimeS
            this.fire()
        }
    }

    private async loadModel(camera: THREE.PerspectiveCamera) {
        const glb = await loader.loadAsync('/ff-ak47.glb')
        glb.scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.receiveShadow = true
            }
        })

        this.model = glb.scene
        camera.add(this.model)
        this.model.scale.z = 2
        this.model.scale.x = .5
        this.model.position.set(.4, -.6, -.75)
        const rotY = -70 * (Math.PI / 180)
        const rotX = 13.5 * (Math.PI / 180)
        this.model.rotation.set(rotX, rotY, 0)
    }

}