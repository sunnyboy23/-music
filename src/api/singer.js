import request from "@/untils/axios"

//请求热门歌手数据
export function getHotSinger(){
    return request({
        url: '/top/artists',
        method: 'get',
        params:{
            limit: 30  //数量, 默认50条
        }
    })
}

// 根据 字母 请求相同首字母名称的歌手的数据
export function getSingerList(letter){
    return request({
        url: '/artist/list',
        method: 'get',
        params:{
            // 字母参数
            initial: letter,
            // initial: "B",  // 表示查询b开头或者拼音b开头的歌手的数据
            type: -1,  //全部性别
            area: 7 //华语歌手
        }
    })
}

// 请求歌手的信息
export function getSingerDetail(id){
    return request({
        url: '/artist/detail',
        method: 'get',
        params:{
            id
        }
    })
}


// 获取歌手50首热门歌曲
export function getSingerAllSongs(id){
    return request({
        url: '/artist/top/song',
        method: 'get',
        params:{
            id
        }
    })
}