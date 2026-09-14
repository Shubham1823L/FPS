import * as THREE from 'three'
import type { Player } from './Player'

const keyMap = {
    forward: 'KeyW',
    backward: 'KeyS',
    left: 'KeyA',
    right: 'KeyD',
    jump: 'Space',
} as const

export class Controller {
    activeKeys = new Set<string>()
    private input = new THREE.Vector3()


    constructor() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this))
        window.addEventListener('keyup', this.handleKeyUp.bind(this))
    }


    private handleKeyDown(e: KeyboardEvent) {
        this.activeKeys.add(e.code)
    }

    private handleKeyUp(e: KeyboardEvent) {
        this.activeKeys.delete(e.code)
    }

    updateInput(player: Player) {
        this.input = new THREE.Vector3()

        if (this.activeKeys.has(keyMap.forward)) {
            this.input.z += 1
        }
        if (this.activeKeys.has(keyMap.backward)) {
            this.input.z -= 1
        }
        if (this.activeKeys.has(keyMap.left)) {
            this.input.x -= 1
        }
        if (this.activeKeys.has(keyMap.right)) {
            this.input.x += 1
        }
        if (player.isOnGround && this.activeKeys.has(keyMap.jump)) {
            this.input.y = 1
        }

        return this.input
    }


}