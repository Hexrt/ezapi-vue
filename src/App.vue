<template>
    <a-layout>
        <a-layout-header class="header">
            <div class="logo" />
            <a-menu
                v-model:selectedKeys="selectedKeysNavi"
                theme="dark"
                mode="horizontal"
                :style="{ lineHeight: '64px' }"
            >
                <a-menu-item key="api">接口管理</a-menu-item>
                <a-menu-item key="visual">可视化开发</a-menu-item>
                <a-menu-item key="magic">微代码开发</a-menu-item>
                <a-menu-item key="resource">数据源管理</a-menu-item>
                <a-menu-item key="idea">创意工坊</a-menu-item>
                <a-menu-item key="sys">系统管理</a-menu-item>
            </a-menu>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
            <ApiMenu v-if="selectedKeysNavi.includes('api')" />
            <BlocklyEditor v-if="selectedKeysNavi.includes('visual')" />
            <ResourceMenu v-if="selectedKeysNavi.includes('resource')" />
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            可视化高定制接口开发
        </a-layout-footer>
    </a-layout>
</template>
<script>
import ApiMenu from "./components/api/ApiMenu.vue";
import BlocklyEditor from "./components/visual/BlocklyEditor.vue";
import ResourceMenu from "./components/resource/ResourceMenu.vue";
import { defineComponent, ref } from "vue";
export default defineComponent({
    components: {
        ApiMenu,
        BlocklyEditor,
        ResourceMenu,
    },
    setup() {
        return {
            selectedKeysNavi: ref(["api"]),
            selectedKeys_1: ref(["api-1"]),
            openKeys_1: ref(["api-1-1"]),
        };
    },
});
</script>
<style>
html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
}

#app {
    width: 100%;
    height: 100%;
}
#components-layout-demo-top-side .logo {
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
    float: right;
    margin: 16px 0 16px 24px;
}

.site-layout-background {
    background: #fff;
}
</style>
