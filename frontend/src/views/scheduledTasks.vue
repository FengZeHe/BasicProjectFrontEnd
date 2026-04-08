<template>
  <div class="ScheduledTasks">
    <h1>定时任务管理</h1>
    <el-table :data="tableData" style="width:100%">
      <el-table-column prop="id" label="任务ID" width="100"></el-table-column>
      <el-table-column prop="taskName" label="任务名称" width="200"></el-table-column>
      <el-table-column prop="cronExpression" label="Cron表达式" width="180"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template v-slot="scope">
          <el-tag :type="scope.row.status === 'running' ? 'success' : 'info'">
            {{ scope.row.status === 'running' ? '运行中' : '已停止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template>
          <el-button type="primary" size="small" icon="el-icon-video-play">启动</el-button>
          <el-button type="warning" size="small" icon="el-icon-video-pause">暂停</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ScheduledTasks',
  data() {
    return {
      tableData: [{
        id: 1,
        taskName: '数据备份任务',
        cronExpression: '0 0 2 * * ?',
        description: '每天凌晨2点执行数据备份',
        status: 'running'
      }, {
        id: 2,
        taskName: '日志清理任务',
        cronExpression: '0 0 3 * * ?',
        description: '每天凌晨3点清理过期日志',
        status: 'stopped'
      }, {
        id: 3,
        taskName: '邮件发送任务',
        cronExpression: '0 0 9 * * ?',
        description: '每天上午9点发送日报邮件',
        status: 'running'
      }]
    }
  }
}
</script>

<style scoped>

</style>
