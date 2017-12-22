import CONFIG from './config';
import storage from './storage';

export default {
    /**
     * 请求
     * @param {string} method 方式
     * @param {string} path 路径
     * @param {object} data 数据
     * @param {boolean} requiresAuth 是否需要third_session
     * @returns {Promise}
     */
    _request({ method, path, data = {}, requiresAuth = true, noReject }) {
        return new Promise((resolve, reject) => {
            if (requiresAuth) {
                data = { ...data, signture: storage.session.get() };
            }
            if (path == '/wbs/index/login') {
                path = '/wbs/index/login';
            } else {
                data.url = path;
                path = '/wbs/transmit/proxy';
                data.method = 'POST';
                data.isJson = 1;
                data.session = storage.session.get();
            }

            // TODO
            data.streamNo = 'UKWEB' + Date.now() + parseInt(Math.random() * 1000000);
            data.langType = "zh-CN";

            wx.request({
                method,
                url: `${CONFIG.REQUEST_URL}${path}`,
                header: {
                    'content-type': 'application/json'
                },
                data,
                success(res) {
                    const { data } = res;
                    if (noReject) {
                        resolve(data);
                    } else {
                        if (data.resultCode === "00000000") {
                            resolve(data);
                        } else {
                            const err = { errMsg: data.msg };
                            reject(data);
                        }
                    }
                },
                fail: reject
            })
        })
    },

    /**
     * GET
     * @param {string} path 路径
     * @param {object} params 数据
     * @param {boolean} requiresAuth 是否需要传递 session，默认否
     * @returns {Promise}
     */
    get({ path, params, requiresAuth, noReject }) {
        return this._request({ method: 'GET', path, data: params, requiresAuth, noReject })
    },

    /**
     * POST
     * @param {string} path 路径
     * @param {object} data 数据
     * @param {boolean} requiresAuth 是否需要传递 session，默认否
     * @returns {Promise}
     */
    post({ path, data, requiresAuth, noReject }) {
        return this._request({ method: 'POST', path, data, requiresAuth, noReject })
    }
}