import * as THREE from 'three'

export const keyMap = {
    forward: 'KeyW',
    left: 'KeyA',
    backward: 'KeyS',
    right: 'KeyD',
    jump: 'Space',
    reload: 'KeyR',
}

export class InputController {
    private activeKeys = new Set<string>()
    mouseDelta = { x: 0, y: 0 }
    sensitivity = 0.005

    movementDirection = new THREE.Vector3() // local normalized direction 
    jumpRequested = false

    firing = false
    reloadRequested = false


    constructor() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this))
        window.addEventListener('keydown', this.onKeyDown.bind(this))
        window.addEventListener('keyup', this.onKeyUp.bind(this))
        window.addEventListener('mousedown', this.onMouseDown.bind(this))
        window.addEventListener('mouseup', this.onMouseUp.bind(this))
    }

    private onMouseMove(e: MouseEvent) {
        if (!document.pointerLockElement) return
        this.mouseDelta.x = e.movementX
        this.mouseDelta.y = e.movementY
    }

    private onKeyDown(e: KeyboardEvent) {
        if (!document.pointerLockElement) document.documentElement.requestPointerLock()
        this.activeKeys.add(e.code)

        // Reload
        if (this.activeKeys.has(keyMap.reload)) this.reloadRequested = true
    }

    private onKeyUp(e: KeyboardEvent) {
        this.activeKeys.delete(e.code)

        if (this.reloadRequested) this.reloadRequested = false
    }

    private onMouseDown() {
        if (!document.pointerLockElement) document.documentElement.requestPointerLock()
        this.firing = true
    }

    private onMouseUp() {
        this.firing = false
    }


    updateMovementInput(playerOnGround: boolean) {
        // read the keys and update the movement input vector to represent local normalized direction vector
        const forwardVelocity = (this.activeKeys.has(keyMap.forward) ? -1 : 0) + (this.activeKeys.has(keyMap.backward) ? 1 : 0)
        const strafeVelocity = (this.activeKeys.has(keyMap.right) ? 1 : 0) + (this.activeKeys.has(keyMap.left) ? -1 : 0)

        this.movementDirection.set(strafeVelocity, 0, forwardVelocity).normalize()


        if (playerOnGround && this.activeKeys.has(keyMap.jump)) this.jumpRequested = true // we won't remove it from here, the animation loop handles that, this is called queueing , so that jump pressed and released between frames isnt missed
    }


    consumeMouseDelta() {
        this.mouseDelta = { x: 0, y: 0 }
    }


    consumeJumpRequest() {
        this.jumpRequested = false
    }

}