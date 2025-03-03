import request from "@/untils/axios"
 //请求轮播区域的图片
 export function getRecommendSwiper(){
    return request({
        url:"/banner",
        method:"get" 
    })
 }
//请求推荐歌单数据
 export function getRecommendPlaylist(){
    return request({
        url:"/personalized",
        method:"get" ,
        params:{
            limit:6 //默认30
        }
    })
 }
 //请求新歌
 export function getRecommendNewSong(){
    return request({
        url:'/personalized/newsong',
        method:"get" ,
        params:{
            limit:4 //默认30
        }
    })
 }
 // 推荐歌单的详情数据
export function getPlaylistDetail(id){
    return request({
        url: '/playlist/detail',
        method: 'get',
        params: {
            id
        }
    })
}