import Listener from '@hecom/listener';

const rootNode = {
    event: {},
    status: null,
    isForce: false,
    finished: [],
};

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

const LoginEvent = 'loginuser';
const LogoutEvent = 'logoutuser';

export default {
    register: _register,
    triggerLogin: _trigger(LoginEvent),
    triggerLogout: _trigger(LogoutEvent),
    mark: _mark,

    startLoginProcess: _startLoginProcess,
};

function _startLoginProcess(isForce) {
    _reset();
    rootNode.isForce = isForce;
    if (!rootNode.status) {
        rootNode.status = new Deferred();
    }
    // 触发注册的登录事件
    Listener.trigger(LoginEvent, isForce);
    return rootNode.status.promise;
}

function _reset() {
    rootNode.finished = [];
    rootNode.status = null;
    rootNode.isForce = false;
}

function _register(loginFunc, logoutFunc, flex, name) {
    if (loginFunc) {
        Listener.register(LoginEvent, loginFunc);
    }
    if (logoutFunc) {
        Listener.register(LogoutEvent, logoutFunc);
    }
    if (flex !== undefined && name !== undefined) {
        rootNode.event[name] = flex;
    }
}

function _trigger(eventType) {
    return function (isForce) {
        Listener.trigger(eventType, isForce);
    };
}

function _mark(name, isSuccess) {
    console.log('loginprocess: ' +  name + ' is loaded ' + (isSuccess ? 'success' : 'fail'));

    if (rootNode.finished.includes(name)) return; 
    rootNode.finished.push(name);  // 防止一个被标记多次

    if (!isSuccess && rootNode.isForce && !!rootNode.status) {
        rootNode.status.reject();   // 强制登录时失败
        _reset();
    } else if (!!rootNode.status) {
        if (rootNode.finished.length >= Object.keys(rootNode.event).length) {
            rootNode.status.resolve();
            _reset();
        }
    }
}