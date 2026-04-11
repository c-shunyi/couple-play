import { createSSRApp } from 'vue';
import App from './App.vue';
import pinia from './store';

/**
 * UniApp Vue3 入口：创建 app 并挂载 Pinia。
 */
export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia);
  return { app };
}
