<template>
  <div id="hello" class="hello">
    <!-- <div class="mdclass" v-html="mdText" v-highlight></div> -->
    <EnterpriseIndex></EnterpriseIndex>
  </div>
</template>
<script>
import EnterpriseIndex from '@/pages/help/EnterpriseIndex'
export default {
  name: 'help',
  data () {
    return {
      testmd: ''
    }
  },
  components: {
    EnterpriseIndex
  },
  methods: {
    isExist (val) {
      if (val && val.length > 1) {
        return val[1]
      } else {
        return ''
      }
    }
  },
  computed: {
    mdText () {
      return this.marked(this.testmd || '').replace('<pre>', '<pre class="hljs">')
    },
    mdToJson () {
      let mdText = this.testmd.toString().split('\n\n') || []
      let menuList = []
      // () 小括号
      var regex1 = /\((.+?)\)/
      // [] 中括号
      var regex2 = /\[(.+?)\]/
      // {} 花括号，大括号
      var regex3 = /\{(.+?)\}/
      mdText.forEach((item, index) => {
        if (item.indexOf('>>') > -1) {
          let menuLast = menuList[menuList.length - 1]
          if (menuLast) {
            menuLast.child.push({
              memuName: this.isExist(regex2.exec(item)) || '',
              mdName: this.isExist(regex1.exec(item)) || '',
              iconName: this.isExist(regex3.exec(item)) || ''
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
      return menuList
    }
  },
  mounted () {
    // this.axios.get('/api/index.md').then(data => {
    //   this.testmd = data.data
    // }).catch(e => {
    //   this.$message.error('请求文件错误')
    // });
  }
}
</script>
<style scoped>
.hello {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: auto;
}
</style>
