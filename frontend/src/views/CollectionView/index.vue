<template>
  <div class="collection">
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-star-on"></i>
        <h1>我的收藏</h1>
      </div>
      <div class="header-count">
        共 <span class="count">{{ collectList.length }}</span> 篇文章
      </div>
    </div>

    <div class="content">
      <div v-if="collectList.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="el-icon-star-off"></i>
        </div>
        <p class="empty-text">暂无收藏</p>
        <p class="empty-desc">浏览文章时点击收藏按钮可添加到这里</p>
      </div>

      <div v-else class="article-list">
        <article
          v-for="item in collectList"
          class="article-card"
          :key="item.id"
          @click="handleCardClick(item.aid)">
          <div class="card-header">
            <div class="author-info">
              <div class="avatar">
                <i class="el-icon-user"></i>
              </div>
              <span class="author-name">{{ item.author }}</span>
            </div>
            <div class="card-actions">
              <el-tooltip content="取消收藏" placement="top">
                <el-button
                  type="text"
                  icon="el-icon-star-on"
                  class="uncollect-btn"
                  @click.stop="handleUncollect(item)">
                </el-button>
              </el-tooltip>
            </div>
          </div>

          <div class="card-body">
            <h2 class="article-title">{{ item.title }}</h2>
          </div>

          <div class="card-footer">
            <div class="read-more">
              阅读全文
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "CollectionView",
  data() {
    return {
      collectList: []
    }
  },
  computed: {
    currentTheme() {
      return this.$store.state.theme.theme
    }
  },
  methods: {
    async getCollection(pageIndex, pageSize) {
      const fd = new FormData();
      fd.append('pageIndex', pageIndex);
      fd.append('pageSize', pageSize);
      await axios.get('/interactive/collection', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        this.collectList = res.data.data.collectList;
      }).catch(() => {});
    },
    handleCardClick(item) {
      this.$router.push({
        name: 'article',
        query: {
          article: JSON.stringify(item),
        }
      }).catch(() => {});
    },
    handleUncollect(item) {
      this.$confirm('确定要取消收藏这篇文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 这里可以调用取消收藏的接口
        await axios.post('/interactive/uncollect', { aid: item.aid })
          .then(() => {
            this.$message.success('已取消收藏');
            this.collectList = this.collectList.filter(i => i.id !== item.id);
          })
          .catch(() => {
            this.$message.error('操作失败');
          });
      }).catch(() => {});
    }
  },
  created() {
    this.getCollection();
  }
};
</script>

<style lang="less" scoped>
.collection {
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
    color: #f7ba2a;
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
    background: linear-gradient(135deg, #fff5e0 0%, #ffe8b8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    i {
      font-size: 48px;
      color: #f7ba2a;
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

.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
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

    .read-more {
      gap: 12px;
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  flex-shrink: 0;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color, #1d2129);
}

.card-actions {
  .uncollect-btn {
    color: #f7ba2a;
    padding: 6px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-size: 18px;

    &:hover {
      background-color: rgba(247, 186, 42, 0.1);
      color: #f56c6c;
    }
  }
}

.card-body {
  margin-bottom: 16px;
}

.article-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-color, #1d2129);
  margin: 0;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, #f2f3f5);
}

.read-more {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #409eff;
  font-weight: 500;
  transition: gap 0.2s;
}
</style>
