<!--
首页消息组件:
传入数据
props: {
  // 跳转消息中心的路由
  messageListPath: {
    type: String,
    default: '/message'
  },
  // 跳转处理详情的的路由
  messageInfoPath: {
    type: String,
    default: '/message-info'
  }
}
-->
<template>
  <div class="message">
    <div class="message-list">
      <div class=title @click="bandleClick">
        <a style="color:#656565">消息中心</a>
        <span>({{$store.state.unreadMessage}}项)</span>
      </div>
      <div class="list">
        <div v-if="emptyShow" class="empty-show">您目前没有新消息</div>
        <div v-else v-for="(item, index) of messageList" :key="index" class="list-li" @click="handleClick(index)">
          <span class="message-date">{{item.createdOn}}</span>
          <span>{{item.subject}}</span>
        </div>
      </div>
    </div>
    <el-row class="sy-global--Pagination--bg" v-if="messageList.length>0">
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
  </div>
</template>

<script>
import settings from '@/settings'
export default {
  props: {
    messageListPath: {
      type: String,
      default: '/message'
    },
    messageInfoPath: {
      type: String,
      default: '/message-info'
    }
  },
  data () {
    return {
      messageList: [],
      pageSize: 10,
      pageSizes: settings.pageSizes,
      pageNo: 1,
      totalCnt: 0,
      // messageList: [],
      type: 'reading',
      markReadedUrl: settings.apiGateway.markReaded,
      getMessageListUrl: settings.apiGateway.getMessageList
    }
  },
  methods: {
    pageChange (curPage) {
      this.pageNo = curPage
      this.getMessageList()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.getMessageList()
    },
    bandleClick () {
      this.$router.push(this.messageListPath)
    },
    getMessageList () {
      let messageStatus = 'reading'
      this.fetch(`${this.getMessageListUrl}${messageStatus}/${this.pageNo - 1}/${this.pageSize}`).then(data => {
        this.messageList = data.data.transactions
        this.totalCnt = data.data.totalElements
        this.$store.commit('setUnreadMessage', this.totalCnt)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    handleClick (index) {
      let ids = []
      if (this.messageList[index].id) {
        ids = [this.messageList[index].id]
      }
      this.fetch(`${this.markReadedUrl}markReaded`, 'post', ids).then(data => {
        this.$store.dispatch('updateCounters')
        this.getMessageList()

        this.$router.push({
          path: this.messageInfoPath,
          query: {
            transactionCode: this.messageList[index].id,
            type: this.messageList[index].messageType }
        })
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    }
  },
  created () {
    this.getMessageList()
  },
  computed: {
    emptyShow () {
      if (this.messageList.length < 1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.message {
  margin-top:37px;
  width:99.8%;
  border: 1px solid #cccccc;
  // border-bottom: 0;
  margin-bottom: 30px;
  .message-list {
    min-height: 80px;
    _height:80px;
    .empty-show {
      width: 100%;
      height: 80px;
      text-align: center;
      line-height: 80px;
      font-size:16px;
      color:#333;
    }
    .title {
      width: 97.8%;
      font-size: 16px;
      font-weight: 400;
      color: #656565;
      height:40px;
      background-color: #f5f5f5;
      padding-left:24px;
      line-height: 40px;
      cursor: pointer;
    }
    .list-li {
      width: 97.8%;
      height:40px;
      line-height: 40px;
      padding-left: 24px;
      border-top:0;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
      &:nth-of-type(2n) {
        background-color: @table-bg;
        background-color: var(--mainTableBg)
      }
      .message-date {
        margin-right: 44px
      }
      &:hover {
        background-color: #e3eef8 !important;
        background-color: var(--mainTableHover) !important;
      }
    }
  }
  .sy-global--Pagination--bg {
    border-right: 0;
    border-left: 0
  }
}
</style>
