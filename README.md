# epuchain-ui

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install / cnpm install

# serve with hot reload at ip:7071
npm run dev

# build for production with minification
npm run build / npm run build:test

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## build打包已修改输出目录为./dist/dist

```
# 打包docker镜像(将Dockerfile和default.conf)复制到dist目录下即可
npm run release

```
## 技术栈

- vue

- vue-router

- vuex

- axios

- element-ui(UI组件库)

- webpack

- docker(部署)

- node(开发)

## 利用css变量新特性来设置颜色
- [参考文档](https://blog.csdn.net/u011043843/article/details/46480677)

- 在App.vue组件根据路由变更动态时获取当前用户角色根据角色设置系统颜色.后续需要设置颜色的地方如下使用:

```
background-color: var(--mainColor);
```
- 现在配置了两个颜色`--mainColor`(主题色)和`--mainLightColor`(浅主题色)

- 由于var属性部分低端浏览器不支持,故对低版本做了兼容处理,均显示默认颜色,并有提示

## 规范

- [英文版 openapi 规范 2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)
- [中文版 openapi 规范 2.0](https://blog.csdn.net/wjc133/article/details/65436778)
- [英文版 openapi 规范 3.0](https://swagger.io/specification/)
- [jwt introduction](https://jwt.io/introduction/)

### 命名规范

- 命名法说明
- camel命名法，形如thisIsAnApple
- pascal命名法，形如ThisIsAnApple
- 下划线命名法，形如this_is_an_apple
- 中划线命名法，形如this-is-an-apple

#### 说明： *所有的名称，包括文件名都作为大小写敏感来处理*

- Vue规范要求
- 组件文件夹 使用 **pascal**命名法 其他文件夹 使用 **中划线** 命名法
- 组件文件使用 **pascal** 命名法，尽量和组件文件夹一致
- 前端路由使用 **中划线** 命名法
- 组件和前端路由文件中的组件name和路由name使用**camel**命名法

- JS规范要求
- 变量名：必须使用camel命名法
- 参数名：必须使用camel命名法
- 函数名：必须使用camel命名法
- 方法/属性：必须使用camel命名法

- css规范要求
- css 文件名必须使用小写字母
- 选择器必须单词全字母小写,多个单词情况下使用中划线分割 **中划线**
- class选择器尽量遵循 [BEM](https://www.cnblogs.com/dujishi/p/5862911.html) 规范
- id 选择器必须保证页面唯一 **camel**
- 同一页面，应避免使用相同的 name 与 id
- 全局样式可以写在 main.css 中以sy-global-*开头

#### 说明： BEM即块（block）、元素（element）、修饰符（modifier）块之间用**-**链接，链接元素用**__**,链接修饰符用**--**

## 常用组件列表

- [sls-admin/sls-admin-vue](https://github.com/sls-admin/sls-admin-vue)

基于vue2+vuex2+vue-router+axios+elementUI的后台管理系统

后台管理地址：https://doc.vue.slsadmin.org
演示地址：https://vue.slsadmin.org/　　账号：sls-2/123456

- [图片裁剪](https://github.com/Agontuk/vue-cropperjs)
- [element ui](http://element-cn.eleme.io/#/zh-CN/component/installation)
- [https://github.com/lin-xin/vue-manage-system](https://github.com/lin-xin/vue-manage-system)
- [vue.js document](https://cn.vuejs.org/v2/guide/installation.html)
- [vue admin](https://admin.vuebulma.com/#/dashboard)

Github 地址：https://github.com/taylorchen709/vue-admin

- [vue manage system](https://github.com/lin-xin/vue-manage-system)

- [lzxb/vue-cnode](https://github.com/lzxb/vue-cnode)

基于vue2 + vue-router + vuet + ES6 + less + flex.css重写vue版cnode社区，使用webpack2打包
- [iview admin](https://github.com/iview/iview-admin)

### less var

- [variables.less ref](https://github.com/distros/bootstrap-less/blob/master/bootstrap/variables.less)

### scss var

- [scss var](https://github.com/twbs/bootstrap/tree/v4-dev/scss)


## CI/CD

- [如何实现前端工程的持续集成与持续部署？](https://www.zhihu.com/question/60194439)
- [jenkins构建触发器定时任务Build periodically和Poll SCM](https://www.cnblogs.com/caoj/p/7815820.html)

## 公共方法组件目录

- 公共组件: src\components(项目通用组件存放于此)
- 过滤器: src\filters
- 全局混入方法: src\mixins
- 全球化: src\locales
- 全局参数配置 src\settings
- vue全局数据: src\vuex
- 其他公共服务: src\services

## 登录使用`token`机制

- [参考文档](https://jwt.io/introduction/)

- 登录逻辑依据axios和vue-router的拦截器以及钩子函数实现

- axios统一配置header的token

- vue-router钩子函数设置登录逻辑(有无token来定向路由)

## 全局log方法

- 用来代替原生的console.log,以便开发人员自行控制在哪些运行环境中打印日志

- 定义于`src\mixins`全局混入,使用形式如下:

```
  this.log(info[, level, type])
```
## 版本信息查看`release_notes`

## 关于测试

- Mocha测试框架
- chai断言库
- Sinon: spies stub mock(测试替代?)
