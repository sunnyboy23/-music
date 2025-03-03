import request from "@/untils/axios"

export function getRankingList(){
    return request({
        url: '/toplist',
        method: 'get'
    })
}