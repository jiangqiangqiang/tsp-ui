<!--
  title: 标题文案
  isShowBack: 是否显示返回按钮(默认/不传,不显示)
-->
 <template>
  <div>
    <div class="business-title">
      <a v-if="isShowBack" class="back-btn" @click="goBack">&lt; 返回</a>{{title}}
      <Button class="invite-btn" v-if="inviteText" :title="inviteText" @handleClick="toInvite"></Button>
    </div>
    <invite-pop-up :setPsdVisible="invitePopUpShow" @handleClose="invitePopUpShow = false" :url="url"></invite-pop-up>
  </div>
</template>

<script>
import InvitePopUp from '@/components/InvitePopUp.vue'
import settings from '@/settings'
export default {
  props: {
    title: {
      type: String,
      default: '请输入标题'
    },
    isShowBack: {
      type: Boolean,
      default: false
    },
    inviteText: {
      type: String,
      default: ''
    }
  },
  components: {
    InvitePopUp
  },
  data () {
    return {
      invitePopUpShow: false,
      url: '',
      getInviteUrl: settings.apiGateway.getInvitation
    }
  },
  methods: {
    goBack () {
      if (this.title === '确认提现信息') {
        this.$emit('goBack')
      } else if (this.title === '审核加入申请') {
        this.$emit('goBack')
      } else if (this.$route.path === '/enterprise/open-top-up/step2' || this.$route.path === '/enterprise/open-top-up/step3') {
        this.$router.push('/enterprise/home')
      } else if (this.$route.path === '/enterprise/top-up-schedule') {
        if (window.location.href.indexOf('tspOrderNo') > -1) {
          this.$router.push('/enterprise/top-up')
        } else if (window.location.href.indexOf('type') > -1) {
          this.$router.replace('/enterprise/cash-detail-account')
        } else {
          this.$router.push('/enterprise/top-up')
        }
      } else {
        this.$router.go(-1)
      }
    },
    toInvite () {
      this.getInvite()
    },
    getInvite () {
      let inviteType = ''
      let inviteSysRoles = ''
      if (this.inviteText === '邀请用户') {
        inviteType = 'Join'
        inviteSysRoles = this.getUserRole()
        inviteSysRoles = inviteSysRoles[0].toUpperCase() + inviteSysRoles.slice(1)
      } else if (this.inviteText === '邀请服务商') {
        inviteType = 'Create'
        inviteSysRoles = 'Service'
      } else if (this.inviteText === '邀请代理商') {
        inviteType = 'Create'
        inviteSysRoles = 'Agent'
      } else if (this.inviteText === '邀请企业方') {
        inviteType = 'Create'
        inviteSysRoles = 'Enterprise'
      }
      this.fetch(`${this.getInviteUrl}/${inviteType}/${inviteSysRoles}`).then(data => {
        this.url = data.data
        this.invitePopUpShow = true
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    }
  }
}

</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.business-title {
  width: 100%;
  height: 80px;
  line-height: 80px;
  color: #4a4a4a;
  font-family: Arial, 'Microsoft Yahei', 'Helvetica Neue', Helvetica, sans-serif;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  position: relative;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  background-clip: padding-box;
  .back-btn {
    position: absolute;
    color: #4a4a4a;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    left: 20px;
    top: 5px;
    cursor: pointer;
    font-weight: 400;
  }
  .back-btn:hover {
    color: @theme-blue;
    color: var(--mainColor);
  }
  .invite-btn {
    height: 36px;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    position: absolute;
    top: 25px;
    right: 18px;
  }
}
.business-title /deep/ .el-button {
  padding-top: 11px;
}
</style>
