import * as THREE from 'three'
import { Bot } from './Bot'

const SCREEN_CENTER = new THREE.Vector2()

export class HitScanner {
    private rayCaster = new THREE.Raycaster
    private intersectableObjects: THREE.Object3D[]
    private camera: THREE.PerspectiveCamera

    private hitTarget = new THREE.Mesh(new THREE.SphereGeometry(.05), new THREE.MeshBasicMaterial({ color: 'red' }))

    constructor(camera: THREE.PerspectiveCamera, intersectableObjects: THREE.Object3D[], scene: THREE.Scene) {
        this.intersectableObjects = intersectableObjects
        this.camera = camera

        this.rayCaster.near = 0.1
        this.rayCaster.far = 50


        scene.add(this.hitTarget)
        this.hitTarget.visible = false
    }

    shoot(damage: number) {
        // Update raycaster
        this.rayCaster.setFromCamera(SCREEN_CENTER, this.camera)

        // Cast ray, and detect intersected object
        const intersection = this.rayCaster.intersectObjects(this.intersectableObjects, true)[0]

        if (!(intersection?.object instanceof THREE.Mesh)) return this.hitTarget.visible = false
        this.hitTarget.position.copy(intersection.point)
        this.hitTarget.visible = true

        const target = intersection.object.userData

        if (target instanceof Bot) target.takeDamage(damage)

    }

}