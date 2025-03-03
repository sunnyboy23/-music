import { useStore } from "vuex"
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { Toast } from 'vant';

// 控制器的业务逻辑
export default function(audioRef){
    const store = useStore()
    const playing = computed(()=>store.state.playing)
    const musicPlayList = computed(()=>store.state.musicPlayList)
    const currentIndex = computed(()=>store.state.currentIndex)
    const modeTextArr = ["顺序播放", "单曲循环", "随机播放"]
    const modeIconArr = ["sequence", "loop", "random"]
    const playMode = computed(()=>store.state.playMode)
    const modeText = computed(()=> modeTextArr[playMode.value])
    const modeIcon = computed(()=> modeIconArr[playMode.value])

    // 监听音乐的播放状态
    watch(playing, (newState)=>{
        if(newState){
            // 启动播放音乐
            audioRef.value.play()
        }else{
            // 暂停播放音乐
            audioRef.value.pause()
        }
    })

    // 切换播放状态: 播放 / 暂停
    function togglePlayState(){
        store.commit("setPlayingState", !playing.value)
    }

    // 下一首
    function nextPlay(){
        switchMusic(currentIndex.value + 1)
    }

    // 上一首
    function prevPlay() {
        switchMusic(currentIndex.value - 1)
    }
    
    // 切换音乐
    function switchMusic(index){
        let musicLen = musicPlayList.value.length
        // 列表里没有歌
        if(musicLen === 0) return 
        // 列表里只有1首歌, 设置播放状态为停止 | 设置重新播放
        if(musicLen === 1) return store.commit("setPlayingState", false)
        // 判断边界
        if(index === musicLen) index = 0
        // 判断边界
        if(index < 0) index = musicLen - 1
        store.commit("setCurrentIndex", index)
    }

    // 更换播放模式
    async function changeMode(){
       const modeVal = (playMode.value + 1) % 3
       store.dispatch("changeMode", modeVal)
       await nextTick() // 当它执行完表示数据修改完毕
       Toast({message: modeText, position: 'bottom',})
    }

    return {
        togglePlayState,
        nextPlay,
        prevPlay,
        changeMode,
        modeText,
        modeIcon
    }

}
