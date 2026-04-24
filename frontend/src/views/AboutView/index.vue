<template>
  <div class="about-container">
    <div class="profile-card">
      <div class="profile-header"></div>

      <div class="avatar-section">
        <el-avatar :size="120" :src="avatarUrl" class="user-avatar"></el-avatar>
      </div>

      <div class="profile-content">
        <h1 class="user-name">{{ userName }}</h1>
        <p class="user-bio">这个人很神秘，什么都没有留下~</p>

        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-number">{{ followingCount }}</div>
            <div class="stat-label">关注</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ followersCount }}</div>
            <div class="stat-label">粉丝</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ postsCount }}</div>
            <div class="stat-label">帖子</div>
          </div>
        </div>

        <div class="action-buttons">
          <el-button type="primary" size="medium" round>编辑资料</el-button>
          <el-button size="medium" round>更换头像</el-button>
        </div>
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
      userName: 'Admin',
      avatarUrl: require('@/assets/avatar.png'),
      followingCount: 128,
      followersCount: 256,
      postsCount: 64,

      base64Data: '',
      imageSrc: '',
      file: null,
      chunkSize: 5 * 1024 * 1024,
      totalChunks: 0,
      currentChunk: 0,
      isPaused: false,
    };
  },
  methods: {
    handleFileChange(event) {
      this.file = event.target.files[0];
      this.totalChunks = Math.ceil(this.file.size / this.chunkSize);
      this.currentChunk = 0;
      this.isPaused = false;
    },
    async uploadFile() {
      if (!this.file) {
        alert("没有文件上传");
        return;
      }

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
            this.uploadChunk(reader.result, this.currentChunk, this.totalChunks)
                .then(() => {
                  resolve();
                  this.currentChunk ++;
                })
                .catch((err) => {
                  reject(err);
                });
          };
          reader.readAsArrayBuffer(chunk);
        });
      }

      console.log("文件分片上传完成")
      await this.mergeChunk(this.file.name, this.totalChunks);
    },
    async uploadChunk(chunkData, chunkIndex, totalChunks) {
      const formData = new FormData();
      formData.append('chunk', new Blob([chunkData]), this.file.name);
      formData.append('fileName', this.file.name);
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
    pauseUpload() {
      this.isPaused = true;
    },
    resumeUpload() {
      if (this.isPaused) {
        this.isPaused = false;
        this.uploadFile();
      }
    },
    cancelUpload() {
      this.isCancelled = true;
    },
    getBase64Image() {
      const formData = new FormData();
      formData.append('fileName', 'MyPhoto.png');
      axios.post("/users/downloadFile", formData)
          .then((res) => {
            this.base64Data = res.data.pic;
            this.imageSrc = 'data:image/png;base64,' + this.base64Data;
            this.avatarUrl = this.imageSrc;
          })
          .catch((err) => {
            console.error(err);
          });
    },
  },
  mounted() {
    this.getBase64Image();
  },
};
</script>

<style lang="less" scoped>
.about-container {
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.profile-card {
  width: 100%;
  max-width: 100%;
  background: #fff;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  position: relative;
  min-height: calc(100vh - 60px);
}

.profile-header {
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar-section {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
}

.user-avatar {
  border: 4px solid #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.profile-content {
  padding-top: 80px;
  text-align: center;
  padding-bottom: 40px;
}

.user-name {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.user-bio {
  font-size: 14px;
  color: #888;
  margin: 0 0 30px 0;
}

.stats-row {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin: 0 40px 30px;
}

.stat-item {
  flex: 1;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #f0f0f0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
