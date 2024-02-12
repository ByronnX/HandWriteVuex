/**
 * 1. 把getters、mutations、actions中的方法每一个都拿出来，解开一层并调用
 * 2. 通过Vue中的data来实现响应式、computed实现缓存
 */
import { foreach } from "@/utils";
import { Vues } from "./mixin";

export class Store {
  constructor(options) {
    // --------------------getters
    // 使用:this.$store.getters.count
    let getters = options.getters;
    this.getters = {};
    let computed = {};
    // 封装写法
    /**
     * 1. 把getters这个对象传进去，并把这个对象的key、value都给拿出来调用别的函数
     * 2. 设置：把getters的key（也就是方法
     * 名）作为computed对象的其中一项，并且值为一个函数，返回并执行一个value（方法体）并且把这个实例的state给传进去
     * 3. 获取：由于在下面进行了代理，所以获取的时候，在实例身上就可以拿到
     */
    foreach(getters, (key, value) => {
      // 缓存机制，第一次就计算返回
      computed[key] = () => {
        return value(this.state);
      };
      Object.defineProperty(this.getters, key, {
        get: () => {
          // 第二次就在实例身上获取并返回
          return this._vm[key];
        },
      });
    });
    // --------------------mutations
    let mutations = options.mutations;
    this.mutations = {};
    // 给mutations对象身上的属性都拿出来遍历，并执行第二个参数的方法，也就是回调函数
    foreach(mutations, (key, value) => {
      // 给mutations对象身上的属性都设置为一个方法
      this.mutations[key] = (data) => {
        return value(this.state, data);
      };
    });
    //   console.log('mutations',this.mutations);
    // --------------------actions
    let actions = options.actions;
    this.actions = {};
    foreach(actions, (key, value) => {
      this.actions[key] = (data) => {
        return value(this, data); // 要注意这里的第一个参数是this，因为外面有可能要解构，比如：{commit}
      };
    });
    console.log("actions", this.actions);

    // --------------------通过Vue中的data来实现响应式、computed实现缓存
    this._vm = new Vues({
      data: {
        state: options.state,
      },
      computed,
    });
  }
  // Object.defineProperty中的get方法
  get state() {
    // console.log("this._vm", this._vm);
    return this._vm.state; // state在data中已经被代理所以可以这样轻松获取
  }
  // $store.commit('increment',1)
  commit = (name, data) => {
    this.mutations[name](data);
  };
  // dispatch
  dispatch = (name, data) => {
    this.actions[name](data);
  };
}
