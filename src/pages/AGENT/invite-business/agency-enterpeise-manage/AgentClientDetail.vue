<template>
  <div>
<!--    <BusinessTitle isShowBack title="企业详情"></BusinessTitle>-->
    <EnterpriseDetail
      isShowBack
      title="企业详情"
      :userId="$route.query.user_id"
      :tag="tag"
      tagColor="#0f8eeb"
      ></EnterpriseDetail>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import EnterpriseDetail from '@/components/EnterpriseDetail'
export default {
  name: 'enterpriseClientDetail',
  data () {
    return {
      sysRole: '',
      tag: ''
    }
  },
  created () {
    this.sysRole = this.$route.query.sysRole
    if (this.sysRole === 'Enterprise') {
      this.tag = '企业客户'
    } else {
      this.tag = '资金方'
    }
  },
  methods: {

  },
  components: {
    BusinessTitle,
    EnterpriseDetail
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>

</style>
