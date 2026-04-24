<template>
  <div class="draft-list">
    <div class="header">
      <div class="header-left">
        <h1>创作中心</h1>
        <p>管理你的草稿和灵感</p>
      </div>
      <el-button type="primary" size="medium" icon="el-icon-edit" @click="goToWriteArticle" class="btn-new">
        开始创作
      </el-button>
    </div>

    <div v-if="DraftList.length > 0" class="grid-container">
      <div v-for="item in DraftList" class="card-wrapper" :key="item.id" @click="goToWriteArticle(item)">
        <div class="draft-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="el-icon-document"></i>
            </div>
            <div class="card-actions">
              <el-tooltip content="删除" placement="top">
                <el-button type="text" icon="el-icon-delete" class="btn-delete" @click.stop="handleDelete(item.id)"></el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ item.title || '无标题' }}</h3>
            <p class="card-excerpt">{{ item.content || '暂无内容' }}</p>
          </div>
          <div class="card-footer">
            <span class="card-date">
              <i class="el-icon-time"></i>
              {{ formatDate(item.updatedAt || item.createdAt) }}
            </span>
            <span class="card-status" :class="item.status === '1' ? 'published' : 'draft'">
              {{ item.status === '1' ? '已发布' : '草稿' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="el-icon-edit-outline"></i>
      </div>
      <h2>开始你的第一篇创作</h2>
      <p>记录灵感，分享见解</p>
      <el-button type="primary" size="medium" icon="el-icon-plus" @click="goToWriteArticle">
        创建文章
      </el-button>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: 'DraftList',
  data() {
    return {
      DraftList: []
    }
  },
  methods: {
    goToWriteArticle(items) {
      this.$router.push({ name: 'writeArticles', query: { items: JSON.stringify(items || {}) } });
    },
    tryHttp() {
      axios.get("/draft/getArticles").then(response => {
        this.DraftList = response.data.data || []
      })
    },
    handleDelete(id) {
      this.$confirm('确定要删除这篇草稿吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log("删除文章", id)
        this.$message.success('删除成功')
        this.tryHttp()
      }).catch(() => {})
    },
    formatDate(dateStr) {
      if (!dateStr) return '刚刚'
      const date = new Date(dateStr)
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 7) return `${days}天前`

      return date.toLocaleDateString('zh-CN')
    }
  },
  created() {
    this.tryHttp()
  }
}
</script>

<style scoped>
.draft-list {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.header-left h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 8px 0;
}

.header-left p {
  font-size: 14px;
  color: #86909c;
  margin: 0;
}

.btn-new {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.btn-new:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.card-wrapper {
  cursor: pointer;
}

.draft-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f2f3f5;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.draft-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #e8e8e8;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
}

.btn-delete {
  color: #ff4d4f;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.draft-card:hover .btn-delete {
  opacity: 1;
}

.btn-delete:hover {
  background: #fff1f0;
}

.card-body {
  flex: 1;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-excerpt {
  font-size: 14px;
  color: #86909c;
  line-height: 1.6;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f2f3f5;
}

.card-date {
  font-size: 13px;
  color: #c9cdd4;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
}

.card-status.draft {
  background: #f7f8fa;
  color: #86909c;
}

.card-status.published {
  background: #e8f7ef;
  color: #00b42a;
}

.empty-state {
  text-align: center;
  padding: 120px 20px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 48px;
  color: #667eea;
}

.empty-state h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #86909c;
  margin: 0 0 24px 0;
}
</style>
