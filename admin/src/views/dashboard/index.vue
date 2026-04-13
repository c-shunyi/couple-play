<template>
  <div>
    <h2 style="margin-bottom: 20px">欢迎使用 couple-play 管理台</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>管理员数</template>
          <div class="stat-num">{{ stats.adminCount ?? '-' }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>用户总数</template>
          <div class="stat-num">{{ stats.userCount ?? '-' }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>系统状态</template>
          <div class="stat-num" style="color: #67c23a">正常</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { getAdminUsers } from '@/api/admin-user'
import { getUsers } from '@/api/user'

const stats = reactive({ adminCount: null, userCount: null })

onMounted(async () => {
  try {
    const admins = await getAdminUsers()
    stats.adminCount = admins.length
  } catch { /* ignore */ }
  try {
    const res = await getUsers({ page: 1, pageSize: 1 })
    stats.userCount = res.total
  } catch { /* ignore */ }
})
</script>

<style scoped>
.stat-num {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  padding: 10px 0;
}
</style>
