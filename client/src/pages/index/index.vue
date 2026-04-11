<template>
  <view class="page">
    <uni-card title="欢迎" sub-title="couple-play 基础脚手架" :is-shadow="true">
      <text class="desc">这是首页示例，后续在此基础上扩展业务。</text>
    </uni-card>

    <uni-section title="功能示例" type="line"></uni-section>
    <uni-list>
      <uni-list-item title="调用 /api/health" note="测试后端连通" showArrow clickable @click="onCallHealth" />
      <uni-list-item title="查看示例列表" note="调用 /api/example" showArrow clickable @click="onCallList" />
    </uni-list>

    <uni-section v-if="lastResult" title="最近响应" type="line"></uni-section>
    <view v-if="lastResult" class="result">
      <text>{{ lastResult }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { exampleApi } from '@/api/example';

// 最近一次请求的响应，用于展示
const lastResult = ref('');

/** 调用健康检查 */
async function onCallHealth() {
  try {
    const data = await exampleApi.health({ loading: true });
    lastResult.value = JSON.stringify(data);
  } catch (e) {
    lastResult.value = 'error: ' + JSON.stringify(e);
  }
}

/** 调用示例列表 */
async function onCallList() {
  try {
    const data = await exampleApi.list();
    lastResult.value = JSON.stringify(data);
  } catch (e) {
    lastResult.value = 'error: ' + JSON.stringify(e);
  }
}
</script>

<style>
.page {
  padding: 20rpx;
}
.desc {
  font-size: 28rpx;
  color: #666;
}
.result {
  margin-top: 20rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #333;
  word-break: break-all;
}
</style>
