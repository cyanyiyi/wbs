/**
 * creat By wanglehui 2017/11/23
 * 接口配置文件
 * **/

module.exports = {
    /**
     * 文件名，该文件下用到的接口
     * **/
    common: {
        getThirdSession: '/wbs/index/login', // 获取3rd session
        queryList : "/bss/wb/wechat/syscfg/QueryList" // 操作员查询字典和参数配置列表
    },
    borrow: {
        queryUserInfo: "/bss/wb/wechat/user/QueryUserInfo",
        generateRechargeOrder: "/bss/wb/wechat/wbBalanceDetail/generateRechargeOrder", // 生成充值订单
        queryWeixinCredential: "/bss/wb/wechat/wbBalanceDetail/QueryWeixinCredential", // 获取支付凭证
        createOrder: "/bss/wb/wechat/order/CreateOrder", // 扫码创建订单
        queryUnFinishedOrder: "/bss/wb/wechat/order/QueryUnFinishedOrder"
    },
    order: {
        queryOrdersList: '/bss/wb/wechat/order/QueryOrderList', // 查询用户订单列表
        queryOrderDetail:'/bss/wb/wechat/order/Query',//查询订单详情
        cancleOrder: '/bss/wb/wechat/order/CancelOrder', // 取消订单
        queryUnFinishedOrder: '/bss/wb/wechat/order/QueryUnFinishedOrder' // 用户查询未结束的订单
    },
    faq: {
        queryList: '/bss/wb/wechat/syscfg/QueryList' // 常见问题列表
    },
    bindPhone: {
        register:'/bss/wb/wechat/noauth/RegisterWeChatUser',
        regSend:'/bss/wb/wechat/noauth/SendRegisterSms',
        change: '/bss/wb/wechat/user/ChangePhone', // 更换手机
        send: '/bss/wb/wechat/user/SendChangeSms' // 发送短信
    },
    network: {
        queryList: '/bss/wb/wechat/cabinet/QueryList', // 查询网点列表
        queryDetail: '/bss/wb/wechat/cabinet/Query' // 查询详情
    },
    user: {
        changePhone: '/bss/wb/wechat/user/ChangePhone', // 修改用户手机
        queryUserInfo: '/bss/wb/wechat/user/QueryUserInfo', // 查询用户接口
        sendChangeSms: '/bss/wb/wechat/user/SendChangeSms' // 发送更换手机短信
    },
    /**
     * 我的钱包
     * **/
    myWallet: {
        queryUserInfo: "/bss/wb/wechat/user/QueryUserInfo",//查询用户信息
        refundDeposit:'/bss/wb/wechat/wbBalanceDetail/refundDeposit',//退押金
        QueryList: '/bss/wb/wechat/syscfg/QueryList',  //交易类型查询
        queryDetailList: '/bss/wb/wechat/wbBalanceDetail/queryDetailList'//查询交易明细
    },
};
