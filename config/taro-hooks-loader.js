export default function taroHooksLoader(source) {
  return source.replace("@tarojs/taro", "@tarojs/taro-h5/src/index.cjs.js");
}
