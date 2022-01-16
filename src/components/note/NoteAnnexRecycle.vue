<template>
  <div class="lum-dialog-mask">
    <el-container
      class="lum-dialog-box animated bounceInDown"
      v-outside="close"
    >
      <el-header height="60px" class="header no-select">
        <p>近 30 天删除的附件({{ tableData.length }})</p>
        <p class="tools">
          <i class="el-icon-close" @click="close" />
        </p>
      </el-header>
      <el-main class="main lum-scrollbar">
        <el-table :data="tableData" size="mini">
          <div slot="empty">暂无相关数据</div>
          <el-table-column
            prop="original_name"
            label="附件名称"
            width="230"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="downloadAnnex(scope.row.id)">{{
                scope.row.original_name
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="所属笔记"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="day"
            label="剩余天数"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="recoverAnnex(scope.row)"
                >恢复</el-button
              >
              <el-popover
                placement="top"
                @hide="lock(false)"
                @show="lock(true)"
                :ref="`popover-${scope.$index}`"
              >
                <p style="margin-bottom: 10px">
                  【{{
                    scope.row.original_name
                  }}】附件您确定要永久删除吗？<br />
                </p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="mini"
                    type="text"
                    @click="
                      scope._self.$refs[`popover-${scope.$index}`].doClose()
                    "
                  >
                    取消</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="deleteAnnex(scope.row, scope.$index)"
                    >确定</el-button
                  >
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  size="small"
                  style="color: #ec5252; margin-left: 5px"
                  >删除</el-button
                >
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer class="footer" height="30px">
        <p class="footer-tip">移动至回收站的附件和笔记，将在 30 天后自动清除</p>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import Vue from 'vue'
import { Table, TableColumn } from 'element-ui'
Vue.use(Table)
Vue.use(TableColumn)

import {
  ServeGetRecoverAnnexList,
  ServeRecoverArticleAnnex,
  ServeDownloadAnnex,
  ServeForeverDeleteAnnex,
} from '@/api/article'

export default {
  name: 'NoteAnnexRecycle',
  data() {
    return {
      tableData: [],
      closeLock: false,
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    loadList() {
      ServeGetRecoverAnnexList().then(res => {
        if (res.code == 200) {
          this.tableData = res.data.rows
        }
      })
    },

    // 关闭当前窗口
    close() {
      if (!this.closeLock) this.$emit('close')
    },

    // 给遮罩层加锁
    lock(value) {
      this.closeLock = value
    },

    // 恢复附件
    recoverAnnex(data, index) {
      ServeRecoverArticleAnnex({
        annex_id: data.id,
      }).then(res => {
        if (res.code == 200) {
          this.tableData.splice(index, 1)
        }
      })
    },

    //永久删除附件
    deleteAnnex(data, index) {
      ServeForeverDeleteAnnex({
        annex_id: data.id,
      })
        .then(res => {
          this.$refs[`popover-${index}`].doClose()
          this.lock(false)
          if (res.code == 200) {
            this.tableData.splice(index, 1)
          } else {
            this.$notify({
              message: '附件删除失败...',
            })
          }
        })
        .catch(() => {
          this.$refs[`popover-${index}`].doClose()
          this.lock(false)
        })
    },

    //下载笔记附件
    downloadAnnex: ServeDownloadAnnex,
  },
}
</script>
<style lang="less" scoped>
.lum-dialog-box {
  width: 100%;
  height: 80%;
  max-width: 800px;

  .main {
    padding-top: 0;
  }

  .footer {
    .footer-tip {
      color: #a7afbc;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.6;
    }
  }
}

/deep/ .tab-header-row .cell {
  font-size: 14px;
  font-weight: 400;
  color: rgb(172, 167, 167);
}
</style>
