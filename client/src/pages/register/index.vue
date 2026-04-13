<template>
  <view class="page">
    <view class="header">
      <text class="title">创建账号</text>
      <text class="subtitle">注册后即可登录</text>
    </view>

    <view class="form-section">
      <uni-forms ref="formRef" :modelValue="form" label-width="0">
        <uni-forms-item name="username">
          <uni-easyinput v-model="form.username" placeholder="用户名（3~32 位）" prefixIcon="person" />
        </uni-forms-item>
        <uni-forms-item name="nickname">
          <uni-easyinput v-model="form.nickname" placeholder="昵称（选填）" prefixIcon="contact" />
        </uni-forms-item>
        <uni-forms-item name="password">
          <uni-easyinput v-model="form.password" type="password" placeholder="密码（至少 6 位）" prefixIcon="locked" />
        </uni-forms-item>
        <uni-forms-item name="confirmPassword">
          <uni-easyinput v-model="form.confirmPassword" type="password" placeholder="确认密码" prefixIcon="locked" />
        </uni-forms-item>
      </uni-forms>

      <button class="register-btn" type="primary" @click="onRegister" :loading="loading">
        注册
      </button>
      <view class="link-row">
        <text class="link" @click="goLogin">已有账号？去登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useUserStore } from '@/store/user';
import { userApi } from '@/api/user';

const userStore = useUserStore();
const loading = ref(false);
const form = reactive({ username: '', nickname: '', password: '', confirmPassword: '' });

/** 注册 */
async function onRegister() {
  if (!form.username || !form.password) {
    uni.showToast({ title: '请填写用户名和密码', icon: 'none' });
    return;
  }
  if (form.username.length < 3 || form.username.length > 32) {
    uni.showToast({ title: '用户名长度需在 3~32 之间', icon: 'none' });
    return;
  }
  if (form.password.length < 6) {
    uni.showToast({ title: '密码至少 6 位', icon: 'none' });
    return;
  }
  if (form.password !== form.confirmPassword) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    const data = await userApi.register({
      username: form.username,
      password: form.password,
      nickname: form.nickname || undefined,
    });
    // 注册成功自动登录
    userStore.setUser({ userInfo: data.user, token: data.token });
    uni.showToast({ title: '注册成功', icon: 'success' });
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' });
    }, 500);
  } catch (e) {
    // request.js 已 toast
  } finally {
    loading.value = false;
  }
}

/** 返回登录页 */
function goLogin() {
  uni.navigateBack();
}
</script>

<style>
.page {
  padding: 40rpx;
  min-height: 100vh;
  background: #f8f8f8;
}
.header {
  padding: 60rpx 0 40rpx;
  text-align: center;
}
.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}
.subtitle {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #999;
}
.form-section {
  margin-top: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
}
.register-btn {
  margin-top: 20rpx;
  background-color: #FF6699 !important;
  border-radius: 48rpx !important;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
}
.link-row {
  margin-top: 24rpx;
  text-align: center;
}
.link {
  font-size: 26rpx;
  color: #FF6699;
}
</style>
