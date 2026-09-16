import type { Octree } from "three/examples/jsm/Addons.js"
import type { Player } from "./Player"
import type { InputController } from "./InputController"

export class Physics {
    accumulator = 0
    simulationRate = 60
    timestep = 1 / this.simulationRate

    gravity = 30

    constructor() {

    }

    update(timeElapsedS: number, player: Player, input: InputController, worldOctree: Octree) {
        this.accumulator += timeElapsedS

        while (this.accumulator >= this.timestep) {
            // Calculate player velocity using gravity, yaw and input
            player.calculateVelocity(input, this.gravity, this.timestep)

            // Update playerCollider's position using velocity
            const deltaPosition = player.velocity.clone().multiplyScalar(this.timestep)
            player.collider.translate(deltaPosition)

            // Resolve collisions from collider's updated position
            this.resolveCollisions(player, worldOctree)


            this.accumulator -= this.timestep
        }
    }


    resolveCollisions(player: Player, worldOctree: Octree) {
        const result = worldOctree.capsuleIntersect(player.collider)
        player.onGround = false

        if (!result) return

        // Collision detected
        player.onGround = result.normal.y >= 0.15 // 81deg slope max

        if (!player.onGround) {
            player.velocity.addScaledVector(result.normal, -result.normal.dot(player.velocity))
        }

        if (result.depth >= 1e-10) {
            player.collider.translate(result.normal.multiplyScalar(result.depth))
        }

    }
}