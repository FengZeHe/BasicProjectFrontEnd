<template>
  <div class="draftList">
    <h1>未发布的文稿都在这里哦</h1>
    <div class="toWrite">
      <el-button type="primary" @click="goToWriteArticle">去写文章</el-button>
    </div>

    <div class="content" v-for="items in DraftList" :key="items.id">
      <el-card class="box-card" shadow="hover" @click.native="goToWriteArticle(items)">
        <div slot="header" class="clearfix">
          <span>{{ items.title }}</span>
        </div>
        <div class="content-area">
          <p>{{ items.content }}</p>
          <el-row class="btn-group">
            <el-col :span="22">
<!--              <el-button type="primary" icon="el-icon-edit" circle></el-button>-->
              <el-button type="danger" icon="el-icon-delete" @click.stop="handleDelete(items.id)" circle></el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <div v-if="DraftList.length === 0">
      <h1>暂时没有文章，快去创作吧!</h1>
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
      this.$router.push({name: "writeArticles", query: {items: JSON.stringify(items)}});
    },
    tryHttp() {
      axios.get("/draft/getArticles").then(response => {
        this.DraftList = response.data.data
      })
    },
    handleDelete(val){
      console.log("我要删除",val)
    }
  },
  created() {
    this.tryHttp()
  }
}
</script>

<style>
.toWrite {
  text-align: right;
  padding-right: 10%;
  margin-bottom: 50px;
}

.box-card {
  margin-bottom: 3rem;
  //background-color: #e9faf2;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
}


.el-card:hover {
  cursor: pointer;
}

.btn-group .el-col {
  text-align: right;
}

</style>