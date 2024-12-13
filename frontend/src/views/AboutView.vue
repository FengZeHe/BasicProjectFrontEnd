<template>
  <div class="about">
    <h1>个人主页</h1>
    <div class="user-info">
      <div class="avatar">
        <img :src="imageSrc" :key="imageSrc" alt="未获取图片">
      </div>
      <div class="user-info-group">
        <div class="user-info-name">用户名</div>
        <div class="user-info-about">关于我</div>
      </div>
      <div class="user-upload-file">
        <input type="file" ref="fileInput" @change="handleFileChange"/>
        <button @click="uploadFile">开始上传</button>
        <button @click="pauseUpload">暂停上传</button>
        <button @click="resumeUpload">继续上传</button>
        <button @click="cancelUpload">取消上传</button>

      </div>
    </div>
  </div>
</template>

<script>

import axios from '@/axios';

export default {
  name: 'AboutView',
  data() {
    return {
      avatarUrl: require('@/assets/avatar.png'),
      base64Data: '', // 用于存储从后端接收的base64数据
      imageSrc: '',

      file: null, // 存储选择的文件
      chunkSize: 5 * 1024 * 1024, // 分片大小设置为5M
      totalChunks: 0,
      currentChunk: 0, // 初始化分片索引
      isPaused: false, // 是否暂停上传

    };
  },

  methods: {


    handleFileChange(event) {
      this.file = event.target.files[0];
      this.totalChunks = Math.ceil(this.file.size / this.chunkSize); // 计算总分片数
      this.currentChunk = 0;
      this.isPaused = false;


    },
    async uploadFile() {
      if (!this.file) {
        alert("没有文件上传");
        return;
      }

      // const totalChunks = Math.ceil(this.file.size / this.chunkSize);
      while (this.currentChunk < this.totalChunks) {
        if (this.isPaused) {
          console.log("上传已暂停")
          return;
        }
        const start = this.currentChunk * this.chunkSize;
        const end = Math.min(start + this.chunkSize, this.file.size);
        const chunk = this.file.slice(start, end);

        await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // 上传分片
            this.uploadChunk(reader.result, this.currentChunk, this.totalChunks)
                .then(() => {
                  resolve(); // 分片上传成功后继续处理下一个分片
                  this.currentChunk ++;
                })
                .catch((err) => {
                  reject(err); // 上传失败，停止并返回错误
                });
          };

          // 读取分片数据
          reader.readAsArrayBuffer(chunk);
        });
      }

      console.log("文件分片上传完成")
      await this.mergeChunk(this.file.name, this.totalChunks);
    },
    async uploadChunk(chunkData, chunkIndex, totalChunks) {
      const formData = new FormData();
      formData.append('chunk', new Blob([chunkData]), this.file.name);
      formData.append('fileName', this.file.name);  // 文件名
      formData.append('index', chunkIndex);
      formData.append('chunkCount', totalChunks);

      try {
        const response = await axios.post(
            '/users/upload_chunk', formData, {
              headers: {
                "Content-Type": "multipart/form-data"
              },
            });
        console.log(response);
      } catch (err) {
        console.log(`第 ${chunkIndex + 1} 片上传失败`, err);
      }
    },
    async mergeChunk(filename, totalChunk) {
      console.log("mergeChunk=>", filename, totalChunk);
      try {
        const formData = new FormData();
        formData.append('fileName', filename);
        formData.append('totalChunk', totalChunk);

        // 发送请求
        const response = await axios.post('/users/merge_chunk', formData, {
          headers: {
            "Content-Type": "'multipart/form-data",
          }
        });
        console.log(response);
      } catch (err) {
        console.log(err);
      }

    },

    // 暂停上传
    pauseUpload() {
      this.isPaused = true;
      console.log("暂停上传");
    },

    // 继续上传
    resumeUpload() {
      if (this.isPaused) {
        this.isPaused = false;
        console.log("继续上传");
        this.uploadFile(); // 继续上传
      }
    },

    // 取消上传
    cancelUpload() {
      this.isCancelled = true;
      console.log("取消上传");
    },

    // 重置上传状态
    resetUpload() {
      this.currentChunk = 0;
      this.isPaused = false;
      this.isCancelled = false;
      console.log("上传状态已重置");
    },


    // 获取 base64 图片
    getBase64Image() {
      const formData = new FormData();
      formData.append('fileName', 'MyPhoto.png');
      axios.post("/users/downloadFile", formData)
          .then((res) => {
            this.base64Data = res.data.pic;
            this.imageSrc = 'data:image/png;base64,' + this.base64Data;
            this.convertBase64ToImage();
          })
          .catch((err) => {
            console.error(err);
          });
    },

    // 将 base64 转换为图像
    convertBase64ToImage() {
      const img = new Image();
      img.src = this.imageSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const imageURL = canvas.toDataURL('image/png');
        this.imageSrc = imageURL; // 更新 imageSrc
      };
    },

  },

  mounted() {
    this.getBase64Image();
  },
};
</script>

<style>
.user-info {
  margin-left: 10px;
  height: 200px;
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  flex: 1;
}

.user-info-group {
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
}

</style>