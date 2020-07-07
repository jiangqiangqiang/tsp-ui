<!--
  需要传入证书相关数据
  CAData: Object
  {
    certNo: '737838393929222762', // 证书序列号
    certAuthority: '深圳CA',       // 证书颁发机构
    issueDate: '2018-05-06',      // 证书颁发日期
    certStatus: '有效/失效',            // 证书状态
    certValidityperiod:'长期,       // 证书有效期
    enterpriseName: '北京数云普惠科技有限公司',  // 企业名称
    enterpriseCreditCode: '911144493838474N',  //企业社会信用代码
    legalPersonName: '孙林',                 // 企业法人
    legalPersonIdNumber: '13033219033392222'  // 企业法人身份证号码
  }
-->
<template>
  <div class="ca-container">
    <BusinessTitle title="CA证书详情"></BusinessTitle>
    <div class="ca-detail">
       <h4>证书详情</h4>
       <table>
          <tr>
            <td>证书ID</td>
            <td>{{CAData.certNo}}</td>
            <td>证书颁发机构</td>
            <td>{{CAData.certAuthority}}</td>
            <td>证书颁发日期</td>
            <td>{{CAData.issueDate}}</td>
          </tr>
          <tr>
            <td>证书状态</td>
            <td>
              <span :style="{color: CAData.certStatus==='有效' ? '#333' : '#da4848'}">{{CAData.certStatus}}</span></td>
            <td>证书有效期</td>
            <td>{{CAData.certValidityperiod}}</td>
            <td></td>
            <td></td>
          </tr>
        </table>
     </div>
     <div class="affiliated-enterprise-detail">
       <h4>企业信息</h4>
       <table>
          <tr>
            <td>企业名称</td>
            <td>{{CAData.enterpriseName}}</td>
            <td>统一社会信用代码</td>
            <td>{{CAData.enterpriseCreditCode}}</td>
          </tr>
          <tr>
            <td>企业法人</td>
            <td>{{CAData.legalPersonName}}</td>
            <td>企业法人身份证号码</td>
            <td>{{CAData.legalPersonIdNumber}}</td>
          </tr>
        </table>
     </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
export default {
  name: 'CADetail',
  props: {
    CAData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  },
  components: {
    BusinessTitle
  }
}
</script>

<style lang=less scoped>
  .ca-detail {
    margin: 30px 0;
  }
  .affiliated-enterprise-detail {
  }
  .ca-container {
    table {
      width: 100%;
      tr {
        td {
          height: 39px;
          border: 1px solid #e6e6e6;
          font-size: 13px;
        }
        td:nth-child(2n+1) {
          text-align: center;
          padding: 0 15px;
          width: 150px;
        }
        td:nth-child(2n) {
          text-align: left;
          padding-left: 20px;
        }
      }
    }
  }
  h4 {
    background-color: #e5e5e5;
    font-size: 15px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #656565;
    border: 1px solid #e1e1e1;
  }
</style>
