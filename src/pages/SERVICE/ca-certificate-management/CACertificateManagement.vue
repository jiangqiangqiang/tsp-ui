<template>
  <div>
     <CADetail :CAData="CAData"></CADetail>
  </div>
</template>

<script>
import CADetail from '@/components/CADetail'
import settings from '@/settings'
export default {
  name: 'CACertificateManagement',
  data () {
    return {
      CAData: {
        certNo: '737838393929222762',
        certAuthority: '深圳CA',
        issueDate: '2018-05-06',
        certStatus: '失效',
        certValidityperiod: '长期',
        enterpriseName: '北京数云普惠科技有限公司',
        enterpriseCreditCode: '911144493838474N',
        legalPersonName: '孙林',
        legalPersonIdNumber: '13033219033392222'
      },
      getCAInfoUrl: settings.apiGateway.getCAInfo
    }
  },
  created () {
    this.fetch(this.getCAInfoUrl).then(data => {
      this.CAData = data.data
    }).catch(res => {
      this.$message.error(res.data.msg)
    })
  },
  methods: {

  },
  components: {
    CADetail
  }
}
</script>

<style lang="less" scoped>
</style>
