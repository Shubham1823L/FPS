import { Capsule } from "three/examples/jsm/Addons.js"
import * as THREE from 'three'

export class Bot {
    health = 100
    isDead = false

    colliderRadius = .35
    height = 1.75 // total height of player (feet to head)
    helper = new THREE.Mesh(
        new THREE.CapsuleGeometry(this.colliderRadius, this.height - (2 * this.colliderRadius)),
        new THREE.MeshBasicMaterial({ wireframe: true, color: 'white' })
    )

    spawnPosition = new THREE.Vector3(2, 2, 2)
    position = this.spawnPosition.clone()
    collider = new Capsule(
        this.spawnPosition.clone().add(new THREE.Vector3(0, this.colliderRadius, 0)),
        this.spawnPosition.clone().add(new THREE.Vector3(0, this.height - this.colliderRadius)),
        this.colliderRadius
    )

    private static botId = 0
    name =`Bot ${Bot.botId++}`

    constructor(scene: THREE.Scene) {
        scene.add(this.helper)
        this.collider.getCenter(this.helper.position)
        this.helper.name = `Bot ${this.name}`
        this.helper.userData = this
    }

    takeDamage(damage: number) {
        if (this.isDead) return

        const reducedHealth = this.health - damage
        this.health = Math.max(reducedHealth, 0)

        if (this.health === 0) {
            this.isDead = true
            console.log(`${this.name} down`)
        }
    }
}