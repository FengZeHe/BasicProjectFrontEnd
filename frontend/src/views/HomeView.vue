<template>
  <div class="home">
    <h1>This is Home Page</h1>
  </div>
</template>

<script>
import axios from "@/axios"

export default {
  name: 'HomeView',
  data(){
      return {

      }
  },
  components: {},
  methods:{
    getArticles(){
      axios.get("/article/getArticles").then(res=>{
        console.log(res.data.data)
      })
    },
  },
  created(){
    this.getArticles()
  }
}
</script>
