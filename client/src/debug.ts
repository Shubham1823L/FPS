import GUI from "three/examples/jsm/libs/lil-gui.module.min.js"
import type { Player } from "./Player"

//Debug
export const debug = {
    playerHelper: false,
    playerCameraHelper: false,
    orbitControls: false
}

export const createDebugUI = (player: Player) => {
    const gui = new GUI()

    const debugFolder = gui.addFolder('Debug')

    debugFolder.add(debug, 'playerHelper').name('Player Capsule').onChange(value => {
        player.helper.visible = value
    })
    debugFolder.add(debug, 'playerCameraHelper').name('Player Camera').onChange(value => {
        player.cameraHelper.visible = value
    })
    debugFolder.add(debug, 'orbitControls').name('Orbit Controls')
}


