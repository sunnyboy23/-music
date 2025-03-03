<template>
  <svg class="svg-icon">
    <use :xlink:href="'#icon-'+iconFileName"></use>
  </svg>
</template>

<script setup>
import {defineProps} from "vue"
const props = defineProps({
  //图标文件名称
    iconFileName:{
        type:String,
        required:true
    }
})

</script>

<style lang="less" scoped>
.svg-icon{
    fill: currentColor; //使用自定义颜色填充
}
</style>