<template>
  <div class="player" v-if="musicPlayList.length">
    <transition name="player">
      <div class="player-transition" v-show="fullScreen">
        <div class="bg-cover">
          <img :src="currentSong.picUrl" :alt="currentSong.name" />
        </div>
        <div class="player-header">
          <svg-icon class="icon back" iconFileName="back" @click="cancelFullScreen"/>
          <div class="hgroup">
            <h2 class="title">{{ currentSong.name }}</h2>
            <h3>
              <span v-for="item in currentSong.ar" :key="item.name">
                {{ item.name }} &nbsp;
              </span>
            </h3>
          </div>
        </div>
        <div class="song-wrap" @click="toggleBlock">
          <!-- 左边的唱片区域 -->
          <div class="song-wrap-l" :class="{showBlock: showCdBlock}">
            <div class="record-disc">
              <div class="rotate" :class="isRotate">
                <img :src="currentSong.picUrl" :alt="currentSong.name" />
              </div>
            </div>
            <div class="song-lyric">{{playLyric}}</div>
          </div>
          <!-- 右边的滚动歌词区域 -->
          <Scroll class="song-wrap-r" :class="{showBlock: !showCdBlock}" ref="lyricScrollRef">
            <div class="lyric-block" ref="lyricBlockRef">
              <p 
                v-for="(item, index) in currentLyric" 
                :key="index"
                :class="{active: index === currentLineNum}"
              >
                {{item.lyric}}
              </p>
            </div>
          </Scroll>
        </div>

        <div class="player-footer">
          <div class="player-progress">
            <span class="time playtime">{{formatTime(currentTime)}}</span>
            <!-- 进度条 -->
            <Progress :progressRatio="progressRatio" @progressMove="progressMove" @progressEnd="progressEnd"/>
            <span class="time endtime">{{formatTime(duration)}}</span>
          </div>
          <div class="player-controller">
            <SvgIcon class="icon" :iconFileName="modeIcon" @click="changeMode"/>
            <SvgIcon class="icon" iconFileName="prev" @click="prevPlay"/>
            <SvgIcon class="icon" :iconFileName="playIcon" @click="togglePlayState"/>
            <SvgIcon class="icon" iconFileName="next" @click="nextPlay"/>
            <SvgIcon class="icon" iconFileName="heart"/>
          </div>
        </div>
      </div>
    </transition>
    <!-- 音乐播放栏 -->
    <PlayerBar 
      :progressRatio="progressRatio" 
      :togglePlayState="togglePlayState" 
      :nextPlay="nextPlay"
      :changeMode="changeMode"
      :modeInfo="{modeText, modeIcon}"
    />
  </div>

  <!--         
    audio 在谷歌浏览器中都不允许媒体自动播放
        1. 静音
        2. 与用户有交互行为(就可以调用play方法播放音乐)
  -->
  <audio
    ref="audioRef"
    @canplay="audioReady"
    @timeupdate="timeUpdate"
    @ended="playEnd"
  >
  </audio>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { getSongUrl } from "@/api/song"
import { formatTime } from "@/untils/fromat.js"
import Progress from "./components/Progress.vue"
import initPlayControl from "./js/playController"
import initLyric from "./js/playLyric"
import PlayerBar from "./components/PlayerBar"
import Scroll from "@/components/Scroll.vue"

let store = useStore()
let audioRef = ref(null)
let duration = ref(0) // mp3的总时长
let currentTime = ref(0) // 当前播放时间
let showCdBlock = ref(false) //是否显示cd区块

let progressRatio = computed(() => {
  if(!audioRef.value) return 0
  // 时间进度比 = 当前的播放时间 / 总时长
  return currentTime.value / duration.value
})

// 控制器
let {togglePlayState, nextPlay, prevPlay, changeMode, modeText, modeIcon} = initPlayControl(audioRef)

// 滚动歌词
let { currentLyric, currentLineNum, playLyric, lyricScrollRef, lyricBlockRef, startOperationLyric, stopOperationLyric} = initLyric(currentTime)

// vuex
let musicPlayList = computed(() => store.state.musicPlayList) // 当前播放列表
let currentSong = computed(() => store.getters.currentSong) // 当前播放的歌曲对象
let fullScreen = computed(() => store.state.fullScreen) // 全屏状态
let playing = computed(()=>store.state.playing) // 播放状态
let playIcon = computed(()=> playing.value ? "pause" : "play") // 播放 / 暂停 图标
let isRotate = computed(()=> playing.value ? "play" : "pause") // 是否旋转唱片
let playMode = computed(() => store.state.playMode) 


// 监听当前要播放的歌曲对象的变化
watch(currentSong, (newSong) => {
  if(!newSong.id) return 
  // 获取mp3的url
  getSongUrl(newSong.id)
  .then(res=>{
    const musicUrl = res.data.data[0].url
    // 设置audio
    audioRef.value.src = musicUrl
    audioRef.value.play()
    store.commit("setPlayingState", true)
  })
  .catch(err=>{
    console.log("MP3获取失败", err);
  })
})

// 监听播放状态
watch(playing, (newState)=>{
  if(newState){
    stopOperationLyric()
    startOperationLyric()
  }else{
    stopOperationLyric()
  }
})

// 取消播放器的全屏状态
function cancelFullScreen(){
  store.commit("setFullScreen", false)
}

// 当audio准备就绪
function audioReady(){
  // 获取mp3的总时长
  duration.value = audioRef.value.duration
}

// 当播放时间变化时
function timeUpdate(){
  // 获取已播放的时间
  currentTime.value = audioRef.value.currentTime
}

// 当音乐播放结束时
function playEnd(){
  audioRef.value.currentTime = 0
  // 判断播放模式是否为单曲循环
  if(playMode.value === 1){
    // 重新播放歌曲
    audioRef.value.play()
    store.commit("setPlayingState", true)
    stopOperationLyric()
    startOperationLyric()
  }else{
    // 播放下一首
    nextPlay()
  }
}

// 在进度条上移动时
function progressMove(newRatio){
  // 停止播放
  if(playing.value) store.commit("setPlayingState", false)
  // 当前时间 = 比例值 * 总时长
  audioRef.value.currentTime = currentTime.value = newRatio * duration.value
  stopOperationLyric()
}

// 结束在进度条上的操作
function progressEnd(newRatio){
  // 当前时间 = 比例值 * 总时长
  audioRef.value.currentTime = currentTime.value = newRatio * duration.value
  // 继续播放
  if(!playing.value) store.commit("setPlayingState", true)
  stopOperationLyric()
  startOperationLyric()
}

// 切换歌词区块 与 唱片区块
function toggleBlock(){
  showCdBlock.value = !showCdBlock.value
}

</script>

<style lang="less">
.player {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 199;

  // 过渡盒子的动画效果
  .player-transition {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: @main-background;
    &.player-enter-active,
    &.player-leave-active {
      transition: all 0.6s;
      .bg-cover,
      .player-header,
      .song-wrap,
      .player-footer {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.player-enter-from,
    &.player-leave-to {
      background: #fff;
      .player-header {
        transform: translateY(-100px);
      }
      .song-wrap {
        transform: scale(0);
      }
      .player-footer {
        transform: translateY(120px);
      }
    }
  }

  .bg-cover {
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(30px);
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .player-header {
    position: relative;
    overflow: hidden;
    height: 60px;
    padding-top: 10px;
    text-align: center;
    box-sizing: border-box;
    .icon.back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      padding: 9px;
      width: 22px;
      height: 22px;
      color: #f0d0e0;
      transform: rotate(-90deg);
    }
    & > * {
      width: 50%;
      margin: 0 auto;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    h2 {
      height: 30px;
      line-height: 30px;
      font-size: @font-size-large;
      color: #fff;
    }
    h3 {
      height: 20px;
      line-height: 20px;
      font-size: @font-size-medium;
      color: #969595;
    }
  }
  .song-wrap {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 190px);
    // cd唱片区块
    .song-wrap-l {
      position: absolute;
      top: 0;
      left: -200%;
      width: 100%;
      padding-top: 20px;
      //唱片圆盘
      .record-disc {
        overflow: hidden;
        // background-color: #fff;
        .rotate {
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          width: 70vw;
          height: 70vw;
          border-radius: 50%;
          border: 10px solid rgba(255, 255, 255, 0.1);
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
        }
      }
      // 歌词
      .song-lyric {
        overflow: hidden;
        width: 80%;
        margin: 30px auto 0 auto;
        text-align: center;
        line-height: 2em;
        font-size: @font-size-medium;
        color: @dark-color;
      }
    }
    // 歌词区块
    .song-wrap-r{
      position: absolute;
      left: -200%;
      top: 0;
      width: 100%;
      height: 100%;
      .lyric-block{
        text-align: center;
        font-size: @font-size-small;
        color: @dark-color;
        p{
          line-height: 30px;
        }
      }
      .active{
        color: #fff;
      }
    }
    .showBlock{
      left: 0;
    }
  }
  .player-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 30px;
    width: 80%;
    height: 100px;
    margin: 0 auto;
    // background-color: #fff;
    .player-progress {
      display: flex;
      align-items: center;
      width: 100%;
      margin: 0 auto;
      padding: 10px 0;
      color: #fff;
      .playtime {
        margin-right: 20px;
      }
      .endtime {
        margin-left: 10px;
      }
    }

    .player-controller {
      display: flex;
      height: 60px;
      align-items: center;
      .icon {
        width: 32px;
        height: 32px;
        flex: 1;
        color: #f0d0e0;
      }
    }
  }
}
</style>