<template>
  <EnterpriseDetail canChangePhoneNum canChangeEmail title="账户认证"><div slot="admin"></div></EnterpriseDetail>
</template>

<script>
import EnterpriseDetail from '@/components/EnterpriseDetail'
export default {
  name: 'basicinformation',
  components: { EnterpriseDetail },
  data () {
    return {}
  },
  created () {
  },
  methods: {},
  computed: {}
}
</script>

<style lang="less" scoped>
</style>
