<template>
  <div id="editor-template">
    <!-- 这是聊天编辑器组件 -->
    <el-popover ref="popover4" placement="top-start" width="400" transition="fade-in-linear" offset='-5' popper-class=""
      v-model="visible2" trigger="click">
      <div class="my-popover">
        <div class="popover-tab-box">
          <div class="smiley-tab-box">
            <ul>
              <li class="PicItem" v-for="(item,i) in EmotionList"  @click="clickEmoticon(item)" :key="i">
                <img :src=" 'https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/' + i + '.gif'">
              </li>
            </ul>
          </div>
        </div>
        <ul style="height: 30px;background: rgb(247, 246, 246);" @click="visible2 = false">

        </ul>
      </div>
    </el-popover>


    <div id="editor-toolbar">
      <ul>
        <li v-popover:popover4 @click="disabled = true">
          <i class="iconfont icon-icon_im_face"></i>
          <p class="i-tips-title">表情包</p>
        </li>
        <li @click="imageEvent">
          <i class="iconfont icon-icon_photo"></i>
          <p class="i-tips-title">发送图片</p>
        </li>
        <li @click="fileEvent">
          <i class="iconfont icon-icon_file"></i>
          <p class="i-tips-title">发送附件</p>
        </li>
      </ul>

      <p class="toolbar-buttom-tip">按Enter发送 / Shift+Enter 换行</p>
      <form enctype="multipart/form-data" ref='fileFrom'>
        <input type="file" ref='restFile' style="display: none;" @change="uploadChange">
      </form>
    </div>
    <div id="editor-textarea">
      <textarea ref='textarea' :placeholder="placeholder" v-model.trim="editorText" @keydown="check($event)"
        @keyup.enter="enterSend($event)"></textarea>
    </div>
  </div>
</template>

<script type="text/javascript">
  import {
    testApi
  } from '@/services/api'
  export default {
    data() {
      return {
        toolbars: [{
            name: 'emoticon',
            text: '表情包',
            icon: 'iconfont icon-biaoqing',
            event: 'emoticonEvent'
          },
          {
            name: 'image',
            text: '发送图片',
            icon: 'iconfont icon-caidan1',
            event: 'imageEvent'
          },
          {
            name: 'file',
            text: '发送文件',
            icon: 'iconfont icon-6nichengzhao',
            event: 'fileEvent'
          }
        ],
        placeholder: ' 你想要的聊点什么呢...',
        editorText: '',
        visible2: false,
        EmotionList: ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭',
          '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱',
          '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘',
          '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼',
          '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒',
          '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹',
          '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引',
          '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手',
          '激动', '街舞', '献吻', '左太极', '右太极'
        ],
        
        emoji:[
            "☀","☁","☔","⛄","⚡","🌀","🌁","🌂","🌃","🌄","🌅","🌆","🌇","🌈","❄","⛅","🌉","🌊","🌋","🌌","🌏","🌑","🌔","🌓","🌙","🌕","🌛","🌟","🌠",
            "🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛","⌚","⌛","⏰","⏳","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","⛎",
            "🍀","🌷","🌱","🍁","🌸","🌹","🍂","🍃","🌺","🌻","🌴","🌵","🌾","🌽","🍄","🌰","🌼","🌿","🍒","🍌","🍎","🍊","🍓","🍉","🍅","🍆","🍈","🍍",
            "🍇","🍑","🍏","👀","👂","👃","👄","👅","💄","💅","💆","💇","💈","👤","👦","👧","👨","👩","👪","👫","👮","👯","👰","👱","👲","👳","👴","👵",
            "👶","👷","👸","👹","👺","👻","👼","👽","👾","👿","💀","💁","💂","💃","🐌","🐍","🐎","🐔","🐗","🐫","🐘","🐨","🐒","🐑","🐙","🐚","🐛","🐜",
            "🐝","🐞","🐠","🐡","🐢","🐤","🐥","🐦","🐣","🐧","🐩","🐟","🐬","🐭","🐯","🐱","🐳","🐴","🐵","🐶","🐷","🐻","🐹","🐺","🐮","🐰","🐸","🐾",
            "🐲","🐼","🐽","😠","😩","😲","😞","😵","😰","😒","😍","😤","😜","😝","😋","😘","😚","😷","😳","😃","😅","😆","😁","😂","😊","☺","😄","😢",
            "😭","😨","😣","😡","😌","😖","😔","😱","😪","😏","😓","😥","😫","😉","😺","😸","😹","😽","😻","😿","😾","😼","🙀","🙅","🙆","🙇","🙈","🙊",
            "🙉","🙋","🙌","🙍","🙎","🙏","🏠","🏡","🏢","🏣","🏥","🏦","🏧","🏨","🏩","🏪","🏫","⛪","⛲","🏬","🏯","🏰","🏭","⚓","🏮","🗻","🗼","🗽",
            "🗾","🗿","👞","👟","👠","👡","👢","👣","👓","👕","👖","👑","👔","👒","👗","👘","👙","👚","👛","👜","👝","💰","💱","💹","💲","💳","💴","💵",
            "💸","-","🔥","🔦","🔧","🔨","🔩","🔪","🔫","🔮","🔯","🔰","🔱","💉","💊","🅰","🅱","🆎","🅾","🎀","🎁",
            "🎂","🎄","🎅","🎌","🎆","🎈","🎉","🎍","🎎","🎓","🎒","🎏","🎇","🎐","🎃","🎊","🎋","🎑","📟","☎","📞","📱","📲","📝","📠","✉","📨","📩",
            "📪","📫","📮","📰","📢","📣","📡","📤","📥","📦","📧","🔠","🔡","🔢","🔣","🔤","✒","💺","💻","✏","📎","💼","💽","💾","💿","📀","✂","📍",
            "📃","📄","📅","📁","📂","📓","📖","📔","📕","📗","📘","📙","📚","📛","📜","📋","📆","📊","📈","📉","📇","📌","📒","📏","📐","📑","🎽","⚾",
            "⛳","🎾","⚽","🎿","🏀","🏁","🏂","🏃","🏄","🏆","🏈","🏊","🚃","🚇","Ⓜ","🚄","🚅","🚗","🚙","🚌","🚏","🚢","✈","⛵","🚉","🚀","🚤","🚕",
            "🚚","🚒","🚑","🚓","⛽","🅿","🚥","🚧","🚨","♨","⛺","🎠","🎡","🎢","🎣","🎤","🎥","🎦","🎧","🎨","🎩","🎪","🎫","🎬","🎭","🎮","🀄","🎯",
            "🎰","🎱","🎲","🎳","🎴","🃏","🎵","🎶","🎷","🎸","🎹","🎺","🎻","🎼","〽","📷","📹","📺","📻","📼","💋","💌","💍","💎","💏","💐","💑","💒",
            "🔞","©","®","™","ℹ","🔟","📶","📳","📴","🍔","🍙","🍰","🍜","🍞","🍳","🍦","🍟","🍡","🍘","🍚",
            "🍝","🍛","🍢","🍣","🍱","🍲","🍧","🍖","🍥","🍠","🍕","🍗","🍨","🍩","🍪","🍫","🍬","🍭","🍮","🍯","🍤","🍴","☕","🍸","🍺","🍵","🍶","🍷",
            "🍻","🍹","↗","↘","↖","↙","⤴","⤵","↔","↕","⬆","⬇","➡","⬅","▶","◀","⏩","⏪","⏫","⏬","🔺","🔻","🔼","🔽","⭕","❌","❎","❗","⁉","‼",
            "❓","❔","❕","〰","➰","-","❤","💓","💔","💕","💖","💗","💘","💙","💚","💛","💜","💝","💞","💟","♥","♠","♦","♣","🚬","🚭","♿","🚩","⚠",
            "⛔","♻","🚲","🚶","🚹","🚺","🛀","🚻","🚽","🚾","🚼","🚪","🚫","✔","🆑","🆒","🆓","🆔","🆕","🆖","🆗","🆘","🆙","🆚","🈁","🈂","🈲","🈳","🈴",
            "🈵","🈶","🈚","🈷","🈸","🈹","🈯","🈺","㊙","㊗","🉐","🉑","➕","➖","✖","➗","💠","💡","💢","💣","💤","💥","💦","💧","💨","💩","💪","💫","💬",
            "✨","✴","✳","⚪","⚫","🔴","🔵","🔲","🔳","⭐","⬜","⬛","▫","▪","◽","◾","◻","◼","🔶","🔷","🔸","🔹","❇","💮","💯","↩","↪","🔃","🔊","🔋",
            "🔌","🔍","🔎","🔒","🔓","🔏","🔐","🔑","🔔","☑","🔘","🔖","🔗","🔙","🔚","🔛","🔜","🔝","✅","✊","✋","✌","👊","👍","☝","👆","👇","👈","👉",
            "👋","👏","👌","👎","👐"
        ]

      }
    },
    methods: {
      //验证消息是否为空
      check(e) {
        if (e.keyCode == 13 && this.editorText == '') {
          e.preventDefault() // 阻止浏览器默认换行操作
        }
      },
      //回车发送消息
      enterSend(e) {
        if (e.shiftKey) {
          return false;
        } else if (this.editorText == '') {
          return false;
        }

        this.$emit('send', this.editorText);
        this.editorText = '';
      },

      //选中表情
      clickEmoticon: function(emoji) {
        this.visible2 = false;
        this.handleEmojiChoose(`[${emoji}]`);
      },

      events(name) {
        this[name]();
      },

      emoticonEvent() {
        alert('emoticonEvent')
      },
      imageEvent() {
        this.$refs.restFile.click();
      },
      fileEvent() {
        this.$refs.restFile.click();
      },

      uploadChange(e) {
        e.preventDefault();
        let file = e.target.files[0];
        let fileSize = Math.ceil(file.size / 1024) + 'KB';
        let fileData = new FormData();
        // fileData.append("uploadFile", file);
        // testApi(fileData).then(res=>{

        // });

      },
      handleEmojiChoose(emoji) {
        let value = this.editorText
        let el = this.$refs.textarea
        let startPos = el.selectionStart
        let endPos = el.selectionEnd
        let newValue = value.substring(0, startPos) + emoji + value.substring(endPos, value.length)
        this.editorText = newValue
        if (el.setSelectionRange) {
          setTimeout(() => {
            let index = startPos + emoji.length
            el.setSelectionRange(index, index)
          }, 0)
        }
      },
    }
  }
</script>

<style scoped>
  .my-popover {
    width: 400px;
    height: 300px;
  }

  .my-popover .popover-tab-box {
    height: 270px;
  }

  .popover-tab-box .smiley-tab-box li {
    width: 30px;
    height: 30px;
    float: left;
    cursor: pointer;
  }


  #editor-template {
    height: 100%;
    width: 100%;
  }

  #editor-toolbar {
    min-height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #f9f3f3;
  }

  #editor-toolbar li {
    float: left;
    margin-left: 3px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    position: relative;
  }

  #editor-toolbar li .i-tips-title {
    display: none;
    position: absolute;
    top: 38px;
    left: 0px;
    height: 20px;
    line-height: 20px;
    background: #212020;
    color: white;
    min-width: 30px;
    font-size: 10px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 5px;
    white-space: pre;

  }

  #editor-toolbar li:hover {
    background: #fff8f8;
  }

  #editor-toolbar li:hover .i-tips-title {
    display: inline-block;
  }

  #editor-toolbar li:first-child {
    margin-left: 0px;
  }


  .toolbar-buttom-tip {
    float: right;
    margin-right: 5px;
    font-size: 12px;
    color: #CCCCCC;
  }


  #editor-textarea {
    height: 122px;
  }

  #editor-textarea textarea {
    width: calc(100% - 9px);
    height: 115px;
    border: 0 none;
    outline: none;
    resize: none;
    font-size: 15px;
    overflow-y: auto;
    padding: 5px 5px 2px 5px;
    color: #464545;
  }


  #editor-textarea textarea::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }

  #editor-textarea textarea::-webkit-scrollbar-thumb {
    background: #d5cfcf;
  }

  #editor-textarea textarea::-webkit-scrollbar-track {
    background: #EDEDED;
  }


  #editor-textarea textarea::-webkit-input-placeholder {
    color: #a9a4a4;
    font-size: 12px;
  }
</style>
