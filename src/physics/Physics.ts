import type { Octree } from 'three/examples/jsm/Addons.js'
import type { Player } from '../player/Player'
import * as THREE from 'three'

export class Physics {
    // Other
    gravity = 30
    worldOctree: Octree

    // Physics consistent timestep
    simulationRate = 200
    timeStep = 1 / this.simulationRate
    accumulator = 0

    constructor(octree: Octree) {
        this.worldOctree = octree
    }

    update(deltaTime: number, player: Player, input: THREE.Vector3) {
        this.accumulator += deltaTime

        while (this.accumulator >= this.timeStep) {
            player.applyInputs(input)
            if (!player.isOnGround) player.velocity.y -= this.gravity * this.timeStep
            player.controls.moveForward(player.velocity.z * this.timeStep)
            player.controls.moveRight(player.velocity.x * this.timeStep)
            player.position.y += player.velocity.y * this.timeStep

            const { x, y, z } = player.position
            player.collider.start.set(x, y, z)
            player.collider.end.set(x, y, z)


            // // Update Bounds Helper
            // player.boundsHelper.position.copy(player.position)
            // player.boundsHelper.position.y -= player.height / 2

            // Update Player Coordinates Display
            const playerCoordinatesDiv = document.getElementById('playerCoordinates')
            if (!playerCoordinatesDiv) return
            playerCoordinatesDiv.textContent = `X: ${player.position.x.toFixed(1)} Y: ${player.position.y.toFixed(1)} Z: ${player.position.z.toFixed(1)}`

            this.resolveCollisions(player)

            player.position.copy(player.collider.end)
            player.collider.getCenter(player.boundsHelper.position)

            this.accumulator -= this.timeStep

        }
    }

    resolveCollisions(player: Player) {
        const result = this.worldOctree.capsuleIntersect(player.collider)
        player.isOnGround = false

        if (!result) return

        player.isOnGround = result.normal.y >= .15

        if (!player.isOnGround) {
            player.velocity.addScaledVector(result.normal, -result.normal.dot(player.velocity)) //dot is negative therefore negating again , cuz adding along normal pointing away from collision plane
        }

        // Collision detected
        if (result.depth >= 1e-10) {

            player.collider.translate(result.normal.multiplyScalar(result.depth))
        }
    }
}