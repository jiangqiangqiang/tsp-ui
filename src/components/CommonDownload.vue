<template>
  <div>
    <slot><a href="#" @click="fileDownload" class="file-download-title">{{fileName}}</a></slot>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      width="30%">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="precent"></el-progress>
    </el-dialog>
  </div>
</template>

<script>
import settings from '@/settings'
export default {
  name: 'commonDownload',
  props: {
    fileId: String,
    fileName: String
  },
  data () {
    return {
      // 下载接口
      downloadUrl: settings.downloadUrl,
      // 下载凭证接口
      downloadCodeUrl: settings.apiGateway.downloadCode,
      // 头部信息
      Header: '',
      // 返回的code
      code: '',
      // 进度
      precent: 0,
      // 弹窗
      dialogVisible: false,
      // dialog title
      dialogTitle: '准备下载'
    }
  },
  methods: {
    fileDownload () {
      this.getCode()
    },
    setHeader () {
      this.dialogTitle = '下载中...'
      this.axios({
        url: this.downloadUrl,
        params: { code: this.code },
        headers: {
          'FileToken': `Bearer ${this.Header}`
        },
        onDownloadProgress: p => {
          this.precent = Math.floor(100 * (p.loaded / p.total))
        },
        responseType: 'blob'
      }).then(data => {
        this.dialogVisible = false
        if (navigator.appVersion.toString().indexOf('.NET') > 0) {
          window.navigator.msSaveBlob(data.data, this.fileName)
        } else {
          let url = window.URL.createObjectURL(data.data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.fileName)
          document.body.appendChild(link)
          link.click()
        }
      }).catch(data => {
        this.dialogVisible = false
        this.$message({
          type: 'error',
          message: '获取code失败！'
        })
      })
    },
    getCode () {
      this.dialogVisible = true
      this.dialogTitle = '准备下载'
      this.precent = 0
      this.fetch(`${this.downloadCodeUrl}/${this.fileId}`).then(data => {
        this.Header = data.data.token
        this.code = data.data.code
        this.setHeader()
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取文件名失败！'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  .file-download-title {
    margin-right: 0.5rem;
    cursor: pointer;
    color: #108ee9;
    text-decoration: underline;
  }
</style>
