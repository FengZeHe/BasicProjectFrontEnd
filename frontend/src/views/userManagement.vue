<template>
  <div class="UserManagement">
    <h1>This is User Management Page</h1>
    <el-table :data="tableData" style="width:100%">
      <el-table-column prop="email" label="Email" width="180"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
      <el-table-column prop="role" label="角色" width="180">
        <template v-slot="scope">
          <el-cascader
              v-model="scope.row.role"
              :options="roles"
              :props="{ value: 'id',label: 'name'}"
          >
          </el-cascader>
        </template>

      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
      <el-table-column prop="birthday" label="生日" width="180"></el-table-column>
      <el-table-column>
          <el-button type="success" icon="el-icon-check" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      roles: [{id: "user_group", name: "普通用户"}, {id: "admin_group", name: "管理员"}],
      tableData: [{
        email: 'jerker@qq.com',
        nickname: 'Jerker',
        role: "user_group",
        phone: "139829382902",
        birthday: '1997-01-01'
      }, {
        email: 'fish@qq.com',
        nickname: 'Fish',
        role: 'admin_group',
        phone: "139829382903",
        birthday: '1997-01-02'
      }]
    }
  }
}

</script>

<style scoped>

</style>