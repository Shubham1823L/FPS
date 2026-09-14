import * as THREE from 'three'
import { GLTFLoader, Octree } from "three/examples/jsm/Addons.js";

const loader = new GLTFLoader().setPath('/models')

export class Map {
    scene: THREE.Group
    octree = new Octree()

    private constructor(scene: THREE.Group) {
        this.scene = scene
        this.octree = this.octree.fromGraphNode(scene)
    }

    static async load(url: string, scene: THREE.Scene) {
        const glb = await loader.loadAsync(url)

        glb.scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        const map = new Map(glb.scene)
        scene.add(map.scene)

        return map
    }
}