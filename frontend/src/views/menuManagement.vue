<template>
  <div class="menuManagement">
    <h1>This is Menu Management Page</h1>
    <el-table :data="menuList" style="width:100%">
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="order_no" label="序号" width="180"></el-table-column>
      <el-table-column  label="操作" width="180">
        <el-button-group>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>

        </el-button-group>

      </el-table-column>
    </el-table>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: 'menuManagement',
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    getMenu() {
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/menus/list", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => {
          this.menuList = JSON.parse(JSON.stringify(res.data.data))
          console.log(this.menuList)
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
  created() {
    this.getMenu()
  }
}
</script>

<style scoped>
.menuManagement{
  text-align: center;
}
</style>