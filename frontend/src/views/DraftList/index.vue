<template>
  <div class="draftList">
    <div class="header-section">
      <h2>创作中心</h2>
      <el-button type="primary" @click="goToWriteArticle">去写文章</el-button>
    </div>

    <div class="content">
      <el-card v-for="items in DraftList" class="draftview-content-card" :key="items.id"
          shadow="hover" @click.native="goToWriteArticle(items)">
        <div class="draftview-content-card-title">{{ items.title }}</div>
        <div class="draftview-content-card-content">{{ items.content }}</div>
        <div class="draftview-content-card-action">
          <el-button type="danger" icon="el-icon-delete" @click.stop="handleDelete(items.id)" circle></el-button>
        </div>
      </el-card>
    </div>

    <div v-if="DraftList.length === 0" class="empty-tip">
      <h2>暂时没有文章，快去创作吧!</h2>
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
      this.$router.push({ name: 'writeArticles', query: { items: JSON.stringify(items) } });
    },
    tryHttp() {
      axios.get("/draft/getArticles").then(response => {
        this.DraftList = response.data.data
      })
    },
    handleDelete(val) {
      console.log("我要删除", val)
    }
  },
  created() {
    this.tryHttp()
  }
}
</script>

<style scoped>
.draftList {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.header-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.header-section h2 {
  margin: 0;
}

.header-section .el-button {
  position: absolute;
  right: 0;
}

.content {
  padding-bottom: 80px;
}

.draftview-content-card {
  margin-top: 0.4rem;
  cursor: pointer;
}

.draftview-content-card-title {
  display: block;
  height: 24px;
  padding-left: 8px;
  text-align: left;
  font-size: 16px;
  color: #646464;
  font-weight: bold;
}

.draftview-content-card-content {
  padding-left: 8px;
  height: 32px;
  line-height: 16px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #999;
}

.draftview-content-card-action {
  height: 24px;
  text-align: right;
  padding-right: 8px;
}

.empty-tip {
  text-align: center;
  padding-top: 60px;
  color: #999;
}

.empty-tip h2 {
  margin: 0;
}
</style>
