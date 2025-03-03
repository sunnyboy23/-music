<template>
    <div ref="scrollRootRef">
        <!-- 插槽：接收外部组件传入的内容 -->
        <slot></slot>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue"
// 滚动
import BScroll from "@better-scroll/core"
import ObserveDom from "@better-scroll/observe-dom"
BScroll.use(ObserveDom)
/**
 * 注意： 
 *  BScroll默认只处理容器的第一个子元素的滚动，其它的元素会被忽略
 *  监听的滚动的容器必须有固定的高度
 * 
 */
let props = defineProps({
    probeType: {
        type: Number,
        default: 0
    },
    click: {
        type: Boolean,
        default: true
    }
})
let emit = defineEmits(["scroll"])

// 滚动的容器
let scrollRootRef = ref(null)
let scroll = ref(null)

onMounted(()=>{
    // arg1: 要监听滚动的容器  arg2: 配置项
    scroll.value = new BScroll(scrollRootRef.value, {
        observeDOM: true, // 开启 observe-dom 插件
        ...props
    })
    if(props.probeType > 0){
        scroll.value.on("scroll", (position) => { // position 滚动距离
            emit("scroll", position.y)
        })
    }
})

onUnmounted(()=>{
    // 销毁
    scroll.value.destroy()
})

// 对外提供scroll实例对象
defineExpose({
    scroll
})
</script>
<style lang='less' scoped>

</style>