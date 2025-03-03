import { createStore } from 'vuex'

export default createStore({
  state: {
    // 当前音乐播放列表
    musicPlayList: [],

    // 随机顺序的列表
    randomList: [],

    // 当前播放歌曲的下标
    currentIndex: 0,

    // 播放状态 ： true播放 false暂停
    playing: false,

    // 播放模式: 0 顺序播放  1单曲循环  2随机播放
    playMode: 0,

    // 全屏播放 true / false展示底部播放条
    fullScreen: false
  },
  getters: {
    // 当前播放的歌曲对象
    currentSong(state){
      return state.musicPlayList[state.currentIndex] || {}
    }
  },
  mutations: {
    // 设置当前的歌曲播放列表
    setMusicPlayList(state, list){
      state.musicPlayList = list
    },
    // 设置随机列表
    setRandomList(state, list){
      state.randomList = list
    },
    // 设置当前播放歌曲的下标
    setCurrentIndex(state, index){
      state.currentIndex = index
    },
    // 设置播放状态
    setPlayingState(state, isPlayState){
      state.playing = isPlayState
    },
    // 设置播放模式
    setPlayMode(state, mode){
      state.playMode = mode
    },
    // 设置全屏播放的状态
    setFullScreen(state, isFullScreenState){
      state.fullScreen = isFullScreenState
    },

  },
  actions: {
    // 添加1首歌到播放列表
    addOneSong({state, commit}, song){
      // 打开全屏播放
      commit("setFullScreen", true)

      let musicPlayList = state.musicPlayList.slice()
      let randomList = state.randomList.slice()
      let currentIndex = state.currentIndex

      // 判断要添加的歌曲是否已经存在在musicPlayList中
      let mIndex = musicPlayList.findIndex(item => item.id === song.id)

      if(mIndex === -1){ //列表中不存在该歌曲
        currentIndex++
        musicPlayList.splice(currentIndex, 0, song)
        randomList.push(song)

      }else{ // 已存在
        if(mIndex > currentIndex){
          // 删除原本的歌曲
          musicPlayList.splice(mIndex, 1)
          currentIndex++
          musicPlayList.splice(currentIndex, 0, song)
        }else{
          musicPlayList.splice(currentIndex + 1, 0, song)
          musicPlayList.splice(mIndex, 1)
        }
      }

      // 限制边界
      if(musicPlayList.length === 1) currentIndex = 0

      // 重新设置值
      commit("setMusicPlayList", musicPlayList)
      commit("setRandomList", randomList)
      commit("setCurrentIndex", currentIndex)
      commit("setPlayingState", true)
    },

    // 删除歌曲
    removeSong({state, commit}, song){
      // const {musicPlayList, currentIndex} = state
      let musicPlayList = state.musicPlayList.slice()
      let randomList = state.randomList.slice()
      let currentIndex = state.currentIndex
      
      // 得到需要被删除歌曲的下标
      let mIndex = musicPlayList.findIndex(item => item.id === song.id)
      let rIndex = randomList.findIndex(item => item.id === song.id)

      // 找不到
      if(mIndex < 0 || rIndex < 0) return 

      musicPlayList.splice(mIndex, 1)
      randomList.splice(rIndex, 1)

      // 修改currentIndex的下标
      // 被删除项 在 当前播放歌曲的前面
      if(mIndex < currentIndex) currentIndex--
      // 被删除项是当前正在播放的歌曲，并且它是列表的最后一项
      if(musicPlayList.length === currentIndex) currentIndex = 0
      if(musicPlayList.length <= 0) commit("setPlayingState", false)

      // 重新设置值
      commit("setCurrentIndex", currentIndex)
      commit("setMusicPlayList", musicPlayList)
      commit("setRandomList", randomList)
    },

    // 更换播放模式
    changeMode({state, getters, commit}, mode){
      const randomList = state.randomList.slice()
      const currentSong = getters.currentSong
      // 随机播放时 打乱列表里的顺序
      if(mode === 2){
        // 打乱后的随机数组 赋值给 musicPlayList
        commit("setMusicPlayList", randomList.sort((a, b) => Math.random() - 0.5))
      }
      const cIndex = state.musicPlayList.findIndex((item) => item.id === currentSong.id)
      commit("setCurrentIndex", cIndex)
      commit("setPlayMode", mode)
    }
  },
  modules: {
  }
})
