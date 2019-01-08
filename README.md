# LoginProcess

[![npm version](https://img.shields.io/npm/v/@hecom/loginprocess.svg?style=flat)](https://www.npmjs.com/package/@hecom/loginprocess)

这是登陆进度管理模块，包括触发事件、注册事件监听和占用的权重。

## 安装

```shell
npm install --save @hecom/loginprocess
```

## 使用方法

```javascript
import LoginProcess from '@hecom/loginprocess';
```

## 事件类型

* 登陆事件：类型为`[LoginEvent]`；数据为`forceUpdate`，表示是否强制更新。
* 登出事件：类型为`[LogoutEvent]`；数据为`forceClear`，表示是否强制清除持久化存储。

## 接口

* `register: (loginFunc, logoutFunc, flex, name) => void`：注册登陆或登出的接收通知的函数，以及进度条的进度项，包括权重`flex`和名称`name`。
* `registerEvent: (flex, name) => void`：只注册进度条的进度项，调用`register`完成操作。
* `triggerLogin: (forceUpdate) => void`：触发登陆事件，`forceUpdate`表示是否强制更新。
* `triggerLogout: (forceClear) => void`：触发登出事件，`forceClear`表示是否强制登出。
* `mark: (name, isSuccess) => void`：标记某个进度项为成功或失败状态。
* `getCount: () => number`：获取所有进度项的权重总和。
* `start: (callback) => void`：设置进度项状态变化的回调函数。
* `finish: () => void`：清除进度项状态变化的回调函数。