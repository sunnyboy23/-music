<template>
  <div class="singer">
    <!-- 歌手的列表区域 -->
    <Scroll class="scroll-plane" ref="scrollRef" :probeType="3" @scroll="handleScrollView">
      <ul class="singer-list" ref="groupRef">
        <!-- 列表组 -->
        <li
          class="singer-list-group"
          v-for="item in singerList"
          :key="item.tag"
        >
          <h3 class="group-title">{{ item.tag }}</h3>
          <ul>
            <li
              class="group-item"
              v-for="sItem in item.singerInfo"
              :key="sItem.id"
              @click="handleClick(sItem.id)"
            >
              <div class="avatar">
                <!-- 图片的懒加载 -->
                <!-- 出现在可视区域，src的地址就是外部图片链接地址-->
                <img v-img-lazy="sItem.picUrl" :alt="sItem.name" />

                <!-- 没出现在可视区域，看不到。 设置src的地址为默认图片的路径 -->
                <!-- <img src="@/assets/default.png"> -->
                <!-- 当检测到img标签出现在了可视区域，立刻把src的外部链接地址重新赋值给src -->
                <!-- <img :src="sItem.picUrl"> -->
              </div>
              <span class="name">{{ sItem.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>
    <!-- 固定索引栏 -->
    <div class="index-bar">
      <ul>
        <li 
          v-for="(item, index) in singerList" 
          :key="item.tag"
          :data-index="index"
          :class="{current: currentIndex === index}"
          @touchstart.prevent.stop="handleTouchStart($event, index)"
          @touchmove.prevent.stop="handleTouchMove($event)"
        >
          {{ item.tag }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import Scroll from "@/components/Scroll.vue";
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import { getHotSinger, getSingerList } from "@/api/singer";
import {useRouter} from "vue-router";

// 歌手数据列表
let singerList = handleAnchor(),
    tempArr = reactive([]),
    router = useRouter()

// 获取锚点列表里的26个英文字母  A-Z
function handleAnchor() {
  let arr = reactive([{ tag: "热" }]);
  for (let i = 65; i < 91; i++) {
    arr.push({ tag: String.fromCharCode(i) });
    // console.log(String.fromCharCode(i));
  }
  return arr;
}

onMounted(() => {
  singerList.forEach((item) => {
    if (item.tag === "热") {
      // 请求热门歌手
      getHotSinger()
        .then((res) => {
          item.singerInfo = res.data.artists;
          tempArr.push(item.singerInfo)
        })
        .catch((err) => {
          console.log("热门歌手请求失败", err);
        });
    } else {
      // 根据字母请求歌手
      getSingerList(item.tag)
        .then((res) => {
          item.singerInfo = res.data.artists;
          tempArr.push(item.singerInfo)
        })
        .catch((err) => {
          console.log("根据字母请求歌手出错", err);
        });
    }
  });
  console.log(singerList);
});

/* 处理点击索引栏上的字母锚点 */
// betterScroll的实例对象
let scrollRef = ref(null) 
let groupRef = ref(null) 
let touch = {} 
// 选中的索引栏下标
let currentIndex = ref(0)
let allGroupItemHeight = ref([])


// 当触摸到索引栏的某个字母, 滚动ul列表到指定的位置
function handleTouchStart(e, i){
  // let anchorIndex = e.target.dataset.index / 1
  
  // 触摸时，第1个触摸点的y坐标
  touch.y1 = e.touches[0].pageY
  // currentIndex.value = i
  touch.anchorIndex = i
  scrollTo(i)
}

// 当手指在索引栏内触摸的同时上下移动, 滚动ul列表到指定的位置
function handleTouchMove(e){
  // 移动过程中, 触摸点的y坐标
  
  touch.y2 = e.touches[0].pageY
  // 得到偏移下标量 = Y坐标的差值 / 字母li的高度20
  let moveIndex = Math.floor((touch.y2 - touch.y1) / 20)
  
  // 初始量： 加上 手指第1个触摸点的下标
  moveIndex += touch.anchorIndex

  // currentIndex.value = moveIndex
  scrollTo(moveIndex)

}

/* 
  在页面视图上滚动，滚动到哪个区域，就高亮该区域对应的字母
  每个区域的高度（坐标区间： 顶点~底部），从而才能知道你现在再哪个区域内部
*/
watch(() => tempArr.length, async () => {
  // 等待页面更新完毕
  await nextTick()

  // 得到所有列表组元素节点
  let allGroupLi = groupRef.value.children

  // 初始高度 0
  let initHeight = 0

  // 临时存储每个列表组的坐标区间
  let temp = [initHeight]

  for(let i = 0; i < allGroupLi.length; i++){
      // 累加存储当前item的高度区间
      temp.push(initHeight += allGroupLi[i].offsetHeight)
  }
  allGroupItemHeight.value = temp
})

// 滚动视图时高亮索引栏字母
function handleScrollView(y){
  
  y = -y
  allGroupItemHeight.value.forEach((itemY, i) => {
    // 得到下一个 itemY
    let nextItemY = allGroupItemHeight.value[i+1]
    // 判断是否在当前项 与 下一项的区间内
    if( y >= itemY && y < nextItemY){
      // console.log(i);
      currentIndex.value = i
    }
  })
  // console.log(allGroupItemHeight.value);
}

// 将这个元素在滚动容器内置顶（滚动元素到顶部）
function scrollTo(i){
  i = Math.max(0, Math.min(i, groupRef.value.children.length - 1))
  currentIndex.value = i
  let targetElement = groupRef.value.children[i]
  let scroll = scrollRef.value.scroll
  scroll.scrollToElement(targetElement)
}

function handleClick(id){
  // 点击歌手，跳转到歌手的详情页
  router.push(`/m/singerDetail/${id}`)
}

</script>

<style lang="less" scoped>
.singer {
  // 索引栏
  .index-bar {
    position: fixed;
    top: 50%;
    right: 10px;
    z-index: 999;
    width: 18px;
    background-color: @sidebar-background;
    transform: translateY(-50%);
    color: @dark-color;
    border-radius: 18px;
    li {
      height: 20px;
      font-size: @font-size-mini;
      line-height: 20px;
      text-align: center;
      box-sizing: border-box;
    }
    // 高亮的颜色
    .current {
      // color: @light-color;
      color: #ff0;
    }
  }
  // 固定滚动容器的高度
  .scroll-plane{
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 88px);
  }
  .singer-list {
    .singer-list-group {
      .group-title {
        padding-left: 16px;
        height: 2em;
        line-height: 2em;
        font-size: @font-size-mini;
        color: @dark-color;
        background: @sidebar-background;
      }
      .group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          overflow: hidden;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        span.name {
          margin-left: 20px;
          color: @dark-color;
          font-size: @font-size-small;
        }
      }
    }
  }
}
</style>
