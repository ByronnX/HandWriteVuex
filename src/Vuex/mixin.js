/**
 * 用到了Vue的混入中的生命名周期来把store放入到每一个组件实例里面
 */

export let Vues; // 后续在外部要使用
// 用混入来实现把store放入到每一个组件实例里面
export const install = function (_Vue) {
  Vues = _Vue;
    Vues.mixin({
      // 用到了混入的生命周期
    beforeCreate() {
      //   console.log("this", this.$options.name);
      // 创建$store
      let options = this.$options;
      if (options.store) {
        // 就代表是根实例  ===》 也就是main.js
        this.$store = options.store;
      } else {
        // 不是根实例，就拿父组件的$store，一层层传下去
        this.$store = this.$parent && this.$parent.$store;
      }
    },
  });
};
