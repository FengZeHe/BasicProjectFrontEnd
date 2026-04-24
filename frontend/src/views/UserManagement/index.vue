<template>
  <div class="user-management">
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-user"></i>
        <h1>用户管理</h1>
      </div>
      <div class="header-actions">
        <el-input
          v-model="searchText"
          placeholder="搜索用户..."
          prefix-icon="el-icon-search"
          class="search-input"
          clearable>
        </el-input>
        <el-button type="primary" icon="el-icon-plus">添加用户</el-button>
      </div>
    </div>

    <div class="page-content">
      <div class="table-card">
        <el-table
          :data="filteredData"
          style="width: 100%"
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          :row-class-name="tableRowClassName"
          stripe>
          <el-table-column prop="email" label="邮箱" min-width="200">
            <template v-slot="scope">
              <div class="user-info-cell">
                <div class="avatar-small">
                  {{ getAvatarText(scope.row.nickName) }}
                </div>
                <span class="email-text">{{ scope.row.email }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="昵称" width="150">
            <template v-slot="scope">
              <span class="nickname-text">{{ scope.row.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="role" label="角色" width="160">
            <template v-slot="scope">
              <el-tag :type="getRoleTagType(scope.row.role)" size="small">
                {{ getRoleName(scope.row.role) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="150">
            <template v-slot="scope">
              <span class="phone-text">{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="生日" width="140">
            <template v-slot="scope">
              <span class="birthday-text">{{ scope.row.birthday }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template v-slot="scope">
              <div class="action-buttons">
                <el-tooltip content="编辑" placement="top">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    class="action-btn edit-btn"
                    @click="handleEdit(scope.row)">
                  </el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    class="action-btn delete-btn"
                    @click="handleDelete(scope.row)">
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      searchText: '',
      roles: [
        { id: 'user_group', name: '普通用户' },
        { id: 'admin_group', name: '管理员' }
      ],
      tableData: [
        {
          email: 'jerker@qq.com',
          nickName: 'Jerker',
          role: 'user_group',
          phone: '139829382902',
          birthday: '1997-01-01'
        },
        {
          email: 'fish@qq.com',
          nickName: 'Fish',
          role: 'admin_group',
          phone: '139829382903',
          birthday: '1997-01-02'
        }
      ]
    }
  },
  computed: {
    filteredData() {
      if (!this.searchText) return this.tableData
      const search = this.searchText.toLowerCase()
      return this.tableData.filter(item =>
        item.email.toLowerCase().includes(search) ||
        item.nickName.toLowerCase().includes(search) ||
        item.phone.includes(search)
      )
    },
    currentTheme() {
      return this.$store.state.theme.theme
    }
  },
  methods: {
    getAvatarText(name) {
      return name ? name.charAt(0).toUpperCase() : '?'
    },
    getRoleName(role) {
      const roleItem = this.roles.find(r => r.id === role)
      return roleItem ? roleItem.name : role
    },
    getRoleTagType(role) {
      return role === 'admin_group' ? 'danger' : 'primary'
    },
    handleEdit(row) {
      console.log('Edit user:', row)
      this.$message.info('编辑功能待实现')
    },
    handleDelete(row) {
      console.log('Delete user:', row)
      this.$confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      }).catch(() => {})
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
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
    }
  }
}
</script>

<style lang="less" scoped>
.user-management {
  min-height: 100%;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 260px;
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

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.email-text {
  color: var(--text-color, #1d2129);
  font-weight: 500;
}

.nickname-text,
.phone-text,
.birthday-text {
  color: var(--text-color, #4e5969);
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

  .even-row td {
    background-color: var(--table-even-bg, transparent);
  }

  &::before {
    display: none;
  }
}

/* 主题适配 */
:global(.dark) {
  .table-card {
    background: #252526;
    border-color: #383838;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  }

  .header-title h1 {
    color: #e5e5e5;
  }

  .email-text {
    color: #e5e5e5;
  }

  .nickname-text,
  .phone-text,
  .birthday-text {
    color: #a3a3a3;
  }
}
</style>
