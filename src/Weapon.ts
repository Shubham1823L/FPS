import { HitScanner } from './HitScanner'
import type { InputController } from './InputController'

export class Weapon {
    rateOfFire = 10 // No. of shots per second
    damage = 10
    magazineCapcity = 30
    currentAmmo = this.magazineCapcity
    reloadTime = 1 // In seconds
    isReloading = false
    lastFire = 0

    hitScanner: HitScanner

    constructor(hitScanner: HitScanner) {
        this.hitScanner = hitScanner
    }

    fire() {
        if (this.isReloading) return
        if (this.currentAmmo == 0) return this.reload()

        this.hitScanner.shoot(this.damage)
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

    update(input: InputController, currentTimeS: number) {
        // Reload if requested
        if (input.reloadRequested) this.reload()

        // Fire if conditions allow
        if (input.isFiring && currentTimeS - this.lastFire > 1 / this.rateOfFire) {
            this.lastFire = currentTimeS
            this.fire()
        }
    }
}