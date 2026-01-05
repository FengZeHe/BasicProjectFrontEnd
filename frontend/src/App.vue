<template>
  <div id="app">
    12323123
    {{ $store.state }}
    <el-container>
      <el-header v-if="!$route.meta.noMenu">
          <topNav/>
      </el-header>

      <el-container>
        <homeAside></homeAside>
        <el-main id="main">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<style scoped>
</style>


<script>
import topNav from '@/components/topNav'
import homeAside from '@/components/homeAside'

export default {
  name: 'App',
  components:{
    topNav,
    homeAside
  },
}


</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.el-main{
  padding-top: 0;
  margin-top: 0;
}

</style>
