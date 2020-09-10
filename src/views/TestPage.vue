<template>
  <div>
    <div style="width:90%;min-height: 300px;margin: 0 auto;border: 1px solid #ccc;padding: 5px;">
      <div class="talk-container" v-for="i in 10" :key="i" :class="{'direction-lt':i%2 == 0}">
        <aside class="checkbox-column">
          <i class="el-icon-success"></i>
        </aside>
        <aside class="avatar-column">
          <div class="avatar">
            <img src="http://im-serve0.gzydong.club/static/image/sys-head/u=548047707,996448547&amp;fm=26&amp;gp=0.jpg"
              onerror="this.src='/static/image/detault-avatar.jpg'" width="30" height="30">
          </div>
        </aside>
        <div class="content-column">
          <div class="talktime">07月18日 15:33</div>
          <div class="subtitle">
            <span class="nickname">晓晓</span>
          </div>
          <div class="talkbox">
            <div class="arrow" v-show="!(i == 2 || i == 3 ||i == 4 || i == 5 || i == 6 || i == 7 ||i == 8 || i == 9)">
            </div>

            <!-- 图片消息 -->
            <div v-if="i == 2 || i == 3" class="image-msg">
              <el-image fit="cover"
                src="http://im-img.gzydong.club/media/images/talks/20200908/5f57886ccaf8eCmvp7ZujuADMMc8wzc5f57886ccafa6_800x533.png">
                <div slot="error" class="image-slot">
                  加载失败...
                </div>
                <div slot="placeholder" class="image-slot">
                  图片加载中<span class="dot">...</span>
                </div>
              </el-image>
            </div>

            <!-- 文件消息 -->
            <div v-else-if="i == 4 || i == 5" class="file-msg">
              <header>
                <div class="icon">ZIP</div>
                <div class="info">
                  <p>hyperf-skeleton.zip (7.87MB)hyperf-skeleton.zip (7.87MB)</p>
                  <p>文件已成功发送, 文件助手永久保存</p>
                </div>
              </header>
              <footer>
                <a>下载</a>
                <a>在线预览</a>
              </footer>
            </div>

            <!-- 音频文件预留 -->
            <!-- <div class="audio-msg"></div> -->

            <!-- 视频文件预留 -->
            <!-- <div class="video-msg"></div> -->

            <!-- 会话记录消息 -->
            <div v-else-if="i == 6 || i == 7" class="records-msg">
              <div class="title">阿森纳近的会话记录</div>
              <div class="lists">
                <p><span>阿森纳近 :</span><span>asdfmakl</span></p>
                <p><span>阿森纳近 :</span><span>asnfak</span></p>
                <p><span>阿森纳近 :</span><span>马克思了吗 玛丽苏卡https://www.ximalaya</span></p>
              </div>
              <div class="footer">转发：会话记录 (3条)</div>
            </div>

            <!-- 代码块消息 -->
            <div v-else-if="i == 8 || i == 9" class="code-msg">
              <i class="iconfont icon-tubiao_chakangongyi cat-code-block"></i>
              <pre v-html="formatCode(code,'php')"></pre>
            </div>

            <!-- 文本消息 -->
            <div v-else class="text-msg">
              <pre>马卡老师们发了马路卡萨达姆发了马上来看顿饭马路卡萨达姆发</pre>
            </div>
          </div>
        </div>
      </div>
      <div class="talk-container paddingt2">
        <div class="system-msg">
          <a>阿森纳近</a>
          <span>邀请了</span>
          <a>zcIgfxnsdY</a> <em>、</em>
          <a>QTmiq62zCf</a> <em>、</em>
          <a>wXBlBi3Q2X</a> <em style="display: none;">、</em>
          <span>加入了群聊</span>
        </div>
      </div>

      <div class="talk-container paddingt2">
        <div class="system-msg">对方撤回了一条消息 | 17:35分</div>
      </div>
      <div class="talk-container paddingt2">
          <div class="talk-time">15:14</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Prism from "prismjs";
  import "prismjs/themes/prism-okaidia.css";

  export default {
    name: 'contacts-page',
    components: {
      //   PrismEditor
    },
    data() {
      return {
        code: `
/**
 * 加入黑名单
 *
 * @param string $token jwt 授权token
 * @param float|int $exp 过期时间
 */
public function joinBlackList(string $token, $exp = 60 * 60 * 24 * 2)
{
    $this->getRedis()->setex(self::BlackListPrefix . $token, $exp, 1);
}
            `,
      }
    },
    methods: {
      formatCode(code, lang) {
        return Prism.highlight(code, Prism.languages[lang], lang);
      }
    },
  };

</script>
<style scoped>
  .paddingt2 {
    padding-top: 5px !important;
  }

  .talk-container {
    display: flex;
    min-height: 30px;
    flex-direction: row;
    margin: 5px;
    flex: 1;
    padding-top: 20px;
    padding-bottom: 5px;
    overflow: hidden;
  }

  .talk-container .avatar-column {
    width: 50px;
    flex-basis: 50px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    order: 3;
    user-select: none;
  }

  .talk-container .avatar-column .avatar {
    width: 30px;
    height: 30px;
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
  }

  .talk-container .avatar-column .avatar:active {
    transform: scale(1.05);
  }

  .talk-container .checkbox-column {
    width: 40px;
    flex-basis: 40px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    order: 1;
    padding-top: 5px;
    display: none;
  }

  .talk-container .checkbox-column i {
    color: #ccc;
    cursor: pointer;
    font-size: 22px;
  }

  .talk-container .checkbox-column i:active {
    transform: scale(1.1);
  }

  .talk-container .content-column {
    flex: 1 1;
    order: 2;
    position: relative;
  }

  .direction-lt .avatar-column {
    order: 2 !important;
  }

  .direction-lt .content-column {
    order: 3 !important;
  }

  .talk-container .content-column .talktime {
    position: absolute;
    top: -15px;
    right: 0;
    font-size: 10px;
    user-select: none;
    opacity: 0;
    transition: ease .5s;
    color: #a7a0a0;
  }

  .direction-lt .content-column .talktime {
    left: 0;
  }

  .talk-container:hover .content-column .talktime {
    opacity: 1;
  }


  .talk-container .content-column .subtitle {
    height: 15px;
    line-height: 15px;
    display: none;
    font-size: 10px;
  }

  .talk-container .content-column .talkbox {
    min-height: 30px;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
  }

  .direction-lt .content-column .talkbox {
    justify-content: flex-start;
  }

  .talk-container .content-column .talkbox .arrow {
    position: absolute;
    width: 0;
    height: 0;
    font-size: 0;
    border: 5px solid;
    top: 5px;
    right: -10px;
    border-color: hsla(0, 0%, 96.9%, 0) hsla(0, 0%, 96.9%, 0) hsla(0, 0%, 96.9%, 0) #1ebafc;
  }

  .direction-lt .content-column .talkbox .arrow {
    left: -10px;
    border-color: hsla(0, 0%, 96.9%, 0) #f6eeee hsla(0, 0%, 96.9%, 0) hsla(0, 0%, 96.9%, 0) !important;
  }


  /* 聊天消息 */
  .talk-container .content-column .talkbox .text-msg {
    min-width: 10px;
    max-width: calc(100% - 50px);
    min-height: 30px;
    background: #1ebafc;
    color: #fff;
    border-radius: 3px;
  }

  .talk-container .content-column .talkbox .text-msg pre {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 13px;
    padding: 0 5px 0px 5px;
    font-family: "微软雅黑";
    line-height: 25px;
    padding-top: 2px;
  }

  .direction-lt .content-column .talkbox .text-msg {
    background: #f5f5f5;
    color: #3a3a3a;
  }

  /* 图片消息 */
  .talk-container .content-column .talkbox .image-msg {
    min-width: 30px;
    max-width: 200px;
    min-height: 30px;
    box-shadow: 0 0 7px #f4f0f0;
    border-radius: 3px;
    overflow: hidden;
  }

  /* 文件消息 */
  .talk-container .content-column .talkbox .file-msg {
    max-width: 300px;
    height: 85px;
    background: white;
    box-shadow: 0 0 5px 0px #e8e4e4;
    padding: 5px;
    border-radius: 3px;
  }

  .talk-container .content-column .talkbox .file-msg:hover,
  .talk-container .content-column .talkbox .records-msg:hover {
    box-shadow: 0 0 5px 0px #cfbdbd;
  }

  .talkbox .file-msg header {
    height: 45px;
    display: flex;
    flex-direction: row;
  }

  .talkbox .file-msg header .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
    color: #ffffff;
    background: #49a4ff;
    border-radius: 3px;
    font-size: 12px;
  }

  .talkbox .file-msg header .info {
    flex: 1 1;
    height: 45px;
    margin-left: 5px;
    overflow: hidden;
  }

  .talkbox .file-msg header .info p {
    text-align: left;
  }

  .talkbox .file-msg header .info p:first-child {
    height: 24px;
    line-height: 24px;
    color: rgb(76, 76, 76);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .talkbox .file-msg header .info p:nth-child(2) {
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    color: #929191;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .talkbox .file-msg footer {
    height: 30px;
    background: white;
    text-align: right;
    line-height: 37px;
    color: #409eff;
    font-size: 12px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-top: 1px solid #eff7ef;
    margin-top: 10px;
  }

  .talkbox .file-msg footer a {
    margin: 0 3px;
    user-select: none;
  }

  .talkbox .file-msg footer a:hover {
    color: royalblue;
  }

  /* 音频消息 */

  /* 视频消息 */

  /* 会话记录消息 */
  .talk-container .content-column .talkbox .records-msg {
    width: 230px;
    min-height: 95px;
    max-height: 150px;
    border-radius: 3px;
    background-color: white;
    padding: 3px 10px;
    cursor: pointer;
    box-shadow: 0 0 5px 0px #e8e4e4;
    text-align: left;
    user-select: none;
  }

  .talkbox .records-msg .title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #565353;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
  }

  .talkbox .records-msg .lists p {
    height: 18px;
    line-height: 18px;
    font-size: 10px;
    color: #aaa9a9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 100;
  }

  .talkbox .records-msg .footer {
    height: 25px;
    line-height: 25px;
    color: #858282;
    border-top: 1px solid #f1ebeb;
    font-size: 12px;
    margin-top: 6px;
    font-weight: 300;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .talkbox .code-msg {
    min-width: 10px;
    background: #272822;
    color: #fff;
    border-radius: 5px;
    position: relative;
    overflow-x: auto;
    max-width: calc(100% - 50px);
    display: inline-grid;
  }

  .talkbox .code-msg pre {
    font-size: 15px;
    padding: 5px 10px;
    line-height: 24px;
    overflow-x: auto;
  }

  .talkbox .code-msg i {
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 18px;
    cursor: pointer;
    color: white;
    display: none;
  }

  .talkbox .code-msg i:active {
    transform: scale(1.05);
  }

  .talkbox .code-msg:hover i {
    display: block;
  }


  /* 系统消息 */
  .talk-container .system-msg {
    margin: 0 auto;
    background-color: #f5f5f5;
    font-size: 11px;
    line-height: 30px;
    padding: 0 8px;
    word-break: break-all;
    word-wrap: break-word;
    color: #979191;
    user-select: none;
    font-weight: 300;
  }

  .talk-container .system-msg a {
    color: #939596;
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;
  }

  .talk-container .system-msg a:hover {
    color: black;
  }

  .talk-container .system-msg em {
    margin-left: 4px;
  }

  .talk-container .talk-time{
    margin: 0 auto;
    color: #ccc9c9;
    font-size: 12px;
    user-select: none;
  }

  /* ---------- */



  .open-checkbox {
    border: 1px solid #e4e8ef;
    transition: ease .5s;
  }

  .open-checkbox:hover {
    border-color: #409eff;
    border-style: dashed;
  }

  .open-checkbox .checkbox-column {
    display: block;
    text-align: center;
  }

</style>
