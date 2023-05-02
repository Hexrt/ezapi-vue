<template>
    <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="200" style="background: #fff">
            <a-menu
                v-model:selectedKeys="selectedKeys"
                v-model:openKeys="openKeys"
                mode="inline"
                style="height: 100%"
            >
                <a-sub-menu key="api-1">
                    <template #title>
                        <span>
                            <user-outlined />
                            接口管理
                        </span>
                    </template>
                    <a-menu-item key="api-1-1">接口列表</a-menu-item>
                    <a-menu-item key="api-1-2">可视化接口</a-menu-item>
                    <a-menu-item key="api-1-3">外部接口</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="api-2">
                    <template #title>
                        <span>
                            <laptop-outlined />
                            审计
                        </span>
                    </template>
                    <a-menu-item key="api-2-1">接口调用统计</a-menu-item>
                    <a-menu-item key="api-2-2">接口日志</a-menu-item>
                    <a-menu-item key="api-2-3">热点接口</a-menu-item>
                    <a-menu-item key="api-2-4">审计管理</a-menu-item>
                </a-sub-menu>
            </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '720px' }">
            <ApiList v-if="selectedKeys.includes('api-1-1')"/>
        </a-layout-content>
    </a-layout>
</template>

<script>
import LaptopOutlined from "@ant-design/icons-vue";
import ApiList from "./list/ApiList.vue";

import { defineComponent, ref } from "vue";
export default defineComponent({
    components: {
        LaptopOutlined,
        ApiList,
    },
    setup() {
        return {
            selectedKeys: ref(["api-1-1"]),
            openKeys: ref(["api-1","api-1-1"]),
        };
    },
});
</script>
