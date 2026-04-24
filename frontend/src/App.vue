<template>
  <div id="app">
    <el-container class="app-container">
      <el-header v-if="!$route.meta.noMenu" class="app-header">
          <topNav/>
      </el-header>

      <el-container class="app-body-container">
        <homeAside></homeAside>
        <el-main id="main" class="app-main">
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
  overflow: hidden;
}

.app-container {
  height: 100vh;
  background-color: #f7f8fa;
}

.app-header {
  height: 60px !important;
  padding: 0 !important;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.app-body-container {
  height: calc(100vh - 60px);
}

.app-main {
  padding: 0 !important;
  background-color: #f7f8fa;
  height: 100%;
  overflow-y: auto;
}

/* 移除 Element UI 容器的默认边框和背景色 */
.el-container {
  background-color: transparent;
}

.el-aside {
  background-color: transparent;
}

/* 滚动条美化 */
.app-main::-webkit-scrollbar {
  width: 8px;
}

.app-main::-webkit-scrollbar-thumb {
  background-color: #c9cdd4;
  border-radius: 4px;
}

.app-main::-webkit-scrollbar-track {
  background-color: #f2f3f5;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
