/*
	权限
	cheng.feng 2017/12/20
*/
import wepy from 'wepy';
import storage from './storage';
import request from './request';
import CONFIG_URL from './config-url';

export default {
	login (isForce){
        return new Promise( (resolve, reject) => {
            let thirdSession = storage.session.get();
            if(!isForce && thirdSession){
                resolve();
            }
            else{
                console.log("登录");
                wx.login({
                    success (data){
                        request.post({
                            path: CONFIG_URL.common.getThirdSession,
                            data : { code : data.code }
                        }).then( d=>{
                            storage.session.set(d.data.session);
                            resolve();
                        }, d=>{
                            reject();
                         });
                    }
                });
            }
        });
    },
    queryUserInfo (isForce){
        let that = this;
        let checkUserInfo = function(data){
            if(data){
                // 如果有用户信息并且有手机号，说明已经授权且绑定了手机
                if(data.weChatName && data.mobilePhone){
                    return 0;
                }
                // 如果有用户信息并且没有手机号
                else if(data.weChatName && !data.mobilePhone){
                    return 1;
                }
            }
            // 缓存里没有用户信息
            return 2;
        };
        let goBindPhone = function(){
            wx.redirectTo({
                url: '../bindPhone/bindPhone'
            });
        };
        let _queryUserInfo = function(){
            return new Promise( (resolve, reject) => {
                request.post({
                    path: CONFIG_URL.user.queryUserInfo,
                }).then( d=>{
                    let userInfo = {
                        weChatName: d.data.weChatName,
                        avatarUrl: d.data.avatarUrl,
                        mobilePhone: d.data.mobilePhone
                    };
                    let status = checkUserInfo(userInfo);
                    switch(status){
                        case 0:
                            storage.user.set(userInfo);
                            resolve();
                            break;
                        case 1 :
                            reject();
                            goBindPhone();
                            break;
                        case 2 :
                            that.userAuth(resolve, reject);
                            break;
                    }
                }, d=>{
                    // session错误 重登录
                    if(d.resultCode === "44444444"){
                        that.login(true).then(d=>{
                            return _queryUserInfo();
                        }).then( d=> resolve(d), d=>reject(d) );
                    }
                    else{
                        // 需要授权，获取用户信息
                        that.userAuth(function(userInfo){
                            storage.user.set(userInfo);
                            goBindPhone();
                            reject();
                        });
                    }
                });
            })
        };

        return new Promise( (resolve, reject) => {
            if(!isForce){
                let user = storage.user.get();
                let status = checkUserInfo(user);
                switch(status){
                    case 0 : resolve(); break;
                    case 1 :
                        reject();
                        goBindPhone();
                        break;
                    case 2 :
                        _queryUserInfo().then( d=> resolve(d), d=>reject(d) );
                        break;
                }
            }else{
                _queryUserInfo().then( d=> resolve(d), d=>reject(d) );
            }
        });
    },
    userAuth (success, failed){
        let that = this;
        let authFailed = function(){
            wx.showModal({
                title: '提示',
                content: '需要授权后才能继续使用',
                showCancel: false,
                confirmText: '开启授权',
                success (res){
                    wx.openSetting({
                        success (res){
                            if(res.authSetting["scope.userInfo"]){
                                that.userAuth(success, failed);
                            }else{
                                setTimeout(authFailed, 1000);
                            }
                        },
                        fail (){
                            setTimeout(authFailed, 1000);
                        }
                    });
                }
            });
        };
        wx.getUserInfo({
            success (d){
                let userInfo = {
                    weChatName: d.userInfo.nickName,
                    avatarUrl: d.userInfo.avatarUrl
                };
                success(userInfo);
            },
            fail (){
                setTimeout(authFailed, 1000);
            }
        });
    }
}
