# 如何在`taro 2.x`中使用`taro-hooks`?

`taro 1.3.x` 开始 即支持 `react hooks`. 但和`3.x`的支持方式不同. 而且非运行时.    

有小伙伴希望可以在`2.x`中使用`taro-hooks`. 我们可以通过配置的方式来达到使用`taro-hooks`.    

主要需要注意一下几点改动:   

1. 由于早版本的`taro`模式还是`nervjs`. 故限制了部分`hooks`需从`@tarojs/taro`中引入. 在经由`taro-cli`来进行分发不同的端匹配. `taro-hooks`初期就是适配`3.x`来进行使用的, 故源码中直接对`react`进行了引用. 这里我们需要转换一下模块, 需要用到配置中的`alias`.

  ```javascript
  // config/index.js 需手动指定端的入口
  const env = process.env.TARO_ENV;
  const config = {
    // ...
    alias: {
      react: resolve(
        __dirname,
        "..",
        "node_modules",
        "@tarojs/taro-" + env,
        env === "h5" ? "src/index.cjs.js" : "index.js"
      ),
    },
    // ...
  }
  ```

2. 由于`taro-hooks`内部不会经由`taro`解析。故部分`api`在`h5`端不会走对应的`default`或者`cjs`的模式, 所以若需要在`h5`端使用, 还需增加`h5`端`webpackChain`的模块解析, 这里简单的为大家提供一个`loader`(实际就是将`@tarojs/taro`替换为了`@tarojs/taro-h5/src/index.cjs.js`):

  - `taro-hooks-loader`

    ```javascript
    // config/taro-hooks-loader.js
    export default function taroHooksLoader(source) {
      return source.replace("@tarojs/taro", "@tarojs/taro-h5/src/index.cjs.js");
    }
    ```

  - `config`

    ```javascript
    // config/index.js
    const config = {
      // ...
      h5: {
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
      }
      // ...
    }
    ```

以上即可在`2.x`版本中使用`taro-hooks`了。但是部分`taro-hooks`补齐的用到的`dom`层面的`hooks`依然无法使用(如: `useImage`在`h5`端的`compress`). 希望大家注意！   

这只是一种解决方式, 若大家还有其他解决方式可寻求最佳解决方式    

此外只是简单适配`2.x`. 本质上`taro-hooks`的设计定位为`3.x`. 故不会分太大的心力在`2.x`中, 使用者需注意. 若有问题请提`issue`至主仓库. 

![screenshot](https://cdn.jsdelivr.net/gh/innocces/DrawingBed/2021-10-03/1633196112926-2.x.png)