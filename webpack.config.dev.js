var webpack = require('webpack');
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');//css样式从js文件中分离出来,需要通过命令行安装 extract-text-webpack-plugin依赖包
var ChunkManifestPlugin = require("chunk-manifest-webpack2-plugin");
var WebpackChunkHashPlugin = require("webpack-chunk-hash");
/*
var loaderOptionsPlugin=new webpack.LoaderOptionsPlugin(
                            {
                              minimize: true,
                              debug: false,
                              options: {
                                context: __dirname
                              }
                            }
                        )
*/
var definePlugin=new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': '"developer"'
  }
});
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
                        name:['vendor'],
                        minChunks: Infinity
                    });
var extractCSS = new ExtractTextPlugin({filename:'style/[name].css', disable: false, allChunks: true});
var uglifyJsPlugin=new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })  //对代码进行压缩，目前不支持ES6语法压缩，只能通过Babel转成ES5后再进行压缩
var chunkManifestPlugin=new ChunkManifestPlugin({
      filename: "js/chunk-manifest.json",
      manifestVariable: "webpackManifest"
    })
var hashedModuleIdsPlugin=new webpack.HashedModuleIdsPlugin()
var webpackChunkHashPlugin=new WebpackChunkHashPlugin()
var htmpWebpackPlugin=new HtmlWebpackPlugin({
    title: 'Custom template',
    template: './src/tmpl/index.ejs', // Load a custom template (ejs by default see the FAQ for details) 
    filename: '../index.html'
  })
module.exports = {
    //插件项
    plugins: [
        definePlugin,
        commonsPlugin,
        //loaderOptionsPlugin,
        hashedModuleIdsPlugin,
        webpackChunkHashPlugin,
        chunkManifestPlugin,
        extractCSS,
        htmpWebpackPlugin,
        //uglifyJsPlugin
    ],
    devtool:'cheap-eval-source-map',
    //页面入口文件配置
    entry: {
        app:'./app.jsx',
        vendor:['jquery','react','redux','react-redux','react-router','react-router-redux','redux-thunk','immutable','redux-immutablejs','react-bootstrap']
    },
    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, 'dist/assets'),
        publicPath: '/dist/assets/',
        filename: 'js/[name].js',
        chunkFilename: "js/[name].js"
    },
    module: {
        //加载器配置
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                //use:['babel-loader'],
                use:{   //把ES6语法转为ES5
                    loader:"babel-loader",
                    options: {
                      presets: ['react','es2015']
                    }
                }
            },
            {
                test: /\.css$/,
                use: extractCSS.extract({ fallback: 'style-loader', use: 'css-loader?modules&importLoaders=1' })
            }, 
            {
                test: /\.scss$/,
                use: extractCSS.extract('css-loader!sass-loader?sourceMap')
            },
            {
                test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
                use: 'url-loader?prefix=font/&limit=10000'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'url-loader?limit=10000&name=img/[hash].[ext]'
                    ]
            }
        ]
    },
    //其它解决方案配置
    resolve: {
        //root: '/home/babystudio/Developer/webpack/', //绝对路径
        extensions: [".js", ".json",".jsx",".scss"],
        modules: [path.resolve(__dirname, "."), "node_modules"]
    }
};