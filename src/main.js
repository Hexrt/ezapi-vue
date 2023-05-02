import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import JsonEditorVue from 'json-editor-vue3'
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'

createApp(App).mount('#app')
const app = createApp(App);

app.use(Antd).use(JsonEditorVue).mount('#app');