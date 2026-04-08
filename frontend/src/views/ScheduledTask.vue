<template>
    <div class="ScheduledTask">
        <h2>定时任务管理</h2>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="taskName" label="TaskName" width="200"></el-table-column>
            <el-table-column prop="status" label="Status" width="120">
                <template v-slot="scope">
                    <el-tag :type="scope.row.status === 'running' ? 'success' : 'info'">
                        {{ scope.row.status }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template v-slot="scope">
                    <el-button type="primary" size="small" @click="handleStart(scope.row)">启动</el-button>
                    <el-button type="warning" size="small" @click="handlePause(scope.row)">暂停</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
    name: 'ScheduledTask',
    data() {
        return {
            tableData: []
        };
    },
    created() {
        this.fetchTasks();
    },
    methods: {
        async fetchTasks() {

            const req = {
                pageIndex: 1,
                pageSize: 10
            }

            await axios.get("/task/", {
                params: req
            }).then((res) => {
                this.tableData = res.data.data.data
            }).catch((err) => {
                console.log(err)
            })



            // await axios.post("/article/getArticles", data).then(res => {
            //     console.log("article", res)
            // })


        },
        handleStart(row) {
            this.$message.info(`启动任务: ${row.taskName}`);
        },
        handlePause(row) {
            this.$message.info(`暂停任务: ${row.taskName}`);
        },
        handleDelete(row) {
            this.$confirm(`确定要删除任务 ${row.taskName} 吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message.success(`删除任务: ${row.taskName}`);
            }).catch(() => { });
        }
    }
};
</script>

<style scoped>
.ScheduledTask {
    padding: 20px;
}
</style>
