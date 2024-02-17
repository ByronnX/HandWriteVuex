import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// vuex-persists 插件实现
function persists() {
  return function (store) {
    console.log("----- persists 插件执行 -----");
    // 取出本地存储的状态
    let data = localStorage.getItem("VUEX:STATE");
    if (data) {
      console.log("----- 存在本地状态，同步至 Vuex -----");
      // 如果存在，使用本地状态替换 Vuex 中的状态
      store.replaceState(JSON.parse(data));
    }
    // subscribe：由 vuex 提供的订阅方法，当触发 mutation 方法时被执行;
    store.subscribe((mutation, state) => {
      console.log("----- 进入 store.subscribe -----");
      localStorage.setItem("VUEX:STATE", JSON.stringify(state));
    });
  };
}

const storePersist = new Vuex.Store({
  plugins: [
    // logger(), // 日志插件:导出的 logger 是一个高阶函数
    persists(), // 持久化插件:vuex-persists
  ],
});

export default storePersist;
