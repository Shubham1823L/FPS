import * as THREE from 'three'

export class RemotePlayer {
    private position: THREE.Vector3
    private height = 1.75
    private radius = .35
    helper = new THREE.Mesh(new THREE.CapsuleGeometry(this.radius, this.height - (2 * this.radius)), new THREE.MeshBasicMaterial({ wireframe: true, color: 'aqua' }))

    constructor(scene: THREE.Scene, position: THREE.Vector3) {
        this.position = position
        scene.add(this.helper)
        this.update(this.position)
    }

    update(position: THREE.Vector3) {
        this.position = position
        this.helper.position.copy(this.position).add(new THREE.Vector3(0, this.height / 2, 0))
    }
}