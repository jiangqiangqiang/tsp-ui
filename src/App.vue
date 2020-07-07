<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
    <div :class="helpBox" v-if="$route.path !== '/helper'" @click="goHelper">
      <svg-icon iconClass='bzzx_rk' className='helpIcon'></svg-icon>
    </div>
  </div>
</template>

<script>
import { Getitem } from '@/services/CommonService.js'
import BrowserMatch from '@/services/Browser.js'
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      role: '',
      isRouterAlive: true
    }
  },
  computed: {
    getUserToken () {
      return this.$store.state.userToken
    },
    helpBox () {
      if (this.role === 'unknow' || !this.role) {
        return 'fundIcon'
      } else {
        return 'themeIcon'
      }
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    goHelper () {
      let newpage = this.$router.resolve({ name: 'helper' })
      window.open(newpage.href, '_blank')
    }
  },
  created () {
    let store = Getitem('store')
    // log打印逻辑
    // 生产环境打印
    // this.log(1111, 'development')
    // 开发环境打印
    // this.log(1111)
    if (store) {
      this.$store.commit('setStore', store)
    }
    // 命名isIE是泛指像ie这么弱的能力的浏览器
    let isIE
    try {
      // 获取浏览器信息
      BrowserMatch.init()
      // 判断浏览器类型是否是IE
      // alert(BrowserMatch.browser)
      // alert(BrowserMatch.version)
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        isIE = true
      } else {
        if (BrowserMatch.browser === 'chrome' && BrowserMatch.version.split('.')[0] < 49) {
          isIE = true
        } else if (BrowserMatch.browser === 'firefox' && BrowserMatch.version.split('.')[0] <= 30) {
          isIE = true
        } else {
          isIE = false
        }
      }
    } catch (e) {
      isIE = false
    }
    if (isIE) {
      // 是IE浏览器,提示
    }
    this.$store.commit('setWebType', isIE)
  },
  watch: {
    $route (to, from) {
      if (!this.getUserToken && Getitem('userData') && JSON.parse(Getitem('userData')).token) {
        this.$store.commit('setUserToken', JSON.parse(Getitem('userData')).token)
      } else {
        if (Getitem('userData') && JSON.parse(Getitem('userData')).token !== this.getUserToken) {
          this.$store.commit('setUserToken', JSON.parse(Getitem('userData')).token)
          if (window.location.href.indexOf('path-lost') === -1 && Getitem('userData') && JSON.parse(Getitem('userData')).perfectState === '4' && window.location.href.indexOf('authentication/finished') === -1) {
            window.location.href = window.location.href.split('#')[0]
          }
        }
      }
      this.role = this.getUserRole()
      if (this.role === 'fund') {
        document.body.className = 'fund-theme-color'
      } else if (this.role === 'admin' || this.role === 'bonus' || this.role === 'service' || this.role === 'allocator') { // 后台系统和分红奖池账户用一个主题色
        document.body.className = 'admin-theme-color'
      } else if (this.role === 'enterprise') {
        document.body.className = 'enterprise-theme-color'
      } else if (this.role === 'agent') {
        document.body.className = 'agent-theme-color'
      } else {
        document.body.className = 'fund-theme-color'
      }
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/less/variables';
body,
html {
  height: 100%;
}
body,
input,
textarea,
button,
select,
pre,
xmp,
tt,
code,
kbd,
samp {
  font-family: 'Helvetica Neue', Helvetica, Arial, 'Microsoft YaHei', '微软雅黑';
}
#app {
  // 因为初始化滚动条问题 先注释
  height: 100%;
  position: relative;
  box-sizing: border-box;
  overflow: auto;
  .helpIcon {
    width: 14px !important;
    height: 22px !important;
    color: #bababa;
  }
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: rgba(87, 87, 87, 0.5);
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(87, 87, 87, 0.5);
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(87, 87, 87, 0.5);
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: rgba(87, 87, 87, 0.5);
}
input:focus::-webkit-input-placeholder {
  color: transparent;
}
input:focus:-moz-placeholder {
  color: transparent;
}
input:focus::-moz-placeholder {
  color: transparent;
}
input:focus:-ms-input-placeholder {
  color: transparent;
}
.fund-theme-color {
  --mainColor: #118eea;
  --mainColorDis: rgba(17, 142, 234, 0.6);
  --mainLightColor: #f2f9ff;
  --mainBtnDisabled: #f0f0f0;
  --mainTableBg: #f2f9ff;
  --mainTableHover: #c0e2fa;
  --mainActiveColor: #0e72bb;
  --mainStateBtn: #8ac7f4;
  --mainReviewBtn: #d0e8fd;
  --navHover: rgba(14, 114, 187, 0.5);
}
.enterprise-theme-color {
  --mainColor: #25b7aa;
  --mainColorDis: rgba(37, 183, 170, 0.6);
  --mainLightColor: #f6fffe;
  --mainBtnDisabled: #f0f0f0;
  --mainTableBg: #f6fffe;
  --mainTableHover: #e4f9f7;
  --mainActiveColor: #1e9288;
  --mainStateBtn: #92dbd4;
  --mainReviewBtn: #d9fffc;
  --navHover: rgba(30, 146, 136, 0.5);
}
.agent-theme-color {
  --mainColor: #e66b30;
  --mainColorDis: rgba(230, 107, 48, 0.6);
  --mainBtnDisabled: #f0f0f0;
  --mainLightColor: #fffaf7;
  --mainTableBg: #fffaf7;
  --mainTableHover: #fbe5d9;
  --mainActiveColor: #c24e15;
  --mainHome: #fffaf7;
  --mainReviewBtn: #fce5d9;
  --navHover: #d85f26;
}
.admin-theme-color {
  --mainColor: #938361;
  --mainColorDis: rgba(147, 131, 97, 0.6);
  --mainBtnDisabled: #f0f0f0;
  --mainLightColor: #fffaf4;
  --mainTableBg: #fffaf4;
  --mainTableHover: #fef5ea;
  --mainActiveColor: #6f5c34;
  --mainReviewBtn: #fdf0d4;
  --navHover: rgba(118, 105, 78, 0.5);
}
.el-table .descending .sort-caret.descending {
  border-top-color: @theme-blue!important;
  border-top-color: var(--mainColor) !important;
}
.el-table .ascending .sort-caret.ascending {
  border-bottom-color: @theme-blue!important;
  border-bottom-color: var(--mainColor) !important;
}
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #ecf5ff;
  background-color: var(--mainLightColor) !important;
  color: @theme-blue!important;
  color: var(--mainColor) !important;
}
.el-select-dropdown__item.selected,
.el-pager li:hover,
.el-pagination button:hover,
.el-date-table td.today span,
.el-date-table td.available:hover,
.el-date-picker__header-label.active,
.el-date-picker__header-label:hover .el-picker-panel__icon-btn:hover {
  color: @theme-blue!important;
  color: var(--mainColor) !important;
}
.el-pagination__sizes .el-input .el-input__inner:hover,
.el-select .el-input__inner:focus,
.el-select .el-input.is-focus .el-input__inner {
  border-color: @theme-blue!important;
  border-color: var(--mainColor) !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: @theme-blue!important;
  background-color: var(--mainColor) !important;
  border-color: @theme-blue!important;
  border-color: var(--mainColor) !important;
}
.el-tooltip__popper.is-dark {
  background-color: rgba(0, 0, 0, .6) !important;
  font-size: 14px;
  margin-top: 2px !important;
  line-height: 14px;
  padding: 8px 10px 8px 5px;
}
input {
  font-size: 1em;
}
.mdclass p .mdImg {
  max-width: 960px;
  margin: 10px 0;
}
.mdclass p {
  line-height: 32px;
}
.mdclass a {
  font-size: 16px;
  line-height: 40px;
  color: rgb(101, 101, 101);
}
.mdclass a:hover {
  cursor: pointer;
  text-decoration: underline;
  color: #118eea;
}
.mdclass ul li {
  list-style: disc;
}
.mdclass ol li {
  list-style: decimal;
}
.mdclass h1 {
  font-size: 17px !important;
}
.mdclass h2 {
  font-size: 16px !important;
}
.mdclass h3 {
  font-size: 15px !important;
}
.mdclass h4 {
  font-size: 14px !important;
}
.mdclass h5 {
  font-size: 13px !important;
}
.mdclass h6 {
  font-size: 12px !important;
}
.mdclass p code {
  color: #c7254e;
  background-color: #f9f2f4;
  border-radius: 2px;
}
.mdclass .hljs {
  background-color: #fafafa !important;
  line-height: 22px;
  border-radius: 4px;
}
.mdclass ul li {
  list-style: disc;
}
.mdclass blockquote {
  display: block;
  padding: 16px;
  margin: 0 0 24px;
  border-left: 8px solid #dddfe4;
  background: #eef0f4;
  overflow: auto;
}
#app .fundIcon,
#app .themeIcon {
  position: fixed;
  width: 34px;
  height: 34px;
  bottom: 63px;
  right: 30px;
  z-index: 999999;
  border: 1px solid rgba(221, 221, 221, 1);
  background-color: #fff;
  cursor: pointer;
  .helpIcon {
    margin: 6px 10px;
  }
}
#app .fundIcon {
  &:hover {
    border: 1px solid @theme-blue;
  }
  &:hover .helpIcon {
    color: @theme-blue;
  }
}
#app .themeIcon {
  &:hover {
    border: 1px solid @theme-blue;
    border: 1px solid var(--mainColor);
  }
  &:hover .helpIcon {
    color: @theme-blue;
    color: var(--mainColor);
  }
}
</style>
