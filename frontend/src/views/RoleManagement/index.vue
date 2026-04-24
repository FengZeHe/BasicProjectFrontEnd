<template>
  <div class="role-management">
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-s-custom"></i>
        <h1>角色管理</h1>
      </div>
      <div class="header-actions">
        <el-button type="primary" icon="el-icon-plus">添加角色</el-button>
      </div>
    </div>

    <div class="page-content">
      <div class="table-card">
        <el-table
          :data="roleList"
          style="width: 100%"
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          stripe>
          <el-table-column prop="role_name" label="角色名称" min-width="180">
            <template v-slot="scope">
              <div class="role-name-cell">
                <div class="role-icon">
                  <i :class="getRoleIcon(scope.row.role_name)"></i>
                </div>
                <span class="role-name">{{ scope.row.role_name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="描述" min-width="280">
            <template v-slot="scope">
              <span class="role-desc">{{ scope.row.desc || '暂无描述' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="140">
            <template v-slot="scope">
              <el-tag :type="scope.row.status === '1' ? 'success' : 'info'" size="small">
                {{ scope.row.status === '1' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template v-slot="scope">
              <div class="action-buttons">
                <el-tooltip content="编辑权限" placement="top">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    class="action-btn edit-btn"
                    @click="HandleEditClick(scope.row.role_name)">
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    class="action-btn delete-btn">
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-drawer
      size="50%"
      :visible.sync="drawer"
      @close="handleDrawerClose"
      class="permission-drawer"
      :wrapperClosable="false">
      <div slot="title" class="drawer-header">
        <i class="el-icon-setting"></i>
        <span>编辑权限 - {{ selectedRole }}</span>
      </div>

      <div class="drawer-content">
        <div class="permission-section">
          <div class="section-title">
            <i class="el-icon-menu"></i>
            <span>菜单权限</span>
          </div>
          <el-transfer
            class="custom-transfer"
            :titles="['未授权', '已授权']"
            v-model="form.menuValue"
            :data="menuList">
          </el-transfer>
        </div>

        <div class="permission-section">
          <div class="section-title">
            <i class="el-icon-s-operation"></i>
            <span>API接口权限</span>
          </div>
          <el-transfer
            class="custom-transfer"
            :titles="['未授权', '已授权']"
            v-model="form.apiValue"
            :data="apiList">
          </el-transfer>
        </div>
      </div>

      <div class="drawer-footer">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="HandleUpdateCasbinRules" :loading="saving">
          <i class="el-icon-check"></i>
          保存
        </el-button>
      </div>
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
      selectedRole: '',
      saving: false
    }
  },
  computed: {
    currentTheme() {
      return this.$store.state.theme.theme
    }
  },
  methods: {
    getRoleIcon(roleName) {
      const roleIcons = {
        'admin': 'el-icon-s-custom',
        'user': 'el-icon-user',
        'guest': 'el-icon-user-solid'
      }
      return roleIcons[roleName] || 'el-icon-s-custom'
    },
    HandleEditClick(roleName) {
      this.selectedRole = roleName
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
            'Authorization': 'Bearer ' + token
          }
        }).then(res => {
          this.roleList = res.data.data
        })
      }
    },
    getToken() {
      const token = localStorage.getItem('userToken');
      return token;
    },
    getMenus() {
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/sys/AllMenuList", {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(res => {
          var list = res.data.data
          if (list == null) {
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
            'Authorization': 'Bearer ' + token
          }
        }).then(res => {
          var list = res.data.data
          if (list == null) {
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
      const data = { role_name: roleName };
      if (token) {
        axios.post("http://127.0.0.1:8088/v2/sys/RoleMenuList", data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }).then(res => {
          var list = res.data.data
          if (list == null) {
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
      const postData = { role_name: roleName };
      if (token) {
        axios.post("http://127.0.0.1:8088/v2/sys/RoleApiList", postData, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(res => {
          var list = res.data.data
          if (list == null) {
            return
          }
          for (var i = 0; i < list.length; i++) {
            this.form.apiValue.push(list[i].id)
          }
        })
      }
    },
    HandleUpdateCasbinRules() {
      this.saving = true
      const token = this.getToken()
      const unselectedMenuItems = this.menuList.filter(item => !this.form.menuValue.includes(item.key));
      const selectedMenuItems = this.menuList.filter(item => this.form.menuValue.includes(item.key));

      const unselectedApiItems = this.apiList.filter(item => !this.form.apiValue.includes(item.key));
      const selectedApiItems = this.apiList.filter(item => this.form.apiValue.includes(item.key));

      const unselectedItems = [...unselectedMenuItems, ...unselectedApiItems];
      const selectedItems = [...selectedMenuItems, ...selectedApiItems];

      const oldPolicies = [];
      const newPolicies = [];

      unselectedItems.forEach(item => {
        oldPolicies.push([this.form.roleName, item.path, item.methods])
      })
      selectedItems.forEach(item => {
        newPolicies.push([this.form.roleName, item.path, item.methods])
      })

      const data = { old_policies: oldPolicies, new_policies: newPolicies };

      if (token) {
        axios.post("http://127.0.0.1:8088/v2/sys/updatePolicies", data, {
          headers: { 'Authorization': 'Bearer ' + token }
        }).then(res => {
          console.log(res)
          this.$notify({
            title: '成功',
            message: '权限更新成功',
            type: 'success',
            duration: 2000
          });
          this.drawer = false
        }).catch(err => {
          console.log(err)
          this.$notify.error({
            title: '错误',
            message: '操作失败'
          });
        }).finally(() => {
          this.saving = false
        })
      }
    },
    handleDrawerClose() {
      this.form.apiValue = []
      this.form.menuValue = []
      this.selectedRole = ''
    },
    headerCellStyle() {
      return {
        background: 'transparent',
        color: this.currentTheme === 'dark' ? '#94a3b8' : '#64748b',
        fontWeight: '600',
        padding: '14px 0'
      }
    },
    cellStyle() {
      return {
        padding: '12px 0'
      }
    }
  },
  mounted() {
    this.getRoles();
    this.getMenus();
    this.getApi();
  }
}
</script>

<style lang="less" scoped>
.role-management {
  min-height: 100%;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;

  i {
    font-size: 28px;
    color: #409eff;
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: var(--text-color, #1d2129);
  }
}

.page-content {
  width: 100%;
}

.table-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, #e8e8e8);
  background: var(--bg-color, #ffffff);
  transition: all 0.3s ease;
}

.role-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.role-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  flex-shrink: 0;
}

.role-name {
  font-weight: 600;
  color: var(--text-color, #1d2129);
  font-size: 15px;
}

.role-desc {
  color: var(--text-color, #4e5969);
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &.edit-btn {
    color: #409eff;

    &:hover {
      background-color: rgba(64, 158, 255, 0.1);
    }
  }

  &.delete-btn {
    color: #f56c6c;

    &:hover {
      background-color: rgba(245, 108, 108, 0.1);
    }
  }
}

/* Drawer 样式 */
.permission-drawer {
  /deep/ .el-drawer__header {
    padding: 0;
    margin-bottom: 0;
  }
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color, #1d2129);
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color, #e8e8e8);

  i {
    color: #409eff;
  }
}

.drawer-content {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.permission-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color, #1d2129);

  i {
    color: #409eff;
    font-size: 18px;
  }
}

.custom-transfer {
  flex: 1;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color, #e8e8e8);
}

/* 表格样式覆盖 */
/deep/ .el-table {
  background-color: transparent !important;
  color: var(--text-color, #303133);

  th.el-table__cell,
  td.el-table__cell {
    border-color: var(--border-color, #ebeef5) !important;
  }

  tr.el-table__row:hover > td {
    background-color: var(--table-hover-bg, #f5f7fa) !important;
  }

  &::before {
    display: none;
  }
}

/* Transfer 组件适配 */
/deep/ .el-transfer {
  display: flex;
  justify-content: space-between;
}

/deep/ .el-transfer-panel {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color, #e8e8e8);

  .el-transfer-panel__header {
    background: var(--bg-color, #f5f7fa);
    border-bottom: 1px solid var(--border-color, #e8e8e8);
  }
}
</style>
