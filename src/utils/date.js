/**
 * 对Date的扩展，将 Date 转化为指定格式的String。
 *
 *  月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *  年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)。
 *
 *  【示例】：
 *  formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
 *  formatDate(new Date(), 'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
 *  formatDate(new Date(), 'hh:mm:ss.S')            ==> 08:09:04.423
 */
export function formatDate(date, fmt) {
    const o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            let value = (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))
            fmt = fmt.replace(RegExp.$1, value);
        }
    }

    return fmt;
};

/**
 * 仿照微信中的消息时间显示逻辑，将时间戳（单位：毫秒）转换为友好的显示格式.
 *
 * 1）7天之内的日期显示逻辑是：今天、昨天(-1d)、前天(-2d)、星期？（只显示总计7天之内的星期数，即<=-4d）；
 * 2）7天之外（即>7天）的逻辑：直接显示完整日期时间。
 *
 * @param {[long]} timestamp 时间戳（单位：毫秒），形如：1550789954260
 * @param {boolean} mustIncludeTime true表示输出的格式里一定会包含“时间:分钟”
 * ，否则不包含（参考微信，不包含时分的情况，用于首页“消息”中显示时）
 *
 * @return {string} 输出格式形如：“刚刚”、“10:30”、“昨天 12:04”、“前天 20:51”、“星期二”、“2019/2/21 12:09”等形式
 */
export function formatDateShort(timestamp, mustIncludeTime) {
    // 当前时间
    let currentDate = new Date();
    // 目标判断时间
    let srcDate = new Date(parseInt(timestamp));

    let currentYear = currentDate.getFullYear();
    let currentMonth = (currentDate.getMonth() + 1);
    let currentDateD = currentDate.getDate();

    let srcYear = srcDate.getFullYear();
    let srcMonth = (srcDate.getMonth() + 1);
    let srcDateD = srcDate.getDate();

    let ret = "";

    // 要额外显示的时间分钟
    let timeExtraStr = (mustIncludeTime ? " " + formatDate(srcDate, "hh:mm") : "");

    // 当年
    if (currentYear == srcYear) {
        let currentTimestamp = currentDate.getTime();
        let srcTimestamp = timestamp;
        // 相差时间（单位：毫秒）
        let deltaTime = (currentTimestamp - srcTimestamp);

        // 当天（月份和日期一致才是）
        if (currentMonth == srcMonth && currentDateD == srcDateD) {
            // 时间相差60秒以内
            if (deltaTime < 60 * 1000)
                ret = "刚刚";
            // 否则当天其它时间段的，直接显示“时:分”的形式
            else
                ret = formatDate(srcDate, "hh:mm");
        }
        // 当年 && 当天之外的时间（即昨天及以前的时间）
        else {
            // 昨天（以“现在”的时候为基准-1天）
            let yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);

            // 前天（以“现在”的时候为基准-2天）
            let beforeYesterdayDate = new Date();
            beforeYesterdayDate.setDate(beforeYesterdayDate.getDate() - 2);

            // 用目标日期的“月”和“天”跟上方计算出来的“昨天”进行比较，是最为准确的（如果用时间戳差值
            // 的形式，是不准确的，比如：现在时刻是2019年02月22日1:00、而srcDate是2019年02月21日23:00，
            // 这两者间只相差2小时，直接用“deltaTime/(3600 * 1000)” > 24小时来判断是否昨天，就完全是扯蛋的逻辑了）
            if (srcMonth == (yesterdayDate.getMonth() + 1) && srcDateD == yesterdayDate.getDate())
                ret = "昨天" + timeExtraStr; // -1d
            // “前天”判断逻辑同上
            else if (srcMonth == (beforeYesterdayDate.getMonth() + 1) && srcDateD == beforeYesterdayDate.getDate())
                ret = "前天" + timeExtraStr; // -2d
            else {
                // 跟当前时间相差的小时数
                let deltaHour = (deltaTime / (3600 * 1000));

                // 如果小于或等 7*24小时就显示星期几
                if (deltaHour <= 7 * 24) {
                    let weekday = new Array(7);
                    weekday[0] = "星期日";
                    weekday[1] = "星期一";
                    weekday[2] = "星期二";
                    weekday[3] = "星期三";
                    weekday[4] = "星期四";
                    weekday[5] = "星期五";
                    weekday[6] = "星期六";

                    // 取出当前是星期几
                    let weedayDesc = weekday[srcDate.getDay()];
                    ret = weedayDesc + timeExtraStr;
                }
                // 否则直接显示完整日期时间
                else {
                    ret = formatDate(srcDate, "yyyy/M/d") + timeExtraStr;
                }
            }
        }
    }
    // 往年
    else {
        ret = formatDate(srcDate, "yyyy/M/d") + timeExtraStr;
    }

    return ret;
};