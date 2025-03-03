const { defineConfig } = require('@vue/cli-service');
const path = require("path");
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:{
      plugins:[
        //设置项目中使用的ui组件为自动按需导入
        ComponentsPlugin({
              resolvers:[VantResolver()]
        })
      ]
  },
  pluginOptions:{
    //设置全局样式loader
    "style-resources-loader": {
      //指定使用less
      preProcessor:"less",
      //指定路径，允许多个
      patterns:[
        //任意组件都能访问该less文件中的变量
        path.join(__dirname,"./src/styles/variable.less")
      ]
    }
  },
  chainWebpack:config =>{
      //配置svg的一个loader
      config.module.rules.delete("svg");//删除原有svg配置
      config.module
        .rule("svg")
        .exclude.add(path.join(__dirname,"./src/icons"))
        .end()
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(path.join(__dirname,"./src/icons"))
        .end()
        .use("svg-sprite-loader")
        .loader('svg-sprite-loader')
        .options({
            symbolId:'icon-[name]'//英勇svg图标名称
        })
        .end()

  }
})
