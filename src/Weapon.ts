import * as THREE from 'three'
import type { Player } from './Player'
import type { Map } from './Map'
import type { InputController } from './InputController'

export class Weapon {
    rateOfFire = 10 // No. of shots per second
    damage = 10
    magazineCapcity = 30
    currentAmmo = this.magazineCapcity
    reloadTime = 1 // In seconds
    isReloading = false

    constructor() {

    }

    fire(player: Player, camera: THREE.PerspectiveCamera, map: Map) {
        if (this.isReloading) return
        if (this.currentAmmo == 0) return this.reload()
        player.rayCastFromCrosshair(camera, map, this.damage)
        this.currentAmmo--

        // Auto reload
        if (this.currentAmmo === 0) this.reload()
    }

    reload() {
        if (this.isReloading || this.currentAmmo === this.magazineCapcity) return
        this.isReloading = true

        setTimeout(() => {
            this.currentAmmo = this.magazineCapcity
            this.isReloading = false
        }, this.reloadTime * 1000);
    }

    update({ input, currentTimeS, player, camera, map }:
        {
            input: InputController,
            currentTimeS: number,
            player: Player,
            camera: THREE.PerspectiveCamera,
            map: Map
        }) {
        // Reload if requested
        if (input.reloadRequested) this.reload()

        // Fire
        if (input.firing && currentTimeS - player.lastRayCast > 1 / this.rateOfFire) {
            player.lastRayCast = currentTimeS
            this.fire(player, camera, map)
        }
    }
}