/**
 * create By wanglehui 2017/12/02
 * @title 提示文字
 * @time  持续毫秒数
 * */
const DURATION = 2000

export default {
  success (title,time) {
    wx.showToast({
        title,
        image: '../../assets/img/success.png',
        duration: time || DURATION
    })
  },
  error (title,time) {
    wx.showToast({
        title,
        image: '../../assets/img/error.png',
        duration: time || DURATION
    })
  },
  warn (title,time) {
    wx.showToast({
        title,
        image: '../../assets/img/warn.png',
        duration: time || DURATION
    })
  },
  loading (title = '加载中...',time) {
    wx.showToast({
      title,
      icon: 'loading',
        duration: time || DURATION
    })
  },
  hide () {
    wx.hideToast()
  }
}
