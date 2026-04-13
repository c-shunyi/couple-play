<template>
  <el-container style="height: 100%">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" style="transition: width 0.3s">
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        style="height: 100%; border-right: none"
      >
        <div class="logo">
          <span v-if="!isCollapse">couple-play</span>
          <span v-else>CP</span>
        </div>
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/admin-users">
          <el-icon><UserFilled /></el-icon>
          <template #title>管理员管理</template>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主区域 -->
    <el-container>
      <el-header class="header">
        <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
        <div class="header-right">
          <el-dropdown @command="onCommand">
            <span class="user-info">
              {{ authStore.user?.username || '管理员' }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { HomeFilled, UserFilled, User, Fold, Expand, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isCollapse = ref(false)

onMounted(() => {
  if (authStore.isLogin && !authStore.user) {
    authStore.fetchProfile()
  }
})

function onCommand(cmd) {
  if (cmd === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 16px;
}
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
}
.header-right {
  display: flex;
  align-items: center;
}
.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}
</style>
