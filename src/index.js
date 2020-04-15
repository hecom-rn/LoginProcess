import Listener from '@hecom/listener';

const rootNode = {
    event: {},
    callback: undefined,
};

const LoginEvent = 'loginuser';
const LogoutEvent = 'logoutuser';

export default {
    register: _register,
    registerEvent: _registerEvent,
    triggerLogin: _trigger(LoginEvent),
    triggerLogout: _trigger(LogoutEvent),
    mark: _mark,
    getCount: _getCount,
    start: _start,
    finish: _finish,
};

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

function _registerEvent(flex, name) {
    _register(undefined, undefined, flex, name);
}

function _trigger(eventType) {
    return function (isForce) {
        Listener.trigger(eventType, isForce);
    };
}

function _mark(name, isSuccess) {
    console.log(name + ' is loaded ' + (isSuccess ? 'success' : 'fail'));
    rootNode.callback && rootNode.callback(name, rootNode.event[name], isSuccess);
}

function _getCount() {
    return Object.values(rootNode.event).reduce((p, c) => p + c, 0);
}

function _start(callback) {
    rootNode.callback = callback;
}

function _finish() {
    rootNode.callback = undefined;
}