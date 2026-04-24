<template>
  <div class="home">
    <div class="content">
      <div class="article-list">
        <article v-for="item in articles" class="article-card" :key="item.id" @click="handleCardClick(item.id)">
          <div class="card-header">
            <div class="author-info">
              <div class="avatar">
                <i class="el-icon-user"></i>
              </div>
              <span class="author-name">{{ item.authorName }}</span>
            </div>
            <span class="publish-time">{{ formatDate(item.createdAt) }}</span>
          </div>

          <div class="card-body">
            <h2 class="article-title">{{ item.title }}</h2>
            <p class="article-excerpt">{{ stripMarkdown(item.content) }}</p>
          </div>

          <div class="card-footer">
            <div class="stats">
              <div class="stat-item">
                <i class="el-icon-view"></i>
                <span>{{ getInteractiveArt(item.id).readCount || 0 }}</span>
              </div>
              <div class="stat-item">
                <i class="el-icon-star-on"></i>
                <span>{{ getInteractiveArt(item.id).collectCount || 0 }}</span>
              </div>
              <div class="stat-item">
                <i class="el-icon-thumb"></i>
                <span>{{ getInteractiveArt(item.id).likeCount || 0 }}</span>
              </div>
            </div>
            <div class="read-more">
              阅读全文
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </article>
      </div>

      <div class="pagination-wrapper">
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
  </div>
</template>

<script>
import axios from "@/axios"
import Article from "@/views/Articles/index.vue";

export default {
  name: 'HomeView',
  data() {
    return {
      articles: [],
      currentPage: 1,
      totalCount: 0,
      interactiveArt: {}
    }
  },
  components: { Article },
  methods: {
    add() {
      this.$store.commit('increment', { num: 1 })
    },
    handleCardClick(item) {
      this.addReadCount(item)
      this.$router.push({
        name: 'article',
        query: {
          article: JSON.stringify(item),
        }
      }).catch(() => {})
    },
    async addReadCount(aid) {
      await axios.post("/interactive/addRead", {
        "Aid": aid
      }).then((res) => {}).catch((err) => {
        console.log("add read count error", err)
      })
    },
    async getArticles(pageIndex) {
      if (pageIndex === undefined) {
        pageIndex = 1
      }
      const data = {
        "pageIndex": pageIndex,
        "pageSize": 8
      }
      await axios.post("/article/getArticles", data).then(res => {
        this.articles = res.data.data.articles
        this.currentPage = res.data.data.pageIndex
        this.totalCount = res.data.data.totalCount

        for (var i = 0; i < this.articles.length; i++) {
          this.getArticleStatus(this.articles[i].id)
        }
      })
    },
    async getArticleStatus(aid) {
      await axios.get("/interactive/status", {
        params: { "aid": aid }
      }).then((res) => {
        const temp = res.data.data
        this.$set(this.interactiveArt, aid, temp)
      }).catch((err) => {
        console.log("err", err)
      })
    },
    handleSizeChange(val) {
      console.log("handleSizeChange", val)
    },
    handleCurrentChange(newPage) {
      this.getArticles(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    stripMarkdown(text) {
      if (!text) return ''
      return text
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '$1')
        .replace(/[#*`~_]/g, '')
        .replace(/>\s*/g, '')
        .replace(/-\s*/g, '')
        .substring(0, 150) + '...'
    }
  },
  computed: {
    getInteractiveArt() {
      return (aid) => {
        const item = this.interactiveArt[aid]
        return item ? item : {}
      }
    }
  },
  created() {
    this.getArticles()
  }
}
</script>

<style lang="less" scoped>
.home {
  min-height: 100vh;
  background: var(--bg-color, #f7f8fa);
}

.content {
  max-width: 95%;
  margin: 0 auto;
  padding: 24px 20px 80px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color, #e8e8e8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: var(--primary-color, #667eea);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #1d2129);
}

.publish-time {
  font-size: 13px;
  color: var(--text-secondary, #c9cdd4);
}

.card-body {
  margin-bottom: 12px;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1d2129);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.article-excerpt {
  font-size: 13px;
  color: var(--text-secondary, #86909c);
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color, #f2f3f5);
}

.stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--text-secondary, #86909c);

  i {
    font-size: 15px;
    color: var(--text-muted, #c9cdd4);
  }
}

.read-more {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--primary-color, #667eea);
  font-weight: 500;
  transition: gap 0.2s;
}

.article-card:hover .read-more {
  gap: 10px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/deep/ .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #667eea;
}
</style>
