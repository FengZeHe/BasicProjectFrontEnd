<template>
  <div class="about">
    <h1>个人主页</h1>
    <div class="user-info">
        <div class="avatar">
          <el-image class="avatar-image" :src="avatarUrl"></el-image>
        </div>
        <div class="user-info-group">
          <div class="user-info-name">用户名</div>
          <div class="user-info-about">关于我</div>
        </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'AboutView',
  data(){
    return {
      avatarUrl :  require('@/assets/avatar.png')
    }
  }
}

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