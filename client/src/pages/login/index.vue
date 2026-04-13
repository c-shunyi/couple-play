<template>
  <view class="page">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">欢迎回来</text>
      <text class="subtitle">请选择登录方式</text>
    </view>

    <!-- 登录方式 Tab -->
    <uni-segmented-control
      :current="tabIndex"
      :values="['微信登录', '账号登录']"
      style-type="text"
      active-color="#FF6699"
      @clickItem="onTabChange"
    />

    <!-- 微信登录 -->
    <view v-if="tabIndex === 0" class="wx-section">
      <button class="wx-btn" type="primary" @click="onWxLogin" :loading="loading">
        微信一键登录
      </button>
    </view>

    <!-- 账号登录 -->
    <view v-if="tabIndex === 1" class="form-section">
      <uni-forms ref="formRef" :modelValue="form" label-width="0">
        <uni-forms-item name="username">
          <uni-easyinput v-model="form.username" placeholder="请输入用户名" prefixIcon="person" />
        </uni-forms-item>
        <uni-forms-item name="password">
          <uni-easyinput v-model="form.password" type="password" placeholder="请输入密码" prefixIcon="locked" />
        </uni-forms-item>
      </uni-forms>
      <button class="login-btn" type="primary" @click="onAccountLogin" :loading="loading">
        登录
      </button>
      <view class="link-row">
        <text class="link" @click="goRegister">还没有账号？去注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useUserStore } from '@/store/user';
import { userApi } from '@/api/user';

const userStore = useUserStore();
const tabIndex = ref(0);
const loading = ref(false);
const form = reactive({ username: '', password: '' });

/** 切换 Tab */
function onTabChange(e) {
  tabIndex.value = e.currentIndex;
}

/** 微信一键登录 */
async function onWxLogin() {
  loading.value = true;
  try {
    const [loginErr, loginRes] = await new Promise((resolve) => {
      uni.login({ provider: 'weixin', success: (res) => resolve([null, res]), fail: (err) => resolve([err, null]) });
    });
    if (loginErr || !loginRes) {
      uni.showToast({ title: '获取微信授权失败', icon: 'none' });
      return;
    }
    const data = await userApi.wxLogin(loginRes.code);
    loginSuccess(data);
  } catch (e) {
    // request.js 已 toast
  } finally {
    loading.value = false;
  }
}

/** 账号密码登录 */
async function onAccountLogin() {
  if (!form.username || !form.password) {
    uni.showToast({ title: '请填写用户名和密码', icon: 'none' });
    return;
  }
  loading.value = true;
  try {
    const data = await userApi.login(form.username, form.password);
    loginSuccess(data);
  } catch (e) {
    // request.js 已 toast
  } finally {
    loading.value = false;
  }
}

/** 登录成功统一处理 */
function loginSuccess(data) {
  userStore.setUser({ userInfo: data.user, token: data.token });
  uni.showToast({ title: '登录成功', icon: 'success' });
  setTimeout(() => {
    uni.switchTab({ url: '/pages/index/index' });
  }, 500);
}

/** 跳转注册页 */
function goRegister() {
  uni.navigateTo({ url: '/pages/register/index' });
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
.wx-section {
  margin-top: 80rpx;
  padding: 0 40rpx;
}
.wx-btn {
  background-color: #07c160 !important;
  border-radius: 48rpx !important;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
}
.form-section {
  margin-top: 40rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
}
.login-btn {
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
