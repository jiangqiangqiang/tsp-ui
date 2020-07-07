<template>
    <message-info :messageType="messageType" :transactionCode="transactionCode"></message-info>
</template>

<script>
import MessageInfo from '@/components/MessageInfo'
export default {
  data () {
    return {
      messageType: '',
      transactionCode: ''
    }
  },
  components: {
    MessageInfo
  },
  methods: {
  },
  created () {
    this.transactionCode = this.$route.query.transactionCode
    this.messageType = this.$route.query.type
  }
}
</script>

<style scoped lang="less">
</style>
