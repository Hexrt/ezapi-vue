<template>
    <a-row>
        <a-col>
            <a-button type="primary" @click="showAddModal">新增数据库</a-button>
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="6" v-for="base in database" v-bind:key="base.node.id">
            <a-card hoverable style="margin: 12px">
                <template #cover>
                    <img alt="example" :src="databaseImage(base)" />
                </template>
                <template #actions>
                    <setting-outlined
                        key="setting"
                        @click="showSettingModal(base)"
                    />
                    <a-popconfirm
                        title="您确认要删除这个数据库吗？"
                        ok-text="对"
                        cancel-text="不，我点错了"
                        @confirm="handleDeleteBase(base)"
                        @cancel="() => {}"
                    >
                        <delete-outlined style="color: red" />
                    </a-popconfirm>
                </template>
                <a-row :gutter="[8, 8]">
                    <a-col :span="4"> id： </a-col>
                    <a-col :span="20">
                        <a-tag color="#87d068">{{ base.node.id }}</a-tag>
                    </a-col>
                    <a-col :span="4"> 名称： </a-col>
                    <a-col :span="10">
                        <a-tag color="#2db7f5">pink{{ base.node.name }}</a-tag>
                    </a-col>
                    <a-col :span="4"> key： </a-col>
                    <a-col :span="6">
                        <a-tag color="#108ee9">{{ base.node.key }}</a-tag>
                    </a-col>
                    <a-col :span="4"> URL </a-col>
                    <a-col :span="20">
                        <a>{{ base.node.url }}</a>
                    </a-col>
                </a-row>
            </a-card>
        </a-col>
    </a-row>
    <a-modal
        v-model:visible="isAddModalVisable"
        title="新增数据库"
        style="width: 600px"
    >
        <template #footer>
            <a-row>
                <a-col :span="4">
                    <a-button
                        type="default"
                        :disabled="confirmLoading"
                        @click="jdbcTest(currentEditBase)"
                        >测试连接</a-button
                    >
                </a-col>
                <a-col :span="20">
                    <a-button
                        type="danger"
                        :disabled="confirmLoading"
                        @click="isAddModalVisable = false"
                        >取消</a-button
                    >
                    <a-button
                        type="primary"
                        :loading="confirmLoading"
                        @click="handleEdit(currentEditBase)"
                        >确认</a-button
                    >
                </a-col>
            </a-row>
        </template>
        <a-form
            :model="currentEditBase"
            name="basic"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            autocomplete="off"
        >
            <a-form-item
                label="名称"
                name="name"
                :rules="[{ required: true, message: '请输入名称' }]"
                style="margin-bottom: 4px"
            >
                <a-input
                    v-model:value="currentEditBase.name"
                    placeholder="数据源名称，仅做显示使用"
                />
            </a-form-item>

            <a-form-item
                label="Key"
                name="Key"
                :rules="[{ required: true, message: '请输入Key' }]"
                style="margin-bottom: 4px"
            >
                <a-input
                    v-model:value="currentEditBase.key"
                    placeholder="数据源key，后续代码使用"
                />
            </a-form-item>

            <a-form-item
                label="URL"
                name="URL"
                :rules="[{ required: true, message: '请输入URL' }]"
                style="margin-bottom: 4px"
            >
                <a-input
                    v-model:value="currentEditBase.url"
                    placeholder="请输入jdbcURL，如: jdbc:mysql://localhost/dbname"
                />
            </a-form-item>

            <a-form-item
                label="用户名"
                name="username"
                :rules="[{ required: true, message: '请输入username' }]"
                style="margin-bottom: 4px"
            >
                <a-input
                    v-model:value="currentEditBase.username"
                    placeholder="请输入数据库用户名"
                />
            </a-form-item>

            <a-form-item
                label="密码"
                name="password"
                :rules="[{ required: true, message: '请输入密码' }]"
                style="margin-bottom: 4px"
            >
                <a-input-password
                    v-model:value="currentEditBase.password"
                    placeholder="请输入数据库密码"
                />
            </a-form-item>

            <a-form-item
                label="驱动类"
                name="driverClassName"
                :rules="[{ required: false, message: '请输入驱动类' }]"
                style="margin-bottom: 4px"
            >
                <a-select
                    v-model:value="currentEditBase.driverClassName"
                    placeholder="驱动类，可选，内部自动识别，也可以手动输入指定"
                >
                    <a-select-option value="com.mysql.jdbc.Driver"
                        >com.mysql.jdbc.Driver</a-select-option
                    >
                    <a-select-option value="com.mysql.cj.jdbc.Driver"
                        >com.mysql.cj.jdbc.Driver</a-select-option
                    >
                    <a-select-option value="oracle.jdbc.driver.OracleDriver"
                        >oracle.jdbc.driver.OracleDriver</a-select-option
                    >
                    <a-select-option value="org.postgresql.Driver"
                        >org.postgresql.Driver</a-select-option
                    >
                    <a-select-option
                        value="com.microsoft.sqlserver.jdbc.SQLServerDriver"
                        >com.microsoft.sqlserver.jdbc.SQLServerDriver</a-select-option
                    >
                    <a-select-option value="com.ibm.db2.jcc.DB2Driver"
                        >com.ibm.db2.jcc.DB2Driver</a-select-option
                    >
                </a-select>
            </a-form-item>

            <a-form-item
                label="数据库连接池"
                name="type"
                :rules="[
                    { required: false, message: '请输入数据库连接池类型' },
                ]"
                style="margin-bottom: 4px"
            >
                <a-select
                    v-model:value="currentEditBase.type"
                    placeholder="连接池烈性，可选，也可以手动输入指定"
                >
                    <a-select-option value="com.zaxxer.hikari.HikariDataSource"
                        >com.zaxxer.hikari.HikariDataSource</a-select-option
                    >
                    <a-select-option
                        value="com.alibaba.druid.pool.DruidDataSource"
                        >com.alibaba.druid.pool.DruidDataSource</a-select-option
                    >
                    <a-select-option
                        value="org.apache.tomcat.jdbc.pool.DataSource"
                        >org.apache.tomcat.jdbc.pool.DataSource</a-select-option
                    >
                    <a-select-option
                        value="org.apache.commons.dbcp2.BasicDataSource"
                        >org.apache.commons.dbcp2.BasicDataSource</a-select-option
                    >
                </a-select>
            </a-form-item>

            <a-form-item
                label="maxRows"
                name="maxRows"
                :rules="[{ required: true, message: '请输入maxRows' }]"
                style="margin-bottom: 4px"
            >
                <a-input
                    v-model:value="currentEditBase.maxRows"
                    placeholder="最多返回条数，-1为不限制"
                />
            </a-form-item>

            <a-form-item
                label="其它配置"
                name="properties"
                :rules="[{ required: true, message: '请输入properties' }]"
                style="margin-bottom: 4px"
            >
                <JsonEditorVue
                    class="editor"
                    v-model="currentEditBase.properties"
                />
            </a-form-item>
        </a-form>
    </a-modal>
    <a-modal
        v-model:visible="isSettingModalVisable"
        title="编辑数据库"
        style="width: 600px"
    >
        <template #footer>
            <a-row>
                <a-col :span="4">
                    <a-button
                        type="default"
                        :disabled="confirmLoading"
                        @click="jdbcTest(currentEditBase)"
                        >测试连接</a-button
                    >
                </a-col>
                <a-col :span="20">
                    <a-button
                        type="danger"
                        :disabled="confirmLoading"
                        @click="isSettingModalVisable = false"
                        >取消</a-button
                    >
                    <a-button
                        type="primary"
                        :loading="confirmLoading"
                        @click="handleEdit(currentEditBase)"
                        >确认</a-button
                    >
                </a-col>
            </a-row>
        </template>
        <a-form
            :model="currentEditBase"
            name="basic"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            autocomplete="off"
        >
            <a-form-item
                label="名称"
                name="name"
                :rules="[{ required: true, message: '请输入名称' }]"
                style="margin-bottom: 4px"
            >
                <a-input
                    v-model:value="currentEditBase.name"
                    placeholder="数据源名称，仅做显示使用"
                />
            </a-form-item>

            <a-form-item
                label="Key"
                name="Key"
                :rules="[{ required: true, message: '请输入Key' }]"
                style="margin-bottom: 4px"
            >
                <a-input
                    v-model:value="currentEditBase.key"
                    placeholder="数据源key，后续代码使用"
                />
            </a-form-item>

            <a-form-item
                label="URL"
                name="URL"
                :rules="[{ required: true, message: '请输入URL' }]"
                style="margin-bottom: 4px"
            >
                <a-input
                    v-model:value="currentEditBase.url"
                    placeholder="请输入jdbcURL，如: jdbc:mysql://localhost/dbname"
                />
            </a-form-item>

            <a-form-item
                label="用户名"
                name="username"
                :rules="[{ required: true, message: '请输入username' }]"
                style="margin-bottom: 4px"
            >
                <a-input
                    v-model:value="currentEditBase.username"
                    placeholder="请输入数据库用户名"
                />
            </a-form-item>

            <a-form-item
                label="密码"
                name="password"
                :rules="[{ required: true, message: '请输入密码' }]"
                style="margin-bottom: 4px"
            >
                <a-input-password
                    v-model:value="currentEditBase.password"
                    placeholder="请输入数据库密码"
                />
            </a-form-item>

            <a-form-item
                label="驱动类"
                name="driverClassName"
                :rules="[{ required: false, message: '请输入驱动类' }]"
                style="margin-bottom: 4px"
            >
                <a-select
                    v-model:value="currentEditBase.driverClassName"
                    placeholder="驱动类，可选，内部自动识别，也可以手动输入指定"
                >
                    <a-select-option value="com.mysql.jdbc.Driver"
                        >com.mysql.jdbc.Driver</a-select-option
                    >
                    <a-select-option value="com.mysql.cj.jdbc.Driver"
                        >com.mysql.cj.jdbc.Driver</a-select-option
                    >
                    <a-select-option value="oracle.jdbc.driver.OracleDriver"
                        >oracle.jdbc.driver.OracleDriver</a-select-option
                    >
                    <a-select-option value="org.postgresql.Driver"
                        >org.postgresql.Driver</a-select-option
                    >
                    <a-select-option
                        value="com.microsoft.sqlserver.jdbc.SQLServerDriver"
                        >com.microsoft.sqlserver.jdbc.SQLServerDriver</a-select-option
                    >
                    <a-select-option value="com.ibm.db2.jcc.DB2Driver"
                        >com.ibm.db2.jcc.DB2Driver</a-select-option
                    >
                </a-select>
            </a-form-item>

            <a-form-item
                label="数据库连接池"
                name="type"
                :rules="[
                    { required: false, message: '请输入数据库连接池类型' },
                ]"
                style="margin-bottom: 4px"
            >
                <a-select
                    v-model:value="currentEditBase.type"
                    placeholder="连接池烈性，可选，也可以手动输入指定"
                >
                    <a-select-option value="com.zaxxer.hikari.HikariDataSource"
                        >com.zaxxer.hikari.HikariDataSource</a-select-option
                    >
                    <a-select-option
                        value="com.alibaba.druid.pool.DruidDataSource"
                        >com.alibaba.druid.pool.DruidDataSource</a-select-option
                    >
                    <a-select-option
                        value="org.apache.tomcat.jdbc.pool.DataSource"
                        >org.apache.tomcat.jdbc.pool.DataSource</a-select-option
                    >
                    <a-select-option
                        value="org.apache.commons.dbcp2.BasicDataSource"
                        >org.apache.commons.dbcp2.BasicDataSource</a-select-option
                    >
                </a-select>
            </a-form-item>

            <a-form-item
                label="maxRows"
                name="maxRows"
                :rules="[{ required: true, message: '请输入maxRows' }]"
                style="margin-bottom: 4px"
            >
                <a-input
                    v-model:value="currentEditBase.maxRows"
                    placeholder="最多返回条数，-1为不限制"
                />
            </a-form-item>

            <a-form-item
                label="其它配置"
                name="properties"
                :rules="[{ required: true, message: '请输入properties' }]"
                style="margin-bottom: 4px"
            >
                <JsonEditorVue
                    class="editor"
                    v-model="currentEditBase.properties"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from "qs";
import { SettingOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import JsonEditorVue from "json-editor-vue3";
import treedata from "../../../assets/treedata.json";
import ApiService from "../../../util/api";
import { notification } from "ant-design-vue";

export default defineComponent({
    components: {
        SettingOutlined,
        DeleteOutlined,
        JsonEditorVue,
    },
    setup() {
        const database = ref(treedata.data.datasource.children[0].children);
        const isSettingModalVisable = ref(false);
        const currentEditBase = ref({});
        const confirmLoading = ref(false);
        const isAddModalVisable = ref(false);

        const showSettingModal = (base) => {
            const tempObecjt = {};
            Object.assign(tempObecjt, base.node);
            isSettingModalVisable.value = true;
            currentEditBase.value = tempObecjt;
        };

        const showAddModal = () => {
            isAddModalVisable.value = true;
            currentEditBase.value = {};
        };

        const handleEdit = (base) => {
            confirmLoading.value = true;
            //进行修改
            ApiService.jdbcTest(base).then((testRes) => {
                if (testRes.data.data === "ok") {
                    ApiService.saveJdbc(base).then((res) => {
                        notification["info"]({
                            message: "修改成功",
                            description: res.data.data,
                            duration: 2,
                        });
                    });
                } else {
                    notification["error"]({
                        message: "修改失败",
                        description: testRes.data.data,
                        duration: 2,
                    });
                }
            });
            isSettingModalVisable.value = false;
            isAddModalVisable.value = false;
            confirmLoading.value = false;
        };

        const jdbcTest = (base) => {
            ApiService.jdbcTest(base).then((res) => {
                console.log(res);
                if (res.data.data === "ok") {
                    notification["success"]({
                        message: "连接成功",
                        description: "URL：" + base.url + "连接成功",
                        duration: 2,
                    });
                } else {
                    notification["error"]({
                        message: "连接失败",
                        description: res.data.data,
                        duration: 2,
                    });
                }
            });
        };

        const handleDeleteBase = (base) => {
            ApiService.deleteJdbc(qs.stringify({ id: base.node.id })).then(
                (res) => {
                    if (res.data.data === true) {
                        notification["success"]({
                            message: "删除",
                            description: "ID: " + base.node.id,
                            duration: 2,
                        });
                    } else {
                        notification["error"]({
                            message: "删除失败",
                            description: res.data.data,
                            duration: 2,
                        });
                    }
                }
            );
        };

        const databaseImage = (base) => {
            console.log(base);
            return base.node.driverClassName === null ||
                base.node.driverClassName === undefined ||
                base.node.driverClassName.includes("mysql")
                ? "../image/mysql.png"
                : base.node.driverClassName.includes("oracle")
                ? "../image/oracle.png"
                : base.node.driverClassName.includes("post")
                ? "../image/postgreSQL.png"
                : base.node.driverClassName.includes("microsoft")
                ? "../image/sqlserver.png"
                : "../image/ibm.png";
        };

        return {
            isSettingModalVisable,
            database,
            currentEditBase,
            confirmLoading,
            isAddModalVisable,
            showSettingModal,
            showAddModal,
            handleEdit,
            jdbcTest,
            databaseImage,
            handleDeleteBase,
        };
    },
});
</script>

<style></style>
