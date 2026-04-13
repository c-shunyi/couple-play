<template>
  <div>
    <div class="page-header">
      <h2>管理员管理</h2>
      <el-button type="primary" @click="openDialog()">新增管理员</el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="role" label="角色" width="140">
        <template #default="{ row }">
          <el-tag :type="row.role === 'super_admin' ? 'danger' : 'primary'">
            {{ row.role === 'super_admin' ? '超级管理员' : '管理员' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确定删除？" @confirm="onDelete(row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑管理员' : '新增管理员'" width="450px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="isEdit" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" :prop="isEdit ? '' : 'password'">
          <el-input v-model="form.password" type="password" :placeholder="isEdit ? '不修改请留空' : '请输入密码'" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="超级管理员" value="super_admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" v-if="isEdit">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="onSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '@/api/admin-user'
import { ElMessage } from 'element-plus'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const formRef = ref()

const form = reactive({ username: '', password: '', role: 'admin', status: 1 })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

function formatTime(t) {
  return t ? new Date(t).toLocaleString('zh-CN') : '-'
}

async function fetchList() {
  loading.value = true
  try {
    list.value = await getAdminUsers()
  } finally {
    loading.value = false
  }
}

function openDialog(row) {
  isEdit.value = !!row
  editId.value = row?.id || null
  form.username = row?.username || ''
  form.password = ''
  form.role = row?.role || 'admin'
  form.status = row?.status ?? 1
  dialogVisible.value = true
}

async function onSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    if (isEdit.value) {
      const data = { role: form.role, status: form.status }
      if (form.password) data.password = form.password
      await updateAdminUser(editId.value, data)
      ElMessage.success('更新成功')
    } else {
      await createAdminUser({ username: form.username, password: form.password, role: form.role })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchList()
  } finally {
    submitting.value = false
  }
}

async function onDelete(id) {
  await deleteAdminUser(id)
  ElMessage.success('已删除')
  fetchList()
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
</style>
