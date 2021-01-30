<template >
  <div class="tt">
              <!-- <div class="loading-toolbar">
        <span class="color-blue">
          <i class="el-icon-loading"></i> 正在加载数据中...
        </span>
      </div>
      <div class="loading-toolbar">
        <span class="pointer color-blue">
          <i class="el-icon-bottom"></i> 查看更多消息...
        </span>
      </div>
      <div class="loading-toolbar">
        <span> 没有更多消息了... </span>
      </div> -->

    <div class="talks-container lum-scrollbar">
      <!-- <div class="loading-toolbar">
        <span class="color-blue">
          <i class="el-icon-loading"></i> 正在加载数据中...
        </span>
      </div>
      <div class="loading-toolbar">
        <span class="pointer color-blue">
          <i class="el-icon-bottom"></i> 查看更多消息...
        </span>
      </div>
      <div class="loading-toolbar">
        <span> 没有更多消息了... </span>
      </div> -->

      <template v-for="i in 5">
        <div
          class="message-box record-box checkbox-border"
          :class="{ 'direction-rt': i % 2 }"
        >
          <aside class="checkbox-column">
            <i class="el-icon-success" />
          </aside>
          <aside class="avatar-column">
            <el-avatar
              shape="square"
              :size="30"
              class="pointer"
              src="http://im-img.gzydong.club/media/images/avatar/20210128/6012b78598f80210925.png"
            />
          </aside>
          <main class="main-column">
            <div class="talk-title">
              <span class="nickname">你是谁？</span>
              <span class="time">11月22日 10:31</span>
            </div>

            <div class="talk-content">
              <code-message :code="code_lang" lang="json" />

              <!-- <image-message
                src="http://im-img0.gzydong.club/media/images/talks/6010243fb9412Xkjz4nSG0m3vKmf56010243fb942a_500x340.png"
              /> -->

              <!-- <text-message :content="content" :full-width="false" /> -->

              <!-- <file-message :file="file" :record_id="160" /> -->

              <!-- <forward-message
                :forward="forward"
                :record_id="6579"
              /> -->
            </div>
          </main>
        </div>
      </template>

      <div class="datetime">2020-11-22 10:31</div>
    </div>
  </div>
</template>

<script>
const code = `
{
    "name": "hyperf/hyperf-skeleton",
    "type": "project",
    "keywords": [
        "php",
        "swoole",
        "framework",
        "hyperf",
        "microservice",
        "middleware"
    ],
    "description": "A coroutine framework that focuses on hyperspeed and flexible, specifically use for build microservices and middlewares.",
    "license": "Apache-2.0",
    "require": {
        "php": ">=7.2",
        "ext-swoole": ">=4.5",
        "hyperf/cache": "~2.0.0",
        "hyperf/command": "~2.0.0",
        "hyperf/config": "~2.0.0",
        "hyperf/db-connection": "~2.0.0",
        "hyperf/framework": "~2.0.0",
        "hyperf/guzzle": "~2.0.0",
        "hyperf/http-server": "~2.0.0",
        "hyperf/logger": "~2.0.0",
        "hyperf/memory": "~2.0.0",
        "hyperf/process": "~2.0.0",
        "hyperf/redis": "~2.0.0",
        "hyperf/database": "~2.0.0",
        "hyperf/async-queue": "~2.0.0",
        "hyperf/amqp": "~2.0.0",
        "hyperf/websocket-server": "^2.0",
        "hyperf/constants": "^2.0",
        "hyperf/validation": "^2.0",
        "phper666/jwt-auth": "^3.0",
        "hyperf/filesystem": "^2.0",
        "hashids/hashids": "^4.0",
        "ext-json": "^1.6",
        "hyperf/view": "^2.0",
        "hyperf/view-engine": "^2.0",
        "phpmailer/phpmailer": "^6.2"
    },
    "require-dev": {
        "swoole/ide-helper": "^4.5",
        "friendsofphp/php-cs-fixer": "^2.14",
        "mockery/mockery": "^1.0",
        "phpstan/phpstan": "^0.12",
        "hyperf/devtool": "~2.0.0",
        "hyperf/testing": "~2.0.0"
    },
    "suggest": {
        "ext-openssl": "Required to use HTTPS.",
        "ext-json": "Required to use JSON.",
        "ext-pdo": "Required to use MySQL Client.",
        "ext-pdo_mysql": "Required to use MySQL Client.",
        "ext-redis": "Required to use Redis Client."
    },
    "autoload": {
        "psr-4": {
            "App\\": "app/"
        },
        "files": [
            "app/helper.php"
        ]
    },
    "autoload-dev": {
        "psr-4": {
            "HyperfTest\\": "./test/"
        }
    },
    "minimum-stability": "dev",
    "prefer-stable": true,
    "extra": [],
    "scripts": {
        "post-root-package-install": [
            "@php -r \"file_exists('.env') || copy('.env.example', '.env');\""
        ],
        "post-autoload-dump": [
            "rm -rf runtime/container"
        ],
        "test": "co-phpunit -c phpunit.xml --colors=always",
        "cs-fix": "php-cs-fixer fix $1",
        "analyse": "phpstan analyse --memory-limit 300M -l 0 -c phpstan.neon ./app ./config",
        "start": "php ./bin/hyperf.php start"
    }
}

`;

export default {
  name: "TestPage",
  data() {
    return {
      code_lang: code,
      content:
        "那三级卡那就开始发你那就开始发南京案件是否那案件是否那框架安居客苏菲娜缴纳加上你发按时看见啊你建三分就看健身房看加上你发叫你家斯诺伐克静安健身卡凡加你数据阿帆就DNA加上你发叫我呢按时开发Jan就看三分就看付款就暗示南范大框架收纳空间",
      file: {
        file_size: 42302,
        file_source: 1,
        file_suffix: "mp3",
        file_type: 4,
        file_url:
          "http://im-img0.gzydong.club/files/talks/20210129/6013c969ce06bkfXIOEqaOs.mp3",
        id: 160,
        original_name: "1701.mp3",
        record_id: 6661,
        save_dir: "files/talks/20210129/6013c969ce06bkfXIOEqaOs.mp3",
        save_type: 0,
        user_id: 2054,
      },
      forward: {
        num: 7,
        list: [
          {
            text: "？？",
            nickname: "丸子",
          },
          {
            text: "那就是看哪家快三年发哪家快三年发",
            nickname: "丸子",
          },
        ],
      },
    };
  },
  methods: {},
  created() {},
};
</script>
<style lang="less" scoped>
.tt {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
}

.talks-container {
  width: 800px;
  height: 500px;
  background: white;
  box-sizing: border-box;
  padding: 5px;
  overflow: auto;

  .message-box {
    width: 100%;
    min-height: 100px;
    margin-bottom: 8px;
  }

  .loading-toolbar {
    height: 30px;
    line-height: 30px;
    margin: 5px 0;
    background: white;
    text-align: center;
    user-select: none;
    font-size: 13px;
    color: #cec4c4;

    .color-blue {
      color: #409eff;
    }
  }

  .datetime {
    height: 30px;
    line-height: 30px;
    color: #ccc9c9;
    font-size: 12px;
    text-align: center;
    margin: 5px 0;
  }

  .record-box {
    display: flex;
    flex-direction: row;
    transition: 0.5s ease;
    padding-bottom: 10px;

    .checkbox-column {
      display: flex;
      justify-content: center;
      flex-basis: 40px;
      flex-shrink: 0;
      order: 1;
      user-select: none;
      padding-top: 25px;
      // display: none;

      i {
        color: #ccc;
        cursor: pointer;
        font-size: 22px;
        &.selected {
          color: #409eff !important;
        }
      }
    }

    .avatar-column {
      width: 50px;
      flex-basis: 50px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      order: 2;
      user-select: none;
      padding-top: 22px;
    }

    .main-column {
      flex: 1 auto;
      order: 3;
      position: relative;
      box-sizing: border-box;
      padding: 5px;
      overflow: hidden;

      .talk-title {
        display: flex;
        align-items: center;
        height: 15px;
        margin-bottom: 2px;
        font-size: 10px;
        user-select: none;
        color: #a7a0a0;
        opacity: 0;
        transition: 0.5s ease;

        span {
          transform: scale(0.9);
        }
      }

      .talk-content {
        display: flex;
        box-sizing: border-box;
        width: 100%;
      }

      &:hover {
        .talk-title {
          opacity: 1;
        }
      }
    }

    &.direction-rt {
      .avatar-column {
        order: 3;
      }

      .main-column {
        order: 2;

        .talk-title,
        .talk-content {
          justify-content: flex-end;
        }
      }
    }

    &.checkbox-border {
      border: 1px dashed #c4c4ec;
    }
  }
}
</style>