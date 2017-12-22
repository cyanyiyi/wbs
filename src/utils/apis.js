/**
 * 接口调用示例
 * 接口的调用统一写在自己的页面
 * **/

import request from './request';
import CONFIG_URL from './config-url';

export default {
    /**
     * 调用示例
     * @options {object}
     *
     * @returns {Promise}
     */
    fun(options) {
        const { params } = options;

        request.get({
            requiresAuth: false,
            path: CONFIG_URL.personalCenter.jiekou1,
            params
        }).then((res) => {
            console.log('success');
        }, (err) => {
            console.log('faild');
        });
    },
    /**
     * 查询用户信息
     * @options {object}
     *
     * @returns {Promise}
     */
    queryUserInfo(data) {
        return request.post({
            path: CONFIG_URL.user.queryUserInfo,
            noReject: true,
            data
        });
    },
    /**
     * 查询用户信息
     * @options {object}
     *
     * @returns {Promise}
     */
    getThirdSession(data) {
        return request.post({
            path: CONFIG_URL.common.getThirdSession,
            data
        });
    }
};
