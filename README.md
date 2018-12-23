# sentry-weapp

为方便小程序接入sentry，由raven改写而来的小程序版本。

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![NPM download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/sentry-weapp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/sentry-weapp
[travis-image]: https://img.shields.io/travis/a526672351/sentry-weapp.svg?style=flat-square
[travis-url]: https://travis-ci.org/a526672351/sentry-weapp
[codecov-image]: https://codecov.io/gh/a526672351/sentry-weapp/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/a526672351/sentry-weapp
[david-image]: https://img.shields.io/david/a526672351/sentry-weapp.svg?style=flat-square
[david-url]: https://david-dm.org/a526672351/sentry-weapp
[snyk-image]: https://snyk.io/test/npm/sentry-weapp/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/sentry-weapp
[download-image]: https://img.shields.io/npm/dm/sentry-weapp.svg?style=flat-square
[download-url]: https://npmjs.org/package/sentry-weapp

#### 安装依赖
```
npm install --save sentry-weapp
yarn add sentry-weapp
```

#### 方式一：引入定制小程序版本
要安装SDK，只需添加高级包，例如：

```
import Raven from 'sentry-weapp'
```

#### 方式二：引入官方版本

```
import Raven from 'sentry-weapp/transport'
```

#### 初始化Raven

```
Raven.config('https://xxx@your.example.com/x', options).install()
```
在app的onLaunch中初始化(?)，options为可选配置对象，目前支持：
```
options = {
    release: '当前小程序版本'，
    environment: 'production', // 指定为production才会上报
    allowDuplicates: true, // 允许相同错误重复上报
    sampleRate: 0.5 // 采样率
}
```
#### 收集信息
收集的信息将在上报时被一起带上
##### 基本信息
初始化后raven会默认收集以下信息：
```
{
    SDKversion: '小程序基础库版本',
    WXversion: '微信版本',
    device: '设备型号',
    network: '网络类型',
    system: '系统信息',
}
```
可以通过[Raven.setUserContext(context)](https://docs.sentry.io/learn/context/#capturing-the-user)或者[Raven.setExtraContext(context)](https://docs.sentry.io/learn/context/#extra-context)添加更多信息（kdtId和userId等）
##### 用户行为
###### console
console的行为默认将被自动收集
###### ajax
wx.request不可扩展，因此只能手动收集请求的行为：例如在经过封装的请求函数的成功回调内添加：
```
Raven.captureBreadcrumb({
  category: 'ajax',
  data: {
    method: 'get',
    url: 'weapp.showcase.page/1.0.0/get',
    status_code: 200
  }
```
###### dom
ui操作的记录暂不支持
###### location
页面变化的记录暂不支持
#### 信息上报
分为message和exception的上报
##### message
使用[Raven.captureMessage(msg, option)](https://docs.sentry.io/clients/javascript/usage/#capturing-messages)上报需要上报的信息比如ajax的报错等
##### exception
所有uncaught exception都会被小程序捕获封装成msg传递到app的onError中，在onError中上报这些信息：
```
onError(msg) {
    Raven.captureException(msg, {
      level: 'error'
    })
  }
```

##### mpVue引入
App.vue 主入口文件

```
import Raven from 'sentry-weapp'

export default {
  onLaunch () {
    Raven.config('https://xxx@your.example.com/x', {
      release: '3.0.4',
      environment: 'production',
      allowDuplicates: true, // 允许相同错误重复上报
      sampleRate: 0.5 // 采样率
    }).install()
  },
  onError (msg) {
    // Raven.captureException(msg)
    Raven.captureException(msg, {
      level: 'error'
    })
  }
}
```

## 资源

* [IRC](irc://chat.freenode.net/sentry) (chat.freenode.net, #sentry)
* Follow [@getsentry](https://twitter.com/getsentry) on Twitter for updates