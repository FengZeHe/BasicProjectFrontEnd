<template>
  <div id="app">
    <el-container>
      <el-header v-if="!$route.meta.noMenu">
        <div class="header-content clearfix">
          <router-link to="/">
            <span class="logo-text">论坛首页</span>
          </router-link>
          <div class="user-info">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-avatar size="small" :src="avatarUrl"></el-avatar>
                <span class="username">
                  <h3>Admin</h3>
                </span>
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
        <el-aside v-if="!$route.meta.noMenu" width="200px" class="home-aside">
          <el-menu :default-active="$route.path" class="el-menu-vertical" background-color="#304156"
            text-color="#bfcbd9" active-text-color="#409EFF">
            <el-menu-item v-for="menuItem in menuList" :key="menuItem.id" :index="menuItem.path"
              @click="goPages(menuItem.path)">
              <div class="menu-item" slot="title">{{ menuItem.name }}</div>
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
  height: 60px;
}



.logo-text {
  position: relative;
  float: left;
  left: 30px;
  width: 100px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-info {
  width: 100px;
  height: 70px;
  float: right;
  position: absolute;
  right: 30px;
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
  width: 200px;
  height: 100%;
}

.home-aside {
  border-radius: 5px;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.home-aside::-webkit-scrollbar {

  display: none;
}

.menu-item {
  text-align: center;
}
</style>


<script>
import axios from 'axios';
import router from './router';

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
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}


html,
body,
#app,
.el-container {
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
