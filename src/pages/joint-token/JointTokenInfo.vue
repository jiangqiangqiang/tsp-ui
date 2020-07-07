<template>
  <JointTokenState
    :logData="logData"
    :bileData="bileData"
    :tokenData="tokenData"
    :orderData="orderData"
  >
  </JointTokenState>
</template>

<script>
import JointTokenState from './JointTokenState.vue'
import settings from '@/settings'
export default {
  data () {
    return {
      orderData: {},
      logData: [],
      bileData: {},
      tokenData: {},
      tokenLogUrl: settings.apiGateway.tokenLog,
      bileUrl: settings.apiGateway.bile,
      tokenDetailUrl: settings.apiGateway.tokenDetail,
      orderDetailUrl: settings.apiGateway.orderDetail,
      orderId: this.$route.query.code
    }
  },
  created () {
    this.getLogData()
    this.getBileData()
    this.getTokenData()
    this.getOrderData()
  },
  methods: {
    getLogData () {
      this.fetch(`${this.tokenLogUrl}${this.orderId}`).then(data => {
        this.log(data)
        this.logData = data.data
      }).catch(res => {})
    },
    getBileData () {
      this.fetch(`${this.bileUrl}${this.orderId}`).then(data => {
        this.log(data)
        this.bileData = data.data
      }).catch(res => {})
    },
    getTokenData () {
      this.fetch(`${this.tokenDetailUrl}${this.orderId}`).then(data => {
        this.log(data)
        this.tokenData = data.data
      }).catch(res => {})
    },
    getOrderData () {
      this.fetch(`${this.orderDetailUrl}${this.orderId}`).then(data => {
        this.orderData = data.data
      }).catch(res => {})
    }
  },
  components: {
    JointTokenState
  }
}
</script>
