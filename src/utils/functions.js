/** 公共方法类 */
import {
  getToken
} from '@/utils/auth';
import config from '@/config/config'

/**
 * 人性化时间显示
 *
 * @param {Object} datetime
 */
export function formateTime(datetime) {
  if (datetime == null) {
    return ''
  }

  datetime = datetime.replace(/-/g, "/");

  //当前时间戳
  let time = new Date();
  let outTime = new Date(datetime);
  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000);
  }

  if ((time.getTime() < outTime.getTime()) || (time.getFullYear() != outTime.getFullYear())) {
    return parseTime(outTime, '{y}-{m}-{d} {h}:{i}');
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, '{m}-{d} {h}:{i}');
  }

  if (time.getDate() != outTime.getDate()) {
    let day = outTime.getDate() - time.getDate();
    if (day == -1) {
      return parseTime(outTime, '昨天 {h}:{i}');
    }

    if (day == -2) {
      return parseTime(outTime, '前天 {h}:{i}');
    }

    return parseTime(outTime, '{m}-{d} {h}:{i}');
  }

  if (time.getHours() != outTime.getHours()) {
    return parseTime(outTime, '{h}:{i}');
  }

  let minutes = outTime.getMinutes() - time.getMinutes();
  if (minutes == 0) {
    return '刚刚';
  }

  minutes = Math.abs(minutes)
  return `${minutes}分钟前`;
}

/**
 * 格式化文件大小
 * 
 * @param {Object} value 文件大小(字节)
 */
export function formateSize(value) {
  if (null == value || value == '') {
    return "0";
  }
  let unitArr = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let index = 0;
  let srcsize = parseFloat(value);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  let size = srcsize / Math.pow(1024, index);
  size = size.toFixed(2); //保留的小数位数
  return size + unitArr[index];
}
/**
 * 获取文件后缀名
 *
 * @param {Object} fileName
 */
export function getFileExt(fileName) {
  let ext = fileName.split('.');
  ext = ext[ext.length - 1]; // 获取文件后缀名
  return ext;
}

/**
 * 根据图片url下载图片
 * @param {Object} imgsrc
 * @param {Object} name
 */
export function downloadIamge(imgsrc, name) { //下载图片地址和图片名
  let image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function () {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    let a = document.createElement("a"); // 生成一个a元素
    let event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = imgsrc;
}

/**
 * 通过图片url获取图片大小
 * 
 *
 * @param {Object} imgsrc 例如图片名： 20200719/5f13a53dbc4abbhK24wky9ScSeyAD8x5f13a53dbc4b9_350x345.png
 */
export function getImageInfo(imgsrc) {
  let data = {
    width: 0,
    height: 0
  }

  let arr = imgsrc.split('_');
  if (arr.length == 1) return data;

  let info = arr[arr.length - 1].match(/\d+x\d+/g);
  if (info == null) return data;

  info = info[0].split('x');
  return {
    width: parseInt(info[0]),
    height: parseInt(info[1])
  }
}

/**
 * 文件下载方法
 * 
 * @param {number} cr_id 
 */
export function download(cr_id) {
  let api = config.api_url;
  let token = getToken();
  try {
    let link = document.createElement('a');
    link.href = `${api}/api/v1/download/user-chat-file?cr_id=${cr_id}&token=${token}`
    link.click();
  } catch (e) {}
}

/**
 * 时间格式化方法
 * 
 * @param {(Object|string|number)} time
 * @param {String} cFormat
 * @returns {String | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time);
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }

    date = new Date(time.replace(/-/g, "/"));
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }

    return value.toString().padStart(2, '0');
  })
  return time_str;
}

/**
 * 去除字符串控制
 * 
 * @param {String} str 
 */
export function trim(str, type = null) {
  if (type) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  } else if (type == 'l') {
    return str.replace(/(^\s*)/g, '');
  } else {
    return str.replace(/(\s*$)/g, '');
  }
}

/**
 * 解析url中参数
 * 
 * @param {String} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"')
    .replace(/\+/g, ' ') +
    '"}'
  );
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {HTMLElement} element
 * @param {String} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {String} cls
 * @returns {Boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {String} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {String} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

/**
 * 通过图片Url获取图片等比例缩放的宽度和高度信息
 * 
 * @param {String} src 
 * @param {number} width 
 */
export function imgZoom(src, width = 200) {
  const info = getImageInfo(src);

  if (info.width < width) {
    return {
      width: `${info.width}px`,
      height: `${info.height}px`
    };
  }

  return {
    width: width + "px",
    height: parseInt(info.height / (info.width / width)) + "px"
  };
}

/**
 * 获取浏览器光标选中内容
 *
 * @export
 * @returns
 */
export function getSelection() {
  return window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
}

/**
 * 剪贴板复制功能
 * 
 * @param {String} value 复制内容
 * @param  callback 复制成功回调方法
 */
export const copyTextToClipboard = (value, callback) => {
  let textArea = document.createElement("textarea");
  textArea.style.background = 'transparent';
  textArea.value = value;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    if (callback) callback();
  } catch (err) {
    alert('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

/**
 * 隐藏用户手机号中间四位
 * 
 * @param {String} phone  手机号
 */
export function hidePhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 包装聊天对话列表数据
 *
 * @param {Object} params
 */
export function packTalkItem(params) {
  let options = Object.assign({
    id: 0,
    type: 1,
    index_name: "",
    name: "未设置昵称",
    remark_name: "",
    avatar: "",
    friend_id: 0,
    group_id: 0,
    group_members_num: 0,
    not_disturb: 0,
    is_top: 0,
    unread_num: 0,
    content: "......",
    created_at: parseTime(new Date()),
  }, params);

  options.index_name = options.type == 1 ? `${options.type}_${options.friend_id}` : `${options.type}_${options.group_id}`;

  return options;
}

/**
 * 人性化显示时间
 *
 * @param {Object} datetime
 */
export function beautifyTime(datetime = '') {
  if (datetime == null) {
    return ''
  }
  datetime = datetime.replace(/-/g, "/");

  //当前时间戳
  let time = new Date();
  let outTime = new Date(datetime);
  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000);
  }

  if (time.getTime() < outTime.getTime()) {
    return parseTime(outTime, '{y}/{m}/{d}')
  }

  if (time.getFullYear() != outTime.getFullYear()) {
    return parseTime(outTime, '{y}/{m}/{d}')
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, '{m}/{d}')
  }

  if (time.getDate() != outTime.getDate()) {
    let day = outTime.getDate() - time.getDate();
    if (day == -1) {
      return parseTime(outTime, '昨天 {h}:{i}')
    }

    if (day == -2) {
      return parseTime(outTime, '前天 {h}:{i}')
    }

    return parseTime(outTime, '{m}-{d}')
  }

  if (time.getHours() != outTime.getHours()) {
    return parseTime(outTime, '{h}:{i}')
  }

  let minutes = outTime.getMinutes() - time.getMinutes();
  if (minutes == 0) {
    return '刚刚';
  }

  minutes = Math.abs(minutes)
  return `${minutes}分钟前`;
}

/**
 * 替换表情文字
 * 
 * @param {String} content  需要替换的字符串
 */
export function textReplaceEmoji(content) {
  let emojis = {
    "[微笑]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/0.gif'>",
    "[撇嘴]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/1.gif'>",
    "[色]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/2.gif'>",
    "[发呆]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/3.gif'>",
    "[得意]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/4.gif'>",
    "[流泪]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/5.gif'>",
    "[害羞]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/6.gif'>",
    "[闭嘴]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/7.gif'>",
    "[睡]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/8.gif'>",
    "[大哭]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/9.gif'>",
    "[尴尬]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/10.gif'>",
    "[发怒]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/11.gif'>",
    "[调皮]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/12.gif'>",
    "[呲牙]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/13.gif'>",
    "[惊讶]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/14.gif'>",
    "[难过]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/15.gif'>",
    "[酷]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/16.gif'>",
    "[冷汗]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/17.gif'>",
    "[抓狂]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/18.gif'>",
    "[吐]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/19.gif'>",
    "[偷笑]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/20.gif'>",
    "[可爱]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/21.gif'>",
    "[白眼]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/22.gif'>",
    "[傲慢]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/23.gif'>",
    "[饥饿]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/24.gif'>",
    "[困]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/25.gif'>",
    "[惊恐]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/26.gif'>",
    "[流汗]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/27.gif'>",
    "[憨笑]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/28.gif'>",
    "[大兵]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/29.gif'>",
    "[奋斗]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/30.gif'>",
    "[咒骂]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/31.gif'>",
    "[疑问]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/32.gif'>",
    "[嘘]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/33.gif'>",
    "[晕]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/34.gif'>",
    "[折磨]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/35.gif'>",
    "[衰]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/36.gif'>",
    "[骷髅]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/37.gif'>",
    "[敲打]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/38.gif'>",
    "[再见]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/39.gif'>",
    "[擦汗]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/40.gif'>",
    "[抠鼻]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/41.gif'>",
    "[鼓掌]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/42.gif'>",
    "[糗大了]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/43.gif'>",
    "[坏笑]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/44.gif'>",
    "[左哼哼]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/45.gif'>",
    "[右哼哼]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/46.gif'>",
    "[哈欠]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/47.gif'>",
    "[鄙视]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/48.gif'>",
    "[委屈]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/49.gif'>",
    "[快哭了]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/50.gif'>",
    "[阴险]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/51.gif'>",
    "[亲亲]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/52.gif'>",
    "[吓]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/53.gif'>",
    "[可怜]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/54.gif'>",
    "[菜刀]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/55.gif'>",
    "[西瓜]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/56.gif'>",
    "[啤酒]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/57.gif'>",
    "[篮球]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/58.gif'>",
    "[乒乓]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/59.gif'>",
    "[咖啡]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/60.gif'>",
    "[饭]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/61.gif'>",
    "[猪头]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/62.gif'>",
    "[玫瑰]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/63.gif'>",
    "[凋谢]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/64.gif'>",
    "[示爱]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/65.gif'>",
    "[爱心]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/66.gif'>",
    "[心碎]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/67.gif'>",
    "[蛋糕]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/68.gif'>",
    "[闪电]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/69.gif'>",
    "[炸弹]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/70.gif'>",
    "[刀]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/71.gif'>",
    "[足球]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/72.gif'>",
    "[瓢虫]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/73.gif'>",
    "[便便]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/74.gif'>",
    "[月亮]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/75.gif'>",
    "[太阳]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/76.gif'>",
    "[礼物]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/77.gif'>",
    "[拥抱]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/78.gif'>",
    "[强]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/79.gif'>",
    "[弱]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/80.gif'>",
    "[握手]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/81.gif'>",
    "[胜利]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/82.gif'>",
    "[抱拳]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/83.gif'>",
    "[勾引]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/84.gif'>",
    "[拳头]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/85.gif'>",
    "[差劲]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/86.gif'>",
    "[爱你]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/87.gif'>",
    "[NO]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/88.gif'>",
    "[OK]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/89.gif'>",
    "[爱情]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/90.gif'>",
    "[飞吻]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/91.gif'>",
    "[跳跳]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/92.gif'>",
    "[发抖]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/93.gif'>",
    "[怄火]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/94.gif'>",
    "[转圈]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/95.gif'>",
    "[磕头]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/96.gif'>",
    "[回头]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/97.gif'>",
    "[跳绳]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/98.gif'>",
    "[挥手]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/99.gif'>",
    "[激动]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/100.gif'>",
    "[街舞]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/101.gif'>",
    "[献吻]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/102.gif'>",
    "[左太极]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/103.gif'>",
    "[右太极]": "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/104.gif'>",
  };

  return content.replace(
    /(\[\微\笑\]|\[\撇\嘴\]|\[\色\]|\[\发\呆\]|\[\得\意\]|\[\流\泪\]|\[\害\羞\]|\[\闭\嘴\]|\[\睡\]|\[\大\哭\]|\[\尴\尬\]|\[\发\怒\]|\[\调\皮\]|\[\呲\牙\]|\[\惊\讶\]|\[\难\过\]|\[\酷\]|\[\冷\汗\]|\[\抓\狂\]|\[\吐\]|\[\偷\笑\]|\[\可\爱\]|\[\白\眼\]|\[\傲\慢\]|\[\饥\饿\]|\[\困\]|\[\惊\恐\]|\[\流\汗\]|\[\憨\笑\]|\[\大\兵\]|\[\奋\斗\]|\[\咒\骂\]|\[\疑\问\]|\[\嘘\]|\[\晕\]|\[\折\磨\]|\[\衰\]|\[\骷\髅\]|\[\敲\打\]|\[\再\见\]|\[\擦\汗\]|\[\抠\鼻\]|\[\鼓\掌\]|\[\糗\大\了\]|\[\坏\笑\]|\[\左\哼\哼\]|\[\右\哼\哼\]|\[\哈\欠\]|\[\鄙\视\]|\[\委\屈\]|\[\快\哭\了\]|\[\阴\险\]|\[\亲\亲\]|\[\吓\]|\[\可\怜\]|\[\菜\刀\]|\[\西\瓜\]|\[\啤\酒\]|\[\篮\球\]|\[\乒\乓\]|\[\咖\啡\]|\[\饭\]|\[\猪\头\]|\[\玫\瑰\]|\[\凋\谢\]|\[\示\爱\]|\[\爱\心\]|\[\心\碎\]|\[\蛋\糕\]|\[\闪\电\]|\[\炸\弹\]|\[\刀\]|\[\足\球\]|\[\瓢\虫\]|\[\便\便\]|\[\月\亮\]|\[\太\阳\]|\[\礼\物\]|\[\拥\抱\]|\[\强\]|\[\弱\]|\[\握\手\]|\[\胜\利\]|\[\抱\拳\]|\[\勾\引\]|\[\拳\头\]|\[\差\劲\]|\[\爱\你\]|\[\N\O\]|\[\O\K\]|\[\爱\情\]|\[\飞\吻\]|\[\跳\跳\]|\[\发\抖\]|\[\怄\火\]|\[\转\圈\]|\[\磕\头\]|\[\回\头\]|\[\跳\绳\]|\[\挥\手\]|\[\激\动\]|\[\街\舞\]|\[\献\吻\]|\[\左\太\极\]|\[\右\太\极\])/gi,
    function ($0, $1) {
      return emojis[$1];
    });
}

export function getSort(fn) {
  return function (a, b) {
    var ret = 0;

    if (fn.call(this, a, b)) {
      ret = -1;
    } else if (fn.call(this, b, a)) {
      ret = 1;
    }

    return ret;
  }
}

/**
 * 批量排序
 * 
 * @param {*} arr 
 */
export function getMutipSort(arr) {
  return function (a, b) {
    var tmp, i = 0;

    do {
      tmp = arr[i++](a, b);
    } while (tmp == 0 && i < arr.length);

    return tmp;
  }
}

/**
 * Url 替换超链接
 * 
 * @param {String} text 文本
 * @param {String} color 超链接颜色
 */
export function textReplaceLink(text, color = '#409eff') {
  let exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
  return text.replace(exp, `<a href='$1' target="_blank" style="color:${color};text-decoration: revert;">$1</a >`)
}