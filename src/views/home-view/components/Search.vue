<template>
  <div class="search">
    <div class="searce-inner">
        <SvgIcon class="icon" iconFileName="search"/>
        <input type="text" class="search-input" v-model="query" :placeholder="placeholder">
    </div>
    <div class="hot-topics" v-if="searchResult.length <= 0">
        <h3 class="title">热门搜素</h3>
        <ul class="hotlist">
            <li v-for="(item,index) in hotKeywords" @click="changeQuery(item.first)" :key="index" >
                {{item.first}}
            </li>
        </ul>
    </div>
    <div class="search-result">
        <Scroll class="scroll-warp">
            <ul>
                <li v-for="item in searchResult" :key="item.id"
                 @click="addOneSong(item)">
                    <span>{{item.name}}</span>
                    <span v-for="(aItem,index) in item.artists" :key="index">
                        {{aItem.name}}&nbsp;
                    </span>
                </li>
            </ul>

        </Scroll>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted, reactive } from "vue"
import { getSongDetail } from "@/api/song"
import Scroll from "@/components/Scroll.vue"
import {getSearchResult,getDefaultKeyword,getHotKeyword} from '@/api/search'
import{useStore} from 'vuex'

let store = useStore()
let query = ref(""),
    placeholder = ref(""),
    searchResult = ref([]),
    hotKeywords = ref([])

let searchInput = debounce(searchEvent,500)

watch(()=>query.value,(newVal)=>{
    searchEvent(newVal)
})
 
 function searchEvent(newVal){
    newVal = newVal.trim()
    console.log(newVal);
    if(!newVal) return searchResult.value = []

    //请求实时搜索结果
    getSearchResult(newVal)
    .then((res)=>{
        searchResult.value = res.data.result.songs
        
    })
    .catch(err=>{
        console.log('实时结果请求失败',err)
    })
 }
// 点击歌曲: 添加1首歌到播放列表
function addOneSong({id}){
    getSongDetail(id)
    .then(res=>{
        let {id, name, al, ar} = res.data.songs[0]
        store.dispatch("addOneSong", {id, name, picUrl: al.picUrl, ar})
    })
    .catch(err=>{
        console.log("歌曲请求失败", err);
    })
}

function debounce(foo,delay){
    let timer = null;
    return function(...args){
        if(timer == null){
            timer = setTimeout(()=>{
            foo.call(this,...args)
            clearTimeout(timer)
            timer = null
        },delay || 500)
        } 
        
    }
}

onMounted(()=>{
    //获取推荐的搜索词
    getDefaultKeyword()
    .then((res)=>{
        placeholder.value = res.data.data.showKeyword
    }).catch((err)=>{
        console.log("获取推荐搜索词失败",err);

    })

    //获取热门关键词
    getHotKeyword()
    .then((res)=>{
        hotKeywords.value = res.data.result.hots
    }).catch((err)=>{
        console.log("获取热门关键词失败",err);
    })
})

function changeQuery(q){
    query.value = q
}

</script>

<style lang='less' scoped>
.search{
    position: relative;
    padding: 10px 20px;
    /deep/.searce-inner{
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        padding: 0 6px;
        height: 32px;
        background: #6d5b77;
        border-radius: 6px;
       .icon{
            width: 16px;
            height: 16px;
            color: hsla(0,0%,100%,.2);
        }
        .search-input{
            flex: 1;
            margin: 0 6px;
            line-height: 18px;
            background: #6d5b77;
            color: #fff;
            font-size: 14px;
            outline: 0;
            &::-webkit-input-placeholder{
                color: hsla(0,0%,100%,.2);
            }
        }
    }
    .hot-topics{
        margin-top: 20px;
        .title{
            margin-bottom: 20px;
            font-size: 14px;
            color: hsla(0,0%,100%,.8);
        }
        .hotlist > li{
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: #6d5b77;
            font-size: 14px;
            color: hsla(0,0%,100%,.5);
        }
    }
    .search-result{
        width: 100%;
        overflow: hidden;
        color: hsla(0,0%,100%,.5);
        .scroll-wrap{
            width: 100%;
            height: calc(100vh - 130px);
            overflow: hidden;
        }
        li{
            overflow: hidden;
            padding: 5px 30px;
            height: 25px;
            font-size: 14px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>