<template>
  <div>
    <transition name="player-bar">
        <div class="player-bar" v-show="!fullScreen" ref="playerBar">
            <div class="play-progress" :style="progressWidth"></div>
            <div class="player" @click="showFullScreen">
                <div class="record-box" :class="isRotate">
                    <img :src="currentSong.picUrl" :alt="currentSong.name">
                    <img class="center" src="@/assets/cd.png" alt="cd">
                </div>
                <div class="info">
                    <span class="title">{{currentSong.name}}</span>
                    - 
                    <span v-for="item in currentSong.artists" :key="item.name">
                        {{ item.name }} &nbsp;
                    </span>
                </div>
                <!-- 控制器 -->
                <div class="control">
                    <SvgIcon class="icon" :iconFileName="playIcon" @click.stop="togglePlayState"/>
                    <SvgIcon class="icon" iconFileName="next" @click.stop="nextPlay"/>
                    <SvgIcon class="icon" iconFileName="list" @click.stop="showPopup = !showPopup"/>
                </div>
            </div>
            <!-- 弹出层 -->
            <div class="popup">
                <van-popup 
                    v-model:show="showPopup"
                    position="bottom" 
                    closeable
                    style="max-height:30%;"
                    :overlay-style="{backgroundColor: 'rgba(0,0,0,.7)'}"
                >
                    <h3 class="title" @click="changeMode">
                      <SvgIcon class="icon" :iconFileName="modeInfo.modeIcon"/>
                      {{modeInfo.modeText}}
                    </h3>
                    <transition-group tag="ul" class="list" name="list">
                        <li v-for="(item,index) in musicPlayList" :key="item.id" @click.stop="playSong(item)">
                            <div class="inner-box">
                                <SvgIcon class="icon play" iconFileName="playing" v-if="index === currentIndex"/>
                                <span class="name">{{item.name}}</span>
                                <SvgIcon class="icon" iconFileName="close" @click.stop="removeSong(item)"/>
                            </div>
                        </li>
                    </transition-group>
                </van-popup>
            </div>
        </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
const store = useStore()
const props = defineProps(["progressRatio", "togglePlayState", "nextPlay", "changeMode", "modeInfo"])
const playerBar = ref(null)
const progressWidth = computed(()=>{
    if(!playerBar.value) return 0
    return `width: ${props.progressRatio * playerBar.value.offsetWidth}px`
})
const showPopup = ref(false)

// vuex
const musicPlayList = computed(() => store.state.musicPlayList) // 当前播放列表
const currentSong = computed(() => store.getters.currentSong) // 当前播放的歌曲对象
const currentIndex = computed(() => store.state.currentIndex) 
const fullScreen = computed(() => store.state.fullScreen) // 全屏状态
const playing = computed(()=>store.state.playing) // 播放状态
const isRotate = computed(()=> playing.value ? "play" : "pause") // 是否旋转唱片
const playIcon = computed(()=> playing.value ? "pause" : "play") // 播放 / 暂停 图标

// 点击时设置为全屏
function showFullScreen() {
    store.commit("setFullScreen", true)
}

// 点击时播放该首歌
function playSong(song) {
  let index = musicPlayList.value.findIndex(item => item.id === song.id)
  store.commit("setCurrentIndex", index)
  store.commit("setPlayingState", true)
}
// 点击时删除该首歌
function removeSong(song) {
  // 根据下标删除队列中的歌曲
  store.dispatch("removeSong", song)
}
</script>

<style lang="less">

.player-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
  background-color: @main-light-background;
  box-sizing: border-box;
  .play-progress{
    position: absolute;
    height: 2px;
    background-color: @light-color;
    top: -4px;
    left: 0;
  }
  .player{
    position: relative;
    display: flex;
    width: 100vw;
    height: 55px;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    color: @light-color;
    padding: 0 20px 0 0;
    z-index: 200;
    .record-box{
      position: relative;
      overflow: hidden;
      width: 55px;
      height: 55px;
      margin: -20px 0 0 15px;
      border-radius: 50%;
      animation: rotate 20s linear infinite;
      &.play {
        animation-play-state: running;
      }
      &.pause {
        animation-play-state: paused;
      }
      img {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      img.center{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30%;
        height: 30%;
        transform: translate(-50%, -50%);
      }
    }
    .info{
      overflow: hidden;
      flex: 1;
      max-width: 68%;
      height: 100%;
      margin-left: 15px;
      padding-right: 8px;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 55px;
      font-size: @font-size-mini;
    }
    .control{
      display: flex;
      height: 100%;
      align-items: center;
      .icon {
        width: 32px;
        height: 32px;
        color: #f0d0e0;
        margin-left: 15px;
      }
    }
  }
  .popup{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    /deep/.van-popup{
      padding: 10px;
      box-sizing: border-box;
      background: @main-light-background;
      transition: .6s;
    }
    .title{
      height: 40px;
      line-height: 40px;
      font-size: @font-size-medium;
      color: @light-color-m;
      .icon{
        vertical-align: middle;
        width: 20px;
        height: 20px;
      }
    }
    .list{
      li{
        width: 100%;
        height: 30px;
        color: @light-color;
        font-size: @font-size-small;
        .inner-box{
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 30px;
          line-height: 30px;
        }
        .play{
          position: absolute;
          left: 0;
          top: 0;
        }
        .name{
          overflow: hidden;
          margin-left: 30px;
          margin-right: 10px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .icon{
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  &.player-bar-enter-active,
  &.player-bar-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.player-bar-enter-from,
  &.player-bar-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  .list-enter,
  .list-leave-to{
      opacity: 0;
      transform: translate3d(0, 100%, 0);
  }
  .list-leave-active,
  .list-enter-active{
      transition: all .6s ease;
  }
  .list-move{
      transition: all .6s ease;
  }
  .list-leave-active{
      position: absolute;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>