import type { Player } from '../player/Player'

export class Physics {
    // Other
    gravity = 9.8

    // Physics consistent timestep
    simulationRate = 200
    timeStep = 1 / this.simulationRate
    accumulator = 0

    update(deltaTime: number, player: Player) {
        this.accumulator += deltaTime

        while (this.accumulator >= this.timeStep) {
            // player.velocity.y -= this.gravity * deltaTime
            player.applyInputs(this.timeStep)
            this.accumulator -= this.timeStep
        }
    }
}