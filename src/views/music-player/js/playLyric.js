import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { getLyric } from "@/api/song"
import { formatLyric } from "@/untils/fromat"

export default function(currentTime){
    const store = useStore()
    const currentSong = computed(()=>store.getters.currentSong)
    const lyricScrollRef = ref(null)
    const lyricBlockRef = ref(null)
    const currentLyric = ref([]) //歌词对象
    const playLyric = ref("") // 当前行需要高亮的歌词
    const currentLineNum = ref(0) // 当前行需要高亮的行数
    let timer = null //定时器id

    // 监听currenSong的变化，请求歌词
    watch(currentSong, (newSong)=>{
        if(!newSong.id) return
        getLyric(newSong.id)
        .then(res => {
            currentLyric.value = formatLyric(res.data.lrc.lyric)
            currentTime.value = 0
            stopOperationLyric()
            // 开始定时获取当前需要高亮的歌词
            startOperationLyric()
        })
        .catch(err => {
            console.log("歌词获取失败", err);
        })
    })

    // 监听高亮行数的变化
    watch(()=>currentLineNum.value, (newNum)=>{
        // 滚动到下一句歌词的位置
        scrollRunning(newNum)
    })

    // 开始高亮当行歌词
    function startOperationLyric(){
        if(currentLyric.value.length > 0){
            getInitCurrentLyric()
            timedUpdateLyric()
        }
    }

    // 关闭定时器
    function stopOperationLyric(){
        clearTimeout(timer)
    }

    // 初始需要高亮的歌词
    function getInitCurrentLyric(){
        let cLyricValue = currentLyric.value, //歌词数组
            cTimeVal = currentTime.value, // 当前音乐播放时间
            len = cLyricValue.length,
            index = 0 //高亮的行数
        for(let i = 0; i < len; i++){
            // 当前播放时间 大于等于 当前i的time 且小于 下一个i的time 
            if(cTimeVal >= cLyricValue[i].time && (cTimeVal < cLyricValue[i+1]?.time || i === len - 1)){
                index = i
                console.log(i);
                break
            }
        }
        // 当前这行需要高亮的歌词
        playLyric.value = cLyricValue[index].lyric
        // 当前需要高亮的行数
        currentLineNum.value = index
    }

    // 定时更新需要高亮的歌词 和 行数
    function timedUpdateLyric(){
        let cLyricValue = currentLyric.value //歌词数组
        let len = cLyricValue.length
        let index = currentLineNum.value // 当前行数

        // 如果已经是最后一项歌词了，就不再往下开启定时器
        if(index >= len - 1) return currentLineNum.value = len - 1

        // 下一句歌词触发更新的时间(秒)： 下一行歌词的播放时间 - 当前播放时间
        let delay = cLyricValue[index + 1].time - currentTime.value

        // 开启定时器更新歌词 与 行数
        timer = setTimeout(() => {
            // 限制index不超过边界
            index = Math.min(index+1, len - 1)
            currentLineNum.value = index
            playLyric.value = cLyricValue[index].lyric

            // 开启下一行的定时器
            timedUpdateLyric()
        }, delay * 1000);
    }

    // 滚动动画：滚动到下一句歌词的位置
    function scrollRunning(num){
        if(num > 5){
            const targetEle = lyricBlockRef.value.children[num - 5]
            // 滚动到指定元素的位置
            lyricScrollRef.value.scroll.scrollToElement(targetEle, 1000)
        }else{
            // 不发生滚动
            lyricScrollRef.value.scroll.scrollTo(0, 0, 1000)
        }
    }

    // 滚动歌词区域
    // 停止滚动区域
    
    return {
        currentLyric,
        currentLineNum,
        playLyric,
        lyricScrollRef,
        lyricBlockRef,
        startOperationLyric,
        stopOperationLyric
    }
}

/* 

[00:00.000] 作词 : 唐恬
[00:00.406] 作曲 : 钱雷
[00:00.812] 编曲 : 钱雷
[00:01.218] 制作人 : 钱雷
[00:01.624] 吉他 : 高飞
[00:02.030] 人声录音 : 利伟明
[00:02.436] 人声录音室 : 雅旺录音室
[00:02.842] 人声编辑 : 汝文博
[00:03.248] 混音 : 周天澈
[00:03.654] 母带 : 周天澈
[00:04.63]词版权管理方：北京梦织音传媒有限公司
[00:04.78]曲版权管理方：索尼音乐版权代理（北京）有限公司
[00:04.92]录音作品及MV版权：EAS MUSIC LTD
[00:05.00]联合出品：拳头游戏/腾讯游戏/腾讯视频
[00:05.07]出品监制：霍锦 卢泓宇
[00:22.29]都 是勇敢的
[00:28.50]你额头的伤口 你的 不同 你犯的错
[00:36.96]都 不必隐藏
[00:43.20]你破旧的玩偶 你的 面具 你的自我
[00:51.46]
[00:51.76]他们说 要带着光 驯服每一头怪兽
[00:58.65]他们说 要缝好你的伤 没有人爱小丑
[01:05.98]为何孤独 不可 光荣
[01:09.25]人只有不完美 值得歌颂
[01:13.52]谁说污泥满身的不算英雄
[01:20.50]
[01:20.80]爱你孤身走暗巷
[01:22.88]爱你不跪的模样
[01:24.61]爱你对峙过绝望
[01:26.41]不肯哭一场
[01:28.05]
[01:28.35]爱你破烂的衣裳
[01:30.11]却敢堵命运的枪
[01:31.95]爱你和我那么像
[01:33.83]缺口都一样
[01:35.23]
[01:35.53]去吗？配吗？这褴褛的披风
[01:39.43]战吗？战啊！以最卑微的梦
[01:43.08]致那黑夜中的呜咽与怒吼
[01:50.35]谁说站在光里的才算英雄
[02:08.41]
[02:08.71]他们说 要戒了你的狂 就像擦掉了污垢
[02:16.25]他们说 要顺台阶而上 而代价是低头
[02:23.33]那就让我 不可 乘风
[02:26.59]你一样骄傲着 那种孤勇
[02:31.07]谁说对弈平凡的不算英雄
[02:38.05]
[02:38.35]爱你孤身走暗巷
[02:40.29]爱你不跪的模样
[02:42.10]爱你对峙过绝望
[02:43.85]不肯哭一场
[02:45.92]
[02:45.92]爱你破烂的衣裳
[02:47.62]却敢堵命运的枪
[02:49.43]爱你和我那么像
[02:51.37]缺口都一样
[02:52.86]
[02:53.16]去吗？配吗？这褴褛的披风
[02:56.85]战吗？战啊！以最卑微的梦
[03:00.55]致那黑夜中的呜咽与怒吼
[03:07.82]谁说站在光里的才算英雄
[03:12.25]
[03:12.55]你的斑驳 与众不同
[03:19.89]你的沉默 震耳欲聋 You Are The Hero
[03:26.14]
[03:26.44]爱你孤身走暗巷
[03:28.27]爱你不跪的模样
[03:30.09]爱你对峙过绝望
[03:31.94]不肯哭一场 (You Are The Hero)
[03:33.45]
[03:33.75]爱你来自于蛮荒
[03:35.75]一生不借谁的光
[03:37.43]你将造你的城邦
[03:39.25]在废墟之上
[03:40.72]
[03:41.02]去吗？去啊！以最卑微的梦
[03:44.85]战吗？战啊！以最孤高的梦
[03:48.54]致那黑夜中的呜咽与怒吼
[03:55.81]谁说站在光里的才算英雄
*/