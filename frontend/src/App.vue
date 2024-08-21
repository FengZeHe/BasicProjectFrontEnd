<template>
  <div id="app">
    <el-container>
      <el-aside v-if="!$route.meta.noMenu">
        <el-row class="">
          <el-col>
            <h5>菜单栏</h5>
            <el-menu>
              <el-menu-item v-for="menuItem in this.menuList" :key="menuList.id" @click="goPages(menuItem.path)">
                <!--                <i class="el-icon-s-claim"></i>-->
                <span slot="title">{{ menuItem.name }}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
        <el-main id="main">
          <!--  用于右侧显示内容区          -->
          <router-view></router-view>
        </el-main>
    </el-container>

  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      menuList: []
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
        axios.get("http://127.0.0.1:8088/v2/sys/menu", {
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
  //color: #2c3e50;
  //background-color: #2c3e50;
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
