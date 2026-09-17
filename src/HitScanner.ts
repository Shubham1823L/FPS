import * as THREE from 'three'
import type { Map } from './Map'

const SCREEN_CENTER = new THREE.Vector2()

export class HitScanner {
    private rayCaster = new THREE.Raycaster
    private intersectableObjects: THREE.Object3D[]
    private camera: THREE.PerspectiveCamera

    private hitTarget = new THREE.Mesh(new THREE.SphereGeometry(.05), new THREE.MeshBasicMaterial({ color: 'red' }))

    private target = {
        boundingBox: new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: 'blue' })),
        health: 100
    }

    constructor(camera: THREE.PerspectiveCamera, map: Map, scene: THREE.Scene) {
        this.intersectableObjects = [map.scene, this.target.boundingBox]
        this.camera = camera

        this.rayCaster.near = 0.1
        this.rayCaster.far = 50


        scene.add(this.hitTarget)
        this.hitTarget.visible = false

        scene.add(this.target.boundingBox)
        this.target.boundingBox.position.set(6, 2, 6)
        this.target.boundingBox.name = 'target'
    }

    shoot(damage: number) {
        // Update raycaster
        this.rayCaster.setFromCamera(SCREEN_CENTER, this.camera)

        // Cast ray, and detect intersected object
        const intersection = this.rayCaster.intersectObjects(this.intersectableObjects, true)[0]

        if (!(intersection?.object instanceof THREE.Mesh)) return this.hitTarget.visible = false
        this.hitTarget.position.copy(intersection.point)
        this.hitTarget.visible = true

        if (intersection.object.name === 'target') {
            if (this.target.health === 0) return
            const reducedHealth = this.target.health - damage
            this.target.health = Math.max(reducedHealth, 0)
            if (this.target.health === 0) {
                this.target.boundingBox.removeFromParent()
                console.log("Target Defeated")
            }
        }

    }

}