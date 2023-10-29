import { init, state } from './shared-cubes.js';



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
    // console.log(fn);  init()和size()
    if (typeof fn !== 'function') {
        throw new Error('no hanler for type:' + e.data.type);
    }
    fn(e.data);
};

// 根据从主页面传入data中的type查找处理函数



