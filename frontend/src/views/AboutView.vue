<template>
  <div class="about">
    <h1>个人主页</h1>
    <div class="user-info">
        <div class="avatar">
<!--          <el-image class="avatar-image" :src="avatarUrl"></el-image>-->
          <img :src="imageSrc" :key="imageSrc" alt="未获取图片">
        </div>
        <div class="user-info-group">
          <div class="user-info-name">用户名</div>
          <div class="user-info-about">关于我</div>
        </div>
    </div>
  </div>
</template>


<script>
import axios from '@/axios';
import { ref,onMounted } from 'vue';

export default {
  name: 'AboutView',
  data() {
    return {
      avatarUrl: require('@/assets/avatar.png'),
      imageSrc: '',
      base64Data: '' // 用于存储从后端接收的base64数据
    };
  },
  mounted() {
    this.getBase64Image();
  },
  methods: {
    getBase64Image() {
      // 准备formData对象
      const formData = new FormData();
      formData.append('fileName', 'MyPhoto.png');

      axios.post("/users/downloadFile", formData)
          .then((res) => {
            console.log(res);
            this.base64Data = res.data.pic;
            this.imageSrc = 'data:image/png;base64,' + this.base64Data;
            this.convertBase64ToImage();
          })
          .catch((err) => {
            console.error(err);
          });
    },
    convertBase64ToImage() {
      const img = new Image();
      img.src = this.imageSrc;
      console.log(img.src);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const imageURL = canvas.toDataURL('image/png');
        this.imageSrc = imageURL; // 更新imageSrc
      };
    }
  }
};
</script>
<style>
.user-info{
  margin-left: 10px;
  height: 200px;
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar{
  flex:1;
}

.user-info-group {
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
}

.user-info-name {
  flex: 1;
}

.user-info-about {
  flex: 1;
}

.avatar-image{
  width: 100px;
  height: 100px;
}

</style>