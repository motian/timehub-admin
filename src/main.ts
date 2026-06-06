import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import hComponents from '@/h-components';
import bComponents from '@/biz/components';
import router from './router';
import store from './store';
import directive from './directive';
import './mock';
import App from './App.vue'; // 必须在
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import '@/api/interceptor';

window.staticDomain = 'timehub-static.haocode.net';
window.uploadDomain = 'up-z0.qiniup.com';
window.appName = '拾光巷漫集';
window.appIcon =
  'https://timehub-static.haocode.net/Fv8qOWAoRcqM39tJ1dzihHuUjLhZ.jpeg';

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(globalComponents);
app.use(hComponents);
app.use(bComponents);
app.use(directive);

app.mount('#app');
