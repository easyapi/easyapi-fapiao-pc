<template>
  <div id="app">
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {},
    data() {
      return {}
    },
    watch: {
      '$route': function () {
      }
    },
    methods: {},
    created() {
    },
  }
</script>


<style lang="stylus" scoped media="screen">
  @import './assets/styles/invoice.styl'
  @media screen and (max-width: 1260px) {
    .main {
      width: 960px;
      height: auto;
      margin: 0px auto;
      padding-top: 24px;
      padding-bottom: 50px;
    }
  }
</style>
