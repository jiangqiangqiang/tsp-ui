<template>
  <div class="CA-certificate-main">
    <CADetail :CAData="CAData"></CADetail>
  </div>
</template>

<script>
import settings from '@/settings'
import CADetail from '@/components/CADetail'
export default {
  name: 'CAcertificatemanage',
  components: { CADetail },
  data () {
    return {
      CAData: {
        certNo: '',
        certAuthority: '',
        issueDate: '',
        certStatus: '',
        certValidityperiod: '',
        enterpriseName: '',
        enterpriseCreditCode: '',
        legalPersonName: '',
        legalPersonIdNumber: ''
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

  }
}
</script>

<style lang="less" scoped>
</style>
