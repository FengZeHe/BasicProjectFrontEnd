<template>
  <div class="menu-management">
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-menu"></i>
        <h1>菜单管理</h1>
      </div>
      <div class="header-actions">
        <el-button type="primary" icon="el-icon-plus">添加菜单</el-button>
      </div>
    </div>

    <div class="page-content">
      <div class="table-card">
        <el-table
          :data="menuList"
          style="width: 100%"
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          stripe>
          <el-table-column prop="name" label="名称" min-width="180">
            <template v-slot="scope">
              <div class="menu-name-cell">
                <div class="menu-icon">
                  <i :class="getMenuIcon(scope.row.name)"></i>
                </div>
                <span class="menu-name">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="路径" min-width="200">
            <template v-slot="scope">
              <span class="menu-path">{{ scope.row.path }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderNo" label="序号" width="140">
            <template v-slot="scope">
              <span class="order-no">{{ scope.row.orderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template v-slot="scope">
              <div class="action-buttons">
                <el-tooltip content="编辑" placement="top">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    class="action-btn edit-btn">
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MenuManagement',
  data() {
    return {
      menuList: []
    }
  },
  computed: {
    currentTheme() {
      return this.$store.state.theme.theme
    }
  },
  methods: {
    getMenuIcon(menuName) {
      // 根据菜单名称包含的关键字匹配图标
      if (menuName.includes('首页') || menuName.includes('home')) return 'el-icon-s-home'
      if (menuName.includes('用户') || menuName.includes('user')) return 'el-icon-user'
      if (menuName.includes('角色') || menuName.includes('role')) return 'el-icon-s-custom'
      if (menuName.includes('菜单') || menuName.includes('menu')) return 'el-icon-menu'
      if (menuName.includes('设置') || menuName.includes('setting')) return 'el-icon-setting'
      if (menuName.includes('文章') || menuName.includes('article')) return 'el-icon-document'
      if (menuName.includes('任务') || menuName.includes('task')) return 'el-icon-date'
      if (menuName.includes('日志') || menuName.includes('log')) return 'el-icon-document-copy'
      if (menuName.includes('系统') || menuName.includes('system')) return 'el-icon-s-tools'
      if (menuName.includes('数据') || menuName.includes('data')) return 'el-icon-s-data'
      if (menuName.includes('图表') || menuName.includes('chart')) return 'el-icon-s-marketing'
      return 'el-icon-s-grid'
    },
    getMenu() {
      const token = this.getToken()
      if (token) {
        axios.get("http://127.0.0.1:8088/v2/menus/list", {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(res => {
          this.menuList = JSON.parse(JSON.stringify(res.data.data))
          console.log(this.menuList)
        })
      }
    },
    getToken() {
      const token = localStorage.getItem('userToken');
      return token;
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
  created() {
    this.getMenu()
  }
}
</script>

<style lang="less" scoped>
.menu-management {
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

.menu-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--icon-bg, #f0f2f5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
  font-size: 18px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.menu-name {
  font-weight: 600;
  color: var(--text-color, #1d2129);
  font-size: 15px;
}

.menu-path {
  color: var(--text-color, #4e5969);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  background: var(--path-bg, #f5f7fa);
  padding: 4px 10px;
  border-radius: 6px;
}

.order-no {
  color: var(--text-color, #4e5969);
  font-weight: 500;
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

  &::before {
    display: none;
  }
}
</style>
