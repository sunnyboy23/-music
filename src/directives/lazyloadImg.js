import defaultImg from "@/assets/lazy.jpg"
import { useIntersectionObserver } from "@vueuse/core"
export default {
    /**
     * 指令绑定的dom元素挂载到页面后触发
     * @param {*} el 指令绑定的dom元素
     * @param {*} binding  指令绑定的值以及配置项信息
     */
    mounted(el, binding){
        // 初始先设置img的src为默认图片(占位)
        el.src = defaultImg

        /**
         * 开启异步监听
         * el 指令绑定的dom对象
         * 回调函数：
         */
        let {stop} = useIntersectionObserver(el, ([{isIntersecting}]) => {
            if(isIntersecting){
                // 将实际的图片地址赋值给元素的src
                el.src = binding.value
                // 当图片加载失败时
                el.onerror = () => {
                    el.src = defaultImg
                }
                // 在可视区域里了, 停止对该元素的监听
                stop()
            }
        })
    },
}