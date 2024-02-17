<template>
  <div class="hello">
    商品数量: {{ num }} 个<br>
      商品单价: 10 元<br>
      订单金额: {{ getPrice }} 元<br>
      <button @click="mutationChangeNum(5)">同步更新：数量+5</button>
      <button @click="actionChangeNum(-5)">异步更新：数量-5</button>
      <br>
       A 模块-商品数量: {{ numA }} 个<br>
      C 模块-商品数量: {{ numC }} 个<br>
      <button @click="mutationAChangeNum(5)">A 模块-同步更新：数量+5</button>
      <button @click="mutationCChangeNum(5)">C 模块-同步更新：数量+5</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import { createNamespacedHelpers } from 'vuex';
const { mapState: mapStateA, mapMutations: mapMutationsA } = createNamespacedHelpers('moduleA')
const { mapState: mapStateC, mapMutations: mapMutationsC } = createNamespacedHelpers('moduleA/moduleC')
export default {
  name: 'HelloWorld',
  data() {
    return {

    }
  },
  props: {
    msg: String
  },
  mounted() {
    console.log('home mounted:如果有值就代表传递下去了', this.$store);
  },
  computed: {
    ...mapState({
      num: state => state.num,
    }),
    ...mapGetters({
      getPrice: 'getPrice'
    }),
    ...mapStateA({
      numA: state => state.num
    }),
    ...mapStateC({
      numC: state => state.num
    }),
  },
  methods: {
    ...mapMutations({
      mutationChangeNum: 'changeNum'
    }),
    ...mapActions({
      actionChangeNum : 'changeNum'
    }),
    ...mapMutationsA({
      mutationAChangeNum: 'changeNum'
    }),
    ...mapMutationsC({
      mutationCChangeNum: 'changeNum'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
