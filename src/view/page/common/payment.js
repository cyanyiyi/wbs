/*
	支付
	cheng.feng 2017/11/21
*/
import config from '../../../utils/config';
import http from '../../../utils/request';
import api from '../../../utils/config-url';

export default {
	/*
	下单 + 获取凭证 + 支付
	例如:
	payment({
		rechargeType : "TOPUP", // 充值
		amount : 10000
	}).then(function(){
		// 支付成功后
		wx.reLaunch({ url: '../personalCenter/index' });
		或者 wx.navigateBack({ delta: 3 });
	}); */
	payment (req){
		return this.generateRechargeOrder(req)
			.then(d=> {
				let req = { orderSN : d.data.orderSN };
				return this.queryWeixinCredential(req)
			})
			.then(d=> {
				let req = {
					timeStamp: d.data.timeStamp,
					nonceStr: d.data.nonceStr,
					package: d.data.package,
					signType: d.data.signType,
					paySign: d.data.paySign,
				};
				return this.requestPayment(req);
			});
	},
	// 第1步: 生成充值/押金订单, 返回orderSN
	generateRechargeOrder (req){
		// req.rechargeType : DEPOSIT(交押金),TOPUP(充值)
		// req.amount : 金额,分
		if(!req.rechargeType || !req.amount) return Promise.reject("生成充值订单缺少rechargeType或amount");
		return http.post({
			path : api.borrow.generateRechargeOrder,
			data : req
		});
	},

	// 第2步: 获取支付凭证, 返回支付5个参数
	queryWeixinCredential (req){
		if(!req.orderSN) return Promise.reject("获取支付凭证缺少orderSN");
		if(!req.source) req.source = "JSAPI";

		if(config.debug){
			return Promise.resolve({ data : {} });
		}

		return http.post({
			path : api.borrow.queryWeixinCredential,
			data : req
		});
	},

	// 第3步: 发起支付请求
	requestPayment  (req) {
		if(config.debug){
			console.log("%c支付成功!", "color:#00f");
			return Promise.resolve({ data : {} });
		}

		let reg = /^timeStamp|nonceStr|package|signType|paySign$/;
		for(var field in req){
			if(!reg.test(field)) return Promise.reject("支付5个参数不正确");
		}
		return new Promise((resolve, reject) => {
			wx.requestPayment({
				timeStamp: req.timeStamp,
				nonceStr: req.nonceStr,
				package: req.package,
				signType: req.signType,
				paySign: req.paySign,
				success : resolve,
				fail : reject,
			});
		});
	},
}
