<template>
  <div style="height:100%">
    <el-container class="container">
      <el-header style="height:80px">
        <Header>
          <div></div>
        </Header>
      </el-header>
      <el-container style="width: 100%;min-width:1354px;height:100%" class="contert">
        <el-aside width="217px">
          <Aside @typeHelp="getTypeHelp"></Aside>
        </el-aside>
        <el-main>
          <div class="headerC">{{headerText}}</div>
          <div class="mdclass" v-html="mdText" v-highlight @click="tokenDetail($event)"></div>
        </el-main>
      </el-container>
      <Footer></Footer>
    </el-container>
  </div>
</template>

<script>
import Header from './Header'
import Aside from './Aside.vue'
import Footer from '@/components/Footer'
// import { Getitem } from '@/services/CommonService.js'
import settings from '@/settings'

export default {
  name: 'sysIndex',
  data () {
    return {
      testmd: '',
      typeHelp: '',
      outerDir: ''
    }
  },
  components: {
    Header,
    Aside,
    Footer
  },
  methods: {
    getTypeHelp (payload) {
      // if (!Getitem('token')) {
      //   return this.$message.error('请登录后重试')
      // }
      const self = this
      self.typeHelp = payload
      self.axios.get('/企业方/' + self.typeHelp).then(data => {
        // () 小括号
        var regex1 = /\((.+?)\)/g
        self.outerDir = self.typeHelp.split('/')
        self.outerDir.pop()
        self.outerDir = self.outerDir.join('/')
        self.testmd = data.data.replace(regex1, function ($0, $1, $2) {
          if ($1.indexOf('.jpg') > -1 || $1.indexOf('.png') > -1) {
            return '(' + settings.domain.helpUrl + '/企业方/' + self.outerDir + '/' + $1 + ')'
          } else {
            return '(' + $1 + ')'
          }
        })
      }).catch(e => {
        this.$message.error('请求文件错误')
      })
    },
    tokenDetail (e) {
      if (e.target.nodeName === 'A') {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
        let upFileLis = null
        let finalPath = null
        let upFileLen = null
        if (e.target.href.indexOf('upFile/') > -1) {
          upFileLis = decodeURIComponent(e.target.href).split('upFile/')
          finalPath = upFileLis[upFileLis.length - 1]
          upFileLen = upFileLis.length
          let outDir = this.outerDir.split('/')
          for (let i = 0; i < upFileLen - 1; i++) {
            outDir.pop()
          }
          this.outerDir = outDir.join('/')
        }
        finalPath = finalPath || e.target.pathname.replace('/upFile', '')
        if (finalPath[0] !== '/') finalPath = '/' + finalPath
        this.getTypeHelp(this.outerDir + finalPath)
        // e.target.href = 'javascript:void(0);'
      }
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {
    mdText () {
      return this.marked(this.testmd || '').replace(/<pre>/g, '<pre class="hljs">').replace(/<img/g, '<img class="mdImg"').replace(/\.\.\//g, 'upFile/')
    },
    headerText () {
      // return this.outerDir.split('/')[this.outerDir.split('/').length - 1]
      let text = this.typeHelp.indexOf('index.md') > -1 ? this.typeHelp.split('/')[this.typeHelp.split('/').length - 2] : this.typeHelp.split('/')[this.typeHelp.split('/').length - 1].replace('.md', '')
      return decodeURIComponent(text)
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="less">
.el-header,
.el-footer {
  padding: 0;
}
.container {
  height: 100%;
}
.headerC {
  font-size: 16px;
  line-height: 48px;
  font-weight: bold;
  margin-bottom: 24px;
  background-color: #f2f9ff;
  text-align: center;
  border-bottom: 1px solid #f1f1f3;
  border-right: 1px solid #f1f1f3;
}
.contert {
  flex: 1;
  overflow: hidden;
}
.el-aside {
  background-color: #fbfbfb;
  text-align: center;
}
.el-main {
  overflow-x: hidden;
  padding: 0;
  width: calc(100% - 217px);
}
.mdclass {
  width: 1035px;
  margin: 0 50px 30px 50px;
}
</style>
