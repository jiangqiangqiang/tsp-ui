<template>
  <EnterpriseDetail
    isShowBack
    tag="代理商"
    title="代理商详情"
    :userId="$route.query.user_id"
    tagColor="#e66b30"
    ></EnterpriseDetail>
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
