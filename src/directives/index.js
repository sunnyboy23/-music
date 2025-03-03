import loading from "./loading"
import lazyloadImg from "./lazyloadImg"
export default{
    install(app){
        // 注册全局的自定义指令
        // 加载框
        app.directive("loading", loading) // v-loading   

        // 图片懒加载
        app.directive("img-lazy", lazyloadImg) // v-img-lazy   
        // app.directive("wanzi", ) //v-wanzi
        // console.log(222, app);
    }
}