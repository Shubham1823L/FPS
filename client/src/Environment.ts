import * as THREE from 'three'

export class Environment {


    private constructor() {

    }

    static generate(scene: THREE.Scene) {
        const sun = new THREE.DirectionalLight(0xFFFFFF, 2.5)
        sun.position.set(50, 50, 50)
        sun.castShadow = true
        sun.shadow.camera.near = 0.1
        sun.shadow.camera.far = 200
        sun.shadow.camera.left = -30
        sun.shadow.camera.right = 30
        sun.shadow.camera.top = 30
        sun.shadow.camera.bottom = -30
        sun.shadow.mapSize.set(1024, 1024)
        sun.shadow.bias = -.001
        scene.add(sun)

        const fillLight = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5);
        fillLight.position.set(2, 1, 1);
        scene.add(fillLight);

        const ambientLight = new THREE.AmbientLight('white', .1)
        scene.add(ambientLight)
    }

    
}