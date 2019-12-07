<template>
  <div id="editor-template">
    <!-- 这是聊天编辑器组件 -->
    <el-popover ref="popover4" placement="top-start" width="400" transition="fade-in-linear" offset='-5' popper-class=""
      v-model="visible2" trigger="click">
      <div class="my-popover">
        <div class="popover-tab-box">
          <div v-if="emoji.tabIndex == 0" class="smiley-tab-box">
            <ul>
              <li v-for="(item,i) in emoji.list.emoji1" @click="clickEmoticon(item,1)">
                <img :src=" 'https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/' + i + '.gif'">
              </li>
            </ul>
          </div>
          <div v-else-if="emoji.tabIndex == 1" class="smiley-tab-box emoji-tab-box">
            <ul>
              <li style="font-size: 22px;height: 30px;line-height: 30px;" v-for="(item,i) in emoji.list.emoji2" @click="clickEmoticon(item,0)"
                :key="i">
                {{item}}
              </li>
            </ul>
          </div>
        </div>
        <div class="emoji-toolbar">
          <div :class="{'active-emoji':emoji.tabIndex ==0?true:false}" @click="emoji.tabIndex =0">GIF表情</div>
          <div :class="{'active-emoji':emoji.tabIndex ==1?true:false}" @click="emoji.tabIndex =1">emoji表情</div>
        </div>
      </div>
    </el-popover>

    <div class="editor-image-preview" v-show="tpmUploadImg.show">
      <div class="image-preview-box">
        <div class="image-preview-header">
          <span>发送图片</span>
          <i class="iconfont icon-RectangleCopy" @click="tpmUploadImg.show = false"></i>
        </div>
        <div class="image-preview-body">
          <img :src="tpmUploadImg.src">
          <p style="padding-top: 10px;font-size: 14px;">{{tpmUploadImg.fileName}}</p>
          <p style="color: rgb(148, 140, 140);font-size: 12px;">{{tpmUploadImg.fileSize}} KB</p>
        </div>
        <div class="image-preview-footer">
          <button @click="sendUploadImg">{{tpmUploadImg.lock?'上传中...':'立即发送'}}</button>
        </div>
      </div>
    </div>

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
      <form enctype="multipart/form-data" id="lumen-file-from" ref='fileFrom'>
        <input type="file" ref='restFile' accept="image/*" style="display: none;" @change="uploadChange">
      </form>
    </div>
    <div id="editor-textarea">
      <textarea ref='textarea' placeholder="你想要的聊点什么呢..." v-model.trim="editorText" @keydown="check($event)"
        @keyup.enter="enterSend($event)"></textarea>
    </div>
  </div>
</template>

<script type="text/javascript">
  import {
    uploadImgApi
  } from '@/services/api'
  export default {
    data() {
      return {
        uploadShow: false,
        editorText: '',
        visible2: false,
        emoji: {
          tabIndex: 0,
          list: {
            emoji1: ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭',
              '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱',
              '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘',
              '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼',
              '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒',
              '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹',
              '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引',
              '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手',
              '激动', '街舞', '献吻', '左太极'
            ],
            emoji2: [
              "😠", "😩", "😲", "😞", "😵", "😰", "😒", "😍", "😤", "😜", "😝", "😋", "😘", "😚", "😷",
              "😳", "😃", "😅", "😆", "😁", "😂", "😊", "☺", "😄", "😢",
              "😭", "😨", "😣", "😡", "😌", "😖", "😔", "😱", "😪", "😏", "😓", "😥", "😫", "😉",
              "✊", "✋", "✌", "👊", "👍", "☝", "👆", "👇", "👈", "👉",
              "👋", "👏", "👌", "👎", "👐",
              "☀", "☁", "☔", "⛄", "⚡", "🌀", "🌁", "🌂", "🌃", "🌄", "🌅", "🌆", "🌇", "🌈", "❄", "⛅", "🌉", "🌊",
              "🌋",
              "🌌", "🌏", "🌑", "🌔", "🌓", "🌙", "🌕", "🌛", "🌟", "🌠",
              "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛", "⌚", "⌛", "⏰", "⏳", "♈", "♉",
              "♊",
              "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "⛎",
              "🍀", "🌷", "🌱", "🍁", "🌸", "🌹", "🍂", "🍃", "🌺", "🌻", "🌴", "🌵", "🌾", "🌽", "🍄", "🌰", "🌼",
              "🌿",
              "🍒", "🍌", "🍎", "🍊", "🍓", "🍉", "🍅", "🍆", "🍈", "🍍",
              "🍇", "🍑", "🍏", "👀", "👂", "👃", "👄", "👅", "💄", "💅", "💆", "💇", "💈", "👤", "👦", "👧", "👨",
              "👩",
              "👪", "👫", "👮", "👯", "👰", "👱", "👲", "👳", "👴", "👵",
              "👶", "👷", "👸", "👹", "👺", "👻", "👼", "👽", "👾", "👿", "💀", "💁", "💂", "💃", "🐌", "🐍", "🐎",
              "🐔",
              "🐗", "🐫", "🐘", "🐨", "🐒", "🐑", "🐙", "🐚", "🐛", "🐜",
              "🐝", "🐞", "🐠", "🐡", "🐢", "🐤", "🐥", "🐦", "🐣", "🐧", "🐩", "🐟", "🐬", "🐭", "🐯", "🐱", "🐳",
              "🐴",
              "🐵", "🐶", "🐷", "🐻", "🐹", "🐺", "🐮", "🐰", "🐸", "🐾",
              "🐲", "🐼", "🐽", "😺", "😸", "😹",
              "😽",
              "😻", "😿", "😾", "😼", "🙀", "🙅", "🙆", "🙇", "🙈", "🙊",
              "🙉", "🙋", "🙌", "🙍", "🙎", "🙏", "🏠", "🏡", "🏢", "🏣", "🏥", "🏦", "🏧", "🏨", "🏩", "🏪", "🏫",
              "⛪",
              "⛲", "🏬", "🏯", "🏰", "🏭", "⚓", "🏮", "🗻", "🗼", "🗽",
              "🗾", "🗿", "👞", "👟", "👠", "👡", "👢", "👣", "👓", "👕", "👖", "👑", "👔", "👒", "👗", "👘", "👙",
              "👚",
              "👛", "👜", "👝", "💰", "💱", "💹", "💲", "💳", "💴", "💵",
              "💸", "-", "🔥", "🔦", "🔧", "🔨", "🔩", "🔪", "🔫", "🔮", "🔯", "🔰", "🔱", "💉", "💊", "🅰", "🅱",
              "🆎",
              "🅾", "🎀", "🎁",
              "🎂", "🎄", "🎅", "🎌", "🎆", "🎈", "🎉", "🎍", "🎎", "🎓", "🎒", "🎏", "🎇", "🎐", "🎃", "🎊", "🎋",
              "🎑",
              "📟", "☎", "📞", "📱", "📲", "📝", "📠", "✉", "📨", "📩",
              "📪", "📫", "📮", "📰", "📢", "📣", "📡", "📤", "📥", "📦", "📧", "🔠", "🔡", "🔢", "🔣", "🔤", "✒",
              "💺",
              "💻", "✏", "📎", "💼", "💽", "💾", "💿", "📀", "✂", "📍",
              "📃", "📄", "📅", "📁", "📂", "📓", "📖", "📔", "📕", "📗", "📘", "📙", "📚", "📛", "📜", "📋", "📆",
              "📊",
              "📈", "📉", "📇", "📌", "📒", "📏", "📐", "📑", "🎽", "⚾",
              "⛳", "🎾", "⚽", "🎿", "🏀", "🏁", "🏂", "🏃", "🏄", "🏆", "🏈", "🏊", "🚃", "🚇", "Ⓜ", "🚄", "🚅", "🚗",
              "🚙", "🚌", "🚏", "🚢", "✈", "⛵", "🚉", "🚀", "🚤", "🚕",
              "🚚", "🚒", "🚑", "🚓", "⛽", "🅿", "🚥", "🚧", "🚨", "♨", "⛺", "🎠", "🎡", "🎢", "🎣", "🎤", "🎥", "🎦",
              "🎧", "🎨", "🎩", "🎪", "🎫", "🎬", "🎭", "🎮", "🀄", "🎯",
              "🎰", "🎱", "🎲", "🎳", "🎴", "🃏", "🎵", "🎶", "🎷", "🎸", "🎹", "🎺", "🎻", "🎼", "〽", "📷", "📹",
              "📺",
              "📻", "📼", "💋", "💌", "💍", "💎", "💏", "💐", "💑", "💒",
              "🔞", "©", "®", "™", "ℹ", "🔟", "📶", "📳", "📴", "🍔", "🍙", "🍰", "🍜", "🍞", "🍳", "🍦", "🍟", "🍡",
              "🍘", "🍚",
              "🍝", "🍛", "🍢", "🍣", "🍱", "🍲", "🍧", "🍖", "🍥", "🍠", "🍕", "🍗", "🍨", "🍩", "🍪", "🍫", "🍬",
              "🍭",
              "🍮", "🍯", "🍤", "🍴", "☕", "🍸", "🍺", "🍵", "🍶", "🍷",
              "🍻", "🍹", "↗", "↘", "↖", "↙", "⤴", "⤵", "↔", "↕", "⬆", "⬇", "➡", "⬅", "▶", "◀", "⏩", "⏪", "⏫", "⏬",
              "🔺",
              "🔻", "🔼", "🔽", "⭕", "❌", "❎", "❗", "⁉", "‼",
              "❓", "❔", "❕", "〰", "➰", "-", "❤", "💓", "💔", "💕", "💖", "💗", "💘", "💙", "💚", "💛", "💜", "💝",
              "💞",
              "💟", "♥", "♠", "♦", "♣", "🚬", "🚭", "♿", "🚩", "⚠",
              "⛔", "♻", "🚲", "🚶", "🚹", "🚺", "🛀", "🚻", "🚽", "🚾", "🚼", "🚪", "🚫", "✔", "🆑", "🆒", "🆓", "🆔",
              "🆕", "🆖", "🆗", "🆘", "🆙", "🆚", "🈁", "🈂", "🈲", "🈳", "🈴",
              "🈵", "🈶", "🈚", "🈷", "🈸", "🈹", "🈯", "🈺", "㊙", "㊗", "🉐", "🉑", "➕", "➖", "✖", "➗", "💠", "💡",
              "💢",
              "💣", "💤", "💥", "💦", "💧", "💨", "💩", "💪", "💫", "💬",
              "✨", "✴", "✳", "⚪", "⚫", "🔴", "🔵", "🔲", "🔳", "⭐", "⬜", "⬛", "▫", "▪", "◽", "◾", "◻", "◼", "🔶",
              "🔷",
              "🔸", "🔹", "❇", "💮", "💯", "↩", "↪", "🔃", "🔊", "🔋",
              "🔌", "🔍", "🔎", "🔒", "🔓", "🔏", "🔐", "🔑", "🔔", "☑", "🔘", "🔖", "🔗", "🔙", "🔚", "🔛", "🔜",
              "🔝",
              "✅"
            ]
          }
        },

        tpmUploadImg: {
          lock: false,
          show: false,
          file: null,
          fileSize: '',
          fileName: '',
          src: '',
        }
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

        this.$emit('send', {
          type: 1,
          text: this.editorText
        });
        this.editorText = '';
      },

      //选中表情
      clickEmoticon: function(emoji, type) {
        this.visible2 = false;
        if (type == 1) {
          this.handleEmojiChoose(`[${emoji}]`);
        } else {
          this.handleEmojiChoose(emoji);
        }
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
        alert('文件上传还在研发中，请耐心等待...');
      },

      //选择文件后回调方法
      uploadChange(e) {
        let that = this;
        let reader = new FileReader();
        let file = e.target.files[0];
        this.tpmUploadImg.file = file;
        this.tpmUploadImg.fileSize = Math.ceil(file.size / 1024);
        this.tpmUploadImg.fileName = file.name;
        reader.onload = function() {
          that.tpmUploadImg.src = reader.result;
          that.tpmUploadImg.show = true;
          that.$refs.restFile.value = '';
        };
        reader.readAsDataURL(file);
      },

      sendUploadImg() {
        let that = this;
        let fileData = new FormData();
        if (this.tpmUploadImg.lock) {
          return;
        }

        this.tpmUploadImg.lock = true;
        fileData.append("img", this.tpmUploadImg.file);
        uploadImgApi(fileData).then(res => {
          if (res.code == 200) {
            that.$emit('send', {
              type: 2,
              text: res.data.img
            });
            that.tpmUploadImg.show = false;
          }
          that.tpmUploadImg.lock = false;
        }).catch(err => {
          that.tpmUploadImg.lock = false;
        });
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
            el.focus();
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
    height: 260px;
    overflow-y: auto
  }

  .my-popover .popover-tab-box::-webkit-scrollbar {
    width: 4px;
    background-color: #E4E4E5;
  }

  .my-popover .popover-tab-box::-webkit-scrollbar-thumb {
    background-color: #C0BEBC;
  }

  .emoji-toolbar {
    /* background: rgb(247, 246, 246); */
    margin-top: 10px;
    box-shadow: 3px 5px 18px 0px #CCCCCC;
    height: 30px;
    width: 100%;
  }

  .emoji-toolbar div {
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    border-right: 1px solid white;
    font-size: 8px;
    border-right: 1px solid #f3f2f2;
    float: left;
    padding: 0 8px 0 8px;
  }

  .emoji-toolbar .active-emoji {
    background: #49d7f3;
    color: white;
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
    background: white;
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
    width: calc(100% - 10px);
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


  .editor-image-preview {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .image-preview-box {
    width: 450px;
    height: 400px;
    margin: auto auto;
    margin-top: calc((100vh - 400px) / 2);
    margin-top: -moz-calc((100vh - 400px) / 2);
    margin-top: -webkit-calc((100vh - 400px) / 2);
    background: white;
  }

  .image-preview-header {
    height: 50px;
    box-shadow: 1px 4px 5px 0px #cccccc78;
    line-height: 50px;
    text-align: center;
    position: relative;
  }

  .image-preview-header i {
    position: absolute;
    right: 10px;
    font-size: 26px;
    cursor: pointer;
  }

  .image-preview-body {
    text-align: center;
    height: 300px;
  }

  .image-preview-footer {
    height: 50px;
    background: #f7f5f5a8;
    text-align: center;
    line-height: 50px;
  }

  .image-preview-body img {
    margin-top: 10px;
    margin-bottom: 10px;
    max-width: 98%;
    max-height: 215px;
  }

  .image-preview-footer button {
    width: 135px;
    height: 35px;
    background: rgb(88, 175, 255);
    border-radius: 3px;
    color: #ffff;
    cursor: pointer;
  }

  .image-preview-footer button:active {
    background: rgb(195, 223, 249);
  }
</style>
