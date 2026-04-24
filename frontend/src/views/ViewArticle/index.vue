<template>
  <div class="view-article">
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-document"></i>
        <h1>我的文章</h1>
      </div>
      <div class="header-actions">
        <div class="header-count">
          共 <span class="count">{{ totalCount }}</span> 篇
        </div>
        <el-button type="primary" icon="el-icon-edit" @click="goToWrite">
          写文章
        </el-button>
      </div>
    </div>

    <div class="content">
      <div v-if="articles.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="el-icon-document"></i>
        </div>
        <p class="empty-text">还没有文章</p>
        <p class="empty-desc">点击右上角按钮开始创作你的第一篇文章</p>
        <el-button type="primary" size="medium" @click="goToWrite">
          开始创作
        </el-button>
      </div>

      <div v-else class="article-list">
        <article
          v-for="item in articles"
          class="article-card"
          :key="item.id"
          @click="handleArticleCardClick(item.id)">
          <div class="card-header">
            <div class="author-info">
              <div class="avatar">
                <i class="el-icon-user"></i>
              </div>
              <span class="author-name">{{ item.authorName }}</span>
            </div>
            <div class="card-actions">
              <el-tooltip content="编辑" placement="top">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  class="action-btn"
                  @click.stop="handleEdit(item)">
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="action-btn delete-btn"
                  @click.stop="handleDelete(item)">
                </el-button>
              </el-tooltip>
            </div>
          </div>

          <div class="card-body">
            <h2 class="article-title">{{ item.title }}</h2>
          </div>

          <div class="card-footer">
            <div class="stats">
              <div class="stat-item">
                <i class="el-icon-view"></i>
                <span>{{ item.read || 0 }} 阅读</span>
              </div>
            </div>
            <div class="read-more">
              查看详情
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-if="totalCount > 0" class="pagination-wrapper">
      <el-pagination
        @current-change="handleCurrentChange"
        :total="totalCount"
        :current-page="currentPage"
        :page-size="8"
        layout="prev, pager, next"
        background>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'ViewArticle',
  computed: {
    currentTheme() {
      return this.$store.state.theme.theme
    }
  },
  methods: {
    getArticles(pageIndex) {
      if (pageIndex === undefined) {
        pageIndex = 1
      }
      const data = {
        "pageIndex": pageIndex,
        "pageSize": 8
      }
      axios.post("/article/getAuthorArticles", data).then(res => {
        this.articles = res.data.data.articles
        this.currentPage = res.data.data.pageIndex
        this.totalCount = res.data.data.totalCount
      })
    },
    handleCurrentChange(newPage) {
      this.getArticles(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleArticleCardClick(id) {
      if (id === undefined) {
        console.log("id is undefined")
        return
      }
      console.log("Click +1", id)
      this.$router.push({
        name: 'article',
        query: {
          article: JSON.stringify(id),
        }
      }).catch(() => {});
    },
    handleEdit() {
      // 跳转到编辑页面
      this.$message.info('编辑功能待实现');
    },
    handleDelete(item) {
      this.$confirm('确定要删除这篇文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里可以调用删除接口
        this.$message.success('删除成功');
        // 更新列表
        this.articles = this.articles.filter(a => a.id !== item.id);
        this.totalCount--;
      }).catch(() => {});
    },
    goToWrite() {
      this.$router.push({ name: 'writeArticle' });
    }
  },
  data() {
    return {
      articles: [],
      currentPage: 1,
      totalCount: 0,
      readcount: 100,
    }
  },
  created() {
    this.getArticles()
  }
}

</script>

<style lang="less" scoped>
.view-article {
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
  gap: 16px;
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
    background: linear-gradient(135deg, #e0f0ff 0%, #cce8ff 100%);
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
    margin: 0 0 24px 0;
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
  display: flex;
  gap: 4px;

  .action-btn {
    padding: 6px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    color: #409eff;

    &:hover {
      background-color: rgba(64, 158, 255, 0.1);
    }

    &.delete-btn {
      color: #f56c6c;

      &:hover {
        background-color: rgba(245, 108, 108, 0.1);
      }
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
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, #f2f3f5);
}

.stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-color, #86909c);

  i {
    font-size: 16px;
    color: var(--text-color, #c9cdd4);
  }
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

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/deep/ .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #667eea;
}
</style>
