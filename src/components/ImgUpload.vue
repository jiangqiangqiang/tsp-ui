<!--
  公共上传插件
    描述：  在上传前,添加请求 token 和 code 的勾子
    props:
      action            //必选参数，上传的地址，string
      getUploadCodeUrl  //非必选参数，获取code的地址，string, 默认为 settings.apiGateway.getUploadCode
      limit             //非必选参数，最大允许上传个数，number
      list-type         //非必选参数，文件列表的类型，string，text/picture/picture-card
    attribute:
      on-exceed
      on-success
      on-process
      on-remove
      on-error
      before-remove
      before-upload
    其它：所有 el-upload 的所有勾子都可以添加，这里只是将常用的绑定过来，如果需要其它勾子在本插件中添加即可
      http://element-cn.eleme.io/2.3/#/zh-CN/component/upload
      canHidden: 是否允许上传成功后隐藏上传按钮,删除已上传后显示上传按钮
-->
<template>
  <div class="common-upload">
        <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        ref="my-upload"
        :limit='limit'
        :disabled="disabled"
        :data="fileData"
        :headers="fileHeaders"
        :action="action"
        :before-upload="_beforeUpload"
        :file-list="fileList"
        :auto-upload="true"
        :on-exceed="_onExceed"
        :on-success="_onSuccess"
        :on-progress="_onProgress"
        :on-remove="_onRemove"
        :on-error="_onError"
        :before-remove="_beforeRemove">
        <div>
        <slot></slot></div>
        </el-upload>
    </div>
</template>
<script>
import settings from '@/settings.js'
import Vue from 'vue'
function noop () {}
export default {
  props: {
    action: {
      type: String,
      required: true
    },
    getUploadCodeUrl: {
      type: String
    },
    data: Object,
    multiple: Boolean,
    name: {
      type: String,
      default: 'file'
    },
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true
    },
    accept: String,
    type: {
      type: String,
      default: 'select'
    },
    beforeRemove: Function,
    beforeUpload: Function,
    onRemove: {
      type: Function,
      default: noop
    },
    onChange: {
      type: Function,
      default: noop
    },
    onPreview: {
      type: Function
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    fileList: {
      type: Array,
      default: function _default () {
        return []
      }
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: 'text' // text,picture,picture-card
    },
    httpRequest: Function,
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function
    },
    canHidden: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileData: {},
      fileHeaders: {},
      uploadSuccess: false
    }
  },
  methods: {
    // 默认上传前获取code，如果传进来会覆盖
    _beforeUpload (file) {
      if (typeof this.beforeUpload === 'function') {
        this.beforeUpload(file)
        return
      }
      let url = this.getUploadCodeUrl ? this.getUploadCodeUrl : settings.apiGateway.getUploadCode
      return new Promise((resolve, reject) => {
        this.fetch(url).then(data => {
          // vue 添加响应式属性 https://cn.vuejs.org/v2/guide/list.html
          Vue.set(this.fileData, 'code', data.data.code)
          Vue.set(this.fileHeaders, 'FileToken', `Bearer ${data.data.token}`)
          resolve(true)
        }).catch(data => {
          this.$message({
            type: 'error',
            message: '未获取到 Token, 请点击重试'
          })
          reject(data)
        })
      })
    },
    // 限制文件上传个数
    _onExceed (files, fileList) {
      if (this.onExceed) {
        this.onExceed(files, fileList)
        return
      }
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 文件删除之前
    _beforeRemove (file, fileList) {
      if (this.beforeRemove) {
        const before = this.beforeRemove(file, this.uploadFiles)
        if (before && before.then) {
          return before
        } else if (before !== false) {
          return
        }
      }
      return this.$confirm(`确定移除 ${file.name}？`, '', { lockScroll: false })
    },
    // 文件删除成功
    _onRemove (file, fileList) {
      this.uploadSuccess = false
      this.onRemove && this.onRemove(file, fileList)
    },
    // 文件上传时的钩子
    _onProgress (event, file, fileList) {
      this.onProgress && this.onProgress(event, file, fileList)
    },
    // 文件上传失败时的钩子
    _onError (err, file, fileList) {
      this.onError && this.onError(err, file, fileList)
    },
    // 文件上传成功时的钩子
    _onSuccess (response, file, fileList) {
      if (response.code !== 0) {
        this.$refs['my-upload'].clearFiles()
        this.uploadSuccess = false
        this.$message.error(response.msg)
      } else {
        this.uploadSuccess = true
        this.onSuccess && this.onSuccess(response, file, fileList)
      }
    }
  }
}
</script>
<style scoped lang='less'>
.avatar-uploader {
  height: 167px;
}
</style>
