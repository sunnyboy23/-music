// 处理秒数, 返回 00 : 00格式
export function formatTime(time){
    time = time | 0
    // 转分钟
    let m = String((time / 60) | 0).padStart(2, 0) 

    // 转秒数
    let s = String(time % 60).padStart(2, 0) 

    return `${m}:${s} `
}

// 格式化歌词
export function formatLyric(str){
    return str.split(/\n/).filter(item => item !== "").map((item) => {
        let [, time, lyric] = item.split(/\[|\]/g)

        // 换算时间为秒数
        // time.split(":")[0]*60 + time.split(":")[1]*1
        time = time.split(":").reduce((a, b) => a*60 + b*1)
        return {time,lyric}
    })
}

/* 
0: "[00:00.000] 作词 : 唐恬"
1: "[00:00.406] 作曲 : 钱雷"
*/