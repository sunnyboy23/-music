<template>
  <div class="root">
    <router-view></router-view>
    <!-- 固定音乐播放条 -->
    <MusicPlayer/>
  </div>
  
</template>
<script setup>
import MusicPlayer from "@/views/music-player"

</script>

<style lang="less">



</style>
