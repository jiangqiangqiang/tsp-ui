<template>
  <div>
    <el-container class="container">
      <el-header style="height:80px">
        <Header :showMessage="showMessage"></Header>
      </el-header>
      <el-container style="width: 1354px;margin: 0 auto" class="contert">
        <el-aside width="200px">
          <Aside :menuList="menuList"></Aside>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      <!--
          <el-footer style="height:42px;width:100%;">
            <Footer></Footer>
          </el-footer>
-->
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Aside from '@/components/Aside.vue'
export default {
  name: 'adminIndex',
  data () {
    return {
      Role: '',
      // 按钮列表
      menuList: [
        {
          firstMenu: '仪表盘',
          path: '/bonus/dashboard',
          classNameI: 'ht_ybp',
          className: 'dashboard icon'
        },
        {
          firstMenu: '支付令明细账',
          path: '/bonus/home',
          classNameI: 'x_sy',
          className: 'home icon'
        }
      ],
      // 传入header组件中是否显示收件图标
      showMessage: false
    }
  },
  components: {
    Header,
    Footer,
    Aside
  },
  created () {
    this.Role = this.getUserRole()
    // 通过角色引入不同主题色变量(废弃)
    /* if (this.Role.toLowerCase() === 'x') {
      require('@/assets/x-theme-color.css')
    } else {
      require('@/assets/y-theme-color.css')
    } */
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.el-header,
.el-footer {
  padding: 0;
}
.container {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
.contert {
  flex: 1;
  overflow: hidden;
}
.el-aside {
  background-color: @theme-blue;
  background-color: var(--mainColor);
  text-align: center;
  /* overflow: hidden; */
}
.el-main {
  overflow-x: hidden;
  padding: 0;
}
</style>
