<template>
  <div class="followee-list">
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-user-plus"></i>
        <h1>我的关注</h1>
      </div>
      <div class="header-count">
        共 <span class="count">{{ total }}</span> 人
      </div>
    </div>

    <div class="content">
      <div v-if="list.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="el-icon-user"></i>
        </div>
        <p class="empty-text">暂无关注</p>
        <p class="empty-desc">去关注一些有趣的人吧</p>
      </div>

      <div v-else class="user-list">
        <div
          v-for="item in list"
          class="user-card"
          :key="item.follower_id"
          @click="handleUserClick(item)">
          <div class="card-header">
            <div class="user-info">
              <div class="avatar">
                <i class="el-icon-user"></i>
              </div>
              <span class="user-name">{{ item.nickname }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="total > pageSize" class="pagination-container">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          background>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "FolloweeListView",
  data() {
    return {
      list: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  methods: {
    async getFolloweeList() {
      await axios.get('/relationship/followee', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      }).then((res) => {
        if (res.data.data) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        }
      }).catch(() => {});
    },
    handlePageChange(page) {
      this.pageIndex = page;
      this.getFolloweeList();
    },
    handleUserClick(item) {
      this.$router.push({
        name: 'userProfile',
        query: {
          author_id: item.follower_id
        }
      }).catch(() => {});
    }
  },
  created() {
    this.getFolloweeList();
  }
};
</script>

<style lang="less" scoped>
.followee-list {
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

.header-count {
  font-size: 14px;
  color: var(--text-color, #86909c);

  .count {
    font-weight: 600;
    color: #409eff;
    font-size: 18px;
  }
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;

  .empty-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e0f3ff 0%, #b8d4ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    i {
      font-size: 48px;
      color: #409eff;
    }
  }

  .empty-text {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color, #1d2129);
    margin: 0 0 8px 0;
  }

  .empty-desc {
    font-size: 14px;
    color: var(--text-color, #86909c);
    margin: 0;
  }
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-card {
  background: var(--bg-color, #ffffff);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color, #e8e8e8);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: #409eff;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color, #1d2129);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
