"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formateTime = formateTime;
exports.formateSize = formateSize;
exports.getFileExt = getFileExt;
exports.downloadIamge = downloadIamge;
exports.getImageInfo = getImageInfo;
exports.download = download;
exports.parseTime = parseTime;
exports.trim = trim;
exports.param2Obj = param2Obj;
exports.param = param;
exports.cleanArray = cleanArray;
exports.toggleClass = toggleClass;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.imgZoom = imgZoom;
exports.getSelection = getSelection;
exports.hidePhone = hidePhone;
exports.packTalkItem = packTalkItem;
exports.beautifyTime = beautifyTime;
exports.copyTextToClipboard = void 0;

var _auth = require("@/utils/auth");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * 人性化时间显示
 *
 * @param {Object} datetime
 */
function formateTime(datetime) {
  datetime = datetime.replace(/-/g, "/"); //当前时间戳

  var time = new Date();
  var outTime = new Date(datetime);

  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000);
  }

  if (time.getTime() < outTime.getTime() || time.getFullYear() != outTime.getFullYear()) {
    return parseTime(outTime, '{y}-{m}-{d} {h}:{i}');
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, '{m}-{d} {h}:{i}');
  }

  if (time.getDate() != outTime.getDate()) {
    var day = outTime.getDate() - time.getDate();

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

  var minutes = outTime.getMinutes() - time.getMinutes();

  if (minutes == 0) {
    return '刚刚';
  }

  minutes = Math.abs(minutes);
  return "".concat(minutes, "\u5206\u949F\u524D");
}
/**
 * 格式化文件大小
 * 
 * @param {Object} value 文件大小(字节)
 */


function formateSize(value) {
  if (null == value || value == '') {
    return "0";
  }

  var unitArr = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  var index = 0;
  var srcsize = parseFloat(value);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  var size = srcsize / Math.pow(1024, index);
  size = size.toFixed(2); //保留的小数位数

  return size + unitArr[index];
}
/**
 * 获取文件后缀名
 *
 * @param {Object} fileName
 */


function getFileExt(fileName) {
  var ext = fileName.split('.');
  ext = ext[ext.length - 1]; // 获取文件后缀名

  return ext;
}
/**
 * 根据图片url下载图片
 * @param {Object} imgsrc
 * @param {Object} name
 */


function downloadIamge(imgsrc, name) {
  //下载图片地址和图片名
  var image = new Image(); // 解决跨域 Canvas 污染问题

  image.setAttribute("crossOrigin", "anonymous");

  image.onload = function () {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

    var a = document.createElement("a"); // 生成一个a元素

    var event = new MouseEvent("click"); // 创建一个单击事件

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


function getImageInfo(imgsrc) {
  var data = {
    width: 0,
    height: 0
  };
  var arr = imgsrc.split('_');
  if (arr.length == 1) return data;
  var info = arr[arr.length - 1].match(/\d+x\d+/g);
  if (info == null) return data;
  info = info[0].split('x');
  return {
    width: parseInt(info[0]),
    height: parseInt(info[1])
  };
}
/**
 * 文件下载方法
 * 
 * @param {number} cr_id 
 */


function download(cr_id) {
  var api = process.env.API_URL;
  var token = (0, _auth.getToken)();

  try {
    var link = document.createElement('a');
    link.href = "".concat(api, "/api/download/user-chat-file?cr_id=").concat(cr_id, "&token=").concat(token);
    link.click();
  } catch (e) {}
}
/**
 * 时间格式化方法
 * 
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */


function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }

  var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  var date;

  if (_typeof(time) === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }

    date = new Date(time.replace(/-/g, "/"));
  }

  var formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  var time_str = format.replace(/{([ymdhisa])+}/g, function (result, key) {
    var value = formatObj[key]; // Note: getDay() returns 0 on Sunday

    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }

    return value.toString().padStart(2, '0');
  });
  return time_str;
}
/**
 * 去除字符串控制
 * 
 * @param {String} str 
 */


function trim(str) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

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
 * @param {string} url
 * @returns {Object}
 */


function param2Obj(url) {
  var search = url.split('?')[1];

  if (!search) {
    return {};
  }

  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ') + '"}');
}
/**
 * @param {Object} json
 * @returns {Array}
 */


function param(json) {
  if (!json) return '';
  return cleanArray(Object.keys(json).map(function (key) {
    if (json[key] === undefined) return '';
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
  })).join('&');
}
/**
 * @param {Array} actual
 * @returns {Array}
 */


function cleanArray(actual) {
  var newArray = [];

  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }

  return newArray;
}
/**
 * @param {HTMLElement} element
 * @param {string} className
 */


function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }

  var classString = element.className;
  var nameIndex = classString.indexOf(className);

  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
  }

  element.className = classString;
}
/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */


function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */


function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}
/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */


function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}
/**
 * 通过图片Url获取图片等比例缩放的宽度和高度信息
 * 
 * @param {string} src 
 * @param {number} width 
 */


function imgZoom(src) {
  var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
  var info = getImageInfo(src);

  if (info.width < width) {
    return {
      width: "".concat(info.width, "px"),
      height: "".concat(info.height, "px")
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


function getSelection() {
  return window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
}
/**
 * 剪贴板复制功能
 * 
 * @param {*} value 复制内容
 * @param {*} callback 复制成功回调方法
 */


var copyTextToClipboard = function copyTextToClipboard(value, callback) {
  var textArea = document.createElement("textarea");
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
};
/**
 * 隐藏用户手机号中间四位
 * 
 * @param {string} phone  手机号
 */


exports.copyTextToClipboard = copyTextToClipboard;

function hidePhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}
/**
 * 包装聊天对话列表数据
 *
 * @param {Object} params
 */


function packTalkItem(params) {
  var options = {
    id: null,
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
    created_at: parseTime(new Date())
  };
  options = Object.assign(options, params);
  options.index_name = options.type == 1 ? "".concat(options.type, "_").concat(options.friend_id) : "".concat(options.type, "_").concat(options.group_id);
  return options;
}
/**
 * 人性化显示时间
 *
 * @param {Object} datetime
 */


function beautifyTime() {
  var datetime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (datetime == null) {
    return '';
  }

  datetime = datetime.replace(/-/g, "/"); //当前时间戳

  var time = new Date();
  var outTime = new Date(datetime);

  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000);
  }

  if (time.getTime() < outTime.getTime()) {
    return parseTime(outTime, '{y}/{m}/{d}');
  }

  if (time.getFullYear() != outTime.getFullYear()) {
    return parseTime(outTime, '{y}/{m}/{d}');
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, '{m}/{d}');
  }

  if (time.getDate() != outTime.getDate()) {
    var day = outTime.getDate() - time.getDate();

    if (day == -1) {
      return parseTime(outTime, '昨天 {h}:{i}');
    }

    if (day == -2) {
      return parseTime(outTime, '前天 {h}:{i}');
    }

    return parseTime(outTime, '{m}-{d}');
  }

  if (time.getHours() != outTime.getHours()) {
    return parseTime(outTime, '{h}:{i}');
  }

  var minutes = outTime.getMinutes() - time.getMinutes();

  if (minutes == 0) {
    return '刚刚';
  }

  minutes = Math.abs(minutes);
  return "".concat(minutes, "\u5206\u949F\u524D");
}