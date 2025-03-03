<template>
  <div>
    <section class="all-songs">
      <p class="songs-subtit">
        <svg-icon class="icon" iconFileName="player" />
        <span>顺序播放全部 ({{ songsData.length }})</span>
      </p>
      <ul class="songs-list" v-loading="loading">
        <li
          class="songs-item"
          v-for="(item, index) in songsData"
          :key="index"
          @click="addOneSong(item)"
        >
          <p class="order">{{ index + 1 }}</p>
          <div class="content">
            <h4 class="name">{{ item.name }}</h4>
            <p class="desc">
              <span v-for="aItem in item.ar" :key="aItem.id">
                {{ aItem.name }} &nbsp;
              </span>
            </p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import {computed} from "vue"
import { useStore } from "vuex"
let {songsData} = defineProps(["songsData"])
let store = useStore()
let loading = computed(()=>songsData.length <= 0)


let addOneSong = ({id,name,al,ar})=>{
    store.dispatch("addOneSong", {id, name, picUrl: al.picUrl, ar})
}
</script>

<style lang="less" scoped>
.all-songs {
  margin: 10px;
  .songs-subtit {
    margin-bottom: 10px;
    line-height: 30px;
    font-size: @font-size-medium;
    color: @light-color;
    .icon {
      width: 26px;
      height: 26px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
  }
  .songs-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    .order {
      width: 30px;
      height: 30px;
      font-size: @font-size-large;
      color: @dark-color-m;
    }
    .content {
      width: 90%;
      h4.name {
        font-size: @font-size-medium;
        color: @light-color-m;
        margin-bottom: 6px;
      }
      p.desc {
        font-size: @font-size-small;
        color: @dark-color;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>