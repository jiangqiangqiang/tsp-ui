<!--
  企业详情组件
  由于获取企业信息成为公共接口,四个角色都要用到接口获取数据的过程也放到组件内部
  现在需要父组件传入配置title 和是否可以修改管理员手机号等部分差异
-->
<template>
  <div class="basic-info-main">
    <BusinessTitle :isShowBack="isShowBack" :title="title" v-if="showTitle"></BusinessTitle>
    <div class="basic-info-content">
      <slot name="overInfo">
        <div class="company-detail" v-if="this.userRole !== 'fund' && userId && this.userRole !== 'enterprise'">
          <div class="enterprise-name">{{overviewInfoData.name}}<el-tag size="mini" v-if="tag" :color="tagColor"
              style="vertical-align: text-bottom; color:#fff;margin-left: 10px">{{tag}}</el-tag>
          </div>
          <div v-if="!tag || tag==='代理商'">
            <div class="enterprise-data">
              <div class="box-width">
                <span>统一社会信用代码:</span>
                <span>{{overviewInfoData.creditCode}}</span>
              </div>
              <div class="box-width">
                <span>法人姓名:</span>
                <span>{{overviewInfoData.legalPersonName}}</span>
              </div>
              <div class="box-width">
                <span>企业通过认证日期:</span>
                <span>{{overviewInfoData.approvedTime}}</span>
              </div>
            </div>
          </div>
          <div v-if="tag==='资金方'">
            <div class="enterprise-data">
              <div class="box-width">
                <span>统一社会信用代码:</span>
                <span>{{overviewInfoData.creditCode}}</span>
              </div>
              <div class="box-width">
                <span>法人姓名:</span>
                <span>{{overviewInfoData.legalPersonName}}</span>
              </div>
              <div class="box-width">
                <span>企业通过认证日期:</span>
                <span>{{overviewInfoData.approvedTime}}</span>
              </div>
            </div>
            <div class="agent-sign">
              <!-- <span class="agent-icon"></span> -->
              <svg-icon iconClass='dls_sy_gys' className='agent-icon'></svg-icon>
              <span>代理商名称: </span>
              <span>{{overviewInfoData.agentName}}</span>
            </div>
          </div>
          <div v-if="tag==='企业客户'">
            <div class="enterprise-data">
              <div class="box-width">
                <span>统一社会信用代码:</span>
                <span>{{overviewInfoData.creditCode}}</span>
              </div>
              <div class="box-width">
                <span>法人姓名:</span>
                <span>{{overviewInfoData.legalPersonName}}</span>
              </div>
              <div class="box-width">
                <span>企业通过认证日期:</span>
                <span>{{overviewInfoData.approvedTime}}</span>
              </div>
            </div>
            <div class="agent-sign" v-if="this.userRole === 'admin'">
              <!-- <span class="agent-icon"></span> -->
              <svg-icon iconClass='dls_sy_gys' className='agent-icon'></svg-icon>
              <span>代理商名称: </span>
              <span>{{overviewInfoData.agentName}}</span>
            </div>
          </div>
        </div>
      </slot>
      <div class="admin-attestation" v-if="!userId">
        <p class="title title__top">账户信息</p>
        <div class="message">
          <ul>
            <li>姓名</li>
            <li>{{managerInfoData.realName}}</li>
            <li>身份证号码</li>
            <li>{{managerInfoData.idNumber}}</li>
            <li>手机号码</li>
            <li>{{managerInfoData.userName}}</li>
          </ul>
          <ul>
            <li>邮箱</li>
            <li style="width: 951px">
              {{managerInfoData.email}}
              <!-- <el-button v-if="canChangeEmail" size="mini" style="margin: 7px" @click="showChangeEmail">修改</el-button> -->
            </li>
          </ul>
        </div>
      </div>
      <div class="change-phone-dialog">
        <el-dialog center title="更改手机" :visible.sync="changePhoneDialogShow" width="568px" top="290px">
          <p class="prompt">为了您的账号安全, 请先进行身份验证</p>
          <el-form class="change-phone">
            <el-form-item>
              <el-input class="phone-input" v-model="telephoneNumber" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input class="code-input" v-model="codeInfo.oldCsrfCode" placeholder="请输入短信验证码"></el-input>
              <el-button class="verification-code" :disabled="!codeStatus" @click="getOldCode">
                {{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="basicInfoNextActive" class="next-button" @click="changePhoneNext">下一步
            </el-button>
          </div>
        </el-dialog>
        <el-dialog center title="绑定新手机" :visible.sync="newPhoneDialogShow" width="568px" top="290px">
          <p class="prompt">为了您的账号安全, 请先进行身份验证</p>
          <el-form class="change-phone">
            <el-form-item>
              <el-input class="phone-input" v-model="newTelephoneNumber" placeholder="请输入新手机号码" @blur="verifyMobile">
              </el-input>
              <transition name="el-fade-in-linear">
                <div v-if="errorWarning.userNameeFormatError" class="error-warning">
                  <i class="el-icon-warning error-icon-warning"></i>
                  <span class="login-error">手机号码有误</span>
                </div>
              </transition>
            </el-form-item>
            <el-form-item style="margin-top: 4px;">
              <el-input class="code-input" v-model="codeInfo.newCsrfCode" placeholder="请输入短信验证码"></el-input>
              <el-button class="verification-code" :disabled="!codeStatus" @click="getNewCode">
                {{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="basicInfoActive" class="next-button" @click="newTelephoneConfirm">确定
            </el-button>
          </div>
        </el-dialog>
        <el-dialog center title="更改邮箱" :visible.sync="changeEmailDialogShow" width="568px" top="290px">
          <p class="prompt"></p>
          <el-form class="change-phone">
            <el-form-item>
              <el-input class="phone-input" v-model="email"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="basicInfoEmailActive" class="next-button" @click="changeEmail">修改
            </el-button>
          </div>
        </el-dialog>
      </div>
      <div class="company-attestation">
        <p class="title title__top">企业信息</p>
        <div class="message">
          <ul style="height: 43px">
            <li>企业名称</li>
            <el-tooltip v-if="longName" class="item" effect="dark" :content="enterpriseInfoData.name" placement="top">
              <li class="long-name">{{enterpriseInfoData.name}}</li>
            </el-tooltip>
            <li v-else class="long-name">{{enterpriseInfoData.name}}</li>
            <li>企业证件类型</li>
            <li>{{enterpriseInfoData.isTern?'三证合一企业':'普通营业执照企业'}}</li>
            <li v-if="enterpriseInfoData.isTern">统一社会信用代码</li>
            <li v-if="enterpriseInfoData.isTern">{{enterpriseInfoData.creditCode}}</li>
            <li v-if="!enterpriseInfoData.isTern">营业执照注册号</li>
            <li v-if="!enterpriseInfoData.isTern">{{enterpriseInfoData.creditCode}}</li>
            <!-- <li>企业注册资本(万元)</li>
            <li>{{enterpriseInfoData.registeredCapital}}</li> -->
          </ul>
          <ul style="height: 43px" v-if="!enterpriseInfoData.isTern">
            <li>组织机构代码</li>
            <li class="long-name">{{enterpriseInfoData.organizationalCode}}</li>
            <li>税务登记证号</li>
            <li>{{enterpriseInfoData.taxRegistrationCertificate}}</li>
            <li>营业执照有效期</li>
            <li>{{enterpriseInfoData.termValidity}}</li>
          </ul>
          <ul style="height: 43px">
            <li>注册资本</li>
            <li>{{enterpriseInfoData.registeredCapital | toThousands}} 万元</li>
            <li v-if="enterpriseInfoData.isTern">营业执照有效期</li>
            <li v-if="enterpriseInfoData.isTern">{{enterpriseInfoData.termValidity}}</li>
            <li>固定电话</li>
            <li>{{enterpriseInfoData.landLinePhone}}</li>
            <li v-if="!enterpriseInfoData.isTern">行业</li>
            <el-tooltip effect="light" placement="top"
              v-if="!enterpriseInfoData.isTern && enterpriseInfoData.industry.length>13">
              <div slot="content">{{enterpriseInfoData.industry}}</div>
              <li>{{enterpriseInfoData.industry.substring(0, 13) + '...'}}</li>
            </el-tooltip>
            <li v-if="!enterpriseInfoData.isTern && enterpriseInfoData.industry.length<=13">
              {{enterpriseInfoData.industry}}</li>
          </ul>
          <ul style="height: 43px;" v-if="enterpriseInfoData.isTern">
            <li>企业类型</li>
            <li style="width: 578px;">{{enterpriseInfoData.enterpriseType | toEnterpriseType}}</li>
            <li>行业</li>
            <el-tooltip effect="light" placement="top" v-if="enterpriseInfoData.industry.length>13">
              <div slot="content">{{enterpriseInfoData.industry}}</div>
              <li>{{enterpriseInfoData.industry.substring(0, 13) + '...'}}</li>
            </el-tooltip>
            <li v-else>{{enterpriseInfoData.industry}}</li>
          </ul>
          <ul style="height: 43px;" v-if="!enterpriseInfoData.isTern">
            <li>企业类型</li>
            <li style="width: 951px;">{{enterpriseInfoData.enterpriseType | toEnterpriseType}}</li>
          </ul>
          <ul style="height: 43px;">
            <li>注册地址</li>
            <li style="width: 951px;">{{enterpriseInfoData.registeredAddress}}</li>
          </ul>
          <ul style="height: 43px">
            <li>经营地址</li>
            <li style="width: 951px;">{{enterpriseInfoData.businessAddress}}</li>
          </ul>
          <ul style="height: 43px;marginBottom:28px">
            <li>经营范围</li>
            <el-tooltip effect="light" placement="top" v-if="enterpriseInfoData.businessScope.length>60">
              <div slot="content" style="width:400px">{{enterpriseInfoData.businessScope}}</div>
              <li style="width: 951px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;">{{enterpriseInfoData.businessScope}}</li>
            </el-tooltip>
            <li style="width: 951px;" v-else>{{enterpriseInfoData.businessScope}}</li>
          </ul>
          <!-- 法人信息 -->
          <p class="title title__top"> 法人信息</p>
          <ul style="height: 43px">
            <li>法人姓名</li>
            <li>{{corporationData.legalPersonName}}</li>
            <li>证件类型</li>
            <li>{{corporationData.legalCertype}}</li>
            <li>证件号</li>
            <li>{{corporationData.legalPersonIdNumber}}</li>
          </ul>
          <ul style="height: 43px;marginBottom:28px">
            <li>证件有效期</li>
            <li>{{corporationData.legalCertDate}}</li>
            <li>法人手机号</li>
            <li>{{corporationData.legalMobile}}</li>
            <li> </li>
            <li> </li>
          </ul>
          <p class="title title__top" v-if="shareholderListData.length>0 && userRole !== 'admin'"> 股东信息</p>
          <!-- 股东信息 -->
          <div v-if="shareholderListData.length>0 && userRole !== 'admin'">
            <div style="marginBottom:28px;borderTop:1px solid #e6e6e6;" v-for="(item,index) in shareholderListData"
              :key="index">
              <ul style="height: 43px">
                <li>股东姓名</li>
                <li>{{item.custName}}</li>
                <li>证件类型</li>
                <li>{{item.certType}}</li>
                <li>证件号</li>
                <li>{{item.certId}}</li>
              </ul>
              <ul style="height: 43px">
                <li>股份占比</li>
                <li>{{item.ratio}}%</li>
                <li>联系地址</li>
                <li style="width: 578px;">{{item.shareholderAddr}}</li>
              </ul>
            </div>
          </div>
          <p class="title title__top">企业联系人</p>
          <!-- 企业联系人 -->
          <ul style="height: 43px;marginBottom:28px">
            <li>企业联系人</li>
            <li>{{contractData.contactName}}</li>
            <li>联系人手机号</li>
            <li>{{contractData.contactMobile}}</li>
            <li>联系人邮箱</li>
            <li>{{contractData.contactEmail}}</li>
          </ul>
          <p class="title title__top" v-if="userRole !== 'admin'">银行对公账户信息</p>
          <!--银行对公账户信息 -->
          <ul style="height: 43px" v-if="userRole !== 'admin'">
            <li>开户银行账户名</li>
            <el-tooltip effect="light" placement="top" v-if="bankData.bankAccountName.length>12">
              <div slot="content">{{bankData.bankAccountName}}</div>
              <li>{{bankData.bankAccountName.substring(0, 12) + '...'}}</li>
            </el-tooltip>
            <li v-else>{{bankData.bankAccountName}}</li>
            <li>开户银行账号</li>
            <li>{{bankData.bankAccountCode}}</li>
            <li>开户银行</li>
            <li>{{bankData.bankName}}</li>
          </ul>
          <ul style="height: 43px;marginBottom:28px" v-if="userRole !== 'admin'">
            <li>开户银行省份</li>
            <li>{{bankData.province}}</li>
            <li>开户银行地区</li>
            <li>{{bankData.address}}</li>
            <li>开户银行支行名称</li>
            <li>{{bankData.bankBranchName}}</li>
          </ul>
          <!-- 附件资料 -->
          <p class="title title__top">附件资料</p>
          <ul style="height:372px">
            <li class="admin-imgs" style="width:100%;height:372px;background:#ffffff">
              <dl class="imgs" style="marginLeft:33px">
                <dt class="img-name">法人身份证人像面</dt>
                <dt>
                  <viewer>
                    <img :src="legalPersonIdFront" class="img-box" width='300'>
                  </viewer>
                </dt>
              </dl>
              <dl class="imgs">
                <dt class="img-name">法人身份证国徽面</dt>
                <dt>
                  <viewer>
                    <img :src="legalPersonIdBack" class="img-box" width='300'>
                  </viewer>
                </dt>
              </dl>
              <dl class="imgs"> </dl>
              <dl class="imgs"> </dl>
              <div>
                <dl class="imgs" style="marginLeft:33px">
                  <dt class="img-name">企业营业执照</dt>
                  <dt>
                    <viewer>
                      <img :src="businessLicence" class="img-box" width='300'>
                    </viewer>
                  </dt>
                </dl>
                <dl class="imgs" v-if="!enterpriseInfoData.isTern">
                  <dt class="img-name">组织机构代码</dt>
                  <dt>
                    <viewer>
                      <img :src="organizationalCode" class="img-box" width='300'>
                    </viewer>
                  </dt>
                </dl>
                <dl class="imgs" v-if="!enterpriseInfoData.isTern">
                  <dt class="img-name">税务登记证</dt>
                  <dt>
                    <viewer>
                      <img :src="taxRegistrationCertificate" class="img-box" width='300'>
                    </viewer>
                  </dt>
                </dl>
                <dl class="imgs" v-if="userRole !== 'admin' && userRole !== 'agent'">
                  <dt class="img-name">银行开户许可证</dt>
                  <dt>
                    <viewer>
                      <img :src="openAccountSingle" class="img-box" width='300'>
                    </viewer>
                  </dt>
                </dl>
              </div>
            </li>
          </ul>
          <!--服务商/代理商信息 -->
          <p class="title title__top" style="marginTop:20px"
            v-if=" !userId && this.userRole !== 'admin' && this.userRole !== 'service' && this.userRole !== 'allocator'">服务商/代理商信息</p>
          <ul style="height: 43px" v-if=" !userId && this.userRole !== 'admin' && this.userRole !== 'service' && this.userRole !== 'allocator'">
            <li>服务商名称</li>
            <li style="width:391px">{{agentInfoData.adminName}}</li>
            <li>联系电话</li>
            <li style="width:391px">{{agentInfoData.adminLandLinePhone}}</li>
          </ul>
          <ul style="height: 43px;marginBottom:50px"
            v-if=" !userId && this.userRole !== 'admin' && this.userRole !== 'agent' && this.userRole !== 'service' && this.userRole !== 'allocator'">
            <li>代理商名称</li>
            <li style="width:391px">{{agentInfoData.agentName}}</li>
            <li>联系电话</li>
            <li style="width:391px">{{agentInfoData.agentLandLinePhone}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="img-layer" v-if="imgShow" @click="close(closeImg)"></div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false"
      width="30%" top="420px">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="precent"></el-progress>
    </el-dialog>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
export default {
  name: 'enterpriseDetail',
  props: {
    // 是否可修改手机号
    canChangePhoneNum: {
      type: Boolean,
      default: false
    },
    // 是否可修改邮箱
    canChangeEmail: {
      type: Boolean,
      default: false
    },
    // title是否显示返回按钮
    isShowBack: {
      type: Boolean,
      default: false
    },
    // title文案
    title: {
      type: String,
      default: '企业信息'
    },
    // 列表序号查询企业信息使用,查询自己不用传
    Id: {
      type: Number,
      default: 1
    },
    // 用户标签
    tag: {
      type: String,
      default: ''
    },
    // 用户标签背景颜色
    tagColor: {
      type: String,
      default: '#22b9aa'
    },
    userId: {
      type: String,
      default: ''
    },
    isAudit: {
      type: Boolean,
      default: false
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  components: { BusinessTitle },
  data () {
    return {
      toolbar: false,
      closeImg: '',
      imgBigshow: [false],
      imgShow: false,
      // 概览信息
      overviewInfoData: {
        name: '',
        // 企业统一社会信用代码
        creditCode: '',
        // 企业法人姓名
        legalPersonName: null,
        // 企业通过认证日期
        approvedTime: '',
        // 累计发行金额
        totalDeposit: '',
        // 时不用
        currency: ''
      },
      // 管理员信息
      managerInfoData: {
        // 管理员手机号码
        userName: null,
        // 管理员姓名
        realName: null,
        // 管理员身份证号码
        idNumber: null,
        // 管理员邮箱
        email: null,
        // 注册日期
        registerTime: ''
      },
      // 企业信息
      enterpriseInfoData: {
        businessAddress: '',
        businessScope: '',
        creditCode: '',
        industry: '',
        isTern: '',
        landLinePhone: '',
        name: '',
        organizationalCode: '',
        registeredAddress: '',
        registeredCapital: '',
        taxRegistrationCertificate: '',
        termValidity: ''
      },
      // 法人信息
      corporationData: {
        legalCertDate: '',
        legalCertype: '',
        legalMobile: '',
        legalPersonIdNumber: '',
        legalPersonName: ''
      },
      // 企业联系人
      contractData: {
        contactEmail: '',
        contactMobile: '',
        contactName: ''
      },
      // 银行信息
      bankData: {
        address: '',
        bankAccountCode: '',
        bankAccountName: '',
        bankBranchName: '',
        bankName: '',
        province: ''
      },
      // 附件资料
      attachmentData: {
        businessLicenceAddress: {
          name: '',
          fileId: ''
        },
        legalPersonIdBackAddress: {
          name: '',
          fileId: ''
        },
        legalPersonIdFrontAddress: {
          name: '',
          fileId: ''
        },
        openAccountSingleAddress: {
          name: '',
          fileId: ''
        },
        organizationalCodeAddress: {
          name: '',
          fileId: ''
        },
        taxRegistrationCertificateAddress: {
          name: '',
          fileId: ''
        }
      },
      // 代理商信息
      agentInfoData: {
        agentName: '',
        agentLandLinePhone: '',
        adminName: '',
        adminLandLinePhone: ''
      },
      // 股东信息
      shareholderListData: [],
      // 审核拒绝原因
      refusalReason: '',
      // 审核状态
      adminAuditStatus: '',
      thirdPartyAuditStatus: '',
      operatorAuditTime: '',
      thirdPartyAuditTime: '',
      // 验证码信息
      codeInfo: {
        // 第一个弹框验证码信息
        oldCsrfCode: '',
        // 第二个弹框验证码信息
        newCsrfCode: ''
      },
      // 错误提示
      errorWarning: {
        userNameeError: false,
        userNameeFormatError: false,
        smsCodeError: false
      },
      // 更改手机弹窗
      changePhoneDialogShow: false,
      // 绑定新手机弹窗
      newPhoneDialogShow: false,
      // 修改邮箱弹窗
      changeEmailDialogShow: false,
      // 下载凭证接口
      downloadCodeUrl: settings.apiGateway.downloadCode,
      // 下载接口
      downloadUrl: settings.downloadUrl,
      // 下载文件的名称
      fileId: '',
      // 头部信息
      Header: '',
      // 返回的code
      code: '',
      // 文件名
      fileName: '',
      // 进度
      precent: 0,
      // 弹窗
      dialogVisible: false,
      // dialog title
      dialogTitle: '准备下载',
      // 身份证正面绑定的 ref
      legalPersonIdFront: '',
      // 身份证背面绑定的 ref
      legalPersonIdBack: null,
      // 企业营业执照的 ref
      businessLicence: null,
      openAccountSingle: null,
      organizationalCode: null,
      taxRegistrationCertificate: null,
      // 电话号码
      telephoneNumber: '',
      // 邮箱
      email: '',
      // 绑定新手机号码
      newTelephoneNumber: '',
      // 验证码状态
      codeStatus: true,
      // 验证码获取间隔
      codeTime: 60,
      // 企业名称过长 超出隐藏 鼠标划过显示
      longName: false,
      // 账户信息 Url
      getAccountInfoUrl: settings.apiGateway.getAccountInfo,
      // 发送短信验证码
      getSendCodeUrl: settings.apiGateway.adminSmsCode,
      // 验证旧手机验证码
      getValidMobileUrl: settings.apiGateway.getValidMobile,
      // 确定绑定新手机
      getModifyMobileUrl: settings.apiGateway.getModifyMobile,
      // 修改邮箱
      getModifyEmailUrl: settings.apiGateway.getModifyEmail,
      // 获取企业审核信息详情
      auditEnterpriseDetailUrl: settings.apiGateway.auditEnterpriseDetail
    }
  },
  created () {
    if (this.isAudit) {
      this.getAuditEnterpriseDetail()
    } else {
      this.getAccountInfoData()
    }
    this.userRole = this.getUserRole()
  },
  methods: {
    close (index) {
      this.imgShow = false
      this.imgBigshow[index] = false
    },
    // 获取图片 code方法
    getCode (imgId, type) {
      this.fileId = imgId
      if (!this.fileId) return
      this.fetch(`${this.downloadCodeUrl}/${imgId}`).then(data => {
        this.Header = data.data.token
        this.code = data.data.code
        this.setImgHeader(type, this.Header, this.code)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取文件名失败！'
        })
      })
    },
    setImgHeader (nameImg, header, code) {
      this.axios({
        url: this.downloadUrl,
        params: { code: code },
        headers: {
          'FileToken': `Bearer ${header}`
        },
        responseType: 'blob'
      }).then(data => {
        function blobToDataURL (blob, callback) {
          var a = new FileReader()
          a.onload = function (e) {
            callback(e.target.result)
          }
          a.readAsDataURL(blob)
        }
        blobToDataURL(data.data, (result) => {
          if (nameImg === 'legalPersonIdFront') {
            this.legalPersonIdFront = result
          } else if (nameImg === 'legalPersonIdBack') {
            this.legalPersonIdBack = result
          } else if (nameImg === 'businessLicence') {
            this.businessLicence = result
          } else if (nameImg === 'openAccountSingle') {
            this.openAccountSingle = result
          } else if (nameImg === 'organizationalCode') {
            this.organizationalCode = result
          } else if (nameImg === 'taxRegistrationCertificate') {
            this.taxRegistrationCertificate = result
          }
        })
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取code失败！'
        })
      })
    },
    // 法人身份证正面
    getLegalPersonIdFront () {
      if (this.attachmentData.legalPersonIdFrontAddress) {
        this.fileId = this.attachmentData.legalPersonIdFrontAddress.fileId
        this.getCode(this.fileId, 'legalPersonIdFront')
      }
    },
    // 法人身份证反面
    getLegalPersonIdBack () {
      if (this.attachmentData.legalPersonIdBackAddress) {
        this.fileId = this.attachmentData.legalPersonIdBackAddress.fileId
        this.getCode(this.fileId, 'legalPersonIdBack')
      }
    },
    // 营业执照
    getBusinessLicence () {
      if (this.attachmentData.businessLicenceAddress) {
        this.fileId = this.attachmentData.businessLicenceAddress.fileId
        this.getCode(this.fileId, 'businessLicence')
      }
    },
    getOpenAccountSingle () {
      if (this.attachmentData.openAccountSingleAddress) {
        this.fileId = this.attachmentData.openAccountSingleAddress.fileId
        this.getCode(this.fileId, 'openAccountSingle')
      }
    },
    getOrganizationalCode () {
      if (this.attachmentData.organizationalCodeAddress) {
        this.fileId = this.attachmentData.organizationalCodeAddress.fileId
        this.getCode(this.fileId, 'organizationalCode')
      }
    },
    getTaxRegistrationCertificate () {
      if (this.attachmentData.taxRegistrationCertificateAddress) {
        this.fileId = this.attachmentData.taxRegistrationCertificateAddress.fileId
        this.getCode(this.fileId, 'taxRegistrationCertificate')
      }
    },
    // 获取账户信息
    getAccountInfoData () {
      let getAccountInfoUrl = this.getAccountInfoUrl
      getAccountInfoUrl = this.userId ? `${getAccountInfoUrl}?eid=${this.userId}` : getAccountInfoUrl
      this.fetch(getAccountInfoUrl).then(data => {
        this.overviewInfoData = data.data.overviewInfo
        this.managerInfoData = data.data.managerInfo
        this.enterpriseInfoData = data.data.enterpriseInfo
        this.corporationData = data.data.corporation
        this.contractData = data.data.contract
        this.bankData = data.data.bank
        this.attachmentData = data.data.attachment
        this.shareholderListData = data.data.shareholderList
        this.agentInfoData = data.data.agentInfo
        if (this.enterpriseInfoData.name.length > 13) {
          this.longName = true
        }
        if (this.enterpriseInfoData.isTern) {
          // 获取法人身份证正面code
          this.getLegalPersonIdFront()
          // 获取法人身份证背面code
          this.getLegalPersonIdBack()
          // 获取营业执照code
          this.getBusinessLicence()
          this.getOpenAccountSingle()
        } else {
          this.getLegalPersonIdFront()
          this.getLegalPersonIdBack()
          this.getBusinessLicence()
          this.getOpenAccountSingle()
          this.getOrganizationalCode()
          this.getTaxRegistrationCertificate()
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    getAuditEnterpriseDetail () {
      this.fetch(`${this.auditEnterpriseDetailUrl}${this.Id}`).then(data => {
        this.managerInfoData = data.data.adminAuthDetail
        this.enterpriseInfoData = data.data.enterpriseInfo
        this.corporationData = data.data.corporation
        this.contractData = data.data.contract
        this.bankData = {}
        this.attachmentData = data.data.attachment
        this.shareholderListData = []
        this.adminAuditStatus = data.data.adminAuditStatus
        this.thirdPartyAuditStatus = data.data.thirdPartyAuditStatus
        this.operatorAuditTime = data.data.operatorAuditTime
        this.thirdPartyAuditTime = data.data.thirdPartyAuditTime
        this.refusalReason = data.data.refusalReason
        if (this.enterpriseInfoData.name.length > 13) {
          this.longName = true
        }
        if (this.enterpriseInfoData.isTern) {
          // 获取法人身份证正面code
          this.getLegalPersonIdFront()
          // 获取法人身份证背面code
          this.getLegalPersonIdBack()
          // 获取营业执照code
          this.getBusinessLicence()
          this.getOpenAccountSingle()
        } else {
          this.getLegalPersonIdFront()
          this.getLegalPersonIdBack()
          this.getBusinessLicence()
          this.getOpenAccountSingle()
          this.getOrganizationalCode()
          this.getTaxRegistrationCertificate()
        }
        this.$emit('statusData', {
          adminAuditStatus: this.adminAuditStatus,
          operatorAuditTime: this.operatorAuditTime,
          thirdPartyAuditTime: this.thirdPartyAuditTime,
          thirdPartyAuditStatus: this.thirdPartyAuditStatus,
          refusalReason: this.refusalReason,
          eid: data.data.eid,
          creditCode: this.enterpriseInfoData.creditCode
        })
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 修改手机
    changePhone () {
      this.telephoneNumber = `请使用手机 ${this.managerInfoData.userName} 验证`
      this.codeInfo.oldCsrfCode = ''
      this.codeInfo.newCsrfCode = ''
      this.newTelephoneNumber = ''
      this.changePhoneDialogShow = true
    },
    // 请求验证码接口
    getOldCode () {
      this.codeCountDown()
      this.fetch(`${this.getSendCodeUrl}/${this.managerInfoData.userName}`, 'post').then(data => {
        this.$message.success('发送成功,请注意查收!')
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    // 第二次发送验证码
    getNewCode () {
      if (!this.newTelephoneNumber) {
        this.$message({
          type: 'error',
          message: '请填写手机号'
        })
        return
      }
      let reg = /^1[3578][0-9]{9}$/
      if (!reg.test(this.newTelephoneNumber)) {
        this.errorWarning.userNameeFormatError = true
        setTimeout(() => {
          this.errorWarning.userNameeFormatError = false
        }, 2000)
        return
      }
      this.fetch(`${this.getSendCodeUrl}/${this.newTelephoneNumber}`, 'post').then(data => {
        this.$message.success('发送成功,请注意查收!')
        this.codeCountDown()
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    // 验证码倒计时
    codeCountDown () {
      let time = setTimeout(() => {
        this.codeTime--
        this.codeStatus = false
        if (this.codeTime < 1) {
          this.codeStatus = true
          this.codeTime = 60
        } else {
          this.codeCountDown()
        }
        clearTimeout(time)
      }, 1000)
    },
    // 验证旧手机验证码 (第一个弹窗的下一步按钮)
    changePhoneNext () {
      this.fetch(`${this.getValidMobileUrl}/${this.managerInfoData.userName}/${this.codeInfo.oldCsrfCode}`, 'post').then(data => {
        this.changePhoneDialogShow = false
        this.newPhoneDialogShow = true
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 检测手机号格式
    verifyMobile () {
      let reg = /^1[3578][0-9]{9}$/
      if (!reg.test(this.newTelephoneNumber)) {
        this.errorWarning.userNameeFormatError = true
        setTimeout(() => {
          this.errorWarning.userNameeFormatError = false
        }, 2000)
      }
    },
    // 确定绑定新手机 (确定按钮)
    newTelephoneConfirm () {
      this.fetch(`${this.getModifyMobileUrl}/${this.newTelephoneNumber}/${this.codeInfo.oldCsrfCode}/${this.codeInfo.newCsrfCode}`, 'post').then(data => {
        this.newPhoneDialogShow = false
        if (data.code === 0) {
          // 显示成功弹层
          this.popUpSuccess({
            text: '新手机绑定成功',
            okBtn: '确定',
            ok: () => {
              if (this.userRole === 'agent') {
                this.$router.push('/agent/basic-information')
              } else {
                this.$router.push('/basic-information')
              }
              this.getAccountInfoData()
            }
          })
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 显示修改邮箱
    showChangeEmail () {
      this.email = this.managerInfoData.email
      this.changeEmailDialogShow = true
    },
    // 修改邮箱
    changeEmail () {
      let emailReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/i
      if (!emailReg.test(this.email)) {
        this.$message.error('请输入正确的邮箱')
        return
      }
      this.fetch(`${this.getModifyEmailUrl}`, 'put', { 'email': this.email }).then(data => {
        if (data.code === 0) {
          this.managerInfoData.email = this.email
          this.changeEmailDialogShow = false
          this.$message.success('修改成功')
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    }
  },
  computed: {
    // 第一个弹框
    basicInfoNextActive () {
      if (this.codeInfo.oldCsrfCode) {
        return false
      } else {
        return true
      }
    },
    // 第二个弹框
    basicInfoActive () {
      if (this.codeInfo.newCsrfCode) {
        return false
      } else {
        return true
      }
    },
    // 修改邮箱的按钮是否可用
    basicInfoEmailActive () {
      if (this.email) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.basic-info-main {
  width: 100%;
  min-width: 1120px;
  .approve-passed {
    width: 100%;
    height: 42px;
    line-height: 42px;
    padding-left: 34px;
    margin-top: 33px;
    border: 1px solid #e6e6e6;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
    .passed-icon {
      color: #8acd3f;
      width: 22px;
      height: 22px;
    }
  }
  .approve-rejected {
    width: 100%;
    height: 66px;
    line-height: 33px;
    padding-left: 34px;
    margin-top: 33px;
    border: 1px solid #e6e6e6;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
    .passed-icon {
      color: #ec5053;
      width: 22px;
      height: 22px;
    }
  }
  .basic-info-content {
    width: 1120px;
    margin: 0 auto;
    .company-detail {
      margin-top: 22px;
      height: 137px;
      border: 1px solid #e1e1e1;
      background: #fcfcfc;
      .enterprise-name {
        width: 100%;
        text-align: center;
        padding-top: 29px;
        font-size: 17px;
        font-weight: 600;
        color: #656565;
      }
      .box-width {
        width: 270px;
        text-align: center;
      }
      .agent-sign {
        width: 100%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        margin-top: 20px;
        border: 1px solid #e6e6e6;
        background: #fffaf7;
        .agent-icon {
          vertical-align: middle;
          display: inline-block;
          vertical-align: middle;
          width: 31px !important;
          height: 31px !important;
          // color:#91815F
        }
      }
    }
    .title {
      width: 100%;
      height: 42px;
      line-height: 42px;
      background: #e5e5e5;
      text-align: center;
    }
    .title__top {
      font-weight: 600;
    }
    .message {
      border-left: 1px solid #e6e6e6;
      _height: 383px;
      margin-bottom: 40px;
      li {
        float: left;
        width: 150px;
        height: 42px;
        line-height: 42px;
        border-bottom: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        color: rgba(101, 101, 101, 1);
        &:nth-of-type(2n + 1) {
          text-align: center;
          background: #fcfcfc;
        }
        &:nth-of-type(2n) {
          padding-left: 16px;
          width: 205px;
        }
      }
      .admin-imgs {
        min-height: 183px;
        height: 183px;
      }
      .long-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .admin-attestation {
      width: 100%;
      border-left: 1px solid #e6e6e6;
      box-sizing: content-box;
      margin: 27px 0;
      // height: 300px;
      overflow-y: auto;
      .el-button {
        border: none;
        background-color: @theme-blue;
        background-color: var(--mainColor);
        color: #ffffff;
      }
    }
    .company-attestation {
      //min-height: 500px;
      // height: 570px;
      margin-top: 25px;
      .imgs {
        float: left;
        height: 144px;
        width: 184px;
        padding-top: 17px;
        margin-right: 40px;
        cursor: pointer;
        .img-box {
          width: 175px;
          height: 111px;
          border: 3px solid #f5f5f5;
          cursor: pointer;
        }
        .img-name {
          padding-top: 15px;
          text-align: left;
          height: 14px;
          color: rgba(101, 101, 101, 1);
          line-height: 14px;
          margin-bottom: 14px;
          cursor: pointer;
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
        }
      }
      .img-message {
        width: 100%;
        height: 100%;
        transform: scale(1);
        transition: all ease 0.5s;
        cursor: pointer;
      }
      .big-img {
        width: 1000px;
        height: 1000px;
        display: block;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 1000;
        cursor: pointer;
        text-align: center;
        .img-message-big {
          width: 100%;
          height: 100%;
          z-index: 1000;
          cursor: pointer;
        }
      }
      .download {
        cursor: pointer;
        color: #118eea;
        text-decoration: underline;
      }
    }
    .agent-attestation {
      height: 150px;
      margin-top: 30px;
      .title {
        width: 100%;
        height: 42px;
        line-height: 42px;
        background: #e5e5e5;
        text-align: center;
      }
      .title__top {
        font-weight: 600;
      }
      .long-name {
        width: 500px;
      }
    }
    .change-phone-dialog {
      .error-warning {
        position: absolute;
        top: 68px;
        .login-error {
          color: #f27072;
          margin-left: 5px;
          font-size: 15px;
          letter-spacing: 1px;
        }
        .error-icon-warning {
          margin-left: 57px;
          font-size: 18px;
          color: #f2706e;
          vertical-align: initial;
        }
      }
      .prompt {
        text-align: center;
        color: #b6b6b6;
        font-size: 14px;
      }
      .change-phone {
        .el-form-item {
          width: 403px;
          margin: 0 auto;
        }
        //padding-left:58px;
        .phone-input {
          width: 100%;
          text-align: center;
          margin-bottom: 29px;
          margin-top: 25px;
        }
        .code-input {
          width: 290px;
        }
      }
      .verification-code {
        width: 108px;
        height: 45px;
        background: #f4f4f4;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
      }
      .el-button.is-disabled {
        color: #858585;
        background-color: @btn-bg-disabeled;
        border-color: @btn-bg-disabeled;
      }
      .next-button {
        width: 403px;
        height: 50px;
        font-size: 18px;
        margin-top: -3px;
        border: none;
        background-color: @theme-blue;
        background-color: var(--mainColor);
      }
    }
  }
  .img-layer {
    position: fixed;
    cursor: pointer;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>

<style>
.basic-info-content .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  /* line-height: 45px; */
}
.basic-info-content .el-form-item {
  margin-bottom: 0;
}
.basic-info-content .el-dialog .el-dialog__title {
  line-height: 0;
}
.basic-info-content .el-dialog__header {
  padding: 56px 20px 0;
}
.basic-info-content .el-dialog__wrapper .el-dialog {
  height: 387px;
}
.basic-info-content .el-dialog {
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
}
</style>
