
 <template>
  <div class="nav">
    <el-menu ref="symenu" :unique-opened="true" class="menu-vertical" @open="handleOpen" @close="handleClose"
      :background-color="themeColor" text-color="#656565" :default-active="$route.path" @select="handleSelect">
      <div class="normalHelp">常见问题帮助</div>
      <div v-for="(item, index) in mdToJson" :key="index">
        <el-menu-item v-if="!item.child.length > 0" :index="item.mdName" class="el-home">
          <svg-icon :iconClass='item.iconName' className='icon'></svg-icon>
          <span slot="title" class="title-size">{{item.memuName}}</span>
        </el-menu-item>
        <div @click="handleClick(item)" class="anywey">
        </div>
        <el-submenu v-if="item.child.length > 0" :index="index+''">
          <template slot="title">
            <svg-icon :iconClass='item.iconName' className='icon'></svg-icon>
            <span class="title-size">{{item.memuName}}</span>
          </template>
          <el-menu-item-group v-for="(secondItem, secondIndex) in item.child" :key="secondIndex">
            <el-menu-item :index="secondItem.mdName">{{secondItem.memuName}}</el-menu-item>
            <span @click="handleClick(secondItem)">
            </span>
          </el-menu-item-group>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
// import { Getitem } from '@/services/CommonService.js'

export default {
  data () {
    return {
      userRole: '',
      themeColor: '#FBFBFB',
      testmd: '',
      isFirst: true
    }
  },
  methods: {
    handleOpen () {
      let active = document.getElementsByClassName('el-submenu is-active')
      if (active.length > 0) {
        active[0].style.backgroundColor = ''
      }
    },
    handleClose (key, keyPath) {
    },
    handleClick (secondItem) {
      this.$router.push({
        path: '/home',
        query: {
          type: secondItem.mdName
        }
      })
    },
    handleSelect (index, indexPath) {
      console.log(index)
      this.$emit('typeHelp', index)
    },
    isExist (val) {
      if (val && val.length > 1) {
        return val[1]
      } else {
        return ''
      }
    },
    homeMd (menuList) {
      if (menuList.length > 0 && this.isFirst) {
        this.isFirst = false
        this.handleSelect(menuList[0].mdName || menuList[0].child[0].mdName || menuList[0].child[0].child[0].mdName || '')
      }
    }
  },
  created () {
    // if (Getitem('token')) {
    this.axios.get('/企业方/index.md').then(data => {
      this.testmd = data.data
      this.isFirst = true
    }).catch(e => {
      this.$message.error('请求文件错误')
    })
    // } else {
    //   this.$message.error('请登录后重试')
    // }
  },
  computed: {
    mdText () {
      return this.marked(this.testmd || '').replace('<pre>', '<pre class="hljs">')
    },
    mdToJson () {
      let mdText = this.testmd.toString().split('\n\n')
      if (mdText && mdText.length > 0 && mdText[0]) {
        let menuList = []
        // () 小括号
        var regex1 = /\((.+?)\)/
        // [] 中括号
        var regex2 = /\[(.+?)\]/
        // {} 花括号，大括号
        var regex3 = /\{(.+?)\}/
        mdText.forEach((item, index) => {
          if (item.indexOf('>>>') > -1) {
            let menuLast = menuList[menuList.length - 1]
            if (menuLast) {
              menuLast.child[menuLast.child.length - 1].child.push({
                memuName: this.isExist(regex2.exec(item)) || '',
                mdName: this.isExist(regex1.exec(item)) || '',
                iconName: this.isExist(regex3.exec(item)) || ''
              })
            } else {
              this.$message.error('MD文件错误')
            }
          } else if (item.indexOf('>>') > -1) {
            let menuLast = menuList[menuList.length - 1]
            if (menuLast) {
              menuLast.child.push({
                memuName: this.isExist(regex2.exec(item)) || '',
                mdName: this.isExist(regex1.exec(item)) || '',
                iconName: this.isExist(regex3.exec(item)) || '',
                child: []
              })
            } else {
              this.$message.error('MD文件错误')
            }
          } else if (item.indexOf('>') > -1) {
            menuList.push({
              memuName: this.isExist(regex2.exec(item)) || '',
              mdName: this.isExist(regex1.exec(item)) || '',
              iconName: this.isExist(regex3.exec(item)) || '',
              child: []
            })
          } else {
            this.$message.error('MD文件错误')
          }
        })
        this.homeMd(menuList)
        return menuList
      } else {
        return []
      }
    }
  }
}
</script>

<style scoped lang="less">
.nav .el-menu {
  border-right: 0;
  //width:217px!important
}
.anywey {
  height: 0;
  width: 0;
}
.title-size {
  font-size: 16px;
}
.el-home {
  text-align: left;
}
.normalHelp {
  height: 48px;
  line-height: 48px;
  color: #fff;
  background-color: #108ee9;
  font-weight: bold;
}
.icon {
  display: inline-block;
  width: 17px;
  height: 17px;
  vertical-align: middle;
  color: rgb(14, 114, 187);
  background-repeat: no-repeat;
  background-size: cover;
}
.nav/deep/.el-submenu__title {
  text-align: left;
}
.nav/deep/ .el-menu-item-group__title {
  padding: 0;
}
.nav/deep/.el-submenu__title i {
  color: #656565;
}
.el-menu-item-group .el-menu-item {
  text-align: left;
  height: 43px;
  line-height: 43px;
  padding-left: 60px !important;
  box-sizing: border-box;
}
.nav/deep/.el-submenu.is-opened {
  .el-submenu__title {
    color: #656565;
  }
  // 设置当前菜单背景
  .el-menu-item {
    color: #656565;
  }
}
.nav/deep/.el-submenu .el-menu .el-menu-item {
  background-color: #f3f3f3 !important;
}
.nav/deep/.el-submenu .el-menu .is-active {
  background-color: #e4e3e3 !important;
}
.nav/deep/.el-submenu.is-active {
  // 设置当前菜单背景
  .el-menu-item,
  .el-menu-item.is-active,
  .el-submenu__title {
    color: #656565;
  }
}
.badge-item {
  cursor: pointer;
  margin-top: -60px;
  margin-left: 140px;
}
.nav/deep/.el-menu-item-group {
  height: 43px;
}
.admin-badge {
  cursor: pointer;
  margin-top: -68px;
  margin-left: 164px;
}
.admin-badge-item {
  float: right;
  margin-right: 14px;
}
</style>

<style>
.nav .el-submenu__icon-arrow {
  right: 10px;
}
</style>
