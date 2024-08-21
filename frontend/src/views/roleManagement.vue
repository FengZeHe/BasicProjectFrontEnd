<template>
  <div class="roleManagement">
    <h1>This is role Management Page</h1>
    <el-table :data="roleList" style="width: 100%">
      <el-table-column prop="role_name" width="180" label="名称"></el-table-column>
      <el-table-column prop="desc" width="180" label="描述"></el-table-column>
      <el-table-column prop="status" width="180" label="状态">
        <template v-slot="scope">
          <el-switch
              :value="scope.row.status === '1'"
              @change="(value)=>scope.row.status = value ? '1' :'0'">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <el-button type="primary" icon="el-icon-edit" circle @click="drawer = true"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle></el-button>
      </el-table-column>

    </el-table>

    <el-drawer
        size="70%"
        :visible.sync="drawer">

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item class="menu-item">
          <h1>修改菜单权限</h1>
          <el-transfer
              class="transfer-item" :titles="['未授权', '已授权']"
              v-model="form.menuValue" :data="menuList"></el-transfer>
        </el-form-item>


        <el-form-item class="menu-item">
          <h1>修改API接口权限</h1>
          <el-transfer
              class="transfer-item" :titles="['未授权', '已授权']"
              v-model="form.apiValue" :data="apiList"></el-transfer>
        </el-form-item>
      </el-form>

      <el-button-group>
        <el-button type="success" icon="el-icon-check" >保存</el-button>
      </el-button-group>

    </el-drawer>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      roleList: [],
      drawer: false,
      menuList: [],
      apiList: [],
      value: [1],
      form: {
        name: '',
        apiValue:[],
        menuValue:[]
      }
    }
  },
  methods: {
    getRoles() {
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/roles/list", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => {
          this.roleList = res.data.data
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
    },
    getMenus() {
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/menus/list", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => {
          var list = res.data.data
          for (var i = 0; i < list.length; i++) {
            var temp = {
              key: list[i].id,
              label: list[i].name,
              disable: false
            }
            this.menuList.push(temp)
          }
        })
      }
    },
    getApi(){
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/sys/apiList", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => {
          var list = res.data.data
          for (var i = 0; i < list.length; i++) {
            var temp = {
              key: list[i].id,
              label: list[i].name,
              disable: false
            }
            this.apiList.push(temp)
          }
        })
      }
    },
    getRoleMenu(){
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/sys/menu", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => {
          var list = res.data.data
          for (var i = 0; i < list.length; i++) {
            this.form.menuValue.push(list[i].id)
          }
        })
      }
    },
    getRoleApi(){
      const token = this.getToken()

    }


  },
  mounted() {
    this.getRoles();
    this.getMenus();
    this.getApi();
    this.getRoleMenu();
  }
}


</script>


<style scoped>
.menu-item {
  display: flex;
}


.transfer-item {
  flex: 1;
  text-align: left;
}

</style>