
import * as THREE from '../three.js/build/three.module';
import { init, state } from './shared-cubes.js';

// 因为Worker看不见dom结构，所以需要重新设定canvas.clientWidth和Height


function main(data) {

    // 不从dom中获取画布，而是从事件数据中获取它
    // const canvas = document.querySelector( '#c' );
    const { canvas } = data;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    state.width = canvas.width;
    state.height = canvas.height;

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    {

        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(- 1, 2, 4);
        scene.add(light);

    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, x) {

        const material = new THREE.MeshPhongMaterial({ color });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;

        return cube;

    }

    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, - 2),
        makeInstance(geometry, 0xaa8844, 2),
    ];


    function resizeRendererToDisplaySize(renderer) {

        const canvas = renderer.domElement;
        // const width = canvas.clientWidth * pixelRatio | 0;
        // const height = canvas.clientHeight * pixelRatio | 0;
        const width = state.width;
        const height = state.height;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {

            renderer.setSize(width, height, false);

        }

        return needResize;

    }

    function render(time) {

        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {

            const canvas = renderer.domElement;
            // camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.aspect = state.width / state.height;
            camera.updateProjectionMatrix();

        }

        cubes.forEach((cube, ndx) => {

            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;

        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);

    }

    requestAnimationFrame(render);

}


// 使用size处理函数 来【更新】宽高的值
function size(data) {
    state.width = data.width;
    state.height = data.height;
}


const handlers = {
    init,
    size,
};

self.onmessage = function (e) {
    const fn = handlers[e.data.type];
    if (typeof fn !== 'function') {
        throw new Error('no hanler for type:' + e.data.type);
    }
    fn(e.data);
};



// main();

