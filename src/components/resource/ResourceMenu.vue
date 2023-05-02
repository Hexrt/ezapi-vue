<template>
    <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="200" style="background: #fff">
            <a-menu
                v-model:selectedKeys="selectedKeys"
                v-model:openKeys="openKeys"
                mode="inline"
                style="height: 100%"
            >
                <a-sub-menu key="res-1">
                    <template #title>
                        <span>
                            <user-outlined />
                            数据库
                        </span>
                    </template>
                    <a-menu-item key="res-1-1">数据库</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="res-2">
                    <template #title>
                        <span>
                            <laptop-outlined />
                            外部接口
                        </span>
                    </template>
                    <a-menu-item key="res-2-1">接口列表</a-menu-item>
                    <a-menu-item key="res-2-2">爬虫接口</a-menu-item>
                </a-sub-menu>
            </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '720px' }">
            <DatabaseList v-if="selectedKeys.includes('res-1-1')"/>
        </a-layout-content>
    </a-layout>
</template>

<script>
import LaptopOutlined from "@ant-design/icons-vue";
import DatabaseList from "./database/DatabaseList.vue";

import { defineComponent, ref } from "vue";
export default defineComponent({
    components: {
        LaptopOutlined,
        DatabaseList
    },
    setup() {
        return {
            selectedKeys: ref(["res-1-1"]),
            openKeys: ref(["res-1","res-1-1"]),
        };
    },
});
</script>
