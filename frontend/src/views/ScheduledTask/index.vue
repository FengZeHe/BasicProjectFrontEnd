<template>
    <div class="ScheduledTask">
        <div class="header-section">
            <h2>定时任务管理</h2>
            <el-button type="primary" icon="el-icon-plus" circle @click="handleAdd"></el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="ID" label="ID" width="80"></el-table-column>
            <el-table-column prop="taskName" label="任务名称" min-width="200"></el-table-column>
            <el-table-column prop="status" label="状态" width="120">
                <template v-slot="scope">
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                        {{ scope.row.status === 1 ? '启动' : '暂停' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="260">
                <template v-slot="scope">
                    <el-button type="primary" icon="el-icon-caret-right" circle :disabled="scope.row.status === 1" @click="handleStart(scope.row)"></el-button>
                    <el-button type="warning" icon="el-icon-video-pause" circle :disabled="scope.row.status === 0" @click="handlePause(scope.row)"></el-button>
                    <el-button type="info" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-drawer
            :title="isEdit ? '编辑任务' : '添加任务'"
            size="40%"
            :visible.sync="drawer"
            @close="handleDrawerClose">
            <el-form ref="form" :model="editForm" label-width="100px">
                <el-form-item label="任务名称">
                    <el-input v-model="editForm.taskName" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="Cron表达式">
                    <el-input v-model="editForm.cronExpr"></el-input>
                </el-form-item>
                <el-form-item label="任务类型">
                    <el-select v-model="editForm.taskType" placeholder="请选择任务类型">
                        <el-option label="func" value="func"></el-option>
                        <el-option label="shell" value="shell"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="drawer-footer">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="primary" @click="handleSave">保存</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
    name: 'ScheduledTask',
    data() {
        return {
            tableData: [],
            drawer: false,
            isEdit: false,
            editForm: {
                ID: null,
                taskName: '',
                cronExpr: '',
                taskType: ''
            }
        };
    },
    created() {
        this.fetchTasks();
    },
    methods: {
        async fetchTasks() {
            const req = { pageIndex: 1, pageSize: 10 };
            await axios.get("/task/", { params: req }).then((res) => {
                this.tableData = res.data.data.data;
            }).catch((err) => {
                console.log(err);
            });
        },
        async handleStart(row) {
            await axios.post("/task/start", { id: row.ID }).then(() => {
                this.$message.success(`启动任务: ${row.taskName}`);
                this.fetchTasks();
            }).catch((err) => {
                console.log(err);
                this.$message.error("启动任务失败");
            });
        },
        async handlePause(row) {
            await axios.post("/task/pause", { id: row.ID }).then(() => {
                this.$message.success(`暂停任务: ${row.taskName}`);
                this.fetchTasks();
            }).catch((err) => {
                console.log(err);
                this.$message.error("暂停任务失败");
            });
        },
        handleAdd() {
            this.isEdit = false;
            this.editForm = {
                ID: null,
                taskName: '',
                cronExpr: '',
                taskType: ''
            };
            this.drawer = true;
        },
        handleEdit(row) {
            this.isEdit = true;
            this.editForm.ID = row.ID;
            this.editForm.taskName = row.taskName;
            this.editForm.cronExpr = row.cronExpr || '';
            this.editForm.taskType = row.taskType || '';
            this.drawer = true;
        },
        handleDrawerClose() {
            this.isEdit = false;
            this.editForm = {
                ID: null,
                taskName: '',
                cronExpr: '',
                taskType: ''
            };
        },
        async handleSave() {
            if (this.isEdit) {
                const data = {
                    id: this.editForm.ID,
                    name: this.editForm.taskName,
                    cronExpr: this.editForm.cronExpr,
                    taskName: this.editForm.taskName,
                    taskType: this.editForm.taskType
                };
                await axios.post("/task/update", data).then(() => {
                    this.$message.success('保存成功');
                    this.drawer = false;
                    this.fetchTasks();
                }).catch((err) => {
                    console.log(err);
                    this.$message.error("保存失败");
                });
            } else {
                const data = {
                    name: this.editForm.taskName,
                    cronExpr: this.editForm.cronExpr,
                    taskName: this.editForm.taskName,
                    taskType: this.editForm.taskType
                };
                await axios.post("/task/add", data).then(() => {
                    this.$message.success('添加成功');
                    this.drawer = false;
                    this.fetchTasks();
                }).catch((err) => {
                    console.log(err);
                    this.$message.error("添加失败");
                });
            }
        },
        async handleDelete(row) {
            this.$confirm(`确定要删除任务 ${row.taskName} 吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await axios.post("/task/delete", { id: row.ID }).then(() => {
                    this.$message.success(`删除任务: ${row.taskName}`);
                    this.fetchTasks();
                }).catch((err) => {
                    console.log(err);
                    this.$message.error("删除失败");
                });
            }).catch(() => {});
        }
    }
};
</script>

<style scoped>
.ScheduledTask {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
}
.header-section {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}
.header-section h2 {
    margin: 0;
}
.header-section .el-button {
    position: absolute;
    right: 0;
}
.el-table {
    width: 100% !important;
}
.drawer-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    border-top: 1px solid #ebeef5;
    text-align: right;
    background: #fff;
}
.el-select {
    width: 100%;
    text-align: left;
}
</style>
