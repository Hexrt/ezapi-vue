<template>
    <a-row>
        <a-col :span="4">
            <a-tree
                v-model:expandedKeys="expandedKeys"
                v-model:selectedKeys="selectedKeys"
                show-line
                :tree-data="treeData"
                @select="handleTreeNodeSelect"
                style="margin-top: 36px"
            >
                <template #icon><SmileTwoTone /></template>
                <template #title="{ node }">
                    <a-tag color="#61affe" v-if="node.method === 'GET'"
                        >GET</a-tag
                    >
                    <a-tag color="#9012fe" v-if="node.method === 'HEAD'"
                        >HEAD</a-tag
                    >
                    <a-tag color="#49cc90" v-if="node.method === 'POST'"
                        >POST</a-tag
                    >
                    <a-tag color="#fca130" v-if="node.method === 'PUT'"
                        >PUT</a-tag
                    >
                    <a-tag color="#f93e3e" v-if="node.method === 'DELETE'"
                        >DELETE</a-tag
                    >
                    <a-tag color="#0d5aa7" v-if="node.method === 'OPTIONS'"
                        >OPTIONS</a-tag
                    >
                    <a-tag color="#50e3c2" v-if="node.method === 'PATH'"
                        >PATH</a-tag
                    >
                    {{ node.name }}
                </template>
            </a-tree>
        </a-col>
        <a-col :span="20">
            <a-menu v-model:selectedKeys="currentTab" mode="horizontal">
                <a-menu-item key="list">
                    <template #icon>
                        <mail-outlined />
                    </template>
                    当前目录
                </a-menu-item>
                <a-menu-item key="api-info" :disabled="null === currentApi">
                    <template #icon>
                        <appstore-outlined />
                    </template>
                    当前接口信息
                </a-menu-item>
            </a-menu>

            <template v-if="currentTab.includes('list')">
                <a-row style="margin: 12px 0px">
                    <a-col :span="16" />
                    <a-col :span="3"
                        ><a-button
                            style="background-color: #ffcc3f"
                            @click="showFolderAddModal"
                        >
                            <template #icon><FolderAddOutlined /></template>
                            新建目录
                        </a-button>
                        <a-modal
                            v-model:visible="isFolderAddModalVisable"
                            title="创建分组"
                            @ok="handleCreateFolder"
                        >
                            <a-row>
                                <a-col :span="4">分组名称</a-col>
                                <a-col :span="20"
                                    ><a-input
                                        v-model:value="currentAddFolder.name"
                                        placeholder="请输入分组的名称"
                                    ></a-input
                                ></a-col>
                                <a-col :span="4">分组路径</a-col>
                                <a-col :span="20"
                                    ><a-input
                                        addon-before="注意：以 / 开头"
                                        v-model:value="currentAddFolder.path"
                                        placeholder="请输入分组的路径（用作路由）"
                                    ></a-input
                                ></a-col>
                            </a-row>
                        </a-modal>
                    </a-col>
                    <a-col :span="3">
                        <a-button style="background-color: #49cc90">
                            <template #icon
                                ><ExperimentOutlined @click="handleCreateApi"
                            /></template>
                            新建接口
                        </a-button>
                    </a-col>
                    <a-col :span="2" />
                </a-row>
                <a-table
                    :data-source="currentList"
                    :columns="columns"
                    style="min-height: 720px; height: 100%"
                >
                    <template
                        #customFilterDropdown="{
                            setSelectedKeys,
                            selectedKeys,
                            confirm,
                            clearFilters,
                            column,
                        }"
                    >
                        <div style="padding: 8px">
                            <a-input
                                ref="searchInput"
                                :placeholder="`Search ${column.dataIndex}`"
                                :value="selectedKeys[0]"
                                style="
                                    width: 188px;
                                    margin-bottom: 8px;
                                    display: block;
                                "
                                @change="
                                    (e) =>
                                        setSelectedKeys(
                                            e.target.value
                                                ? [e.target.value]
                                                : []
                                        )
                                "
                                @pressEnter="
                                    handleSearch(
                                        selectedKeys,
                                        confirm,
                                        column.dataIndex
                                    )
                                "
                            />
                            <a-button
                                type="primary"
                                size="small"
                                style="width: 90px; margin-right: 8px"
                                @click="
                                    handleSearch(
                                        selectedKeys,
                                        confirm,
                                        column.dataIndex
                                    )
                                "
                            >
                                <template #icon><SearchOutlined /></template>
                                Search
                            </a-button>
                            <a-button
                                size="small"
                                style="width: 90px"
                                @click="handleReset(clearFilters)"
                            >
                                Reset
                            </a-button>
                        </div>
                    </template>
                    <template #customFilterIcon="{ filtered }">
                        <search-outlined
                            :style="{ color: filtered ? '#108ee9' : undefined }"
                        />
                    </template>
                    <template #bodyCell="{ text, column, record }">
                        <template v-if="column.dataIndex == 'method'">
                            <a-tag
                                color="#61affe"
                                v-if="record.method === 'GET'"
                                >GET</a-tag
                            >
                            <a-tag
                                color="#9012fe"
                                v-if="record.method === 'HEAD'"
                                >HEAD</a-tag
                            >
                            <a-tag
                                color="#49cc90"
                                v-if="record.method === 'POST'"
                                >POST</a-tag
                            >
                            <a-tag
                                color="#fca130"
                                v-if="record.method === 'PUT'"
                                >PUT</a-tag
                            >
                            <a-tag
                                color="#f93e3e"
                                v-if="record.method === 'DELETE'"
                                >DELETE</a-tag
                            >
                            <a-tag
                                color="#0d5aa7"
                                v-if="record.method === 'OPTIONS'"
                                >OPTIONS</a-tag
                            >
                            <a-tag
                                color="#50e3c2"
                                v-if="record.method === 'PATH'"
                                >PATH</a-tag
                            >
                        </template>
                        <template v-if="column.dataIndex == 'path'">
                            <a>{{ getFullPath(record.id) }}</a>
                        </template>
                        <span
                            v-if="
                                searchText &&
                                searchedColumn === column.dataIndex
                            "
                        >
                            <template
                                v-for="(fragment, i) in text
                                    .toString()
                                    .split(
                                        new RegExp(
                                            `(?<=${searchText})|(?=${searchText})`,
                                            'i'
                                        )
                                    )"
                            >
                                <mark
                                    v-if="
                                        fragment.toLowerCase() ===
                                        searchText.toLowerCase()
                                    "
                                    :key="i"
                                    class="highlight"
                                >
                                    {{ fragment }}
                                </mark>
                                <template v-else>{{ fragment }}</template>
                            </template>
                        </span>
                        <template v-if="column.dataIndex === 'operation'">
                            <a-popover>
                                <template #content> 查看 </template>
                                <a-button
                                    type="primary"
                                    ghost
                                    shape="circle"
                                    style="margin-right: 4px"
                                    @click="onViewApi(record)"
                                >
                                    <template #icon><EyeOutlined /></template>
                                </a-button>
                            </a-popover>
                            <a-popover>
                                <template #content> 编辑 </template>
                                <a-button
                                    type="primary"
                                    ghost
                                    shape="circle"
                                    style="margin-right: 4px"
                                    @click="onEditApi(record)"
                                >
                                    <template #icon><EditOutlined /></template>
                                </a-button>
                            </a-popover>
                            <a-popconfirm
                                v-if="currentList.length"
                                title="确定要删除吗?"
                                shape="circle"
                                @confirm="onDeleteApi(record)"
                            >
                                <a-button type="danger" ghost>
                                    <template #icon
                                        ><DeleteOutlined
                                    /></template>
                                </a-button>
                            </a-popconfirm>
                        </template>
                    </template>
                </a-table>
            </template>

            <a-descriptions
                layout="vertical"
                bordered
                v-if="currentTab.includes('api-info')"
            >
                <a-descriptions-item label="名称">
                    <h3>{{ currentApi.name }}</h3>
                </a-descriptions-item>
                <a-descriptions-item label="调用方式">
                    <a-tag color="#61affe" v-if="currentApi.method === 'GET'"
                        >GET</a-tag
                    >
                    <a-tag color="#9012fe" v-if="currentApi.method === 'HEAD'"
                        >HEAD</a-tag
                    >
                    <a-tag color="#49cc90" v-if="currentApi.method === 'POST'"
                        >POST</a-tag
                    >
                    <a-tag color="#fca130" v-if="currentApi.method === 'PUT'"
                        >PUT</a-tag
                    >
                    <a-tag color="#f93e3e" v-if="currentApi.method === 'DELETE'"
                        >DELETE</a-tag
                    >
                    <a-tag
                        color="#0d5aa7"
                        v-if="currentApi.method === 'OPTIONS'"
                        >OPTIONS</a-tag
                    >
                    <a-tag color="#50e3c2" v-if="currentApi.method === 'PATH'"
                        >PATH</a-tag
                    >
                </a-descriptions-item>
                <a-descriptions-item label="Path"
                    ><a>{{
                        getFullPath(currentApi.id)
                    }}</a></a-descriptions-item
                >
                <a-descriptions-item label="所属目录">
                    {{ getFullParent(currentApi.groupId) }}
                </a-descriptions-item>
                <a-descriptions-item label="创建时间">{{
                    currentApi.createTime
                }}</a-descriptions-item>
                <a-descriptions-item label="更新时间">{{
                    currentApi.updateTime
                }}</a-descriptions-item>
                <a-descriptions-item
                    label="请求参数"
                    :span="3"
                    style="max-height: 300px"
                >
                    <a-table
                        :dataSource="currentApi.parameters"
                        :columns="params_columns"
                        disabled="true"
                    >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'required'">
                                <a-switch v-model:checked="record.required" />
                            </template>
                            <template v-if="column.dataIndex === 'name'">
                                <a-tag>{{ record.name }}</a-tag>
                            </template>
                            <template v-if="column.dataIndex === 'value'">
                                <a-input v-model:value="record.value" />
                            </template>
                            <template v-if="column.dataIndex === 'dataType'">
                                <a-select
                                    v-model:value="record.dataType"
                                    style="min-width: 80px"
                                >
                                    <a-select-option value="String"
                                        >String</a-select-option
                                    >
                                    <a-select-option value="Boolean"
                                        >Boolean</a-select-option
                                    >
                                    <a-select-option value="Integer"
                                        >Integer</a-select-option
                                    >
                                    <a-select-option value="Date"
                                        >Date</a-select-option
                                    >
                                    <a-select-option value="Double"
                                        >Double</a-select-option
                                    >
                                    <a-select-option value="Long"
                                        >Long</a-select-option
                                    >
                                    <a-select-option value="Short"
                                        >Short</a-select-option
                                    >
                                    <a-select-option value="Float"
                                        >Float</a-select-option
                                    >
                                    <a-select-option value="Byte"
                                        >Byte</a-select-option
                                    >
                                    <a-select-option value="MultipartFile"
                                        >MultipartFile</a-select-option
                                    >
                                    <a-select-option value="MultipartFiles"
                                        >MultipartFiles</a-select-option
                                    >
                                </a-select>
                            </template>
                            <template
                                v-if="column.dataIndex === 'defaultValue'"
                            >
                                <a-input v-model:value="record.defaultValue" />
                            </template>
                            <template
                                v-if="column.dataIndex === 'validateType'"
                            >
                                <a-select
                                    v-model:value="record.validateType"
                                    style="min-width: 80px"
                                >
                                    <a-select-option value=""
                                        >不验证</a-select-option
                                    >
                                    <a-select-option value="expression"
                                        >表达式验证</a-select-option
                                    >
                                    <a-select-option value="pattern"
                                        >正则验证</a-select-option
                                    >
                                </a-select>
                            </template>
                            <template v-if="column.dataIndex === 'expression'">
                                <a-input v-model:value="record.expression" />
                            </template>
                            <template v-if="column.dataIndex === 'error'">
                                <a-input v-model:value="record.error" />
                            </template>
                            <template v-if="column.dataIndex === 'description'">
                                <a-input v-model:value="record.description" />
                            </template>
                        </template>
                    </a-table>
                </a-descriptions-item>
                <a-descriptions-item label="请求体" :span="3">
                    <JsonEditorVue
                        currentMode="code"
                        :options="{ onEditable: false }"
                        v-model="currentApi.requestBodyObject"
                    />
                </a-descriptions-item>
            </a-descriptions>
        </a-col>
    </a-row>
</template>

<script>
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    FolderAddOutlined,
    ExperimentOutlined,
    SmileTwoTone,
} from "@ant-design/icons-vue";
import { defineComponent, reactive, ref, toRefs } from "vue";
import ApiService from "../../../util/api";
import { notification } from "ant-design-vue";
import JsonEditorVue from "json-editor-vue3";

export default defineComponent({
    components: {
        SearchOutlined,
        EyeOutlined,
        EditOutlined,
        DeleteOutlined,
        FolderAddOutlined,
        ExperimentOutlined,
        SmileTwoTone,
        JsonEditorVue,
    },
    setup() {
        const expandedKeys = ref(["0-0"]);
        const selectedKeys = ref([]);
        const treeData = ref([]);
        const currentTab = ref(["list"]);
        const currentList = ref([]);
        const currentApi = ref(null);
        const currentFolder = ref({ node: { id: "0" } });
        const searchState = reactive({
            searchText: "",
            searchedColumn: "",
        });
        const searchInput = ref();

        const columns = [
            {
                title: "方式",
                dataIndex: "method",
                key: "method",
            },
            {
                title: "名称",
                dataIndex: "name",
                key: "name",
                customFilterDropdown: true,
                onFilter: (value, record) =>
                    record.name
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        setTimeout(() => {
                            searchInput.value.focus();
                        }, 100);
                    }
                },
            },
            {
                title: "id",
                dataIndex: "id",
                key: "id",
                customFilterDropdown: true,
                onFilter: (value, record) =>
                    record.id
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        setTimeout(() => {
                            searchInput.value.focus();
                        }, 100);
                    }
                },
            },
            {
                title: "path",
                dataIndex: "path",
                key: "path",
                customFilterDropdown: true,
                onFilter: (value, record) =>
                    record.path
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        setTimeout(() => {
                            searchInput.value.focus();
                        }, 100);
                    }
                },
            },
            {
                title: "更新时间",
                dataIndex: "updateTime",
                key: "updateTime",
            },
            {
                title: "创建时间",
                dataIndex: "createTime",
                key: "createTime",
            },
            {
                title: "操作",
                dataIndex: "operation",
            },
        ];

        const params_columns = ref([
            {
                title: "必填",
                dataIndex: "required",
                key: "required",
            },
            {
                title: "name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "value",
                dataIndex: "value",
                key: "value",
            },
            {
                title: "数据类型",
                dataIndex: "dataType",
                key: "dataType",
            },
            {
                title: "默认值",
                dataIndex: "defaultValue",
                key: "defaultValue",
            },
            {
                title: "验证方式",
                dataIndex: "validateType",
                key: "validateType",
            },
            {
                title: "表达式或者正则表达式",
                dataIndex: "expression",
                key: "expression",
            },
            {
                title: "验证说明",
                dataIndex: "error",
                key: "error",
            },
            {
                title: "参数描述",
                dataIndex: "description",
                key: "description",
            },
        ]);

        const handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            searchState.searchText = selectedKeys[0];
            searchState.searchedColumn = dataIndex;
        };
        const handleReset = (clearFilters) => {
            clearFilters({
                confirm: true,
            });
            searchState.searchText = "";
        };

        const unescapedJsonString = (str) => {
            if (undefined === str || null === str || "" === str) {
                return {};
            }
            let object = eval("(" + str + ")");
            return object;
        };

        const handleTreeNodeSelect = (selectedKeys, event) => {
            console.log(event);
            const currentNode = event.node;
            let groupId = "";
            // 当前选中的为目录
            if (currentNode.node.parentId !== undefined) {
                groupId = currentNode.node.id;
                currentApi.value = null;
                currentTab.value = ["list"];
            } else {
                groupId = currentNode.node.groupId;
                currentApi.value = currentNode.node;
                currentNode.node.requestBodyObject = unescapedJsonString(
                    currentNode.node.requestBody
                );
                currentTab.value = ["api-info"];
            }

            currentFolder.value = findNode(groupId);
            // 进行更行
            currentList.value = [];
            getApiInFolder(treeData.value[0], groupId, currentList.value);
            console.log(currentList, currentApi);
        };

        const getApiInFolder = (current, id, list, ok = false) => {
            if (current.node.id === id) {
                ok = true;
            }
            for (const child of current.children) {
                if (child.node.parentId !== undefined) {
                    getApiInFolder(child, id, list, ok);
                } else if (ok) {
                    list.push(child.node);
                }
            }
        };

        const onViewApi = (record) => {
            currentApi.value = record;
            record.requestBodyObject = unescapedJsonString(record.requestBody);
            console.log(currentApi);
            currentTab.value = ["api-info"];
            console.log(record.id)
            console.log(getTreeKey(record.id));
            expandNode(getTreeKey(record.id));
        };

        const onEditApi = (record) => {
            expandNode(getTreeKey(record.id));
        };

        const onDeleteApi = (record) => {
            console.log(record);
        };

        const findNode = (id, current = treeData.value[0]) => {
            if (id === current.node.id) {
                return current;
            }

            for (const child of current.children) {
                const find = findNode(id, child);
                if (null != find) {
                    return find;
                }
            }

            return null;
        };

        const getFullParent = (id) => {
            let folder = "";
            let current = findNode(id);
            while (null != current) {
                folder =
                    current.node.name + (folder != "" ? "\\" : "") + folder;
                let parentId = current.node.groupId || current.node.parentId;
                current = findNode(parentId);
            }
            return folder;
        };

        const getFullPath = (id) => {
            console.log(id);
            let path = "";
            let current = findNode(id);
            while (current && current.node.id != "0") {
                path = current.node.path + path;
                let parentId = current.node.groupId || current.node.parentId;
                current = findNode(parentId);
            }
            return path;
        };

        const getTreeKey = (id) => {
            let key = "";
            let current = findNode(id);
            while (null != current) {
                let parentId = current.node.groupId || current.node.parentId;
                const parent = findNode(parentId);
                if (null != parent) {
                    key =
                        parent.children.indexOf(current) +
                        (key == "" ? "" : "-") +
                        key;
                }
                current = parent;
            }
            return `0-0-${key}`;
        };

        const currentAddFolder = ref({ name: "", path: "" });
        const isFolderAddModalVisable = ref(false);
        const showFolderAddModal = () => {
            isFolderAddModalVisable.value = true;
        };

        const handleCreateFolder = () => {
            ApiService.saveFolder({
                parentId: currentFolder.value.node.id,
                type: "api",
                name: currentAddFolder.value.name,
                path: currentAddFolder.value.path,
            }).then((res) => {
                if (res.data.data !== null) {
                    notification["success"]({
                        message: "创建成功",
                        description: "ID: " + res.data.data,
                        duration: 2,
                    });
                    isFolderAddModalVisable.value = false;
                } else {
                    notification["error"]({
                        message: "创建失败",
                        description: res.data.message,
                        duration: 2,
                    });
                }
            });
        };

        // 执行初始化
        ApiService.treeApi().then((res) => {
            treeData.value = [res.data.data.api];
            getApiInFolder(treeData.value[0], "0", currentList.value);
        });
        const expandNode = (id) => {
            expandedKeys.value = [];
            const ids = id.split("-");
            let key = "";
            for (const i of ids) {
                key = key + (key == "" ? "" : "-") + i;
                expandedKeys.value.push(key);
            }
            console.log(expandedKeys);
        };

        return {
            expandedKeys,
            selectedKeys,
            treeData,
            currentTab,
            currentList,
            currentApi,
            columns,
            searchInput,
            params_columns,
            isFolderAddModalVisable,
            currentAddFolder,
            currentFolder,
            ...toRefs(searchState),
            handleTreeNodeSelect,
            handleSearch,
            handleReset,
            onDeleteApi,
            onViewApi,
            onEditApi,
            getFullPath,
            getFullParent,
            getTreeKey,
            showFolderAddModal,
            handleCreateFolder,
        };
    },
});
</script>

<style>
.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}
</style>
