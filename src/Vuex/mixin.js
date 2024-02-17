// src/vuex/mixin.js

/**
 * 将根组件中注入store实例，混入到所有子组件上
 * @param {*} Vue
 */
export default function applyMixin(Vue) {
  // 通过 beforeCreate 生命周期，在组件创建前，实现全局混入
  Vue.mixin({
    beforeCreate: vuexInit, // vuexInit 为初始化混入逻辑
  });
}

function vuexInit() {
  const options = this.$options;
  // 若选项中存在 store 属性,说明是根实例;否则是子实例;
  if (options.store) {
    // 根实例
    // 为根实例添加 $store 属性，指向 store 实例
    this.$store = options.store;
  } else if (options.parent && options.parent.$store) {
    // 子实例
    // 儿子通过父亲拿到 $store 属性，放到自己身上继续提供给儿子
    this.$store = options.parent.$store;
  }
}



/**
 * 组件混入（共享）store 实例的原理：
 * 组件的渲染是先渲染父组件再渲染子组件，所以，根组件中注入的 store 实例，就可以被混入到 App.vue 组件上。
 * 同理，逐层地，由父组件向子组件传递 store 实例，实现所有组件共享 store 容器实例；
 */