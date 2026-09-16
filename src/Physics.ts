import type { Octree } from "three/examples/jsm/Addons.js"
import type { Player } from "./Player"
import * as THREE from 'three'

export class Physics {
    accumulator = 0
    simulationRate = 200
    timestep = 1 / this.simulationRate

    gravity = 9.8

    constructor() {

    }

    update(timeElapsedS: number, player: Player, worldOctree: Octree) {
        this.accumulator += timeElapsedS

        while (this.accumulator >= this.timestep) {
            //camera has updated
            // lets copy cam position to collider then resolve collision
            player.update(this.timestep) // updates camera and collider (rotation and translation)
            // player.velocity.y -= this.gravity * this.timestep
            // player.fpsCamera.translation.y += player.velocity.y * this.timestep
            // player.camera.position.copy(player.fpsCamera.translation)
            player.updateCameraFromCollider()

            this.resolveCollisions(player, worldOctree)
            player.updateCameraFromCollider()
            player.updateColliderHelper()

            this.accumulator -= this.timestep
        }
    }


    resolveCollisions(player: Player, worldOctree: Octree) {
        const result = worldOctree.capsuleIntersect(player.collider)
        player.onGround = false

        console.log(result)
        if (!result) return
        // console.log('r', result)
        // Collision detected
        player.onGround = result.normal.y >= 0.15 // 81deg slope max

        if (result.depth >= 1e-10) {
            // console.log('y', player.collider.start.y)
            // const a = result.normal.clone().multiplyScalar(result.depth)
            // console.log(result.normal.y * result.depth)
            // console.log('delta', a)

            player.collider.translate(result.normal.clone().multiplyScalar(result.depth))
        }

    }
}