<template>
  <div class="p-progress-inner" ref="proBarWrapRef" @click="hanleClickProgress">
    <!-- 当前已经播放的进度条： 控制它的宽度 -->
    <div class="p-progress-play" ref="proBarPlayRef" :style="proBarPlayStyle">
      <!-- 滑块 -->
      <div 
        class="slider"
        @touchstart.prevent="touchStartProgress"
        @touchmove.prevent="touchMoveProgress"
        @touchend.prevent="touchEndProgress"
        :style="sliderStyle"
      >
        <i class="slider-btn" ref="sliderBtnRef"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, onMounted, watch} from "vue"

// 当前的播放时间 / 总时长 = 当前的play进度条的宽度 /  进度条的总宽度
const props = defineProps(["progressRatio"])
const emits = defineEmits(["progressMove", "progressEnd"])
// 存储触摸相关事件的位置信息
const touch = {}
// 偏移量
const offsetW = ref(0) 
// 进度条容器
const proBarWrapRef = ref(null)
const proBarWrapWdith = ref(0)
// play进度条
const proBarPlayRef = ref(null) 
const proBarPlayStyle = computed(() => `width:${offsetW.value}px;`)
// 滑块
const sliderBtnRef = ref(null)
const sliderStyle = computed(() => `transform:translateX(${offsetW.value}px);`)

onMounted(()=>{
  // 获取进度条容器的总宽度
  proBarWrapWdith.value = proBarWrapRef.value.offsetWidth - sliderBtnRef.value.offsetWidth
})

watch(()=>props.progressRatio, (newRatio) => {
  offsetW.value = props.progressRatio * proBarWrapWdith.value
})
// 当触摸滑块
function touchStartProgress(e){
  touch.x1 = e.touches[0].pageX
  // play进度条的初始宽度
  touch.initW = proBarPlayRef.value.offsetWidth
}

// 移动滑块
function touchMoveProgress(e){
  // 差值 = 移动中的x坐标 - 初始触摸时的x坐标
  let xDiff = e.touches[0].pageX - touch.x1 
  
  // play进度条的宽度 = x坐标差值 + 初始宽度
  offsetW.value = xDiff + touch.initW

  // 边界限制
  offsetW.value = Math.max(0, Math.min(offsetW.value, proBarWrapWdith.value))

  // 限制时间比例 0 ~ 1 : play宽度 / 总宽度
  let progressRatio = offsetW.value / proBarWrapWdith.value

  // 移动中，设置audio的currentTime  为 play宽度对应的时间值
  emits("progressMove", progressRatio)
}

// 手指离开：结束操作
function touchEndProgress(e){
  // 限制时间比例 0 ~ 1
  let progressRatio = offsetW.value / proBarWrapWdith.value
  // 移动中，设置audio的currentTime  为 play宽度对应的时间值
  emits("progressEnd", progressRatio)
}

// 点击进度条时
function hanleClickProgress(e){
  let offsetWidth = Math.min(e.offsetX, proBarWrapWdith.value)
  let progressRatio = offsetWidth / proBarWrapWdith.value
  emits("progressEnd", progressRatio)
}
</script>

<style lang="less">
.p-progress-inner {
  position: relative;
  flex: 1;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  .p-progress-play {
    position: absolute;
    width: 0;
    height: 100%;
    background: #f0d0e0;
  }
  // 滑块
  .slider {
    position: absolute;
    left: -7px;
    top: -13px;
    width: 30px;
    height: 30px;
    .slider-btn{
        position: absolute;
        top: 7px;
        left: 7px;
        width: 16px;
        height: 16px;
        border: 3px solid #fff;
        box-sizing: border-box;
        border-radius: 8px;
        background: @light-color;
    }
  }
}
</style>