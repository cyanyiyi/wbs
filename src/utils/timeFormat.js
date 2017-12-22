/**
 * Created by chenwenxiao on 2016/8/23.
 * 描述：处理时区转换功能，后天服务器存储gmt0的时间戳，前端根据实际需要将时间戳转换成需要的
 */
/**
 * log by zhanhuancheng<zhanhuancheng@ukelink.com>
 * toFixed 改为静态函数
 */
/**
 * Update by zhijie.huang on 2017/5/18
 * 添加方法
 * getToday/getTodayFormat/getTodayFormatShort
 * getDayNearToday/getDayNearTodayFormat/getDayNearTodayFormatShort
 */
const ONE_DAY = 3600 * 24 *1000;
const REG_M_SEC = /[.](\d{1,3})/;
const REG_TIME_SEPARATOR = /([0-9]+?)(?:[-])/g;
const REG_ISO_FORMAT = /(\d{4}-\d{1,2}-\d{1,2})T(\d+(?:[:]\d+){1,2})/;
const TIME_SEPARATOR = '/';

class timeFormat {
    //  获取当前浏览器的时区
    getBrowserGMT() {
        const dates = new Date();
        return -dates.getTimezoneOffset() / 60;
    }

    //  获取当前浏览器时区的修正
    getDateZoneOffset() {
        return new Date().getTimezoneOffset();
    }

    //  转换时间long格式到yyyy-mm-dd hh-MM-ss
    getFormatTime(d, ks) {
        d = parseInt(d);
        d = d + ((ks - this.getBrowserGMT()) * 60 || 0) * 60000;
        let M, h, m, s;
        let date = new Date(timeFormat.toAvailDateStr(d));
        if (!d) {
            return;
        }
        if (parseInt(d) < 86400) {
            return d;
        }
        let Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        M = M < 10 ? '0' + M : M;
        let D = (date.getDate() + ' ') < 10 ? '0' + (date.getDate() + ' ') : (date.getDate() + ' ');
        h = date.getHours();
        h = (h < 10 ? '0' + h : h) + ':';
        m = date.getMinutes();
        m = (m < 10 ? '0' + m : m) + ':';
        s = date.getSeconds();
        s = (s < 10 ? '0' + s : s);
        return Y + M + D + h + m + s;
    }

    //  转换时间yyyy-mm-dd hh-MM-ss格式到long
    formatTimeTolong(datetime, ks) {
        ks = ks === undefined ? this.getBrowserGMT() : ks;
        if (!datetime) {
            return;
        }
        let tmpDatetime = datetime.replace(/:/g, '-');
        tmpDatetime = tmpDatetime.replace(/ /g, '-');
        const arr = tmpDatetime.split('-');
        arr[2] = arr[2] || 0;
        arr[3] = arr[3] || 0;
        arr[4] = arr[4] || 0;
        arr[5] = arr[5] || 0;
        const now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]));
        const offset = (this.getDateZoneOffset() + (this.getBrowserGMT() - ks) * 60) * 60000;
        return parseInt(now.getTime() + offset);
    }

    // 今天的时间戳
    getToday() {
        const today = this.formatTimeTolong(this.getFormatTime(new Date().getTime()).substring(0, 10));
        return today;
    }

    // 今天的时间格式 yyyy-mm-dd hh-MM-ss
    getTodayFormat() {
        const today = this.getFormatTime(this.getToday());
        return today;
    }

    // 今天的时间格式 yyyy-mm-dd
    getTodayFormatShort() {
        const today = this.getFormatTime(this.getToday()).substring(0, 10);
        return today;
    }

    // 今天加减n天的时间戳
    getDayNearToday(day) {
        if (day === undefined) {
            day = 0;
        } else if (typeof day !== 'number') {
            console.error('parameter "day" type must be number');
            return;
        }
        const someDay = this.formatTimeTolong(this.getFormatTime(new Date().getTime() + (day * ONE_DAY)).substring(0, 10));
        return someDay;
    }

    // 今天加减n天的时间格式 yyyy-mm-dd hh-MM-ss
    getDayNearTodayFormat(day) {
        const someDay = this.getFormatTime(this.getDayNearToday(day));
        return someDay;
    }

    // 今天加减n天的时间格式 yyyy-mm-dd
    getDayNearTodayFormatShort(day) {
        const someDay = this.getFormatTime(this.getDayNearToday(day)).substring(0, 10);
        return someDay;
    }

    /**
     * 转化日期字符串为时间戳
     * @param {String|Date|Number} dtStr
     * @return {Number}
     */
    static parseDateStr(dtStr) {
        let mSec = 0, dateTime;
        if (dtStr instanceof Date) {
            return dtStr.getTime();
        }
        if (typeof(dtStr) === 'string') {
            mSec = timeFormat.subMilliseconds(dtStr);
            dtStr = timeFormat.toAvailDateStr(dtStr);
        }
        dateTime = new Date(dtStr);
        if (dateTime.getTime() && mSec) {
            dateTime.setMilliseconds(mSec);
        }
        return dateTime.getTime();
    }

    /**
     * 获取时间字符串中的毫秒数
     * @param {String} dtStr
     * @example
     *     subMilliseconds('2017-01-01 12:00:00.999') => 999
     *     subMilliseconds('2017-01-01 12:00:00.1') => 100
     * @return {Number}
     */
    static subMilliseconds(dtStr) {
        let mSec = 0;
        if (REG_M_SEC.test(dtStr)) {
            let matches = REG_M_SEC.exec(dtStr);
            mSec = parseFloat(matches[0]) * 1000;
        }
        return mSec;
    }

    /**
     * 转化日期字符串为兼容浏览器的字符串
     * '2017-05-20 08:00:00.999' => '2017/05/20 08:00:00'
     * 不转换ISO时间'2017-05-20T05:49:58.090Z' => '2017-05-20T05:49:58.090Z'
     * @param {String|*} dtStr
     * @return {String|*}
     */
    static toAvailDateStr(dtStr) {
        if (typeof(dtStr) === 'string' && REG_TIME_SEPARATOR.test(dtStr) && !REG_ISO_FORMAT.test(dtStr)) {
            dtStr = dtStr.replace(REG_TIME_SEPARATOR, (...args) => {
                return `${args[1]}${TIME_SEPARATOR}`;
            }).replace(REG_M_SEC, '');
        }
        return dtStr;
    }


    /**
     * @description 转换时间到其他时区的时间
     * @author zhanhuancheng<zhanhuancheng@ukelink.com>
     * @date 2017-05-20
     * @param {number|Date|string} dt 时间 时间戳|Date对象|ISO时间: "2017-05-20T05:49:58.090Z"|GMT时间: "Fri May 19 2017 16:00:00 GMT+0800" 或 "2017-05-20 16:00:00 GMT+0800"
     * @param {number} targetTimezone 目标时区 西12区(-12)至东12区(12) 默认为零时区
     * @param {string} format 时间格式 'yyyy-MM-dd HH:mm:ss.uuu' 默认为 yyyy-MM-dd HH:mm:ss
     * @param {boolean} withGMT 返回值是否带时区标识 默认为false, 时区标识 Chrome/Edge 支持, Firefox不支持 new Date("017-05-20 08:00:00 GMT+0800")
     * @returns {string}
     * @example
     *     timeFormat.convertDatetime(1495238400000, 8, 'yyyy-MM-dd HH:mm:ss', true) 返回值 "2017-05-20 08:00:00 GMT+0800"
     *     timeFormat.convertDatetime(1495238400000, 0, 'yyyy-MM-dd HH:mm:ss', true) 返回值 "2017-05-20 00:00:00 GMT+0000"
     *     timeFormat.convertDatetime('2017-05-20 08:00:00 GMT+0800', -4, 'yyyy-MM-dd HH:mm:ss', true) 返回值 "2017-05-19 20:00:00 GMT-0400"
     *     timeFormat.convertDatetime('2017-05-20 08:00:00 GMT+0800', -4, 'yyyy-MM-dd HH:mm:ss', false) 返回值 "2017-05-19 20:00:00"
     */
    static convertDatetime(dt, targetTimezone = 0, format = 'yyyy-MM-dd HH:mm:ss', withGMT = false) {
        if (!(dt instanceof Date)) {
            dt = new Date(timeFormat.toAvailDateStr(dt));
        }
        const M_SEC_PER_HOUR = 3600000; //每小时的毫秒数
        let timestamp = (dt.getTime() + timeFormat.getTimezoneOffset()) + M_SEC_PER_HOUR * targetTimezone;
        let dtStr = timeFormat.formatDateTime(format, timestamp);
        if (withGMT) {
            dtStr += ' ' + timeFormat.formatGMTTimezone(targetTimezone);
        }
        return dtStr;
    }

    /**
     * @author zhanhuancheng<zhanhuancheng@ukelink.com>
     * @date 2017-05-20
     * @description 浏览器时间和UTC时间的偏移量(毫秒数)
     * @returns {number}
     * @example
     *     timeFormat.getTimezoneOffset() 返回值 -28800000 (东八区)
     */
    static getTimezoneOffset() {
        return (new Date()).getTimezoneOffset() * 60 * 1000;
    }

    /**
     * @author zhanhuancheng<zhanhuancheng@ukelink.com>
     * @date 2017-05-20
     * @description 格式化时区
     * @param {number} tz Time Zone 时区 -12至12
     * @returns {string}
     * @throws
     * @example
     *     timeFormat.formatGMTTimezone(-8) 返回值 "GMT-0800"
     *     timeFormat.formatGMTTimezone(8) 返回值 "GMT+0800"
     *     timeFormat.formatGMTTimezone(0) 返回值 "GMT+0000"
     */
    static formatGMTTimezone(tz) {
        let intTz = parseInt(tz);
        if (intTz >= -12 && intTz <= 12) {
            let symbol = intTz >= 0 ? '+' : '-';
            return 'GMT' + symbol + ('00' + Math.abs(intTz)).substr(-2) + '00';
        } else {
            throw 'Timezone must be integer between -12 to 12.';
        }
    }

    /**
     * @author zhanhuancheng<zhanhuancheng@ukelink.com>
     * @date 2017-05-20
     * @description 通用格式化时间方法
     * @param {string} format 'yyyy-MM-dd HH:mm:ss.uuu' 时间格式
     *     yyyy年 MM月 dd日 HH时 mm分 ss秒 uuu毫秒
     * @param {number|Date|undefined|string|mixed} dt dateTime 可以为 时间戳|Date对象|undefined|表示日期时间的字符串
     * @returns {string}
     * @throws {string}
     * @example
     *     timeFormat.formatDateTime('yyyy-MM-dd', '2017-05-20 00:00:00') 返回值 "2017-05-20"
     *     timeFormat.formatDateTime('yyyy-MM-dd HH:mm:ss.uuu', 1495209600000) 返回值 "2017-05-20 00:00:00.000"
     *     timeFormat.formatDateTime('yyyyMMdd', 'Sat May 20 2017') 返回值 "20170520"
     */
    static formatDateTime(format, dt) {
        if (dt instanceof Date) {

        } else if (dt) {
            dt = new Date(timeFormat.toAvailDateStr(dt));
        } else {
            dt = new Date();
        }
        if (isNaN(dt.getTime())) {
            throw 'Invalid Date';
        }
        let patterns = {
            year: 'yy*',
            month: 'MM*',
            day: 'dd*',
            hour: 'HH*',
            min: 'mm*',
            sec: 'ss*',
            mSec: 'uu*'
        };
        let dateTime = {
            year: dt.getFullYear(),
            month: dt.getMonth() + 1,
            day: dt.getDate(),
            hour: dt.getHours(),
            min: dt.getMinutes(),
            sec: dt.getSeconds(),
            mSec: dt.getMilliseconds()
        };
        Object.keys(patterns).forEach(function (key) {
            let pattern = new RegExp(patterns[key], 'g');
            switch (key) {
                case 'year':
                    format = format.replace(pattern, function ($match) {
                        return ('0000' + dateTime[key]).substr(-1 * $match.length);
                    });
                    break;
                case 'month':
                case 'day':
                case 'hour':
                case 'min':
                case 'sec':
                    format = format.replace(pattern, function ($match) {
                        return ('00' + dateTime[key]).substr(-1 * $match.length);
                    });
                    break;
                case 'mSec':
                    format = format.replace(pattern, function ($match) {
                        return (dateTime[key] + '000').substr(0, $match.length);
                    });
                    break;
                default:
                    break;
            }
        });
        return format;
    }
}
export default timeFormat;
