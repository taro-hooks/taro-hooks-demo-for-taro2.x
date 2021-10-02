const { resolve } = require("path");
const env = process.env.TARO_ENV;
const config = {
  projectName: "taro-hooks 2.x demo",
  date: "2021-10-2",
  designWidth: 750,
  deviceRatio: {
    "640": 2.34 / 2,
    "750": 1,
    "828": 1.81 / 2,
  },
  alias: {
    react: resolve(
      __dirname,
      "..",
      "node_modules",
      "@tarojs/taro-" + env,
      env === "h5" ? "src/index.cjs.js" : "index.js"
    ),
  },
  sourceRoot: "src",
  outputRoot: "dist",
  babel: {
    sourceMap: true,
    presets: [
      [
        "env",
        {
          modules: false,
        },
      ],
    ],
    plugins: [
      "transform-decorators-legacy",
      "transform-class-properties",
      "transform-object-rest-spread",
      [
        "transform-runtime",
        {
          helpers: false,
          polyfill: false,
          regenerator: true,
          moduleName: "babel-runtime",
        },
      ],
      [
        "import",
        {
          libraryName: "taro-hooks",
          camel2DashComponentName: false,
        },
        "taro-hooks",
      ],
    ],
  },
  plugins: ["@tarojs/plugin-less", "@tarojs/plugin-terser"],
  defineConstants: {},
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 10240, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    esnextModules: ["taro-hooks"],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ["last 3 versions", "Android >= 4.1", "ios >= 8"],
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    webpackChain(chain) {
      chain.merge({
        module: {
          rule: {
            "taro-hooks-loader": {
              test: /taro-hooks/,
              loader: resolve(__dirname, "taro-hooks-loader"),
            },
          },
        },
      });
    },
    ...(process.env.TARGET === "GH"
      ? {
          router: {
            mode: "hash",
            basename: "/taro-hooks-demo-for-taro2.x",
          },
        }
      : {}),
  },
};

module.exports = function(merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
