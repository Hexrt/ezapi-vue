import { javascriptGenerator } from "blockly/javascript";
export const generator = javascriptGenerator;

//================ 解决普通 statement 和 json 的区别转化代码问题
generator.scrub_others = generator.scrub_;

generator.scrub_json = function(block, code, opt_thisOnly) {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();
    if (nextBlock && !opt_thisOnly) {
        return code + ",\n" + generator.blockToCode(nextBlock);
    }
    return code;
}

generator.scrub_ = function (block, code, opt_thisOnly) {
    console.log(block);
    if (block.type != 'member') {
        return this.scrub_others(block, code, opt_thisOnly);
    }
    return this.scrub_json(block, code, opt_thisOnly);
};

//============ member 的代码转化器
generator["member"] = function (block) {
    const name = block.getFieldValue("MEMBER_NAME");
    var value = generator.valueToCode(
        block,
        "MEMBER_VALUE",
        generator.ORDER_ATOMIC
    );
    if (isLogicNull(name)) {
        return "";
    }
    if (isLogicNull(value)) {
        value = null;
    }
    return `${name}: ${value}`;
};

//============ object 通常是 json 的转化器
generator["object"] = function (block) {
    const statementMembers = generator.statementToCode(
        block,
        "MEMBERS"
    );
    const code = `{\n${statementMembers}\n}`;
    return [code, generator.ORDER_ATOMIC];
};


//============ return 参数
generator['return'] = function(block) {
    const value = generator.valueToCode(block, "RETURN_VALUE", generator.ORDER_ATOMIC);
    return `return (${value});\n`;
}
















//================================== 工具函数
/**
 * 逻辑为空
 * @param {*} value
 * @returns
 */
const isLogicNull = function (value) {
    if (undefined == value || null == value || "" == value) {
        return true;
    }
    return false;
};
