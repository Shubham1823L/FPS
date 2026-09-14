import type { Player } from '../player/Player'
import * as THREE from 'three'

export class Physics {
    // Other
    gravity = 9.8

    // Physics consistent timestep
    simulationRate = 200
    timeStep = 1 / this.simulationRate
    accumulator = 0

    update(deltaTime: number, player: Player, input: THREE.Vector3) {
        this.accumulator += deltaTime

        while (this.accumulator >= this.timeStep) {
            player.applyInputs(input)
            // player.velocity.y -= this.gravity * this.timeStep
            console.log(player.velocity.length())
            player.position.addScaledVector(player.velocity, this.timeStep)


            // Update Bounds Helper
            player.boundsHelper.position.copy(player.position)
            player.boundsHelper.position.y -= player.height / 2

            // Update Player Coordinates Display
            const playerCoordinatesDiv = document.getElementById('playerCoordinates')
            if (!playerCoordinatesDiv) return
            playerCoordinatesDiv.textContent = `X: ${player.position.x.toFixed(1)} Y: ${player.position.y.toFixed(1)} Z: ${player.position.z.toFixed(1)}`
            this.accumulator -= this.timeStep
        }
    }
}