<template>
    <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-sider width="300" style="background: #fff">
            <a-row style="width: 95%; margin: 2%">
                <a-col :span="6"
                    ><a-tag color="pink" class="full-inline"
                        >接口名称</a-tag
                    ></a-col
                >
                <a-col :span="18"
                    ><a-input
                        v-model:value="formState.name"
                        placeholder="请输入名称"
                        required="true"
                /></a-col>
            </a-row>
            <a-row style="width: 95%; margin: 2%">
                <a-col :span="8">
                    <a-select
                        v-model:value="formState.method"
                        class="full-inline"
                    >
                        <a-select-option value="GET">GET</a-select-option>
                        <a-select-option value="POST">POST</a-select-option>
                        <a-select-option value="PUT">PUT</a-select-option>
                        <a-select-option value="DELETE">DELETE</a-select-option>
                        <a-select-option value="HEAD">HEAD</a-select-option>
                        <a-select-option value="PATH">PATCH</a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="16">
                    <a-input
                        v-model:value="formState.path"
                        placeholder="输入Path 如 '/api/user' "
                    />
                </a-col>
            </a-row>
            <a-row style="width: 95%; margin: 2%">
                <a-col :span="6"
                    ><a-tag color="yellow" class="full-inline"
                        >所属目录</a-tag
                    ></a-col
                >
                <a-col :span="18"
                    ><a-input
                        v-model:value="formState.groupId"
                        placeholder="请输入所在目录id"
                        required="true"
                /></a-col>
            </a-row>
            <a-row
                style="min-height: 150px; max-height: 300px; overflow-y: auto"
            >
                <a-col :span="24">
                    <a-card title="请求参数" style="margin: 10px; width: 95%">
                        <template #extra
                            ><a-button type="primary" @click="showParamsModal"
                                >调整</a-button
                            ></template
                        >
                        <p
                            v-for="param in formState.parameters"
                            v-bind:key="param.name"
                        >
                            {{ param.name }} : {{ param.name }}
                        </p>
                        <a-empty v-if="formState.parameters.length == 0" />
                    </a-card>
                </a-col>
                <a-modal
                    v-model:visible="paramsModalVisible"
                    title="请求参数"
                    width="100%"
                    wrap-class-name="full-modal"
                    @ok="handleParamsOk"
                >
                    <a-button
                        style="margin-bottom: 8px"
                        @click="showParamsAddModal"
                        >新增参数</a-button
                    >

                    <a-modal
                        v-model:visible="paramsAddModalVisible"
                        title="提供关键参数"
                        :confirm-loading="confirmLoading"
                        @ok="handleParamsAdd"
                    >
                        <a-row>
                            <a-col :span="6"
                                ><a-tag color="green" class="full-inline"
                                    >参数key(key)</a-tag
                                ></a-col
                            >
                            <a-col :span="18"
                                ><a-input
                                    v-model:value="paramsAddTempObject.name"
                            /></a-col>
                        </a-row>
                    </a-modal>

                    <a-table
                        :dataSource="formState.parameters"
                        :columns="params_columns"
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
                </a-modal>
            </a-row>
            <a-row
                style="
                    min-height: 150px;
                    max-height: 300px;
                    overflow-y: auto;
                    overflow-x: auto;
                "
            >
                <a-col :span="24">
                    <a-card
                        title="请求体(格式)"
                        style="margin: 10px; width: 95%"
                    >
                        <template #extra
                            ><a-button
                                type="primary"
                                @click="showRequestBodyModal"
                                >格式</a-button
                            >
                        </template>

                        <a-textarea
                            placeholder="{x}"
                            :disabled="true"
                            :rows="7"
                            v-model:value="requestBodyJson"
                            v-if="requestBodyJson != 'null'"
                            style="
                                width: calc(100% + 24px);
                                margin: -12px;
                                max-width: none;
                                color: black;
                            "
                        />
                        <a-empty v-if="requestBodyJson == 'null'" />
                        <a-modal
                            v-model:visible="requestBodyModalVisible"
                            title="请求体"
                            width="40%"
                            height="40%"
                            @ok="handleRequestBodyOk"
                        >
                            <JsonEditorVue
                                class="editor"
                                v-model="formState.requestBodyObject"
                            />
                            <a-row>
                                <a-col :span="18" />
                                <a-col :span="6"
                                    ><a-button
                                        type="primary"
                                        @click="showRequestBodyDefinitionModal"
                                        >参数调整</a-button
                                    ></a-col
                                >
                            </a-row>
                            <a-modal
                                v-model:visible="
                                    requestBodyDefinitionModalVisible
                                "
                                title="请求体"
                                width="100%"
                                wrap-class-name="full-modal"
                                @ok="handleRequestBodyDefinitionOk"
                            >
                                <a-table
                                    :dataSource="
                                        null === formState.requestBodyDefinition
                                            ? []
                                            : formState.requestBodyDefinition
                                                  .children
                                    "
                                    :columns="params_columns"
                                    :rowExpandable="rowExpandable"
                                >
                                    <template #bodyCell="{ column, record }">
                                        <template
                                            v-if="
                                                column.dataIndex === 'required'
                                            "
                                        >
                                            <a-switch
                                                v-model:checked="
                                                    record.required
                                                "
                                            />
                                        </template>
                                        <template
                                            v-if="column.dataIndex === 'name'"
                                        >
                                            <a-tag>{{ record.name }}</a-tag>
                                        </template>
                                        <template
                                            v-if="column.dataIndex === 'value'"
                                        >
                                            <a-input
                                                v-model:value="record.value"
                                            />
                                        </template>
                                        <template
                                            v-if="
                                                column.dataIndex === 'dataType'
                                            "
                                        >
                                            <a-select
                                                v-model:value="record.dataType"
                                                style="min-width: 80px"
                                            >
                                                <a-select-option value="String"
                                                    >String</a-select-option
                                                >
                                                <a-select-option value="Object"
                                                    >Object</a-select-option
                                                >
                                                <a-select-option value="Array"
                                                    >Array</a-select-option
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
                                            </a-select>
                                        </template>
                                        <template
                                            v-if="
                                                column.dataIndex ===
                                                'defaultValue'
                                            "
                                        >
                                            <a-input
                                                v-model:value="
                                                    record.defaultValue
                                                "
                                            />
                                        </template>
                                        <template
                                            v-if="
                                                column.dataIndex ===
                                                'validateType'
                                            "
                                        >
                                            <a-select
                                                v-model:value="
                                                    record.validateType
                                                "
                                                style="min-width: 80px"
                                            >
                                                <a-select-option value=""
                                                    >不验证</a-select-option
                                                >
                                                <a-select-option
                                                    value="expression"
                                                    >表达式验证</a-select-option
                                                >
                                                <a-select-option value="pattern"
                                                    >正则验证</a-select-option
                                                >
                                            </a-select>
                                        </template>
                                        <template
                                            v-if="
                                                column.dataIndex ===
                                                'expression'
                                            "
                                        >
                                            <a-input
                                                v-model:value="
                                                    record.expression
                                                "
                                            />
                                        </template>
                                        <template
                                            v-if="column.dataIndex === 'error'"
                                        >
                                            <a-input
                                                v-model:value="record.error"
                                            />
                                        </template>
                                        <template
                                            v-if="
                                                column.dataIndex ===
                                                'description'
                                            "
                                        >
                                            <a-input
                                                v-model:value="
                                                    record.description
                                                "
                                            />
                                        </template>
                                    </template>
                                </a-table>
                            </a-modal>
                        </a-modal>
                    </a-card>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24">
                    <a-textarea
                        v-model:value="formState.description"
                        placeholder="接口描述"
                        allow-clear
                        style="width: 95%"
                    />
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="3" />
                <a-col :span="6"
                    ><a-button type="primary" @click="save"
                        >创建</a-button
                    ></a-col
                >
                <a-col :span="6" />
                <a-col :span="6"
                    ><a-button type="primary" @click="save"
                        >暂存</a-button
                    ></a-col
                >
                <a-col :span="3" />
            </a-row>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '720px' }"
            ><div id="blockly-container"></div>
        </a-layout-content>
    </a-layout>
</template>

<script>
import { defineComponent, ref, toRaw, unref } from "vue";
import Blockly from "blockly";
import { generator } from "../../blockly/generator";
import { toolbox } from "../../blockly/toolbox";
import { blocks } from "../../blockly/blocks";
import JsonEditorVue from "json-editor-vue3";
import * as Ch from "blockly/msg/zh-hans";
import ApiService from "../../util/api";
let workspace = undefined;
Blockly.setLocale(Ch);
Blockly.common.defineBlocks(blocks);
export default defineComponent({
    name: "blockly-editor",
    components: {
        JsonEditorVue,
    },
    setup() {
        const formState = ref({
            id: null,
            name: null,
            path: null,
            method: "GET",
            groupId: null,
            requestBodyObject: null,
            requestBody: null,
            requestBodyDefinition: null,
            description: "",
            script: null,
            parameters: [],
            headers: [],
            paths: [],
            options: [],
        });
        const paramObject = {
            required: false,
            name: "",
            value: "",
            dataType: "String",
            defaultValue: "",
            validateType: "",
            expression: "",
            error: "",
            description: "",
        };
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

        const paramsModalVisible = ref(false);
        const showParamsModal = () => {
            paramsModalVisible.value = true;
        };
        const handleParamsOk = () => {
            paramsModalVisible.value = false;
        };
        const handleParamsAdd = () => {
            const newParam = { ...paramsAddTempObject.value };
            formState.value.parameters.push(newParam);
            paramsAddModalVisible.value = false;
        };

        const paramsAddModalVisible = ref(false);
        const paramsAddTempObject = ref();
        const showParamsAddModal = () => {
            paramsAddTempObject.value = { ...paramObject };
            paramsAddModalVisible.value = true;
        };

        const requestBodyModalVisible = ref(false);
        const handleRequestBodyOk = () => {
            requestBodyModalVisible.value = false;
            updateRequestBodyDefinition();
            console.log(formState);
        };
        const showRequestBodyModal = () => {
            requestBodyModalVisible.value = true;
        };

        const requestBodyDefinitionModalVisible = ref(false);
        const showRequestBodyDefinitionModal = () => {
            updateRequestBodyDefinition();
            requestBodyDefinitionModalVisible.value = true;
        };

        const handleRequestBodyDefinitionOk = () => {
            requestBodyDefinitionModalVisible.value = false;
        };

        const save = () => {
            var code = generator.workspaceToCode(workspace);
            console.log(code);
            formState.value.script = code;
            let form = JSON.stringify(unref(formState), null, "\t");
            console.log(form);
            ApiService.saveApi(form);
        };

        const updateRequestBodyDefinition = () => {
            let form = unref(formState);
            let requestBody = form.requestBodyObject;
            let requestBodyDefinition = form.requestBodyDefinition;
            if (!isLogicNull(requestBody)) {
                // 初始化
                if (isLogicNull(requestBodyDefinition)) {
                    requestBodyDefinition = form.requestBodyDefinition = {
                        key: "root",
                        name: "",
                        value: "",
                        dataType: "Object",
                        validateType: "",
                        expression: "",
                        error: "",
                        description: "",
                        children: [],
                    };
                }
                solveUpdateRequestBodyDefinition(
                    requestBody,
                    requestBodyDefinition
                );
            } else {
                form.requestBodyDefinition = null;
            }
        };

        const solveUpdateRequestBodyDefinition = (body, definition) => {
            const type = typeOf(body);
            if (type === "Object" || type === "Array");
            else {
                return;
            }
            if (definition.children === null) {
                definition.children = [];
            }
            const newDefinitionChildren = [];
            // 找 definition 中有，body 中没有的属性
            if (type != "Array")
                for (const item of definition.children) {
                    if (isLogicNull(body[item.name])) {
                        continue;
                    }
                    newDefinitionChildren.push(item);
                }

            // 更新 children
            definition.children = newDefinitionChildren;

            // 找body中有，definition中没有的属性
            for (let key in body) {
                //todo 处理children有存在1的可能，与数组下标冲突
                let currentDefinition = definition.children.filter(
                    (item) => item.name === key
                )[0];
                // 新增 定义
                if (isLogicNull(currentDefinition)) {
                    // Array 需要进行特殊处理
                    const itemType = typeOf(body[key]);
                    currentDefinition = {
                        key: crypto.randomUUID(),
                        name: type === "Array" ? "" : key,
                        value:
                            itemType != "Array" && itemType != "Object"
                                ? body[key]
                                : "",
                        dataType: typeOf(body[key]),
                        validateType: "",
                        expression: "",
                        error: "",
                        description: "",
                        children: [],
                    };
                    definition.children.push(currentDefinition);
                }
                // 共同有的继续往下走
                solveUpdateRequestBodyDefinition(body[key], currentDefinition);
                // 如果是 Array 的话仅执行一次
                if (type === "Array") {
                    break;
                }
            }
        };

        const isLogicNull = (value) => {
            return undefined === value || null === value || "" === value;
        };

        const typeOf = (value) => {
            const typeStr = Object.prototype.toString.call(value);
            const startIndex = typeStr.indexOf(" ") + 1;
            const endIndex = typeStr.lastIndexOf("]");
            const type = typeStr.slice(startIndex, endIndex);
            if (type === "Number") {
                if (Number.isInteger(value)) {
                    return "Integer";
                } else {
                    return "Float";
                }
            }
            return type;
        };

        const rowExpandable = (record) => {
            console.log(record);
            if (isLogicNull(record.children) || record.children.length === 0) {
                return false; // 如果 children 为空数组，则不显示展开图标
            }
            return true;
        };

        return {
            formState,
            params_columns,
            paramsModalVisible,
            paramsAddModalVisible,
            paramsAddTempObject,
            requestBodyModalVisible,
            requestBodyDefinitionModalVisible,
            showParamsModal,
            handleParamsOk,
            handleParamsAdd,
            showParamsAddModal,
            handleRequestBodyOk,
            showRequestBodyModal,
            updateRequestBodyDefinition,
            save,
            showRequestBodyDefinitionModal,
            handleRequestBodyDefinitionOk,
            rowExpandable,
        };
    },
    mounted() {
        workspace = Blockly.inject("blockly-container", {
            toolbox: toolbox,
            comments: true,
            grid: { spacing: 20, length: 3, colour: "#ccc", snap: true },
            move: {
                scrollbars: true,
                drag: true,
                wheel: false,
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 1.75,
                minScale: 0.75,
                scaleSpeed: 1.03,
            },
            trashcan: true,
            media: 'http://localhost:10086/media/'
        });
    },
    computed: {
        requestBodyJson() {
            let code = JSON.stringify(
                unref(this.formState.requestBodyObject),
                null,
                "\t"
            );
            toRaw(this.formState).requestBody = code;
            return code;
        },
    },
    methods: {},
});
</script>

<style lang="less">
html,
body {
    margin: 0;
}
#blockly-container {
    min-width: 1080px;
    max-width: 100%;
    min-height: 720px;
    max-height: 100%;
    width: 1600px;
    height: 720px;
}
.ant-tag {
    line-height: 28px;
}

.full-inline {
    width: 100%;
    height: 100%;
}

.full-modal {
    .ant-modal {
        max-width: 100%;
        top: 0;
        padding-bottom: 0;
        margin: 0;
    }
    .ant-modal-content {
        display: flex;
        flex-direction: column;
        height: calc(100vh);
    }
    .ant-modal-body {
        flex: 1;
    }
}

.editable-cell {
    position: relative;
    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
        padding-right: 24px;
    }

    .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
        position: absolute;
        right: 0;
        width: 20px;
        cursor: pointer;
    }

    .editable-cell-icon {
        margin-top: 4px;
        display: none;
    }

    .editable-cell-icon-check {
        line-height: 28px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }

    .editable-add-btn {
        margin-bottom: 8px;
    }
}
.editable-cell:hover .editable-cell-icon {
    display: inline-block;
}
</style>
