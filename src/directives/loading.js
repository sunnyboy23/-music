import Loading  from "@/components/Loading.vue";
import { createApp, onUpdated } from "vue";

export default{
    /**
     * 指令绑定的dom元素挂载到页面后触发
     *
     */
    mounted(el,binding){
        //为了获取loading组件内的dom元素
        let loadApp = createApp(Loading)
        let instance = loadApp.mount(document.createElement("div"))
        //添加dom元素到页面需要真实dom   instance.$el 就是loading组件的dom元素 
        
        el.instance = instance.$el
        if(binding.value) append(el)
    },
    //指令绑定的值发生变化时触发
    updated(el,binding){
        binding.value ? append(el) : remove(el)
    }
}
function append(el){
    //获取被绑定元素的全部样式
    let allStyle = getComputedStyle(el)
    let arr = ['absolute','fixed','relative'] 
    if(arr.indexOf(allStyle.position) === -1) el.style.position = 'relative'

    //给指定绑定的dom元素内添加一个loading元素容器
    el.appendChild(el.instance)
}
function remove(el){
    el.removeChild(el.instance)
}