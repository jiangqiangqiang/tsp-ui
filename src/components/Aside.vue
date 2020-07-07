<!--
  传入参数
  props: menuList Array
  [
    {
      firstMenu: '首页',
      path: '/home',
      className: 'home icon'
    },
    {
      firstMenu: '业务处理',
      className: 'business icon',
      secondMenuList: [
        {
          secondMenu: '充值',
          path: '/top-up'
        },
        {
          secondMenu: '支付',
          path: '/payment'
        },
        {
          secondMenu: '收款',
          path: '/proceeds'
        },
        {
          secondMenu: '提现',
          path: '/withdraw-list'
        }
      ]
    }
  ]
-->
 <template>
  <div class="nav">
    <el-menu
      ref="symenu"
      :unique-opened="true"
      class="menu-vertical"
      router
      @open="handleOpen"
      @close="handleClose"
      :background-color="themeColor"
      text-color="#fff"
      :default-active="$route.path"
      @select="handleSelect"
      >
      <div v-for="(item, index) in menuList" :key="index">
       <el-menu-item v-if="!item.secondMenuList"  :index="item.path" class="el-home">
          <svg-icon :iconClass='item.classNameI' className='icon'></svg-icon>
          <span slot="title" class="title-size">{{item.firstMenu}}</span>
       </el-menu-item>
       <div @click="handleClick(item)" class="anywey">
         <el-badge :value="item.badge" class="admin-badge" v-if="!item.secondMenuList && item.badge && item.badge !== 0" :max="99" ></el-badge>
       </div>
       <el-submenu  v-if="item.secondMenuList" :index="index+'s'">
          <template slot="title">
            <svg-icon :iconClass='item.classNameI' className='icon'></svg-icon>
            <span class="title-size">{{item.firstMenu}}</span>
            <el-badge :value="item.badge" class="admin-badge-item" v-if="item.secondMenuList && item.badge && item.badge !== 0" :max="99" ></el-badge>
          </template>
          <div v-for="(secondItem, secondIndex) in item.secondMenuList" :key="secondIndex + 't'">
            <el-submenu v-if="secondItem.thirdMenuList && secondItem.thirdMenuList.length" :index="secondIndex + 'tt'">
              <template slot="title"><span class="second-menu">{{secondItem.secondMenu}}</span></template>
              <!-- 三级菜单 -->
              <el-menu-item v-for="itemChild_Child in secondItem.thirdMenuList" :index="itemChild_Child.path" :key="itemChild_Child.path">
              <span slot="title" class="third-menu">{{itemChild_Child.thirdMenu}}</span></el-menu-item>
            </el-submenu>
            <el-menu-item-group v-else>
              <el-menu-item :index="secondItem.path">{{secondItem.secondMenu}}</el-menu-item>
              <span @click="handleClick(secondItem)">
                <el-badge :value="secondItem.badge" class="badge-item" v-if="secondItem.badge && secondItem.badge !== 0" :max="99" ></el-badge>
              </span>
            </el-menu-item-group>
          </div>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>
<script>
export default {
  props: {
    menuList: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      userRole: '',
      themeColor: ''
    }
  },
  methods: {
    handleOpen () {
      let active = document.getElementsByClassName('el-submenu is-active')
      if (active.length > 0) {
        let isIE = this.$store.state.isIE
        if (isIE) {
          active[0].style.backgroundColor = ''
        } else {
          active[0].style.backgroundColor = ''
        }
      }
    },
    handleClose (key, keyPath) {
      let active = document.getElementsByClassName('el-submenu is-active')
      if (active.length > 0) {
        let isIE = this.$store.state.isIE
        if (isIE) {
          active[0].style.backgroundColor = 'rgb(14, 114, 187)'
        } else {
          active[0].style.backgroundColor = 'var(--mainActiveColor)'
        }
      }
    },
    handleClick (secondItem) {
      this.$router.push(secondItem.path)
    },
    handleSelect (index, indexPath) {
      this.$store.dispatch('updateCounters')
    }
  },
  created () {
    this.userRole = this.getUserRole()
    let isIE = this.$store.state.isIE
    // 设置导航背景主题色
    if (this.userRole === 'enterprise') {
      this.themeColor = '#25b7aa'
    } else if (this.userRole === 'admin' || this.userRole === 'bonus' || this.userRole === 'service' || this.userRole === 'allocator') {
      this.themeColor = '#938361'
    } else if (this.userRole === 'agent') {
      this.themeColor = '#e66b30'
    } else {
      this.themeColor = '#118eea'
    }
    // IE或者不支持的浏览器使用默认颜色
    if (isIE) {
      this.themeColor = '#118eea'
    }
    this.$store.dispatch('updateCounters')
  }
}
</script>

<style scoped lang="less">
  @import '~@/assets/less/variables';
  .nav
  .el-menu{
    border-right:0;
    //width:217px!important
  }
  .anywey {
    height: 0;
    width: 0
  }
  .title-size{
    font-size: 16px
  }
  .el-home {
    text-align: left;
  }
  .icon {
    display: inline-block;
    width: 17px;
    height:17px;
    vertical-align: middle;
    color: @theme-blue;
    color: var(--mainColor);
    background-repeat: no-repeat;
    background-size: cover
  }
  .second-menu {
    padding-left: 20px;
  }
  .third-menu {
    margin-left: 15px;
  }
  .nav/deep/.el-submenu__title {
    text-align: left;
    border-bottom-color: @theme-blue;
    border-bottom-color: var(--mainColor);
  }
  .nav/deep/ .el-menu-item-group__title{
    padding:0
  }
  .nav/deep/.el-submenu__title i {
    color: #fff;
  }
  .el-menu-item-group .el-menu-item {
    text-align: left;
    height: 43px;
    line-height: 43px;
    padding-left: 60px!important;
    box-sizing: border-box;
  }
  .nav/deep/.el-submenu.is-opened {
    .el-submenu__title {
      color: #fff;
      background-color: rgba(14, 114, 187, 0.5)!important;
      background-color: var(--navHover)!important;
    }
    // 设置当前菜单背景
    .el-menu-item {
      text-align: left;
      color: #fff;
      background-color: rgb(14, 114, 187)!important;
      background-color: var(--navHover)!important;
    }
  }
  .nav/deep/.el-submenu.is-active {
    .el-submenu__title {
      color: #fff;
      background-color: rgba(14, 114, 187, 0.5)!important;
      background-color: var(--navHover)!important;
    }
    // 设置当前菜单背景
    .el-menu-item {
      color: #fff;
      background-color: rgba(14, 114, 187, 0.5)!important;
      background-color: var(--navHover)!important;
    }
    .el-menu-item.is-active {
      color: #fff;
      background-color: rgb(14, 114, 187)!important;
      background-color: var(--mainActiveColor)!important;
    }
  }
  .el-menu-item.is-active {
    color: #fff;
    background-color: rgb(14, 114, 187)!important;
    background-color: var(--mainActiveColor)!important;
  }
  .badge-item {
    cursor: pointer;
    margin-top: -60px;
    margin-left: 140px;
  }
  .el-menu-item-group {
    height: 43px;
  }
  .admin-badge {
    cursor: pointer;
    margin-top: -68px;
    margin-left: 164px;
  }
  .admin-badge-item {
    float: right;
    margin-right: 14px
  }
</style>

<style>
.nav .el-submenu__icon-arrow {
  right: 10px
}
</style>
