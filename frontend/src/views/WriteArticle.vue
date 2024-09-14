<template>
  <div class="WriteArticle">
    <h1>This is Write Article Page</h1>
    <h1>{{article.title}}</h1>
    <h1>{{article.content}}</h1>
  </div>
</template>

<script>
export default {
  data(){
    return{
      article:{}
    }
  },
  created(){
    this.article = this.$route.params.items;
  }
}



</script>

<style scoped>

</style>