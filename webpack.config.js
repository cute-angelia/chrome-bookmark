const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path');

const HappyPack = require('happypack');
// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({
  size: 5
});

const {
  version
} = require('./package.json')

const AppPath = __dirname + "/chrome";;
const AppDistPath = AppPath + "/dist";

const DistPath = __dirname + "/build";

const isPro = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: "production",
  // Chrome extension compiled by Webpack throws `unsafe-eval` error
  // devtool: 'inline-source-map',
  devtool: isPro ? 'cheap-module-source-map' : 'inline-source-map',
  node: {
    fs: "empty",
  },
  optimization: {
    runtimeChunk: false,
    minimize: !isDev ? true : false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: !isDev ? true : false,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  entry: {
    options: AppPath + "/js/options.js",
    background: AppPath + "/js/background-script.js",
    popup: AppPath + "/js/popup.js",
    "content-script": AppPath + "/js/content-script.js",
    "browser-polyfill": AppPath + "/js/browser-polyfill.js",
  },
  output: {
    path: AppDistPath,
    filename: "[name].entry.js",
  },
  watch: false,
  watchOptions: {
    aggregateTimeout: 3000,
    // poll: 2000,
    ignored: /node_modules/
  },
  module: {
    rules: [{
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    },
    {
      test: /\.vue$/,
      loader: "vue-loader"
    },
    {
      test: /\.svg$/,
      loader: "svg-inline-loader"
    },
    {
      test: /\.html$/,
      loader: "html-loader"
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        // loader: 'babel-loader'
        loader: 'esbuild-loader',
        options: {
          target: 'es2015'
        }
      }
      // use: {
      //   loader: "babel-loader",
      //   options: {
      //     cacheDirectory: true
      //   }
      // }
    },
    {
      test: /\.(css)$/,
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      },
      {
        loader: "css-loader" // translates CSS into CommonJS
      }
      ]
    },
    {
      test: /\.(woff|woff2|eot|ttf|png|svg|gif)(\?.*$|$)/,
      loader: "url-loader?importLoaders=1&limit=100000"
    }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.mjs', '.json', ".html"],
    alias: {
      // vue$: "vue/dist/vue.esm.js"
      // vue$: "vue/dist/vue.runtime.esm.js"
      '@': path.resolve(__dirname, './chrome/option/src'),
      '~': path.resolve(__dirname, './chrome'),
      vue$: 'vue/dist/vue.esm-bundler.js',
    }
  },
  performance: {
    hints: false
  },
  plugins: [
    // new HappyPack({
    //   // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
    //   id: 'babel',
    //   // 如何处理 .js 文件，用法和 Loader 配置中一样
    //   loaders: ['babel-loader?cacheDirectory'],
    //   // ... 其它配置项
    //   // 使用共享进程池中的子进程去处理任务
    //   threadPool: happyThreadPool,
    // }),
    // new HappyPack({
    //   id: 'css',
    //   // 如何处理 .css 文件，用法和 Loader 配置中一样
    //   loaders: ['css-loader', 'style-loader'],
    //   // 使用共享进程池中的子进程去处理任务
    //   threadPool: happyThreadPool,
    // }),
    // new CleanWebpackPlugin(),
    // new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      "__VUE_OPTIONS_API__": true,
      "__VUE_PROD_DEVTOOLS__": false,
    }),
    new webpack.BannerPlugin("Copyright banther@pm.me"),
    // new CopyPlugin([{
    //   from: AppPath + "/background-wrapper.js",
    //   to: DistPath,
    // }]),
    new CopyPlugin([{
      from: AppPath + "/icons",
      to: DistPath + "/icons"
    }]),
    new CopyPlugin([{
      from: AppPath + "/css",
      to: DistPath + "/css"
    }]),

    new CopyPlugin([{
      from: AppPath + "/less",
      to: DistPath + "/less"
    }]),
    new CopyPlugin([{
      from: AppPath + "/view",
      to: DistPath + "/view"
    }]),
    // new CopyPlugin([{
    //   from: AppPath + "/option/public/favicon.ico",
    //   to: DistPath + "/favicon.ico"
    // }]),
    new CopyPlugin([{
      from: AppPath + "/manifest.json",
      to: DistPath,
      transform: (content) => {
        const jsonContent = JSON.parse(content)
        jsonContent.version = version
        return JSON.stringify(jsonContent, null, 2)
      },
    }]),
    new CopyPlugin([{
      from: AppPath + "/dist/",
      to: DistPath + "/dist/",
    }]),
  ],
};