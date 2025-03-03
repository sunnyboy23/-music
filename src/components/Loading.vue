<template>
    <div class="loading-wrap">
        <div class="loading-content">
            <img width="24" height="24" src="../assets/loading.gif" alt="加载..." />
            <p class="desc">正在载入...</p>
        </div>
    </div>
</template>
<style lang="less" scoped>
.loading-wrap {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    .loading-content {
        text-align: center;
        .desc {
            line-height: 20px;
            font-size: @font-size-small;
            color: @light-color-m;
        }
    }
}
</style>
