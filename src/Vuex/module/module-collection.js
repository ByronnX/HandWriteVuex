/**
 * ModuleCollection 类：用于在 Vuex 初始化时进行模块收集操作；
 * 模块收集操作
 * 处理用户传入的options选项
 * 将子模块注册到父模块下
 */
import Module from "./module";
import { forEachValue } from "../utils";
class ModuleCollection {
  constructor(options) {
    // 从根模块开始，将当前子模块注册到父模块下
    // 参数1是一个数组，用于存储路径，标识模块的层级关系
    this.register([], options);
  }
  /**
   *
   * @param {*} path 数组类型，当前待注册模块的完整路径
   * @param {*} rootModule 当前待注册模块对象
   */
  register(path, rootModule) {
    // 格式化：创建module对象
    // 通过类的方式创建，便于后续使用扩展
    let newModule = new Module(rootModule);
    //  // let newModule = {
    //   _raw: rootModule,        // 当前模块的完整对象
    //   _children: {},           // 当前模块的子模块
    //   state: rootModule.state  // 当前模块的状态
    // }

    if (path.length == 0) {
      // 根模块时:创建模块树的根对象
      this.root = newModule;
    } else {
      // 非根模块时：将当前模块注册到父模块身上
      // 逐层找到当前模块的父亲，例如：path = [a, b, c, d]
      /**
       * 1. path.slice(0,-1) ===> [a,b,c]
       * 2. reduce方法 ===> 从根模块(第二个参数的this.root)中找到a模块;从a模块中找到b模块;从b模块中找到c模块;结束返回c模块即为d模块的父亲
       * 3. 返回的是c模块
       */
      let parent = path.slice(0, -1).reduce((memory, current) => {
        return memory.getChild(current); // 当前memory为Module类，使用getChild方法进行处理
        // return memory._children[current];
      }, this.root);
      // 此时parent返回的是c模块
      // path[path.length - 1] ===> 拿到的是d模块，已经是最后了，所以创建一个初始化的模块
      // 将d模块注册到c模块上
      parent.addChild(path[path.length - 1], newModule); // 此时 memo 为 Module 类，使用 addChild 方法进行处理；
      //   parent._children[path[path.length - 1]] = newModule;
    }

    // 若当前模块存在子模块时，递归调用 register 方法（深度优先）,继续注册子模块
    if (rootModule.modules) {
      // 采用深度递归的方式处理子模块
      forEachValue(rootModule.modules, (module, moduleName) => {
        this.register(path.concat(moduleName), module); // 调用 register 时，需要拼接好当前子模块的路径层级，便于确定层级关系时，快速查找父模块；
      });
      //   Object.keys(rootModule.modules).forEach((moduleName) => {
      //     // 拿到当前模块
      //     let module = rootModule.modules[moduleName];
      //     // 1. path: 待注册子模块的完整路径,当前父模块path拼接子模块名moduleName
      //     // 2. module: 当前待注册子模块对象
      //     this.register(path.cancat(moduleName), module); // 调用 register 时，需要拼接好当前子模块的路径层级，便于确定层级关系时，快速查找父模块；
      //   });
    }
  }
  /**
   * 根据当前模块的 path 路径，拼接当前模块的命名空间标识
   * @param {*} path
   * @returns
   */
  getNamespaced(path) {
    let root = this.root;
    // console.log("root", root,)
    // 从根模块开始，逐层处理子模块，拼接命名空间标识
    return path.reduce((str, key) => {
      // 从根模块查找当前子模块
      root = root.getChild(key);
      // console.log("root", root, "root.namespced", root.namespaced);
      
      // 若子模块启用命名空间，拼接命名空间标识并返回结果继续处理
      return str + (root.namespaced ? key + "/" : "");
    }, "");
  }
}
export default ModuleCollection;

/**
 * 期待模块化树的形状是：
 * // 模块树对象
{
  _raw: '根模块',
  _children:{
    moduleA:{
      _raw:"模块A",
      _children:{
        moduleC:{
          _raw:"模块C",
          _children:{},
          state:'模块C的状态'  
        }
    	},
    	state:'模块A的状态'  
    },
    moduleB:{
      _raw:"模块B",
      _children:{},
      state:'模块B的状态'  
    }
  },
  state:'根模块的状态'
}
 */
