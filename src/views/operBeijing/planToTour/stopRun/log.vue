<template>
    <div>
        <div class="title">流程跟踪示意图</div>
        <div class="pur">
            <img :src="url">
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: './u=2718041170,2371556399&fm=26&gp=0.jpg',
        };
    }
};
</script>
<style lang="scss" scoped>
//标签
.title {
    margin: 0px 0px 20px 7px;
    color: #232323;
    font-size: 16px;
    font-weight: 550;
    letter-spacing: 2px;
}
//图片
.pur {
    position: relative;
    height: 600px;
    border: 2px solid #e8e8e8;
    img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
}
</style>