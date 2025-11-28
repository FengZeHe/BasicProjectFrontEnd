<template>
    <div class="collection">
        <div class="content">
            <el-card v-for="item in collectList" class="homeview-content-card" :key="item.id"
                @click.native="handleCardClick(item.aid)">
                <div class="homeview-content-card-author clearfix">
                    <img class="homeview-card-avatar" src="@/assets/bruce.jpg" alt="">
                    <div class="homeview-card-authorName">{{ item.author }}</div>
                </div>
                <div class="homeview-content-card-title">{{ item.title }}</div>
                <div class="homeview-content-card-content">{{ item.content }}</div>
            </el-card>
        </div>


    </div>
</template>

<script>
import axios from "@/axios"
export default {
    name: "CollectionView",
    data() {
        return {
            collectList: []
        }
    },
    methods: {
        async getCollection(pageIndex, pageSize) {
            const fd = new FormData()
            fd.append('pageIndex', pageIndex)
            fd.append('pageSize', pageSize)
            await axios.get('/interactive/collection', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((res) => {
                this.collectList = res.data.data.collectList
            }).catch((err)=>{
                
            })
        },
        handleCardClick(item) {
            this.$router.push({
                name: 'article',
                query: {
                    article: JSON.stringify(item),
                }
            }).catch(() => {

            })

        },

    },
    created() {
        this.getCollection()
    }
}
</script>

<style></style>