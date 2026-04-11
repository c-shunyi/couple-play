<template>
  <view class="page">
    <uni-card :title="userStore.isLogin ? userStore.userInfo?.nickname || '已登录' : '未登录'"
              :sub-title="userStore.isLogin ? 'token 已保存' : '请先登录'" :is-shadow="true">
      <view class="info">
        <text>昵称：{{ userStore.userInfo?.nickname || '-' }}</text>
        <text>角色：{{ userStore.userInfo?.role || '-' }}</text>
        <text>token：{{ userStore.token || '-' }}</text>
      </view>
    </uni-card>

    <uni-section title="操作" type="line"></uni-section>
    <view class="btns">
      <button class="btn" type="primary" @click="onMockLogin">设置测试用户</button>
      <button class="btn" @click="onLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup>
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

/** 模拟登录：向 store 写入一条假数据，演示 Pinia 读写 */
function onMockLogin() {
  userStore.setUser({
    userInfo: { id: 1, nickname: '测试用户', role: 'user' },
    token: 'mock-token-' + Date.now(),
  });
  uni.showToast({ title: '已写入', icon: 'success' });
}

/** 退出登录 */
function onLogout() {
  userStore.clear();
  uni.showToast({ title: '已清空', icon: 'none' });
}
</script>

<style>
.page {
  padding: 20rpx;
}
.info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  font-size: 28rpx;
  color: #333;
}
.btns {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.btn {
  width: 100%;
}
</style>
