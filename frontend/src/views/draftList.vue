<template>
  <div class="draftList">
    <h1>this is draft list</h1>
    <div class="content" v-for="items in DraftList" :key="items.id">
      <el-card class="box-card" shadow="hover" @click.native="goToWriteArticle(items)">
        <div slot="header" class="clearfix">
          <span>{{items.title}}</span>

        </div>
        <div class="content-area">
          <p>{{items.content}}</p>
          <el-row class="btn-group">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-row>
        </div>
      </el-card>
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
      this.$router.push({name:"writeArticles",params:{items}});
    },
    tryHttp(){
      axios.get("/draft/getArticles").then(response => {
        this.DraftList = response.data.data
      })
    }
  },
  created() {
    this.tryHttp()
  }
}
</script>

<style>
.box-card {
  margin-bottom: 3rem;
  background-color: #e9faf2;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
}


.el-card:hover {
  cursor: pointer;
}



.content-area{
  background-color: #e48dbb;
}

.btn-group {
  background: #56bc99;
}



</style>