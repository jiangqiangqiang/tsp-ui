<template>
  <div>
<!--    <BusinessTitle isShowBack title="企业详情"></BusinessTitle>-->
    <EnterpriseDetail
      isShowBack
      title="企业详情"
      :userId="$route.query.user_id"
      tag="资金方"
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

    }
  },
  created () {
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
