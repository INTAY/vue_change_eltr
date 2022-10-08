<template>
    <div class="protr">
        <el-dialog
            title="桩编号"
            :visible.sync="dialogFormVisible"
            top="8%"
            width="750px"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
<el-table :data="chargeTable" :header-cell-style="{ background: '#f1f1f1', color: '#000' }" stripe style="width: 100%">
                <el-table-column type="index" width="50" ></el-table-column>
                <el-table-column
                    label="桩编号"
                    show-overflow-tooltip
                    prop="devId"
                    
                ></el-table-column>
                <el-table-column label="桩名称" show-overflow-tooltip prop="devName" ></el-table-column>
                <el-table-column label="厂家名称" show-overflow-tooltip prop="factName"></el-table-column>
            </el-table>
        </el-dialog>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogFormVisible:false,
            chargeTable:[],
        };
    },
    components: {},
    created() {},

    methods: {
        handleClick(tab) {}
    }
};
</script>
<style lang="scss" scope>
.protr {
    position: relative;
     .el-dialog__body {
        padding: 20px 45px 30px;
    }
    .el-timeline-item {
        height: 80px;
    }
    .el-timeline-item::marker {
        color: #fff;
    }
    .el-row {
        height: 39.5px;
    }
    .el-col {
        height: 40px;
    }
    .download_btn {
        border-radius: 3px;
        height: 25px;
        line-height: 10px;
    }
    .sqfj {
        float: left;
        height: 40px;
        line-height: 40px;

        /deep/ .el-form-item__label {
            vertical-align: inherit;
        }
        .el-icon-document {
            color: #0c83ae;
            position: absolute;
            font-size: 16px;
            left: -6px;
            bottom: 7px;
        }
        .pdf_d {
            margin: 0 10px;
        }
    }
    .el-tabs__header {
        margin: 0;
    }
    .row_bg {
        background-color: #f7f7f7;
    }
    .el-tabs--card > .el-tabs__header {
        border: none;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: none;
    }
    .el-timeline-item {
        padding-bottom: 8px;
        &:nth-child(1) {
            .el-timeline-item__node {
                background: #1394c5;
            }
        }
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
        border: 1px solid #dfe4ed;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border-right: none;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
        border: 1px solid #dfe4ed;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-left: none;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
    }
    padding: 8px;
    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        background: #1396c2;
        color: white;
        height: 33px;
        line-height: 33px;
    }
    .el-tabs__nav {
        height: 32px;
    }
    .el-tabs__item {
        background: #f9f9f9;
        line-height: 32px;
        width: 150px;
        text-align: center;
        border: 1px solid #dfe4ed;
    }
}
</style>
<style lang="scss" scoped>
// box-shadow: 0px 0px 20px red;
/deep/ .el-timeline-item__node--normal {
    left: 0;
    width: 9px;
    height: 9px;
}
/deep/ .el-timeline-item:nth-child(1) .el-timeline-item__node {
    box-shadow: 0px 0px 7px #1394c5;
}
/deep/ .el-timeline-item__timestamp.is-bottom {
    margin: -59px 0 0 -105px;
    width: 73px;
    text-align-last: right;
    line-height: inherit;
}
.time_lines_zky {
    padding: 10px;
    margin-left: 70px;
    .card_zky {
        height: 60px;
        display: flex;
        border-radius: 4px;
        border: 1px solid #e6ebf5;
        background: #f2f2f2;
        .left_zky {
            flex: 1;
            box-sizing: border-box;
            padding-top: 4px;
            p {
                line-height: 24px;
                .a_label {
                    display: inline-block;
                    width: 90px;
                    text-align: right;
                    color: darkgrey;
                }
                .a {
                    color: black;
                    padding-left: 8px;
                }
            }
        }
        .right_zky {
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eaeaea;
        }
    }
}
.panel_info {
    padding: 7px 0;
    /deep/ .el-form-item__label {
        color: #a1a1a1;
    }
    /deep/ .el-form-item__content {
        color: #363636;
        font-size: 13px;
    }
    /deep/ .el-form-item {
        white-space: nowrap;
    }
}
.p_title {
    font-size: 16px;
    margin: 15px 0px 10px -2px;
    b {
        color: #1396c2;
    }
}
</style>
