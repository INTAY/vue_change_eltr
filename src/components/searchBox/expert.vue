/*
    search-BOX 示例
*/
<template>
    <div id="app">
        <HelloWorld
            ref="form"
            :form="form"
            :listTypeInfo="listTypeInfo"
            :rules="rules"
            :formData="formData"
            :labelWidth="labelWidth"
            :cascaderPorps="cascaderPorps"
            @handleChanges="handleC"
        >
            <template slot="form-avatar">
                <div class="solt-avatar"><el-input class="Israel" /> - <el-input class="Israel" /></div>
            </template>
        </HelloWorld>
    </div>
</template>

<script>
import HelloWorld from './searchBox';

export default {
    name: 'App',
    components: {
        HelloWorld
    },
    data() {
        return {
            cascaderPorps: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            //级联选择框数据
            listTypeInfo: { //(这里面的字段要和form中list的字段名称一样)
                statusList: [
                    {
                        id: '1',
                        name: '黄金糕'
                    },
                    {
                        id: '2',
                        name: '双皮奶'
                    },
                    {
                        id: '3',
                        name: '蚵仔煎'
                    },
                    {
                        id: '4',
                        name: '龙须面'
                    },
                    {
                        id: '5',
                        name: '北京烤鸭'
                    }
                ],
                sexList: [
                    {
                        id: '0',
                        name: '男'
                    },
                    {
                        id: '1',
                        name: '女'
                    }
                ],
                cascaderData: [
                    {
                        value: 'zhinan',
                        label: '指南',
                        children: [
                            {
                                value: 'shejiyuanze',
                                label: '设计原则',
                                children: [
                                    {
                                        value: 'yizhi',
                                        label: '一致'
                                    },
                                    {
                                        value: 'fankui',
                                        label: '反馈'
                                    },
                                    {
                                        value: 'xiaolv',
                                        label: '效率'
                                    },
                                    {
                                        value: 'kekong',
                                        label: '可控'
                                    }
                                ]
                            },
                            {
                                value: 'daohang',
                                label: '导航',
                                children: [
                                    {
                                        value: 'cexiangdaohang',
                                        label: '侧向导航'
                                    },
                                    {
                                        value: 'dingbudaohang',
                                        label: '顶部导航'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        value: 'zujian',
                        label: '组件',
                        children: [
                            {
                                value: 'basic',
                                label: 'Basic',
                                children: [
                                    {
                                        value: 'layout',
                                        label: 'Layout 布局'
                                    },
                                    {
                                        value: 'color',
                                        label: 'Color 色彩'
                                    },
                                    {
                                        value: 'typography',
                                        label: 'Typography 字体'
                                    },
                                    {
                                        value: 'icon',
                                        label: 'Icon 图标'
                                    },
                                    {
                                        value: 'button',
                                        label: 'Button 按钮'
                                    }
                                ]
                            },
                            {
                                value: 'form',
                                label: 'Form',
                                children: [
                                    {
                                        value: 'radio',
                                        label: 'Radio 单选框'
                                    },
                                    {
                                        value: 'checkbox',
                                        label: 'Checkbox 多选框'
                                    },
                                    {
                                        value: 'input',
                                        label: 'Input 输入框'
                                    },
                                    {
                                        value: 'input-number',
                                        label: 'InputNumber 计数器'
                                    },
                                    {
                                        value: 'select',
                                        label: 'Select 选择器'
                                    },
                                    {
                                        value: 'cascader',
                                        label: 'Cascader 级联选择器'
                                    },
                                    {
                                        value: 'switch',
                                        label: 'Switch 开关'
                                    },
                                    {
                                        value: 'slider',
                                        label: 'Slider 滑块'
                                    },
                                    {
                                        value: 'time-picker',
                                        label: 'TimePicker 时间选择器'
                                    },
                                    {
                                        value: 'date-picker',
                                        label: 'DatePicker 日期选择器'
                                    },
                                    {
                                        value: 'datetime-picker',
                                        label: 'DateTimePicker 日期时间选择器'
                                    },
                                    {
                                        value: 'upload',
                                        label: 'Upload 上传'
                                    },
                                    {
                                        value: 'rate',
                                        label: 'Rate 评分'
                                    },
                                    {
                                        value: 'form',
                                        label: 'Form 表单'
                                    }
                                ]
                            },
                            {
                                value: 'data',
                                label: 'Data',
                                children: [
                                    {
                                        value: 'table',
                                        label: 'Table 表格'
                                    },
                                    {
                                        value: 'tag',
                                        label: 'Tag 标签'
                                    },
                                    {
                                        value: 'progress',
                                        label: 'Progress 进度条'
                                    },
                                    {
                                        value: 'tree',
                                        label: 'Tree 树形控件'
                                    },
                                    {
                                        value: 'pagination',
                                        label: 'Pagination 分页'
                                    },
                                    {
                                        value: 'badge',
                                        label: 'Badge 标记'
                                    }
                                ]
                            },
                            {
                                value: 'notice',
                                label: 'Notice',
                                children: [
                                    {
                                        value: 'alert',
                                        label: 'Alert 警告'
                                    },
                                    {
                                        value: 'loading',
                                        label: 'Loading 加载'
                                    },
                                    {
                                        value: 'message',
                                        label: 'Message 消息提示'
                                    },
                                    {
                                        value: 'message-box',
                                        label: 'MessageBox 弹框'
                                    },
                                    {
                                        value: 'notification',
                                        label: 'Notification 通知'
                                    }
                                ]
                            },
                            {
                                value: 'navigation',
                                label: 'Navigation',
                                children: [
                                    {
                                        value: 'menu',
                                        label: 'NavMenu 导航菜单'
                                    },
                                    {
                                        value: 'tabs',
                                        label: 'Tabs 标签页'
                                    },
                                    {
                                        value: 'breadcrumb',
                                        label: 'Breadcrumb 面包屑'
                                    },
                                    {
                                        value: 'dropdown',
                                        label: 'Dropdown 下拉菜单'
                                    },
                                    {
                                        value: 'steps',
                                        label: 'Steps 步骤条'
                                    }
                                ]
                            },
                            {
                                value: 'others',
                                label: 'Others',
                                children: [
                                    {
                                        value: 'dialog',
                                        label: 'Dialog 对话框'
                                    },
                                    {
                                        value: 'tooltip',
                                        label: 'Tooltip 文字提示'
                                    },
                                    {
                                        value: 'popover',
                                        label: 'Popover 弹出框'
                                    },
                                    {
                                        value: 'card',
                                        label: 'Card 卡片'
                                    },
                                    {
                                        value: 'carousel',
                                        label: 'Carousel 走马灯'
                                    },
                                    {
                                        value: 'collapse',
                                        label: 'Collapse 折叠面板'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        value: 'ziyuan',
                        label: '资源',
                        children: [
                            {
                                value: 'axure',
                                label: 'Axure Components'
                            },
                            {
                                value: 'sketch',
                                label: 'Sketch Templates'
                            },
                            {
                                value: 'jiaohu',
                                label: '组件交互文档'
                            }
                        ]
                    }
                ],
                orYList: [] //自定义数据
            },
            form: [
                {
                    label: '账号',
                    value: 'account',
                    type: 'input',
                    prop: 'account',
                    labelWidth: '120px',
                    labelPosition: 'left',
                    clearable: true,
                    className: 'inputClass',
                    required: false,
                    placeholder: '请输入密码'
                },
                {
                    label: '密码',
                    value: 'password',
                    type: 'password',
                    required: true,
                    clearable: true
                },
                {
                    label: '描述',
                    value: 'desc',
                    type: 'textarea',
                    className: 'el-form-block'
                },
                {
                    label: '性别',
                    value: 'sex',
                    type: 'select',
                    list: 'sexList',
                    clearable: true,
                    required: true
                },
                {
                    label: '状态',
                    value: 'status',
                    type: 'select',
                    collapseTags: true,
                    multiple: true,
                    list: 'statusList',
                    required: true,
                    clearable: true
                },
                {
                    label: '选择日期',
                    value: 'changeDate',
                    type: 'datetimerange',
                    show: 'datePicker',
                    defaultTime: ['08:00:00', '08:00:00'],
                    rangeSeparator: '-',
                    startPlaceholder: '开始日期',
                    endPlaceholder: '结束日期',
                    dateAlign: 'center',
                    clearable: true
                },
                {
                    label: '选择时间',
                    value: 'changeTime',
                    type: 'timePicker',
                    rangeSeparator: '-',
                    startPlaceholder: '开始日期',
                    endPlaceholder: '结束日期',
                    isRange: true,
                    arrowControl: true,
                    clearable: true
                },
                {
                    label: '级联选择器',
                    value: 'cascaderData',
                    type: 'cascader',
                    list: 'cascaderData',
                    clearable: true
                },
                {
                    label: '状态',
                    value: 'orY',
                    type: 'treeSelect',
                    list: 'orYList',
                    prop: 'orY'
                },
                {
                    label: '头像',
                    value: 'avatar',
                    type: 'slot',
                    className: 'el-form-block'
                },
                {
                    tag: '查询',
                    value: 'search',
                    type: 'button',
                    className: 'el-form-block'
                },
                {
                    tag: '清除',
                    value: 'cancel',
                    type: 'button',
                    className: 'el-form-block'
                }
            ],
            labelWidth: '100px',
            formData: {},
            rules: {
                account: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
            }
        };
    },
    methods: {
        InputM(val) {
            console.log(val, 'InputM');
        },
        handleC(flag, val) {
            //case配置的是value
            switch (flag) {
                case 'account':
                    console.log(val);
                    break;
                case 'password':
                    console.log(val);
                    break;
                case 'desc':
                    console.log(val);
                    break;
                case 'sex':
                    console.log(val);
                    break;
                case 'status':
                    console.log(val);
                    break;
                case 'changeDate':
                    console.log(val);
                    break;
                case 'changeTime':
                    console.log(val);
                    break;
                case 'cascaderData':
                    console.log(val);
                    break;
                case 'orY':
                    console.log(val);
                    break;
                case 'search':
                    console.log(val);
                    console.log(this.formData);
                    break;
                case 'cancel':
                    this.formData = {};
                    this.$refs.form.$refs.form.clearValidate();
                    console.log(this.$refs.form.$refs.form, 'this.refs.form');
                    break;
                default:
                    break;
            }
        }
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.inputClass {
    width: 180px !important;
}
.Israel {
    width: 80px !important;
}
</style>