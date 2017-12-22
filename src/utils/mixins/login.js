import wepy from 'wepy';
import apis from '../apis';
import storage from '../storage';

export default class extends wepy.mixin {
    data = {
        user: null
    }

    /**
     * 检查是否已登录且已获取用户信息
     * 请在调用接口之前做此检查
     * 因为接口依赖了登录相关信息
     */
    async login() {
        const that = this;
        let userInfoRes = {};
        // 未获取到third session
        if (!storage.session.get()) {
            // 小程序登陆 获取 code
            const wxLoginRes = await wepy.login();

            // 服务端登录 code => third session
            const getThirdSessionRes = await apis.getThirdSession({
                code: wxLoginRes.code
                // code: '071HN8bk1QbYYk0URkbk1bd3bk1HN8b5'
            });

            // 保存 third session
            storage.session.set(getThirdSessionRes.data.session);
            // // 服务端查询用户信息
            // const serverUserInfoRes = await apis.queryUserInfo({
            //     weChatOpenId: 'a'
            // });
            // if (serverUserInfoRes.resultCode === '00000000') {
            //     const userInfo = {
            //         weChatName: serverUserInfoRes.data.weChatName,
            //         avatarUrl: serverUserInfoRes.data.avatarUrl,
            //         mobilePhone: serverUserInfoRes.data.mobilePhone
            //     };
            //     // 保存userInfo
            //     storage.user.set(userInfo);
            //     console.log('已获取到用户信息不需要再授权');
            //     console.log(storage.user.get());
            //     userInfoRes.getUserInfoSuccess = true;
            // } else {
            //     console.log('需要授权');
            //     // 获取wx用户信息
            //     await wepy.getUserInfo()
            //         .then(d => {
            //             // 平台登录
            //             d.getUserInfoSuccess = true;
            //             userInfoRes = d;
            //         }, d => {
            //             d.getUserInfoSuccess = false;
            //             userInfoRes = d;
            //         });
            // }
            // return userInfoRes;
        }
        // 服务端查询用户信息
        const serverUserInfoRes = await apis.queryUserInfo();
        if (serverUserInfoRes.resultCode === '00000000') {
            const userInfo = {
                weChatName: serverUserInfoRes.data.weChatName,
                avatarUrl: serverUserInfoRes.data.avatarUrl,
                mobilePhone: serverUserInfoRes.data.mobilePhone
            };
            // 保存userInfo
            storage.user.set(userInfo);
            console.log('已获取到用户信息不需要再授权');
            console.log(storage.user.get());
            userInfoRes.getUserInfoSuccess = true;
            userInfoRes.getUserPhoneSuccess = true;
        } else if (serverUserInfoRes.resultCode === '44444444') {
            await this.relogin();
            userInfoRes.getUserInfoSuccess = true;
            userInfoRes.getUserPhoneSuccess = true;
        } else {
            console.log('需要授权');
            // 获取wx用户信息
            await wepy.getUserInfo()
                .then(d => {
                    // 平台登录
                    const userInfo = {
                        weChatName: d.userInfo.nickName,
                        avatarUrl: d.userInfo.avatarUrl
                    };
                    // 保存userInfo
                    storage.user.set(userInfo);
                    d.getUserInfoSuccess = true;
                    d.getUserPhoneSuccess = false;
                    userInfoRes = d;
                }, d => {
                    d.getUserInfoSuccess = false;
                    d.getUserPhoneSuccess = false;
                    userInfoRes = d;
                });
        }
        return userInfoRes;
    }

    /**
     * session 中有 third session 但是过期
     * 调用此接口
     */
    async relogin() {
        // 小程序登陆
        const wxLoginRes = await wepy.login();
        // 服务端登录 code => third session
        const getThirdSessionRes = await apis.getThirdSession({
            code: wxLoginRes.code
            // code: '071HN8bk1QbYYk0URkbk1bd3bk1HN8b5'
        });

        // 保存 third session
        storage.session.set(getThirdSessionRes.data.session);
        // 服务端查询用户信息
        const serverUserInfoRes = await apis.queryUserInfo();
        if (serverUserInfoRes.resultCode === '00000000') {
            const userInfo = {
                weChatName: serverUserInfoRes.data.weChatName,
                avatarUrl: serverUserInfoRes.data.avatarUrl,
                mobilePhone: serverUserInfoRes.data.mobilePhone
            };

            // 保存userInfo
            storage.user.set(userInfo);
        }
    }

    async wxGetUserInfoAndSave() {
        const wxGetUserInfoRes = await wepy.getUserInfo();
        const userInfo = {
            weChatName: wxGetUserInfoRes.userInfo.nickName,
            avatarUrl: wxGetUserInfoRes.userInfo.avatarUrl
        };
        storage.user.set(userInfo);
        return wxGetUserInfoRes;
    }
}
