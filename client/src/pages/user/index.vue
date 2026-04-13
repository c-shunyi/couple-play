<template>
  <view class="page">
    <!-- 已登录状态 -->
    <view v-if="userStore.isLogin" class="profile-section">
      <view class="avatar-row">
        <image
          class="avatar"
          :src="userStore.userInfo?.avatar || '/static/logo.png'"
          mode="aspectFill"
        />
        <view class="name-col">
          <text class="nickname">{{ userStore.userInfo?.nickname || '未设置昵称' }}</text>
          <text class="username" v-if="userStore.userInfo?.username">@{{ userStore.userInfo.username }}</text>
        </view>
      </view>

      <uni-section title="个人信息" type="line"></uni-section>
      <uni-list>
        <uni-list-item title="昵称" :rightText="userStore.userInfo?.nickname || '-'" />
        <uni-list-item title="性别" :rightText="genderText" />
        <uni-list-item title="ID" :rightText="String(userStore.userInfo?.id || '-')" />
      </uni-list>

      <view class="btns">
        <button class="btn logout-btn" @click="onLogout">退出登录</button>
      </view>
    </view>

    <!-- 未登录状态 -->
    <view v-else class="not-login">
      <view class="not-login-icon">
        <uni-icons type="person" size="80" color="#ccc" />
      </view>
      <text class="not-login-text">您还未登录</text>
      <button class="btn login-btn" type="primary" @click="goLogin">去登录</button>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

/** 性别文案映射 */
const genderText = computed(() => {
  const g = userStore.userInfo?.gender;
  if (g === 1) return '男';
  if (g === 2) return '女';
  return '未设置';
});

/** 页面显示时，如果已登录且没有 userInfo，尝试拉取 */
onShow(() => {
  if (userStore.isLogin && !userStore.userInfo) {
    userStore.fetchProfile();
  }
});

/** 退出登录 */
function onLogout() {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
      }
    },
  });
}

/** 跳转登录页 */
function goLogin() {
  uni.navigateTo({ url: '/pages/login/index' });
}
</script>

<style>
.page {
  padding: 20rpx;
  min-height: 100vh;
  background: #f8f8f8;
}
.profile-section {
  padding-top: 20rpx;
}
.avatar-row {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 24rpx;
  background: #eee;
}
.name-col {
  display: flex;
  flex-direction: column;
}
.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
.username {
  font-size: 26rpx;
  color: #999;
  margin-top: 8rpx;
}
.btns {
  padding: 40rpx 20rpx;
}
.logout-btn {
  background-color: #fff !important;
  color: #ff4d4f !important;
  border: 1rpx solid #ff4d4f;
  border-radius: 48rpx !important;
  height: 88rpx;
  line-height: 88rpx;
}
.not-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}
.not-login-icon {
  margin-bottom: 24rpx;
}
.not-login-text {
  font-size: 30rpx;
  color: #999;
  margin-bottom: 40rpx;
}
.login-btn {
  width: 60%;
  background-color: #FF6699 !important;
  border-radius: 48rpx !important;
  height: 88rpx;
  line-height: 88rpx;
}
</style>
