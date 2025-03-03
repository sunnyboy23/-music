<template>
  <div class="recommend">
    <!-- 轮播 -->
    <div class="swiper-container">
    <van-swipe
        class="remd-swiper"
        :autoplay="3000"
        indicator-color="white"
        lazy-render
      >
        <van-swipe-item v-for="item in swiperImgList" :key="item">
          <img :src="item.imageUrl" width="375" class="imger" alt="图片" />
        </van-swipe-item>
    </van-swipe>
    </div>
    <!-- 推荐歌单 -->
    <section class="recommend-playlist">
      <div class="remd-header">
        <h3>推荐歌单</h3>
      </div>
      <ul class="remd-playlist">
        <li v-for="(item, index) in playlist" :key="index"  @click="handleClickPlayList(item.id)">
          <img class="cover" v-img-lazy="item.picUrl" alt="封面" />
          <p class="name">{{ item.name }}</p>
        </li>
      </ul>
    </section>
    <!-- 新歌推荐 -->
    <section class="recommend-newsong">
      <div class="remd-header">
        <h3>新歌推荐</h3>
      </div>
      <ul class="remd-newsong">
        <li v-for="(item, i) in newSongList" :key="i" >
          <img class="pic" v-img-lazy="item.picUrl" alt="新歌封面" @click="addOneSong(item)"/>
          <div class="info">
            <h4 class="name">{{ item.name }}</h4>
            <p>
              <span v-for="(aItem, aI) in item.song.artists" :key="aI">
                {{ aItem.name }}
              </span>
            </p>
          </div>
          <SvgIcon class="icon" iconFileName="player"/>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import {getRecommendSwiper,getRecommendPlaylist,getRecommendNewSong} from "@/api/recommend"

let swiperImgList = reactive([])
let playlist = reactive([])
let store = useStore()
let newSongList = reactive([])
let route = useRouter()
onMounted(()=>{
    getSwiperImg();
    getPlaylist();
    getNewSongList();
});

let getSwiperImg = ()=>{
      getRecommendSwiper({ type:2 })
        .then((res)=>{
           swiperImgList.push(...res.data.banners); 
        })
        .catch((err)=>{
            console.log("轮播请求失败",err)
        }); 
    }
let getPlaylist = ()=>{
  getRecommendPlaylist()
  .then((res)=>{
    playlist.push(...res.data.result)
    
  })
  .catch((err)=>{
    console.log("歌单数据获取失败",err)
  })
}
// 点击歌曲: 添加1首歌到播放列表
function addOneSong({id, name, picUrl, song}){
  store.dispatch("addOneSong", {id, name, picUrl, ar: song.artists})
  console.log(123);
}
let getNewSongList = ()=>{
  getRecommendNewSong()
  .then((res)=>{
      newSongList.push(...res.data.result)
    })
  .catch((err)=>{
      console.log("新歌请求失败",err)
    })
  
}
//跳转到歌单详情页
let handleClickPlayList = (id)=>{
  console.log(id);
  route.push(`/m/playList/${id}`)
}

</script>

<style lang="less" scoped>
.recommend {
  // padding-top: 88px;
  width: 100%;
  .remd-header {
    margin: 10px;
    h3 {
      height: 26px;
      font-size: @font-size-large;
      line-height: 2em;
      color: @light-color;
      letter-spacing: 0.12em;
      font-weight: bold;
    }
  }
}
.swipe-container {
  width: 100%;
   .remd-swiper {
    .van-swipe-item {
        img {
            width: 100%;
        }
    }
  }
}
.recommend-playlist {
  .remd-playlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    li {
      flex: 0 0 32%;
      max-width: 32%;
      margin: 10px 0;
      box-sizing: border-box;
      img {
        width: 100%;
        height: auto;
        border-radius: 10px;
      }
      p {
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 3em;
        line-height: 1.5em;
        color: @light-color;
        font-size: @font-size-small;
      }
    }
  }
}
.remd-newsong {
    margin:0 10px;
  li {
    position: relative;
    display: flex;
    height: 60px;
    margin-bottom: 10px;
    justify-content: space-between;
    align-items: center;
    .pic {
      width: 56px;
      height: 56px;
      border-radius: 10px;
    }
    .info {
      overflow: hidden;
      flex: 1;
      margin-left: 12px;
      height: 100%;
      border-bottom: @dark-color-m solid 1px;
      h4 {
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        color: @light-color-m;
        font-size: @font-size-medium;
      }
      p {
        margin-top: 10px;
        color: @dark-color-m;
        font-size: @font-size-small;
      }
    }
    .icon{
        position: absolute;
        margin-top: auto;
        margin-bottom: auto;
        width: 24px;
        height: 24px;
        top: 0;
        bottom: 0;
        right: 0;
        font-size: 2em;
        color: @dark-color;
    }
  }
}
</style>