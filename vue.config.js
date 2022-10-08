const path = require('path');
var webpack = require('webpack')

module.exports = {

    //基本路径
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
    // 输出文件目录
    outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',
    assetsDir: 'static',
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    devServer: {
        open: false,
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: {
            [process.env.VUE_APP_API]: {
                // target: 'http://192.168.161.123:8843', 
                // target: 'http://192.168.0.103:8843',
                target: 'http://172.21.4.112:8843',
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_API]: ''
                }
            }
        }
    },
    configureWebpack: (config) => {
        config.resolve = { // 配置解析别名
            extensions: ['.js', '.json', '.vue'], // 自动添加文件名后缀
            alias: {
                'vue': 'vue/dist/vue.js',
                '@': path.resolve(__dirname, './src'),
                '@c': path.resolve(__dirname, './src/components')
            }
        }
    }
}