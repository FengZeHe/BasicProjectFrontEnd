<template>
  <div class="write-article">
    <div class="editor-header">
      <div class="header-left">
        <el-button icon="el-icon-arrow-left" @click="goBack" class="btn-back">返回</el-button>
        <span class="editor-title">{{ isNew ? '新建文章' : '编辑文章' }}</span>
      </div>
      <div class="header-right">
        <el-button @click="handleSave('0')" class="btn-save">
          <i class="el-icon-document"></i>
          保存草稿
        </el-button>
        <el-button type="primary" @click="handleSave('1')" class="btn-publish">
          <i class="el-icon-upload2"></i>
          发布文章
        </el-button>
      </div>
    </div>

    <div class="editor-container">
      <div class="title-section">
        <el-input
          v-model="Article.title"
          placeholder="请输入文章标题"
          class="title-input"
          size="large"
        ></el-input>
      </div>

      <div class="editor-wrapper">
        <mavon-editor
          v-model="Article.content"
          :toolbars="toolbars"
          :subfield="true"
          :default-open="'edit'"
          placeholder="在这里开始创作..."
          :code-style="'atom-one-dark'"
          :ishljs="true"
          @change="handleChange"
          @imgAdd="handleImgAdd"
          class="md-editor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

export default {
  components: {
    mavonEditor
  },
  data() {
    return {
      Article: {},
      isNew: false,
      hasChanged: false,
      toolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        fullscreen: true,
        readmodel: true,
        htmlcode: true,
        help: true,
        undo: true,
        redo: true,
        trash: true,
        save: false,
        navigation: true,
        alignleft: true,
        aligncenter: true,
        alignright: true,
        subfield: true,
        preview: true
      }
    }
  },
  methods: {
    goBack() {
      this.$router.push('/draftList');
    },
    handleChange() {
      this.hasChanged = true;
    },
    handleImgAdd(pos, $file) {
      const formData = new FormData();
      formData.append('image', $file);
      console.log('上传图片:', $file);
      this.$message.info('图片上传功能需要后端支持');
    },
    handleSave(status) {
      if (!this.Article.title || this.Article.title.trim() === '') {
        this.$message.warning('请输入文章标题');
        return;
      }
      if (this.isNew === true) {
        this.addArticle(status)
      } else {
        this.updateArticle(status)
      }
    },
    addArticle(status) {
      const data = {
        "authorName": this.Article.authorName,
        "title": this.Article.title,
        "content": this.Article.content,
        "status": status,
      }
      axios.post("/draft/addArticle", data).then(response => {
        console.log(response)
        this.hasChanged = false;
        this.showSuccessMsg(status === '1' ? '发布成功' : '保存成功')
        if (status === '0') {
          this.$router.push("/draftList");
        } else {
          this.$router.push('/');
        }
      }).catch(error => {
        console.log(error)
        this.showErrorMsg('保存失败')
      })
    },
    updateArticle(status) {
      const data = {
        "draftID": this.Article.id,
        "authorID": this.Article.authorID,
        "title": this.Article.title,
        "content": this.Article.content,
        "status": status
      }
      axios.post("/draft/updateArticle", data).then(response => {
        console.log("res", response.data.data)
        this.hasChanged = false;
        var msg = response.data.data
        this.showSuccessMsg(msg)
        if (status === '0') {
          this.$router.push("/draftList");
        } else {
          this.$router.push('/');
        }
      }).catch(error => {
        console.log(error);
        this.showErrorMsg('保存失败')
      })
    },
    getDraft() {
      const data = {
        "draftID": this.Article.id,
        "authorID": this.Article.authorID,
      }
      axios.post("/draft/getDraft", data).then(response => {
        console.log("数据回来了", response.data.data)
        this.Article = response.data.data
      })
    },
    showSuccessMsg(msg) {
      this.$notify({
        title: "成功",
        message: msg,
        type: "success",
        duration: 2000
      })
    },
    showErrorMsg(msg) {
      this.$notify.error({
        title: '错误',
        message: msg
      });
    }
  },
  created() {
    this.Article = JSON.parse(this.$route.query.items || '{}')
    if (this.Article.id === undefined) {
      console.log("这是一篇新文章")
      this.isNew = true
      this.Article = { title: '', content: '' }
    } else {
      this.getDraft()
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasChanged) {
      this.$confirm('文章内容未保存，确定要离开吗？', '提示', {
        confirmButtonText: '确定离开',
        cancelButtonText: '继续编辑',
        type: 'warning',
        distinguishCancelAndClose: true
      }).then(() => {
        next();
      }).catch(action => {
        if (action === 'cancel') {
          next(false);
        } else {
          next();
        }
      });
    } else {
      next();
    }
  }
}
</script>

<style scoped>
.write-article {
  min-height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-back {
  border: none;
  background: transparent;
  color: #606a75;
}

.btn-back:hover {
  color: #1d2129;
  background: #f7f8fa;
}

.editor-title {
  font-size: 16px;
  font-weight: 500;
  color: #1d2129;
}

.header-right {
  display: flex;
  gap: 12px;
}

.btn-save {
  border-color: #e5e6eb;
  color: #4e5969;
}

.btn-save:hover {
  border-color: #c9cdd4;
  color: #1d2129;
}

.btn-publish {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding-left: 20px;
  padding-right: 20px;
}

.btn-publish:hover {
  opacity: 0.9;
}

.editor-container {
  flex: 1;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 32px;
}

.title-section {
  margin-bottom: 24px;
}

.title-input >>> .el-input__inner {
  font-size: 28px;
  font-weight: 600;
  border: none;
  padding: 16px 0;
  color: #1d2129;
  background: transparent;
}

.title-input >>> .el-input__inner::placeholder {
  color: #c9cdd4;
}

.title-input >>> .el-input__inner:focus {
  box-shadow: none;
}

.editor-wrapper {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  min-height: 600px;
}

.md-editor {
  min-height: 600px;
}

/* 深度修改 mavon-editor 样式 */
/deep/ .v-note-wrapper {
  border: none !important;
}

/deep/ .v-note-toolbar {
  background: #f7f8fa !important;
  border-bottom: 1px solid #e8e8e8 !important;
  padding: 8px 16px !important;
}

/deep/ .v-note-edit,
/deep/ .v-note-preview {
  padding: 24px !important;
}

/deep/ .v-note-edit textarea {
  font-size: 15px !important;
  line-height: 1.8 !important;
}

/deep/ .v-note-preview {
  font-size: 15px !important;
  line-height: 1.8 !important;
}
</style>
