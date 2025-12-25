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
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="HandleEditClick(scope.row.role_name)"
                     :value="scope.row.role_name"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-drawer
        size="70%"
        :visible.sync="drawer"
        @close="handleDrawerClose"
    >

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
              v-model="form.apiValue" :data="apiList"
          ></el-transfer>
        </el-form-item>
      </el-form>

      <el-button-group>
        <template v-slot="scope">
          <el-button type="success" icon="el-icon-check" @click="HandleUpdateCasbinRules">保存</el-button>

        </template>
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
        roleName: '',
        apiValue: [],
        menuValue: []
      },
      selectedRole: ''
    }
  },
  methods: {
    HandleEditClick(roleName) {
      this.getRoleMenu(roleName)
      this.getRoleApi(roleName)
      this.form.roleName = roleName;
      this.drawer = true
    },
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
      const token = localStorage.getItem("userToken")
      return token;
    },
    getMenus() {
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/sys/AllMenuList", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => {
          var list = res.data.data
          if (list == null){
            return
          }
          for (var i = 0; i < list.length; i++) {
            var temp = {
              key: list[i].id,
              label: list[i].name,
              disable: false,
              path: list[i].path,
              methods: list[i].methods
            }
            this.menuList.push(temp)
          }
        })
      }
    },
    getApi() {
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/sys/AllApiList", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => {
          var list = res.data.data
          if (list == null){
            return
          }
          for (var i = 0; i < list.length; i++) {
            var temp = {
              key: list[i].id,
              label: list[i].name,
              disable: false,
              path: list[i].url,
              methods: list[i].methods
            }
            this.apiList.push(temp)
          }
        })
      }
    },
    getRoleMenu(roleName) {
      const token = this.getToken()
      const data = {
        role_name: roleName,
      };
      if (token) {
        axios.post("http://127.0.0.1:8088/v2/sys/RoleMenuList", data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }).then(res => {
          var list = res.data.data
          if (list == null){
            return
          }
          for (var i = 0; i < list.length; i++) {
            this.form.menuValue.push(list[i].id)
          }
        }).catch(err => {
          console.log("err=>", err)
        })
      }
    },
    getRoleApi(roleName) {
      const token = this.getToken()
      const postData = {
        role_name: roleName,
      };
      if (token) {
        axios.post("http://127.0.0.1:8088/v2/sys/RoleAPIList", postData, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }).then(res => {
          var list = res.data.data
          if (list == null){
            return
          }
          for (var i = 0; i < list.length; i++) {
            this.form.apiValue.push(list[i].id)
          }
        })
      }
    },
    HandleUpdateCasbinRules() {

      const token = this.getToken()
      //获取未授权区的数组与已授权的数组
      const unselectedMenuItems = this.menuList.filter(item => !this.form.menuValue.includes(item.key));
      const selectedMenuItems = this.menuList.filter(item => this.form.menuValue.includes(item.key));

      //获取未授权和已授权的API
      const unselectedApiItems = this.apiList.filter(item => !this.form.apiValue.includes(item.key));
      const selectedApiItems = this.apiList.filter(item => this.form.apiValue.includes(item.key));

      const unselectedItems = [...unselectedMenuItems, ...unselectedApiItems]
      const selectedItems = [...selectedMenuItems, ...selectedApiItems]


      const oldPolicies = [], newPolicies = [];

      unselectedItems.forEach(item => {
        oldPolicies.push([this.form.roleName, item.path, item.methods])
      })
      selectedItems.forEach(item => {
        newPolicies.push([this.form.roleName, item.path, item.methods])
      })


      const data = {
        old_policies: oldPolicies,
        new_policies: newPolicies
      }


      if (token) {
        axios.post("http://127.0.0.1:8088/v2/sys/updatePolicies", data, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => {
          console.log(res)
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.drawer = false
        }).catch(err => {
          console.log(err)
          this.$notify.error({
            title: '错误',
            message: '操作失败'
          });
        })
      }
    },
    handleDrawerClose() {
      this.form.apiValue = []
      this.form.menuValue = []
    }


  },
  mounted() {
    this.getRoles();
    this.getMenus();
    this.getApi();
    // this.getRoleApi();
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