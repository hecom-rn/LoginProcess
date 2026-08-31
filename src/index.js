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
// 非阻塞批（无 mark name 的 fire-and-forget 任务）独立事件：
// startLoginProcess 先触发阻塞批（带 name，需 mark），全部 mark 完成后再触发本批，
// 削减启动瞬间请求风暴，让阻塞接口更快拿到连接
const LoginDeferredEvent = 'loginuser:deferred';
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
    // 触发注册的登录事件（阻塞批）
    Listener.trigger(LoginEvent, isForce);
    // 全部 mark 完成（resolve）或 isForce 失败（reject）后，再触发非阻塞批
    rootNode.status.promise.finally(() => {
        Listener.trigger(LoginDeferredEvent, isForce);
    });
    return rootNode.status.promise;
}

function _reset() {
    rootNode.finished = [];
    rootNode.status = null;
    rootNode.isForce = false;
}

function _register(loginFunc, logoutFunc, flex, name) {
    if (loginFunc) {
        // 带 name 的任务需要 mark（阻塞批）；无 name 的为非阻塞批
        Listener.register(name !== undefined ? LoginEvent : LoginDeferredEvent, loginFunc);
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

function _mark(name, isSuccess, error) {
    console.log('loginprocess: ' + name + ' is loaded ' + (isSuccess ? 'success' : 'fail'));

    if (rootNode.finished.includes(name)) return;
    rootNode.finished.push(name);  // 防止一个被标记多次

    if (!isSuccess && rootNode.isForce && !!rootNode.status) {
        if (error && typeof error === 'object') {
            error.event = name
        }
        rootNode.status.reject(error);   // 强制登录时失败
        _reset();
    } else if (!!rootNode.status) {
        if (rootNode.finished.length >= Object.keys(rootNode.event).length) {
            rootNode.status.resolve();
            _reset();
        }
    }
}
