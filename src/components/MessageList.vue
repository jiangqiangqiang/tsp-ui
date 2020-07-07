<!--
消息中心列表组件:
获取数据由于是统一接口获取的, 数据在组件内获取
传入数据 toPath: 不同角色点击后跳转路由需要传入
toPath: {
  type: String,
  default: '/message-info'
}
// 消息状态 reading-未读 all-所有消息
messageStatus: {
  type: String,
  default: 'all'
}
// title是否显示返回按钮
isShowBack: {
  type: Boolean,
  default: true
}
-->
 <template>
  <div class="top-up">
    <BusinessTitle title="消息中心"></BusinessTitle>
    <div class="messageCon">
      <div class="h20"></div>
    <div v-if="totalReadingElements !== 0" class="el-badge__content">{{totalReadingElements}}</div>
    <div class="selectAll">全选</div>
    <el-tabs type="card" v-model="tabIndex" @tab-click="handleClick">
      <el-tab-pane name="index1" label="全部消息">
        <div>
          <el-button style="margin-left:30px;" size="mini" @click="deleteMessages">删除</el-button>
          <el-button size="mini" @click="markReaded">标记为已读</el-button>
          <el-button size="mini" @click="deleteAll">全部删除</el-button>
          <el-button size="mini" @click="markAllReaded">全部标记为已读</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="messageList"
          stripe
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @row-click="StartMessage"
          header-align='center'
          class="messageList credit-table-color-blue sy-global-has-gutter__th--text-center">
          <el-table-column
            type="selection"
            align="right"
            width="55">
          </el-table-column>
          <el-table-column
            prop="messageStatus1"
            align="center"
            width="80">
            <template slot-scope="scope">
              <!-- <span class="message message-readed" v-if="scope.row.hasRead"></span>
              <span class="message message-reading" v-else></span> -->
              <svg-icon v-if="scope.row.hasRead" iconClass='xxlb_yd' className='message'></svg-icon>
              <svg-icon v-else iconClass='xxlb_wd' className='message'></svg-icon>
            </template>
          </el-table-column>
          <el-table-column
            prop="subject"
            align="left"
            label="主题">
          </el-table-column>
          <el-table-column
            prop="createdOn"
            label="时间"
            align="left"
            width="200">
          </el-table-column>
        </el-table>
        <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="messageList.length>0">
          <el-col>
            <div class="sy-global__div--Pagination sy-global-pull-right">
              <el-pagination
              @current-change="pageChange"
              @size-change="sizeChange"
              :page-sizes="pageSizes"
              :pageSize="pageSize"
              :current-page="pageNo"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCnt">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="index2" label="未读消息">
        <div>
            <el-button style="margin-left:30px;" size="mini" @click="deleteMessages">删除</el-button>
            <el-button size="mini" @click="markReaded">标记为已读</el-button>
            <el-button size="mini" @click="deleteAll">全部删除</el-button>
            <el-button size="mini" @click="markAllReaded">全部标记为已读</el-button>
        </div>
        <el-table
            ref="multipleTable"
            :data="messageList"
            stripe
            header-align='center'
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @row-click="StartMessage"
            class="messageList credit-table-color-blue sy-global-el-table-fit--border sy-global-has-gutter__th--text-center">
            <el-table-column
                type="selection"
                align="right"
                width="55">
            </el-table-column>
            <el-table-column
                prop="messageStatus1"
                align="center"
                width="80">
                <template slot-scope="scope">
                  <svg-icon v-if="scope.row.hasRead" iconClass='xxlb_yd' className='message'></svg-icon>
                  <svg-icon v-else iconClass='xxlb_wd' className='message'></svg-icon>
                  <!-- <span class="message message-readed" v-if="scope.row.hasRead"></span>
                  <span class="message message-reading" v-else></span> -->
                </template>
            </el-table-column>
            <el-table-column
                prop="subject"
                align="left"
                label="主题">
            </el-table-column>
            <el-table-column
                prop="createdOn"
                label="时间"
                width="200">
            </el-table-column>
        </el-table>
        <el-row class="sy-global--Pagination--bg" style="margin-bottom: 2rem" v-if="messageList.length>0">
            <el-col>
            <div class="sy-global__div--Pagination sy-global-pull-right">
                <el-pagination
                @current-change="pageChange"
                @size-change="sizeChange"
                :page-sizes="pageSizes"
                :pageSize="pageSize"
                :current-page="pageNo"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCnt">
                </el-pagination>
            </div>
            </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import BusinessFiltrate from '@/components/BusinessFiltrate'
import settings from '@/settings'
export default {
  props: {
    toPath: {
      type: String,
      default: '/message-info'
    },
    // 消息状态 reading-未读 all-所有消息
    messageStatus: {
      type: String,
      default: 'all'
    },
    // title是否显示返回按钮
    isShowBack: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      ids: [], // 选框选中的列表
      messageList: [],
      tabIndex: 'index1',
      totalReadingElements: 0, // 未读总条数
      messageUrl: settings.apiGateway.getMessage,
      messageStatus1: '' // 消息类型用于开始接收props数据
    }
  },
  components: {
    BusinessTitle,
    BusinessFiltrate
  },
  methods: {
    pageChange (curPage) {
      this.pageNo = curPage
      this.getMessageList()
    },
    sizeChange (curSize) {
      this.pageSize = curSize
      this.getMessageList()
    },
    StartMessage (row) {
      let ids = []
      ids.push(row.id)
      this.fetch(`${this.messageUrl}markReaded`, 'post', ids).then(data => {
        this.$router.push({
          path: this.toPath,
          query: {
            type: row.messageType,
            transactionCode: row.id
          }
        })
        this.getMessageList()
        this.$store.dispatch('updateCounters')
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getMessageList () {
      this.fetch(`${this.messageUrl}list/${this.messageStatus1}/${this.pageNo - 1}/${this.pageSize}`, 'get').then(data => {
        this.messageList = data.data.transactions
        this.totalCnt = data.data.totalElements
        this.totalReadingElements = data.data.totalReadingElements > 99 ? '99+' : data.data.totalReadingElements
        this.$store.commit('setUnreadMessage', this.totalReadingElements)
      }).catch(data => {
        this.$message.error('数据获取失败')
      })
    },
    handleSelectionChange (rows) {
      this.ids = []
      rows.forEach(row => {
        this.ids.push(row.id)
      })
    },
    // 删除选中的消息
    deleteMessages () {
      if (this.ids.length <= 0) {
        this.$message.error('没有选中选框')
        return
      }
      // 删除选中的消息
      this.fetch(`${this.messageUrl}deleteMessages`, 'post', this.ids).then(data => {
        if (data.code === 0) {
          this.$message.success('删除成功')
          this.getMessageList()
        } else {
          this.$message.success('删除失败')
        }
      }).catch(data => {
        this.$message.error('数据获取失败')
      })
    },
    // 全部删除
    deleteAll () {
      // 全部删除消息
      this.fetch(`${this.messageUrl}deleteAll/${this.messageStatus1}`, 'post').then(data => {
        if (data.code === 0) {
          this.$message.success('删除成功')
          this.getMessageList()
        } else {
          this.$message.success('删除失败')
        }
      }).catch(data => {
        this.$message.error('数据获取失败')
      })
    },
    // 标记为已读
    markReaded () {
      if (this.ids.length <= 0) {
        this.$message.error('没有选中选框')
        return
      }
      // 标记选中的消息
      this.fetch(`${this.messageUrl}markReaded`, 'post', this.ids).then(data => {
        if (data.code === 0) {
          this.$message.success('标记已读成功')
          this.getMessageList()
          this.$store.dispatch('updateCounters')
        } else {
          this.$message.success('标记已读失败')
        }
      }).catch(data => {
        this.$message.error('数据获取失败')
      })
    },
    // 全部标记为已读
    markAllReaded () {
      // 全部标记为已读
      this.fetch(`${this.messageUrl}markAll`, 'post').then(data => {
        if (data.code === 0) {
          this.$message.success('全部标记已读成功')
          this.getMessageList()
          this.$store.dispatch('updateCounters')
        } else {
          this.$message.success('全部标记已读失败')
        }
      }).catch(data => {
        this.$message.error('数据获取失败')
      })
    },
    handleClick (tab, event) {
      if (this.tabIndex === 'index1') {
        this.messageStatus1 = 'all'
      } else {
        this.messageStatus1 = 'reading'
      }
      this.messageList = []
      this.pageNo = 1

      this.getMessageList()
    }
  },
  created () {
    this.messageStatus1 = this.messageStatus
    this.getMessageList()
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.top-up {
  position: relative
}
.messageCon {
  width: calc(~"100% - 40px");
  position: relative;
  margin: 0 20px;
}
.top-up .el-badge__content {
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
    position: absolute;
    left: 180px;
    z-index: 20;
    top: 15px
}
.top-up .selectAll {
  position: absolute;
  color: #909399;
  top: 138px;
  left: 48px;
  z-index: 20
}
.top-title {
    width: 100%;
    height:76px;
    line-height:76px;
    text-align: center;
    color:#333333;
    font-size: 22px;
    background-color: #f2f9ff;
    letter-spacing:15px;
    padding-left:15px
}
.topUpBtn {
    width: 163px;
    height: 41px;
    margin: 22px 0 0 25px;
    border-radius: 5px

}
.messageList{
    margin-top:20px;
    cursor: pointer
}
.h20 {
    height: 20px;
}
.message {
  width: 17px!important;
  height: 17px!important;
  vertical-align: middle;
  background-size: 17px 17px;
  background-repeat: no-repeat;
  display: inline-block;
}
.top-up/deep/.credit-table-color-blue tr {
  cursor: pointer;
  background-color: @table-bg;
  background-color: var(--mainTableBg)!important
}
.top-up/deep/.credit-table-color-blue .el-table__body tr:hover>td {
  cursor: pointer;
  background-color: #e3eef8 !important;
  background-color: var(--mainTableHover) !important;
}
.top-up/deep/.el-table_5_column_17.el-table-column--selection.is-leaf:first-child {
  border-right: 0px!important
}
.top-up/deep/.el-table-column--selection:first-child {
  border-right: 0px
}
// .message-reading {
//   background-image: url('~@/assets/img/message-reading.png')
// }
// .message-readed {
//   background-image: url('~@/assets/img/message-readed.png')
// }
.el-button:active {
  color: #fff;
  border-color: @theme-blue;
  border-color: var(--mainActiveColor);
  background-color: @theme-blue;
  background-color: var(--mainActiveColor);
  outline: 0;
}
.el-button:focus, .el-button:hover {
    color: #fff;
    border-color: @theme-blue;
    border-color: var(--mainColor);
    background-color: @theme-blue;
    background-color: var(--mainColor);
}
</style>
<style lang="less">
@import '~@/assets/less/variables';
.el-tabs__item:hover {
  color: #fff!important;
  background-color: @theme-blue;
  background-color: var(--mainColor);
}
.el-tabs__item.is-active {
  color: #fff!important;
  background-color: @theme-blue;
  background-color: var(--mainColor);
}
</style>
