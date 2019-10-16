<template id='wxLeft'>
  <div class="main">
    <div id="Left">
      <div class="wx-left">
        <ul class="switch">
          <li>
            <img src="/static/image/touxiang.jpg" alt class="img" />
          </li>
          <li @click="tabLeft(0)">
            <i class="iconfont icon-message"></i>
          </li>
          <li @click="tabLeft(1)">
            <i class="iconfont icon-tongxunlu"></i>
          </li>
        </ul>
        <i class="iconfont icon-caidan closeLogin"></i>

      </div>
      <ul class="setUp">
        <li>个人设置</li>
        <li>修改密码</li>
        <li>退出登录</li>
      </ul>

    </div>


    <div class="Right" v-if="type == 0">
      <div class="wx-right">
        <header class="search">
          <i class="iconfont icon-sousuo sousuo"></i>
          <input type="text" placeholder="搜索" />
          <i class="iconfont icon-jia jiahao"></i>
        </header>

        <main class="nav-left listWebkit">
          <div class="content">
            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>

            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>

            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>

            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>


            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>

            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>


            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>

            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>

            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>

            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>

            <div class="list">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="list-right">
                <div class="name">
                  周杰伦
                  <span class="time">16:20</span>
                </div>
                <div class="chat">法老麻烦法老麻烦马卡洛夫法老麻烦马卡洛夫法老麻烦马卡洛夫马卡洛夫</div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <div class="nav-right">
        <header class="friendName">
          <span>周杰倫</span>
        </header>

        <main class="box-right rightWebkit">
          <div class="wx-main ">
            <div class="left">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="leftSend send">
                辅导帕克否定穷疯第四头发都是墨菲定律没电了开发鸣锣开道发生买了开发的模式路口发的什么吗l
                <div class="leftArrow arrow"></div>
              </div>
              <div class="clear"></div>
            </div>

            <div class="right">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="rightSend send">
                辅导帕克否定穷疯第四头发都是墨菲定律没电了开发鸣锣开道发生买了开发的模式路口发的什么吗l
                <div class="rightArrow arrow"></div>
              </div>
              <div class="clear"></div>
            </div>

            <div class="left">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="leftSend send">
                辅导帕克否定穷疯第四头发都是墨菲定律没电了开发鸣锣开道发生买了开发的模式路口发的什么吗l
                <div class="leftArrow arrow"></div>
              </div>
              <div class="clear"></div>
            </div>

            <div class="left">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="leftSend send">
                辅导帕克否定穷疯第四头发都是墨菲定律没电了开发鸣锣开道发生买了开发的模式路口发的什么吗l
                <div class="leftArrow arrow"></div>
              </div>
              <div class="clear"></div>
            </div>

            <div class="right">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="rightSend send">
                辅导帕克否定穷疯第四头发都是墨菲定律没电了开发鸣锣开道发生买了开发的模式路口发的什么吗l
                <div class="rightArrow arrow"></div>
              </div>
              <div class="clear"></div>
            </div>

            <div class="right">
              <img src="/static/image/touxiang.jpg" alt class="img" />
              <div class="rightSend send">
                辅导帕克否定穷疯第四头发都是墨菲定律没电了开发鸣锣开道发生买了开发的模式路口发的什么吗l
                <div class="rightArrow arrow"></div>
              </div>
              <div class="clear"></div>
            </div>
            <div class="clear"></div>
          </div>
        </main>

        <footer>
          <ul>
            <li>
              <i class="iconfont icon-xiaolian"></i>
            </li>
            <li>
              <i class="iconfont icon-folder_icon"></i>
            </li>
            <li>
              <i class="iconfont icon-xinxi"></i>
            </li>
          </ul>
          <textarea></textarea>
        </footer>
      </div>

    </div>



    <div class="Right" v-else>
      <div class="wx-right">
        <header class="search">
          <i class="iconfont icon-sousuo sousuo"></i>
          <input type="text" placeholder="搜索" />
          <i class="iconfont icon-jia jiahao"></i>
        </header>

        <main class="nav-left listWebkit">
          <div class="content box-fired">
            <div class="cellHeader">A</div>
            <div class="cellTab">
              <img src="/static/image/touxiang.jpg" alt=""> <span>吴永辉</span>
            </div>
            <div class="cellTab">
              <img src="/static/image/touxiang.jpg" alt=""> <span>吴永辉</span>
            </div>

            <div class="cellTab">
              <img src="/static/image/touxiang.jpg" alt=""> <span>吴永辉</span>
            </div>

            <div class="cellTab">
              <img src="/static/image/touxiang.jpg" alt=""> <span>吴永辉</span>
            </div>

            <div class="cellHeader">A</div>
            <div class="cellTab">
              <img src="/static/image/touxiang.jpg" alt=""> <span>吴永辉</span>
            </div>
            <div class="cellTab">
              <img src="/static/image/touxiang.jpg" alt=""> <span>吴永辉</span>
            </div>

            <div class="cellTab">
              <img src="/static/image/touxiang.jpg" alt=""> <span>吴永辉</span>
            </div>

            <div class="cellTab">
              <img src="/static/image/touxiang.jpg" alt=""> <span>吴永辉</span>
            </div>

          </div>

        </main>
      </div>
      <div class="nav-right">
        <div class="iconfont icon-weixin1 weixinLogo"></div>
      </div>

    </div>

    <!-- <div class="boxFixed">
      <div class="popupFixed">
        <div class="header">修改密码<icon class="iconfont icon-guanbi11"></icon>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script scoped>
  import WsSocket from '@/request/WsSocket'
  import auth from '@/request/auth'
  export default {
    name: "Left",
    data() {
      return {
        type: 0,
      }
    },
    mounted() {
      let wsObj = new WsSocket(1017, {});


      wsObj.initWebSocket();
    },
    methods: {
      tabLeft: function(even) {
        let that = this
        this.type = even;
        if (even == 1) {
          that.$server.friends().then(res => {
            if (res.code == 200) {
              console.log(res.data)
            }
          })
        }
      },
      // 退出登录
      closeLogin: function() {
        let that = this
        this.$server.logout().then(res => {
          if (res.code == 200) {
            auth.removeToken();
            this.$notify({
              title: '成功',
              message: '退出成功，即将跳转！',
              type: 'success'
            });
            setTimeout(function() {
              that.$router.push({
                path: '/'
              });
            }, 500);
          } else {
            that.$notify.error({
              title: '错误',
              message: res.msg
            });
          }
        })
      }
    },

  };
</script>


<style scoped>
  @import url("../../static/css/Dialogue.css");
</style>
