// src/store/index.js

import Vue from "vue";
import Vuex from "@/vuex";

// 引入两个测试模块
import moduleA from './moduleA'
import moduleB from './moduleB'
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    num: 10,
  },
  getters: {
    getPrice(state) {
      return state.num * 10;
    },
  },
  // 同步更新状态
  mutations: {
    changeNum(state, payload) {
      state.num += payload;
    },
  },
  // 可执行异步操作，通过 mutations 更新状态
  actions: {
    changeNum({ commit }, payload) {
      setTimeout(() => {
        commit("changeNum", payload);
      }, 1000);
    },
  },
  // 在根模块下注册子模块 A、B
  modules: {
    moduleA,
    moduleB,
  },
});
export default store;
