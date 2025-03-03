//批量处理svg的图标文件
const request = require.context("./svg",false,/\.svg$/)

request.keys().forEach(srcItem => {
    //将遍历路径传入request
    request(srcItem)
});
