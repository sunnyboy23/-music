import request from '@/untils/axios'

//获取搜索结果
export function getSearchResult(keywords){
    return request({
        url:'/search',
        method:'get',
        params:{
            keywords
        }
    })
}

//推荐搜索词
export function getDefaultKeyword(keywords){
    return request({
        url:'/search/default',
        method:'get',
        
    })
}

//热门搜索词
export function getHotKeyword(){
    return request({
        url: '/search/hot',
        method: 'get'
    })
}