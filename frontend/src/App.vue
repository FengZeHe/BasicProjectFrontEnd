<template>
  <div id="app">
    <el-container>
      <el-aside width="600px" v-if="!$route.meta.noMenu">
        <el-row class="tac">
          <el-col :span="12">
            <h5>菜单栏</h5>
            <el-menu
                default-active="2"
                class="el-menu-vertical-demo">
              <el-menu-item v-for="menuItem in this.menuList" :key="menuList.ID" @click="goPages(menuItem.Path)">
                <i class="el-icon-s-claim"></i>
                <span slot="title">{{ menuItem.Name}}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-main>
          <!--  用于右侧显示内容区          -->
          <router-view></router-view>
        </el-main>
      </el-container>
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
    goPages(url){
      console.log(url)
      this.$router.push(url).catch(()=>{})
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
