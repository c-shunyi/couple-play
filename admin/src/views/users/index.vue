<template>
  <div>
    <div class="page-header">
      <h2>用户管理</h2>
      <el-input v-model="keyword" placeholder="搜索昵称/用户名" clearable style="width: 250px" @clear="onSearch" @keyup.enter="onSearch">
        <template #append>
          <el-button @click="onSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="username" label="用户名">
        <template #default="{ row }">{{ row.username || '-' }}</template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="80">
        <template #default="{ row }">
          {{ row.gender === 1 ? '男' : row.gender === 2 ? '女' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间" width="180">
        <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-popconfirm
            :title="row.status === 1 ? '确定禁用该用户？' : '确定启用该用户？'"
            @confirm="onToggleStatus(row)"
          >
            <template #reference>
              <el-button size="small" :type="row.status === 1 ? 'warning' : 'success'">
                {{ row.status === 1 ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-popconfirm>
          <el-button size="small" @click="onDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="total > 0"
      class="pagination"
      background
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="onPageChange"
    />

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="用户详情" width="450px">
      <el-descriptions :column="1" border v-if="detailUser">
        <el-descriptions-item label="ID">{{ detailUser.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ detailUser.username || '-' }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ detailUser.nickname }}</el-descriptions-item>
        <el-descriptions-item label="OpenID">{{ detailUser.openid || '-' }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ detailUser.gender === 1 ? '男' : detailUser.gender === 2 ? '女' : '未知' }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detailUser.status === 1 ? '正常' : '禁用' }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ formatTime(detailUser.createdAt) }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers, getUserById, updateUserStatus } from '@/api/user'
import { ElMessage } from 'element-plus'

const list = ref([])
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const detailVisible = ref(false)
const detailUser = ref(null)

function formatTime(t) {
  return t ? new Date(t).toLocaleString('zh-CN') : '-'
}

async function fetchList() {
  loading.value = true
  try {
    const params = { page: page.value, pageSize: pageSize.value }
    if (keyword.value) params.keyword = keyword.value
    const res = await getUsers(params)
    list.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  fetchList()
}

function onPageChange(p) {
  page.value = p
  fetchList()
}

async function onToggleStatus(row) {
  const newStatus = row.status === 1 ? 0 : 1
  await updateUserStatus(row.id, newStatus)
  ElMessage.success(newStatus === 1 ? '已启用' : '已禁用')
  fetchList()
}

async function onDetail(row) {
  detailUser.value = await getUserById(row.id)
  detailVisible.value = true
}

onMounted(fetchList)
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
