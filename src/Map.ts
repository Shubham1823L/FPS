import * as THREE from 'three'
import { GLTFLoader, Octree, OctreeHelper } from 'three/examples/jsm/Addons.js'

const loader = new GLTFLoader().setPath('/models')

export class Map {
    worldOctree = new Octree()


    private constructor(scene: THREE.Group) {
        this.worldOctree.fromGraphNode(scene)
    }

    static async generate(scene: THREE.Scene) {
        const glb = await loader.loadAsync('/warehouse.glb')
        glb.scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        scene.add(glb.scene)

        const map = new Map(glb.scene)
        // scene.add(new OctreeHelper(map.worldOctree))
        return map
    }
}