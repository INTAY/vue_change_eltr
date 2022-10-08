
/* 
        formData 获取绑定的数据;(必传字段)
        labelWidth: form长度;
        form: {
            label: 表单名称 (必传字段)
            value: 表单绑定的字段 (必传字段)
            type: 表单类型（input,textarea,select） (必传字段)
            tag: 按钮的名字 (按钮独有)
            prop: 前端规则校验的字段
            size: 输入框的大小的字段（默认mini）
            clearable: 清除小圆圈
            disabled: 输入框是否禁止输入
            placeholder: 默认输入提示
            minlength: 输入框最小允许输入的字符
            maxlength: 输入框最大允许输入的字符
            className: 单个输入框的样式
            multiple: 是否多选 (select选择框独有)
            collapseTags: 多选时是否将选中值按文字的形式展示 (select选择框独有)
            filterable: 是否可搜索(select选择框和级联选择框共有)
            list: select选择框的绑定数据选项;
            show: 判断时间选择器类型 (时间选择器独有)
            rangeSeparator: 选择范围时的分隔符 (时间选择器独有)
            pickerOptions: 当前时间日期选择器特 (时间选择器独有)
            arrowControl: 是否使用箭头进行时间选择 (时间选择器独有)
            valueFormat: 显示内容的转换 
            props: 级联选择器规则   (级联选择器独有)
            collapseTags:   多选模式下是否折叠Tag(级联选择器独有)
            showAllLevels:  输入框中是否显示选中值的完整路径 (级联选择器独有)           
            InputMethods: input输入框响应事件(input 输入框独有)
            handleChange: 输入框操作事件（flag: 操作事件的type,val是值）
        }
        cascaderPorps: 级联选择器的porps
        listTypeInfo: (select选择框独和级联选择框共有)
*/
<template>
    <div>
        <el-form ref="form" :model="formData" :inline="inline" :label-width="labelWidth" :rules="rules" :class="fatherClassName">
            <el-form-item
                v-for="(item, index) in form"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :label-position="item.labelPosition"
            >
                <!-- input输入框 -->
                <el-input
                    v-if="item.type == 'input' || item.type == 'textarea' || item.type == 'password'"
                    v-model="formData[item.value]"
                    :type="item.type"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder || getPlaceholder(item)"
                    :minlength="item.minlength"
                    :maxlength="item.maxlength"
                    :clearable="item.clearable || true"
                    :class="item.className"
                    :size="item.size || 'mini'"
                    @input="InputMethods"
                    @change="handleChange(item.value, formData[item.value])"
                ></el-input>
                <!-- select选择框 -->
                <el-select
                    v-if="item.type == 'select'"
                    v-model="formData[item.value]"
                    :placeholder="item.placeholder || getPlaceholder(item)"
                    :disabled="item.disabled"
                    :multiple="item.multiple"
                    :collapse-tags="item.collapseTags"
                    :allow-create="item.allowCreated"
                    :filterable="item.filterable"
                    :clearable="item.clearable || true"
                    :class="item.className"
                    :size="item.size || 'mini'"
                    @change="handleChange(item.value, formData[item.value])"
                >
                    <el-option
                        v-for="(childItem, childIndex) in listTypeInfo[item.list]"
                        :key="childIndex"
                        :label="childItem.name"
                        :value="childItem.id"
                        :disabled="childItem.disabled"
                    ></el-option>
                </el-select>
                <!-- 日期选择器 -->
                <el-date-picker
                    v-if="item.show == 'datePicker'"
                    v-model="formData[item.value]"
                    :type="item.type"
                    :placeholder="item.placeholder || getPlaceholder(item)"
                    :range-separator="item.rangeSeparator"
                    :start-placeholder="item.startPlaceholder || '开始时间'"
                    :end-placeholder="item.endPlaceholder || '结束时间'"
                    :default-time="item.defaultTime"
                    :align="item.dateAlign"
                    :value-format="item.valueFormat || 'yyyy-MM-dd'"
                    :format='item.format || "yyyy-MM-dd"'
                    :picker-options="item.pickerOptions"
                    :clearable="item.clearable || true"
                    :class="item.className"
                    :disabled="item.disabled"
                    :size="item.size || 'mini'"
                    @change="handleChange(item.value, formData[item.value])"
                >
                </el-date-picker>
                <!-- 时间选择器 -->
                <el-time-picker
                    v-if="item.type == 'timePicker'"
                    v-model="formData[item.value]"
                    :is-range="item.isRange"
                    :type="item.type"
                    :placeholder="item.placeholder || getPlaceholder(item)"
                    :range-separator="item.rangeSeparator"
                    :start-placeholder="item.startPlaceholder || '开始时间'"
                    :end-placeholder="item.endPlaceholder || '结束时间'"
                    :arrow-control="item.arrowControl"
                    :align="item.dateAlign"
                    :picker-options="item.pickerOptions"
                    :value-format="item.valueFormat || 'yyyy-MM-dd'"
                    :format='item.format || "yyyy-MM-dd"'
                    :clearable="item.clearable || true"
                    :class="item.className"
                    :disabled="item.disabled"
                    :size="item.size || 'mini'"
                    @change="handleChange(item.value, formData[item.value])"
                >
                </el-time-picker>
                <!-- 级联选择器 -->
                <el-cascader
                    v-if="item.type == 'cascader'"
                    v-model="formData[item.value]"
                    :placeholder="item.placeholder || getPlaceholder(item)"
                    :options="listTypeInfo[item.list]"
                    :props="cascaderPorps[item.props]"
                    :collapse-tags="item.collapseTags"
                    :show-all-levels="item.showAllLevels"
                    :clearable="item.clearable || true"
                    :class="item.className"
                    :disabled="item.disabled"
                    :size="item.size || 'mini'"
                    @change="handleChange(item.value, formData[item.value])"
                ></el-cascader>
                <!-- 自定义级联选择器 -->
                <tree-select
                    v-if="item.type == 'treeSelect'"
                    ref="treeSelect"
                    :props="cascaderPorps[item.props]"
                    :options="listTypeInfo[item.list]"
                    clearable
                    accordion
                    @getValue="handleChange(item.value, $event)"
                    height="200"
                />
                <!-- 按钮 -->
                <el-button
                    v-if="item.type == 'button'"
                    :class="item.className"
                    :disabled="item.disabled"
                    @click="handleChange(item.value, formData[item.value])"
                    >{{ item.tag }}</el-button
                >
                <!-- 插槽 solt -->
                <template v-if="item.type === 'slot'">
                    <slot :name="'form-' + item.value" />
                </template>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import treeSelect from '@/components/treeSelect/nodeTree';  //引用自定的下拉框树形自定义事件
export default {
    components: { treeSelect },
    props: {
        rules: {
            type: Object
        },
        listTypeInfo: {
            type: Object
        },
        cascaderPorps: {
            type: Object
        },
        form: {
            type: Array
        },
        labelWidth: {
            type: String
        },
        inline: {
            type: Boolean,
            default: true
        },
        formData: {
            type: Object
        },
        fatherClassName: {
            type: String
        }
    },
    methods: {
        // 得到placeholder的显示
        getPlaceholder(row) {
            let placeholder;
            if (row.type === 'input' || row.type === 'textarea' || row.type === 'password') {
                placeholder = `${row.label}待输入`;
            } else if (row.type === 'select' || row.type === 'time' || row.type === 'date' || row.type === 'cascader') {
                placeholder = `${row.label}待选择`;
            } else if (row.type === 'cascader') {
                placeholder = `${row.label}待输入`;
            } else {
                placeholder = '';
            }
            return placeholder;
        },
        //input 时间触发时启动
        InputMethods(flag, val) {
            this.$emit('InputMethod', flag, val);
        },
        //input 事件最终值改变后启动
        handleChange(flag, val) {
            this.$emit('handleChanges', flag, val);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>