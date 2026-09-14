const keyMap = {
    forward: 'KeyW',
    left: 'KeyA',
    backward: 'KeyS',
    right: 'KeyD'
}

export class InputController {
    activeKeys = new Set<string>()
    mouseDelta = { x: 0, y: 0 }
    sensitivity = 0.005


    constructor() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this))
        window.addEventListener('mousedown', this.onMouseDown.bind(this))
        window.addEventListener('keydown', this.onKeyDown.bind(this))
        window.addEventListener('keyup', this.onKeyUp.bind(this))
    }

    private onMouseMove(e: MouseEvent) {
        if (!document.pointerLockElement) return
        this.mouseDelta.x = e.movementX
        this.mouseDelta.y = e.movementY
    }

    private onMouseDown() {
        if (!document.pointerLockElement) document.documentElement.requestPointerLock()
    }

    private onKeyDown(e: KeyboardEvent) {
        if (!document.pointerLockElement) document.documentElement.requestPointerLock()
        this.activeKeys.add(e.code)
    }

    private onKeyUp(e: KeyboardEvent) {
        this.activeKeys.delete(e.code)
    }

    update() {

    }

}