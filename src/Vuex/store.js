// src/vuex/store.js
import applyMixin from "./mixin";
import ModuleCollection from "./module/module-collection";
import { forEachValue } from "./utils";
// 导出传入的 Vue 的构造函数，供插件内部的其他文件使用
export let Vue;

// 容器的初始化
export class Store {
  constructor(options) {
    // options:{state, getters, mutation, actions}
    const state = options.state; // 获取 options 选项中的 state 状态对象
    // ----------------------------
    this._actions = {};
    this._mutations = {};
    this._wrappedGetters = {};

    // 1,模块收集：options 格式化 -> Vuex 模块树
    this._modules = new ModuleCollection(options);

    // 2,模块安装：
    installModule(this, state, [], this._modules.root); // (store, rootState, path, module)

    // 3,将 state 状态、getters 定义在当前的 vm 实例上
    resetStoreVM(this, state);
    console.log("模块安装结果:_mutations", this._mutations);
    console.log("模块安装结果:_actions", this._actions);
    console.log("模块安装结果:_wrappedGetters", this._wrappedGetters);
    // ----------------------------
    // 获取 options 选项中的 getters 对象：内部包含多个方法
    const getters = options.getters;
    // 声明 store 实例中的 getters 对象
    this.getters = {};
    // 将 options.getters 中的方法定义到计算属性中
    const computed = {};
    // 页面通过“{{this.$store.getters.getPrice}}”取值，取的是 getters 对象中的属性
    // 所以，需要将将用户传入的 options.getters 属性中的方法,转变成为 store 实例中的 getters 对象上对应的属性
    Object.keys(getters).forEach((key) => {
      // 将 options.getters 中定义的方法，放入计算属性 computed 中，即定义在 Vue 的实例 _vm 上
      computed[key] = () => {
        return getters[key](this.state);
      };
      // 将 options.getters 中定义的方法，放入store 实例中的 getters 对象中
      Object.defineProperty(this.getters, key, {
        // 取值操作时,执行计算属性逻辑
        get: () => this._vm[key],
      });
    });
    // ----------------------------
    // 声明 store 实例中的 mutations 对象
    this.mutations = {};
    // 获取 options 选项中的 mutations 对象
    const mutations = options.mutations;

    // 将 options.mutations 中定义的方法，绑定到 store 实例中的 mutations 对象
    Object.keys(mutations).forEach((key) => {
      // payload：commit 方法中调用 store 实例中的 mutations 方法时传入
      this.mutations[key] = (payload) => mutations[key](this.state, payload);
    });
    // ----------------------------
    // 声明 store 实例中的 actions 对象
    this.actions = {};
    // 获取 options 选项中的 actions 对象
    const actions = options.actions;

    // 将 options.actions 中定义的方法，绑定到 store 实例中的 actions 对象
    Object.keys(actions).forEach((key) => {
      // payload:dispatch 方法中调用 store 实例中的 actions 方法时传入
      this.actions[key] = (payload) => actions[key](this, payload);
    });
    // ----------------------------
    // 响应式数据: new Vue({ data })
    this._vm = new Vue({
      data: {
        // 在 Vue 中，以 $ 开头表示 Vue 的内部属性，当做数据代理时默认不会被挂载到 vm 实例上；
        // 即不能通过vm.$$state获取，只能通过 _vm._data.$$state 进行访问，_data表示私有属性，不可被外部访问；
        $$state: state, // $$state 对象将通过 defineProperty 进行属性劫持
      },
      computed, // 将 options.getters 定义到 computed 实现数据缓存
    });
    this._modules = new ModuleCollection(options);
    // console.log("this._modules", this._modules);
  }
  // --------------------
  // get state()是 ES6 语法属性访问器，相当于 Object.defineProperty({ }) 中的 getter；
  get state() {
    // 对外提供属性访问器：当访问state时，实际是访问 _vm._data.$$state
    return this._vm._data.$$state;
  }
  // --------------------------
  /**
   * 通过 type 找到 store 实例的 mutations 对象中对应的方法，并执行
   *    用户可能会解构使用{ commit }, 也有可能在页面使用 $store.commit，
   *    所以，在实际执行时，this是不确定的，{ commit } 写法 this 为空，
   *    使用箭头函数：确保 this 指向 store 实例；
   * @param {*} type mutation 方法名
   * @param {*} payload 载荷：值或对象
   */
  commit = (type, payload) => {
    // 旧：执行 mutations 对象中对应的方法，并传入 payload 执行
    // this.mutations[type](payload);
    // 新：不再去 mutations 对象中查找，直接在 _mutations 中找到 type 对应的数组，依次执行
    // console.log("this._mutations[type]", this._mutations);
    this._mutations[type].forEach((mutation) => {
      mutation.call(this,payload)
    })
  };
  // --------------------
  /**
   * 通过 type 找到 store 实例的 actions 对象中对应的方法，并执行
   *    用户可能会解构使用{ dispatch }, 也有可能在页面使用 $store.dispatch,
   *    所以，在实际执行时，this 是不确定的，{ dispatch } 写法 this 为空，
   *    使用箭头函数：确保 this 指向 store 实例；
   * @param {*} type action 方法名
   * @param {*} payload 载荷：值或对象
   */
  dispatch = (type, payload) => {
    // 旧：执行 actions 对象中对应的方法，并传入 payload 执行
    // this.actions[type](payload);
    // 新：不再去 actions 对象中查找，直接在 _actions 中找到 type 对应的数组，依次执行
    this._actions[type].forEach(action=>action.call(this, payload))
  };
}
/**
 * 插件安装逻辑：当Vue.use(Vuex)时执行
 * @param {*} _Vue Vue 的构造函数,Vue自带传过来的
 */
export const install = (_Vue) => {
  Vue = _Vue;
  applyMixin(Vue);
};

//----------------------------
/**
 * 1. store：store实例
 * 2. rootState：根模块的state
 * 3. path：所有路径
 * 4. module：当前模块
 */
const installModule = (store, rootState, path, module) => {
  // 根据当前模块的 path 路径，拼接当前模块的命名空间标识
  let namespace = store._modules.getNamespaced(path);
  // console.log("namespace", namespace);
  // console.log(store, rootState, path, module);
  // 处理子模块：将子模块上的状态，添加到对应父模块的状态中；
  if (path.length > 0) {
    // console.log("path", path, "path.slice(0, -1)", path.slice(0, -1));

    // 从根状态开始逐层差找，找到当前子模块对应的父模块状态
    /**
     * 思路：
     * 第一次进来的时候path:[]，是根实例所以path的长度不大于零，不进行判断
     * 第二次进来的时候path:['moduleA']，是moduleA，但是由于path.slice(0, -1)这句话，因为此时path只有一个值，path:[moduleA]，
     * 导致redece一个空的数组，所以不走reduce，而是直接拿到第二个参数的初始化数据（rootState），赋值给了parent
     * 此时moduleA的parent正好是rootState。
     * 第三次进来的时候path:['moduleA','moduleC']，moduleC是moduleA的儿子，
     * 此时path.slice(0, -1)拿到的是['moduleA'],此时进reduce是rootState和moduleA的state进行运算，
     * 所以return pre[current];的意思是在rootState中取到儿子moduleA，此时正好是moduleC的父亲
     * 总的来说：
     * 1. 关键在path.slice(0, -1)，这个条件就排除掉了本身，留下了自己的父级
     * 2. 然后reduce的时候，通过return pre[current]进一步拿到当前模块的子模块 ==》 return stateRoot[moduleA]
     */
    let parent = path.slice(0, -1).reduce((pre, current) => {
      // console.log("pre", pre, "current", current);
      return pre[current];
    }, rootState);
    // console.log("parent", parent);
    // 支持 Vuex 动态添加模块，将新增状态直接定义成为响应式数据；
    // 在parent的身上设置一个属性为path[path.length-1]的值为：module.state
    Vue.set(parent, path[path.length - 1], module.state);
  }
  /**
   * 1. mutation: 每一个模块里面的mutation方法
   * 2. key： 每一个模块里面mutation方法的名称
   */
  module.forEachMutation((mutation, key) => {
    // console.log("mutation", mutation);
    // console.log("key", key);
    // 每个 key 可能会存在多个需要被处理的函数
    store._mutations[namespace + key] = store._mutations[namespace + key] || [];
    // console.log("store._mutations[key]", store._mutations[key]);
    // 向 _mutations 对应 key 的数组中，放入对应的处理函数
    store._mutations[namespace + key].push((payload) => {
      // 执行 mutation，传入当前模块的 state 状态
      mutation.call(store, module.state, payload);
    });
    // console.log("store._mutations[key]", store._mutations[key]);
  });
  // 遍历 action
  module.forEachAction((action, key) => {
    store._actions[namespace + key] = store._actions[namespace + key] || [];
    store._actions[namespace + key].push((payload) => {
      action.call(store, store, payload);
    });
  });
  // 遍历 getter
  module.forEachGetter((getter, key) => {
    // 注意：getter 重名将会被覆盖
    store._wrappedGetters[namespace + key] = function () {
      // 执行对应的 getter 方法，传入当前模块的 state 状态，返回执行结果
      return getter(module.state);
    };
  });
  // 遍历当前模块的儿子
  module.forEachChild((child, key) => {
    // 递归安装/加载子模块
    installModule(store, rootState, path.concat(key), child);
  });
};



// ---------------------------
/**
 * 借助 Vue 的响应式，为 store 实例上添加一个 Vue 实例_vm，通过计算属性
 * 实现 _wrapperGetters 中的 getters 的缓存效果，并将 state 定义到 data 中实现状态的响应式能力；
 */
/**
 * 重置 Store 容器对象的 vm 实例
 * @param {*} store store实例，包含 _wrappedGetters 即全部的 getter 方法；
 * @param {*} state 根状态，在状态安装完成后包含全部模块状态；
 */
function resetStoreVM(store, state) {
  const computed = {}; // 定义 computed 计算属性
  store.getters = {};  // 定义 store 容器实例中的 getters
  // 遍历 _wrappedGetters 构建 computed 对象并进行数据代理
  forEachValue(store._wrappedGetters, (fn, key) => {
    // 构建 computed 对象，后面借助 Vue 计算属性实现数据缓存
    computed[key] = () => {
      return fn();
    }
    // 数据代理：将 getter 的取值代理到 vm 实例上，到计算数据取值
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key]
    });
  })
  // 使用 state 根状态 和 computed 创建 vm 实例，成为响应式数据
  store._vm = new Vue({
    // 借助 data 使根状态 state 成为响应式数据
    data: {
      $$state: state
    },
    // 借助 computed 计算属性实现数据缓存
    computed 
  });
}