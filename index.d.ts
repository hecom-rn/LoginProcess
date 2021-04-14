declare module "@hecom/loginprocess" {

    /**
     *  为登录进程添加伴生函数
     *
     * @export
     * @param {Function} loginFunc 登录时
     * @param {Function} logoutFunc 登出时
     * @param {number} flex 进度占比
     * @param {string} name 为loginFunc 添加锁定标识。 不为空时需要配合mark解除锁定
     */
    export function register(loginFunc: Function, logoutFunc: Function, flex?: number, name?: string);

    /**
     *  触发登录事件，即执行注册好的 loginFunc  (内部使用)
     *
     * @export
     */
    export function triggerLogin(): void;

    /**
     *  触发登出事件，即执行注册好的 logoutFunc
     *
     * @export
     */
    export function triggerLogout(): void;

    /**
     *  表示register loginFunc 执行成功或者失败  
     *  当register name 不为空时，必须调用该函数
     * @export
     * @param {string} name
     * @param {boolean} isSuccess
     */
    export function mark(name: string, isSuccess: boolean);
    
    /**
     * 开始登录
     * 1. 强制登录时, 任一失败则 reject
     * 2. 非强制登录时, 不管成功与否都会 resolve
     * @export
     * @return {*}  {Promise} 登录状态
     */
    export function startLoginProcess(): Promise;
}