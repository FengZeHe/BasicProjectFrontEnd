<template>
  <div id="app">
    <el-container>
      <el-header v-if="!$route.meta.noMenu" height="60px">
        <div class="header-content">
          <div class="logo">
            <img src="./assets/logo.png" alt="Logo" class="logo-img">
            <span class="logo-text">BasicProjectV2</span>
          </div>
          <div class="user-info">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-avatar size="small" :src="avatarUrl"></el-avatar>
                <span class="username"> //todo </span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside v-if="!$route.meta.noMenu" width="240px">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF">
            <el-menu-item v-for="menuItem in menuList" :key="menuItem.id" :index="menuItem.path" @click="goPages(menuItem.path)">
              <i :class="menuItem.icon || 'el-icon-menu'"></i>
              <span slot="title">{{ menuItem.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
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
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 32px;
  margin-right: 10px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-info {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 8px;
  color: var(--text-primary);
}

.el-menu-vertical {
  height: calc(100vh - 60px);
}

.el-menu-item i {
  margin-right: 10px;
}
</style>


<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      menuList: [],
      avatarUrl: require("./assets/avatar.png"),
    }
  },
  methods: {
    goAbout() {
      this.$router.push("/about").catch(() => {
      })
    },
    goViewArticles() {
      this.$router.push("/viewArticles").catch(() => {
      })
    },
    goPages(url) {
      this.$router.push(url).catch(() => {
      })
    },
    //获取当前用户的菜单列表
    getMenu() {
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/menus/list", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => {
          this.menuList = JSON.parse(JSON.stringify(res.data.data))
        })
      }
    },
    // 获取用户的token
    getToken() {
      let cookieValue = null;
      document.cookie.split('; ').forEach((item) => {
        let [n, v] = item.trim().split('=');
        if (n === 'jwt') {
          cookieValue = v;
        }
      });
      return cookieValue;
    }
  },
  mounted() {
    this.getMenu()
  }
}


</script>


<style>

html, body,#app ,.el-container{
  margin: 0;
  padding: 0;
  height: 100%;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.el-main {
  text-align: center;
  height: 100%;
}


nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
