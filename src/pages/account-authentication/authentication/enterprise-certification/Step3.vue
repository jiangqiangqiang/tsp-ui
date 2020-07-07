<template>
  <div class="no-business">
    <AuthenticationTitle :stepInfo="stepInfo"></AuthenticationTitle>
    <p class="reselect-enterorise"></p>
    <div v-loading="loadingShow" element-loading-text="" element-loading-spinner="el-icon-loading">
      <div class="enterprise-info-main">
        <div class="form_align">
          <el-form label-width="206px" label-paddingRight="80px" :model="submitData" class="enterprise-form">
            <!-- 企业信息 -->
            <div class="titleText">
              <div class="buyTableTitle">企业信息</div>
              <div class="dotted"></div>
            </div>
            <div style="height:99px"></div>
            <el-form-item label="企业名称" required>
              <el-input v-model="submitData.name" placeholder="请输入企业名称" @blur="verifyEnp" :disabled="checkEid">
              </el-input>
              <div v-if="errorWarning.enpError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">{{errorTextEnp}}</span>
              </div>
            </el-form-item>
            <el-form-item label="企业类型" required>
              <el-select v-model="submitData.caType" placeholder="请选择企业类型" style="width:400px">
                <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业证照类型" required>
              <el-select v-model="licenceType" style="width:400px" @change='licenceChange' :disabled="checkEid">
                <el-option v-for="item in licenceOption" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="licenceType==='普通营业执照企业'?'营业执照注册号':'统一社会信用代码'" required>
              <el-input v-model="submitData.creditCode" :disabled="checkEid"
                :placeholder="licenceType==='普通营业执照企业'?'请输入营业执照注册号':'请输入统一社会信用代码'" @blur="verifyCreditCode"></el-input>
              <div v-if="errorWarning.creditCodeError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">{{errorTextCode}}</span>
              </div>
            </el-form-item>
            <el-form-item label="组织机构代码" v-if="licenceType==='普通营业执照企业'" required>
              <el-input v-model="submitData.organizationalCode" placeholder="请输入组织机构代码证号，格式为：xxxxxxxx-X"
                @blur="verifyCreditCode1">
              </el-input>
              <div v-if="errorWarning.organizationalCodeError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">{{creditCode1Text}}</span>
              </div>
            </el-form-item>
            <el-form-item label="税务登记证号" v-if="licenceType==='普通营业执照企业'" required>
              <el-input v-model="submitData.taxRegistrationCertificate" placeholder="请输入税务登记证号"
                @blur="verifyCreditCode2"></el-input>
              <div v-if="errorWarning.taxRegistrationCertificateError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">{{creditCode2Text}}</span>
              </div>
            </el-form-item>
            <el-form-item label="企业经营地址" required>
              <el-input v-model="submitData.businessAddress" placeholder="请输入企业经营地址" autocomplete="address-level3">
              </el-input>
              <div v-if="checkBusinessAddress" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">经营地址不能超过250位字节</span>
              </div>
            </el-form-item>
            <el-form-item label="企业注册地址" required>
              <el-input v-model="submitData.registeredAddress" placeholder="请输入企业注册地址" autocomplete="address-level3">
              </el-input>
              <div v-if="checkRegisteredAddress" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">注册地址不能超过250位字节</span>
              </div>
            </el-form-item>
            <el-form-item label="营业执照有效时间" required>
              <el-date-picker v-model="beginTime" type="date" :editable="false" @change="changeStart"
                placeholder="年/月/日" value-format="yyyy.MM.dd" :picker-options="pickerBeginDateBefore"
                style="width:194px;">
              </el-date-picker>
              <el-date-picker v-model="endTime" type="date" :editable="false" @change="changeEnd" placeholder="年/月/日"
                value-format="yyyy.MM.dd" :picker-options="pickerBeginDateAfter" style="width:194px;marginLeft:4px"
                :disabled="checked">
              </el-date-picker>
              <el-checkbox v-model="checked" class="checkRadio">永久</el-checkbox>
              <div v-if="errorWarning.licenceTimeError" class="error-warning" style="left:450px">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">输入有误</span>
              </div>
            </el-form-item>
            <el-form-item label="注册资本" required>
              <el-input maxlength="26" v-model="submitData.registeredCapital" placeholder="请输入企业注册资本"
                @blur="checkRegisteredCapital"></el-input>
              <span class="unit-price">万元</span>
              <div v-if="errorWarning.registeredCapitalError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">{{registerErrorText}}</span>
              </div>
            </el-form-item>
            <el-form-item label="固定电话" required>
              <el-input maxlength="20" v-model="submitData.landLinePhone" placeholder="请输入固定电话"
                @blur="checkRegisteredPhone" autocomplete="username"></el-input>
              <div v-if="errorWarning.registeredPhoneError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">企业电话不能为空且应小于15位</span>
              </div>
            </el-form-item>
            <el-form-item label="经营范围" required>
              <el-input v-model="submitData.businessScope" placeholder="请输入经营范围" type="textarea"></el-input>
              <div v-if="checkBusinessScope" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">经营范围不能超过1000位字节</span>
              </div>
            </el-form-item>
            <el-form-item label="行业" required>
              <el-select v-model="submitData.industry" placeholder="请选择行业" style="width:400px">
                <el-option v-for="item in industryOption" :key="item.value" :label="item.lable" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="控股股东（实际控制人）" required>
              <ul style="marginBottom:20px">
                <li class="addItemCard" v-for="(item,index) in shareholderList" :key='index'>
                  &nbsp;占比{{item.ratio}}%&nbsp;&nbsp;{{item.type===1?item.custName:item.corporateName}}
                  <i class="el-icon-close closeAdd" @click="closeAdd(index)"></i>
                </li>
              </ul>
              <Button class="addShareholder" @handleClick="addShareholder" title="添 加"></Button>
              <span class="shareholderAmind">注：有多个控股股东的可逐一添加填写；没有超过25%控股股东的，填写最大股东的信息。</span>
            </el-form-item>
            <!-- 法人信息 -->
            <div class="titleText">
              <div class="buyTableTitle">法人信息</div>
              <div class="dotted"></div>
            </div>
            <div style="height:99px"></div>
            <el-form-item label="法人姓名" required>
              <el-input v-model="submitData.legalPersonName" placeholder="请输入法人姓名" autocomplete="username" @blur="legalBlur"></el-input>
              <div v-if="errorWarning.adminNameError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">姓名输入有误</span>
              </div>
            </el-form-item>
            <el-form-item label="法人证件类型" required>
              <el-select v-model="submitData.legalCertype" placeholder="请选择法人证件类型" style="width:397px">
                <el-option v-for="item in idcardOption" :key="item.value" :label="item.lable" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码" required>
              <el-input v-model="submitData.legalPersonIdNumber" placeholder="请输入法人证件号码" @blur="verifyIdNum">
              </el-input>
              <div v-if="errorWarning.legalPersonIdNumberError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">{{personNumberError}}</span>
              </div>
            </el-form-item>
            <el-form-item label="证件有效期" required>
              <el-date-picker v-model="codeTimeStart" type="date" :editable="false" @change="changeStartCode"
                placeholder="年/月/日" value-format="yyyy.MM.dd" :picker-options="pickerDateBefore" style="width:194px;">
              </el-date-picker>
              <el-date-picker v-model="codeTimeEnd" type="date" :editable="false" @change="changeEndCode"
                placeholder="年/月/日" value-format="yyyy.MM.dd" :picker-options="pickerDateAfter"
                style="width:194px;marginLeft:4px" :disabled="codeChecked">
              </el-date-picker>
              <el-checkbox v-model="codeChecked" class="checkRadio">永久</el-checkbox>
              <div v-if="errorWarning.idCardTimeError" class="error-warning" style="left:450px">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">输入有误</span>
              </div>
            </el-form-item>
            <el-form-item label="法人手机号" required>
              <el-input v-model="submitData.legalMobile" placeholder="请输入手机号码" @blur="legalMobileBlur"></el-input>
              <div v-if="errorWarning.legalMobileError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">{{legalMobileText}}</span>
              </div>
            </el-form-item>
            <!-- 企业联系人信息 -->
            <div class="titleText">
              <div class="buyTableTitle">企业联系人信息 <span class="remindImg">（建议使用<span class="remindTop">财务负责人</span>信息，将用于接收提现短信验证码）</span></div>
              <div class="dotted"></div>
            </div>
            <div style="height:99px"></div>
            <el-form-item label="企业联系人" required>
              <el-input v-model="submitData.contactName" placeholder="请输入联系人姓名" autocomplete="username"></el-input>
              <div v-if="errorWarning.adminNameError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">姓名输入有误</span>
              </div>
            </el-form-item>
            <el-form-item label="联系人手机号" required>
              <el-input v-model="submitData.contactMobile" placeholder="请输入手机号码" @blur="contactMobileBlur"></el-input>
              <div v-if="errorWarning.contactMobileError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">{{contactMobileText}}</span>
              </div>
            </el-form-item>
            <el-form-item label="联系人邮箱" required>
              <el-input v-model="submitData.contactEmail" placeholder="请输入邮箱" @blur="contactEmailBlur"></el-input>
              <div v-if="errorWarning.contactEmailError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">{{contactEmailText}}</span>
              </div>
            </el-form-item>
            <!-- 资料上传 -->
            <div class="titleText">
              <div class="buyTableTitle">资料上传 <span class="remindImg">（上传图片字体能清楚辨认，证件必须盖有注册企业的 <span class="remindTop">有色公章</span> 证件需在有效期内，文件不超过1M，文件格式支持png，jpg，pdf）</span></div>
              <div class="dotted toTop"></div>
            </div>
            <div style="height:99px"></div>
          </el-form>
          <div class="imgContent">
            <!-- 身份证信息 -->
            <div class="uploadImg">
              <p class="upload-title">法人身份证个人信息面<span class="upload-sample" @click.stop="frontExamineSample">查看样例</span>
              </p>
              <span v-if="format" class="error-img"><i class="el-icon-warning"></i> 上传失败，请检查网络是否连接</span>
              <div class="init-img-main" v-if="initUpload1">
                <img class="init-img" ref="legalPersonIdFront" alt="法人身份证正面">
                <a class="init-img--close" @click="closeInitImg('initUpload1', 'legalPersonIdFrontAddress')">X</a>
              </div>
              <common-upload v-else :limit="1" :on-remove="loanApplyFormRemove" :on-success="legalPersonIdFrontAddress"
                :on-error="loanApplyFormFrontUploadFailed" :action="actionUrl" :canHidden="canHidden"
                list-type="picture-card" uploadType="1" :beforeRemove="beforeRemove">
                <img @click="upLoadClick(1)" src="~@/assets/img/ID-card-front.gif" alt="正面" style="margin-right: 26px">
              </common-upload>
            </div>
            <div class="uploadImg">
              <span v-if="reversFormat" class="error-img"><i class="el-icon-warning"></i> 上传失败，请检查网络是否连接</span>
              <p class="upload-title">法人身份证国徽面<span class="upload-sample" @click.stop="reverseExamineSample">查看样例</span>
              </p>
              <div class="init-img-main" v-if="initUpload2">
                <img class="init-img" ref="legalPersonIdBack" alt="法人身份证背面">
                <a class="init-img--close" @click="closeInitImg('initUpload2', 'legalPersonIdBackAddress')">X</a>
              </div>
              <common-upload v-else :limit="1" :on-remove="loanApplyFormRemove" :on-success="legalPersonIdBackAddress"
                :on-error="loanApplyFormUploadFailed" :action="actionUrl" :canHidden="canHidden"
                list-type="picture-card" uploadType="2" :beforeRemove="beforeRemove">
                <img src="~@/assets/img/ID-card-back.gif" alt="反面" style="margin-right: 26px">
              </common-upload>
            </div>
          </div>
          <!-- 营业执照信息 -->
          <div class="imgContent">
            <div class="uploadImg">
              <p class="upload-title">企业营业执照</p>
              <span v-if="LicenceFormat" class="error-img"><i class="el-icon-warning"></i> 上传失败，请检查网络是否连接</span>
              <div class="init-img-main" v-if="initUpload3">
                <img class="init-img" ref="businessLicence" alt="企业营业执照扫描件">
                <a class="init-img--close" @click="closeInitImg('initUpload3', 'businessLicenceAddress')">X</a>
              </div>
              <common-upload v-else :limit="1" :on-remove="loanApplyFormRemove" :on-success="businessLicenceAddress"
                :on-error="loanApplyFormLicenceUploadFailed" :action="actionUrl" :canHidden="canHidden"
                list-type="picture-card" :uploadType="licenceType==='普通营业执照企业'?'5':'4'" :file-list="fileList"
                :beforeRemove="beforeRemove">
                <img src="~@/assets/img/business-license.gif" alt="企业营业执照" style="margin-right: 26px">
              </common-upload>
            </div>
            <div class="uploadImg" v-if="licenceType==='普通营业执照企业'">
              <p class="upload-title">组织机构代码<span class="code_remind"></span>
              </p>
              <span v-if="organize" class="error-img"><i class="el-icon-warning"></i> 上传失败，请检查网络是否连接</span>
              <div class="init-img-main" v-if="initUpload4">
                <img class="init-img" ref="organizationalCode" alt="组织机构代码">
                <a class="init-img--close" @click="closeInitImg('initUpload4', 'organizationalCodeAddress')">X</a>
              </div>
              <common-upload v-else :limit="1" :on-remove="loanApplyFormRemove" :on-success="organizationalCodeAddress"
                :on-error="loanApplyFormFrontUploadFailed1" :action="actionUrl" :canHidden="canHidden"
                list-type="picture-card" uploadType="6" :beforeRemove="beforeRemove">
                <img @click="upLoadClick(1)" src="~@/assets/img/ID-card-front.gif" alt="正面" style="margin-right: 26px">
              </common-upload>
            </div>
            <div class="uploadImg" style="marginRight:0" v-if="licenceType==='普通营业执照企业'">
              <span v-if="certificate" class="error-img"><i class="el-icon-warning"></i> 上传失败，请检查网络是否连接</span>
              <p class="upload-title">税务登记证<span class="code_remind"></span>
              </p>
              <div class="init-img-main" v-if="initUpload5">
                <img class="init-img" ref="taxRegistrationCertificate" alt="税务登记证">
                <a class="init-img--close"
                  @click="closeInitImg('initUpload5', 'taxRegistrationCertificateAddress')">X</a>
              </div>
              <common-upload v-else :limit="1" :on-remove="loanApplyFormRemove"
                :on-success="taxRegistrationCertificateAddress" :on-error="loanApplyFormUploadFailed2"
                :action="actionUrl" :canHidden="canHidden" list-type="picture-card" :beforeRemove="beforeRemove"
                uploadType="7">
                <img src="~@/assets/img/ID-card-back.gif" alt="反面">
              </common-upload>
            </div>
            <!-- 下一步 -->
            <Button :disabled="enterpriseActive" class="enterprise-info-button" @handleClick="goNext"
              title="下一步"></Button>
            <div style="width:100%;height:80px"></div>
          </div>
        </div>
      </div>
      <AuthFailedPopUp :showTip="showTip" titleText="企业认证失败" :htmlText="htmlText" @confirm="closePopUp">
      </AuthFailedPopUp>
    </div>
    <!-- 照片预览弹窗 -->
    <div class="enterprise-info-sample">
      <el-dialog :visible.sync="frontSample" center width="568px" title="身份证个人信息面照片样例">
        <p style="text-align:center;font-size: 16px;margin-top:13px">请保持图片角度正确 , 身份证号码清晰无遮挡 , 如下图</p>
        <div class="sample-img">
          <img src="~@/assets/img/yl_z.gif" alt="">
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" title="确定" @handleClick="frontSample = false"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="reverseSample" center width="568px" title="身份证国徽面照片样例">
        <p style="text-align:center;font-size: 16px;margin-top:13px">请保持图片角度正确 , 身份证号码清晰无遮挡 , 如下图</p>
        <div class="sample-img">
          <img src="~@/assets/img/yl_b.gif" alt="">
        </div>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" title="确定" @handleClick="reverseSample = false"></Button>
        </div>
      </el-dialog>
      <!-- 添加控股股东弹窗 -->
      <el-dialog :visible.sync="isShareholder" center width="605px" :before-close="beforeClose">
        <p style="text-align:center;font-size: 16px;margin-top:13px">添加股东</p>
        <div class="changeTab">
          <span :class="activeName==='naturalPerson'?'tabItem tabActive':'tabItem'"
            @click="activeName='naturalPerson'">自然人</span>
          <span :class="activeName==='company'?'tabItem tabActive':'tabItem'" @click="activeName='company'">企业</span>
        </div>
        <el-form label-width="152px" label-paddingRight="17px" class="tabForm">
          <el-form-item label="股东占比">
            <el-input maxlength="26" v-model="naturalPerson.ratio" placeholder="请输入股东占比" @change='checkRate'
              @blur="checkRateBlur"></el-input>
            <span class="rateText">%</span>
          </el-form-item>
          <el-form-item :label="activeName==='naturalPerson'?'股东姓名':'企业名称'">
            <el-input v-model="naturalPerson.custName" :placeholder="activeName==='naturalPerson'?'请输入姓名':'请输入企业名称'">
            </el-input>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select v-model="naturalPerson.certType" placeholder="请选择证件类型" style="width:380px"
              v-if="activeName==='naturalPerson'">
              <el-option v-for="item in idcardOption" :key="item.value" :label="item.lable" :value="item.value">
              </el-option>
            </el-select>
            <el-input value="企业营业执照" v-else disabled></el-input>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input v-model="naturalPerson.certId"
              :placeholder="activeName==='naturalPerson'?'请输入证件号码':'请输入统一社会信用代码或营业执照号'">
            </el-input>
          </el-form-item>
          <el-form-item label="联系地址">
            <el-input v-model="naturalPerson.shareholderAddr" placeholder="请输入联系地址">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <Button class="confirm-btn" title="确定添加" @handleClick="toAdd" :disabled="ziranrenDisabled"></Button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import CommonUpload from '@/components/CommonUpload'
import AuthFailedPopUp from '@/components/AuthFailedPopUp'
import AuthenticationTitle from '../AuthenticationTitle'
import { Setitem, Getitem, Removeitem, registStep3 } from '@/services/CommonService'
export default {
  data () {
    return {
      agents: [],
      types: [{ name: '企业', value: 'ET_PE' }, { name: '个体工商户', value: 'ET_SE' }, { name: '政府机构/事业单位', value: 'ET_OU' }],
      next: '',
      activeName: 'naturalPerson',
      downloadCodeUrl: settings.apiGateway.downloadCode,
      // 下载接口
      downloadUrl: settings.downloadUrl,
      header: '',
      // 是否显示默认图片
      initUpload1: false,
      initUpload2: false,
      initUpload3: false,
      initUpload4: false,
      initUpload5: false,
      loadingShow: false,
      // 是否显示上传错误提示
      format: false,
      reversFormat: false,
      certificate: false,
      organize: false,
      LicenceFormat: false,
      // 提示是否显示
      hintFrontShow: true,
      hintBackShow: true,
      isShareholder: false,
      stepInfo: {
        list: ['账户注册', '个人实名认证', '企业实名认证', '对公银行账户信息'],
        step: 3
      },
      eid: '',
      fileList: [],
      cacheInfo: {},
      // 企业信息
      submitData: {
        // 企业名称
        name: this.$route.query.enterpriseName,
        // 社会统一信用代码
        creditCode: '',
        // 组织机构代码
        organizationalCode: '',
        // 税务登记证号码
        taxRegistrationCertificate: '',
        // 企业法人姓名
        legalPersonName: '',
        // 法人证件类型
        legalCertype: '01020100',
        // 企业法人身份证号码
        legalPersonIdNumber: '',
        // 企业法人身份证正面图片地址
        legalPersonIdFrontAddress: '',
        // 企业法人身份证背面图片地址
        legalPersonIdBackAddress: '',
        // 组织机构代码照片地址
        organizationalCodeAddress: '',
        // 税务登记证照片地址
        taxRegistrationCertificateAddress: '',
        // 企业类型
        enterpriseType: '',
        // 企业类型
        caType: '',
        // 企业注册地
        registeredAddress: '',
        // 企业注册资本
        registeredCapital: '',
        // 企业营业执照图片地址
        businessLicenceAddress: '',
        // 企业联系电话
        landLinePhone: '',
        // 企业经营地址
        businessAddress: '',
        // 行业
        industry: '',
        // 经营范围
        businessScope: '',
        // 法人手机号
        legalMobile: '',
        // 企业联系人姓名
        contactName: '',
        // 企业联系人手机号
        contactMobile: '',
        // 企业联系人邮箱
        contactEmail: ''
      },
      // 法人身份证有效期开始
      codeTimeStart: '',
      // 法人身份证有效期结束
      codeTimeEnd: '',
      // 营业执照起始时间
      beginTime: '',
      // 营业执照结束时间
      endTime: '',
      // 营业执照是否永久
      checked: false,
      // 法人身份证是否永久
      codeChecked: false,
      // 自然人
      naturalPerson: {
        ratio: '',
        custName: '',
        certType: '01020100',
        certId: '',
        shareholderAddr: ''
      },
      shareholderList: [],
      // 错误提示
      errorWarning: {
        legalPersonIdNumberError: false,
        licenceTimeError: false,
        idCardTimeError: false,
        legalMobileError: false,
        contactMobileError: false,
        contactEmailError: false,
        registeredCapitalError: false,
        registeredPhoneError: false,
        adminNameError: false,
        creditCodeError: false,
        organizationalCodeError: false,
        taxRegistrationCertificateError: false,
        enpError: false
      },
      companyType: '',
      // 公司列表
      options: [{ value: '有限责任公司' }, { value: '股份有限公司' }],
      industryOption: [{ value: '1', lable: '行业1' }, { value: '2', lable: '行业2' }],
      idcardOption: [{ lable: '身份证', value: '01020100' }, { lable: '护照', value: '01020101' }, { lable: '军官证', value: '01020102' }, { lable: '士兵证', value: '01020103' }, { lable: '回乡证', value: '01020104' }, { lable: '警官证', value: '01020105' }, { lable: '台胞证', value: '01020106' }, { lable: '其他', value: '01020107' }],
      licenceOption: [{ value: '普通营业执照企业' }, { value: '三证合一企业' }],
      licenceType: '三证合一企业',
      // 上传类型
      upLoadType: '',
      // 企业信息初始化 Url
      enterpriseInfoUrl: settings.apiGateway.enterpriseInfo,
      // 上传文件接口
      actionUrl: settings.actionUrl,
      // 上传凭证接口
      getUploadCode: settings.apiGateway.getUploadCode,
      // 获取代理商列表
      getAgentMessageListUrl: settings.apiGateway.getAgentMessageList,
      // 获取行业信息
      getIndustryUrl: settings.apiGateway.getIndustry,
      // 检查信用代码是否存在
      verifyEnterpriseCodeUrl: settings.apiGateway.verifyEnterpriseCode,
      // 获取当前用户信息
      getCurrentUserUrl: settings.apiGateway.getCurrentUser,
      // 企业初始化信息用于重新修改提交
      getEnterpriseInitInfoUrl: settings.apiGateway.getEnterpriseInitInfo,
      // 检查企业是否存在
      getEnterpriseMessageUrl: settings.apiGateway.getEnterpriseMessage,
      // 是否允许隐藏上传按钮
      canHidden: false,
      // 显示企业认证失败的标志
      showTip: false,
      // 身份证正面照样例
      frontSample: false,
      // 身份证反面照样例
      reverseSample: false,
      errorTextEnp: '',
      errorTextCode: '',
      creditCode1Text: '',
      creditCode2Text: '',
      registeredCapitalError: '',
      personNumberError: '',
      legalMobileText: '',
      contactMobileText: '',
      contactEmailText: '',
      // 企业认证失败提示文案
      htmlText: `<p style="height:30px;line-height:30px;">请确保企业名称、统一社会信用代码、企业法人姓名</p><p style="height:30px;line-height:30px;">及企业法人身份证号码与工商注册信息一致</p>`,
      content: '为了让企业客户更方便的联系到您, 请认真填写该信息',
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          return time.getTime() > (new Date()).getTime()
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          return time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      },
      pickerDateBefore: {
        disabledDate: (time) => {
          return time.getTime() > (new Date()).getTime()
        }
      },
      pickerDateAfter: {
        disabledDate: (time) => {
          return time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/authentication/initialization' || to.path === '/authentication/enterprise-certificate/step4') {
      next()
    } else if (to.path === '/authentication/enterprise-certificate/step5' || to.path === '/authentication/home') {
      next()
    } else if (to.path === '/login') {
      Removeitem('token')
      Removeitem('userData')
      Removeitem('perfectState')
      Removeitem('enterpriseName')
      Removeitem('topName')
      // 移除本地存储中是否显示浏览器版本的提示
      Removeitem('browserLowTip')
      Removeitem('store')
      sessionStorage.removeItem('browserLowTip')
      next()
    } else {
      let perfectState = parseInt(JSON.parse(Getitem('userData').perfectState))
      perfectState > 2 ? next() : next(false)
    }
  },
  beforeRouteEnter (to, from, next) {
    let userData = JSON.parse(Getitem('userData'))
    if (userData.perfectState === '4') {
      next('/')
    } else if (userData.perfectState === '5') {
      next('/authentication/initialization')
    } else {
      next()
    }
  },
  components: { CommonUpload, AuthFailedPopUp, AuthenticationTitle },
  created () {
    this.getAgentList()
    this.getIndustry()
    this.getCurrentUser()
    this.getEpInfo()
  },
  methods: {
    beforeRemove () {
      return true
    },
    licenceChange () {
      this.fileList = []
      this.submitData.businessLicenceAddress = ''
      this.submitData.organizationalCodeAddress = ''
      this.submitData.taxRegistrationCertificateAddress = ''
      this.initUpload3 = false
      this.initUpload4 = false
      this.initUpload5 = false
    },
    // 获取行业信息
    getIndustry () {
      this.fetch(this.getIndustryUrl).then(data => {
        this.industryOption = data.data.map(item => {
          let obj = {}
          obj.value = item.code
          obj.lable = item.name
          return obj
        })
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 获取企业缓存信息
    getEpInfo () {
      this.fetch(this.getEnterpriseInitInfoUrl).then(data => {
        if (!data.data) return
        this.cacheInfo = data.data
        this.getEnterpriseInitInfo()
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    // 获取联系人信息
    getCurrentUser () {
      this.fetch(this.getCurrentUserUrl).then(data => {
        this.submitData.contactName = data.data.realName
        this.submitData.contactMobile = data.data.phone
        this.submitData.contactEmail = data.data.email
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 获取代理商列表信息
    getAgentList () {
      this.fetch(this.getAgentMessageListUrl).then(data => {
        this.agents = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    changeStart (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateAfter = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          }
        }
      } else {
        this.pickerBeginDateAfter = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() < (new Date(timeStr).getTime() + 1 * 24 * 60 * 60 * 1000) || time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          }
        }
      }
    },
    changeStartCode (timeStr) {
      if (!timeStr) {
        this.pickerDateAfter = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          }
        }
      } else {
        this.pickerDateAfter = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() < (new Date(timeStr).getTime() + 1 * 24 * 60 * 60 * 1000) || time.getTime() < (new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          }
        }
      }
    },
    changeEnd (timeStr) {
      if (!timeStr) {
        this.pickerBeginDateBefore = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() > (new Date()).getTime()
          }
        }
      } else {
        this.pickerBeginDateBefore = {
          disabledDate (time) { // 开始时间-结束时间
            return (time.getTime() > new Date(timeStr).getTime() - 1 * 24 * 60 * 60 * 1000) || (time.getTime() > (new Date()).getTime())
          }
        }
      }
    },
    changeEndCode (timeStr) {
      if (!timeStr) {
        this.pickerDateBefore = {
          disabledDate (time) { // 开始时间-结束时间
            return time.getTime() > (new Date()).getTime()
          }
        }
      } else {
        this.pickerDateBefore = {
          disabledDate (time) { // 开始时间-结束时间
            return (time.getTime() > new Date(timeStr).getTime() - 1 * 24 * 60 * 60 * 1000) || (time.getTime() > (new Date()).getTime())
          }
        }
      }
    },
    beforeClose () {
      this.isShareholder = false
      this.initDialog()
    },
    initDialog () {
      this.activeName = 'naturalPerson'
      this.naturalPerson.ratio = ''
      this.naturalPerson.custName = ''
      this.naturalPerson.certType = '01020100'
      this.naturalPerson.certId = ''
      this.naturalPerson.shareholderAddr = ''
    },
    // 比率限制输入
    checkRate (val) {
      let reg = /[^\d,.]/g
      if (reg.test(val.toString())) {
        this.naturalPerson.ratio = this.naturalPerson.ratio.replace(reg, ($1) => {
          return ''
        })
      }
    },
    // 比率限制范围
    checkRateBlur () {
      if (!this.naturalPerson.ratio) {
        this.$message.error('请输入股东占比')
      } else if (this.naturalPerson.ratio < 0 || this.naturalPerson.ratio > 100) {
        this.$message.error('占比在0~100%之间')
      }
    },
    // 增加股东信息 添加处理信息对象
    toAdd () {
      if (this.activeName !== 'naturalPerson') this.naturalPerson.certType = '01020107'
      let data = JSON.parse(JSON.stringify(this.naturalPerson))
      if (this.checkStrByte(data.shareholderAddr) > 250) return this.$message.error('地址不能超过250个字节')
      if (data.ratio < 0 || data.ratio > 100) return this.$message.error('占比在0~100%之间')
      // 检查证件类型
      let status = this.checkTypeCard(data.certType, data.certId)
      if (status) {
        this.$message.error(status)
        return
      } else {
        if (data.certType === '01020100') data.certId = data.certId.toUpperCase()
      }
      let rateSum = 0
      this.shareholderList.forEach(item => {
        rateSum = rateSum + parseFloat(item.ratio)
      })
      if (parseFloat(rateSum) + parseFloat(data.ratio) > 100) return this.$message.error('占比和不能大于100%')
      // 区别化发送参数
      if (this.activeName === 'naturalPerson') {
        data.type = 1
      } else {
        data.certType = '01020107'
        data.corporateName = data.custName
        data.creditCode = data.certId
        delete data.custName
        delete data.certId
        data.type = 2
      }
      this.shareholderList.push(data)
      this.isShareholder = false
      this.initDialog()
    },
    // 删除控股股东信息
    closeAdd (index) {
      this.shareholderList = this.shareholderList.filter((item, index1) => {
        return index !== index1
      })
    },
    addShareholder () {
      this.isShareholder = true
    },
    frontExamineSample () {
      this.frontSample = true
    },
    reverseExamineSample () {
      this.reverseSample = true
    },
    // 检查姓名
    legalBlur () {
      if (this.checkNames(this.submitData.legalPersonName)) {
        this.errorWarning.adminNameError = true
        return true
      } else {
        this.errorWarning.adminNameError = false
        return false
      }
    },
    // 检验社会信用代码
    verifyCreditCode () {
      let region = /(^[A-Z0-9]{18}$)/
      let region1 = /(^[0-9]{15}$)/
      let codeText = this.licenceType === '普通营业执照企业' ? '营业执照注册号' : '统一社会信用代码'
      if (!this.submitData.creditCode) {
        this.errorWarning.creditCodeError = true
        this.errorTextCode = codeText + '不能为空'
        return true
      }
      if (this.licenceType === '普通营业执照企业') {
        if (!region1.test(this.submitData.creditCode)) {
          this.errorWarning.creditCodeError = true
          this.errorTextCode = codeText + '由15位数字组成'
          return true
        } else {
          this.errorWarning.creditCodeError = false
          return false
        }
      }
      if (!region.test(this.submitData.creditCode)) {
        this.errorWarning.creditCodeError = true
        this.errorTextCode = codeText + '由18位数字或大写字母组成'
        return true
      } else {
        this.fetch(this.verifyEnterpriseCodeUrl + this.submitData.creditCode).then(data => {
          if (!data.data) {
            this.errorWarning.creditCodeError = true
            this.errorTextCode = codeText + '已被占用'
            return true
          } else {
            this.errorWarning.creditCodeError = false
          }
        }).catch(data => {
          this.$message.error(data.data.msg)
        })
      }
    },
    // 检查企业名称
    verifyEnp () {
      if (!this.submitData.name) {
        this.errorWarning.enpError = true
        this.errorTextEnp = '企业名称不能为空'
        return true
      } else if (this.checkStrByte(this.submitData.name) > 50) {
        this.errorWarning.enpError = true
        this.errorTextEnp = '企业名称不能超过50位字节'
        return true
      }
      let name = /(^[\u4E00-\u9FFF()（）]+$)/
      if (!name.test(this.submitData.name)) {
        this.errorWarning.enpError = true
        this.errorTextEnp = '企业名称由汉字与括号组成'
        return true
      } else {
        this.submitData.name = this.submitData.name.trim()
        this.checkEnpName(this.submitData.name)
      }
    },
    // 检查名称是否重复
    checkEnpName (enpName) {
      this.fetch(`${this.getEnterpriseMessageUrl}${enpName}`).then(data => {
        let enterprise = data.data
        if (enterprise === null) {
          this.errorWarning.enpError = false
        } else {
          this.errorWarning.enpError = true
          this.errorTextEnp = '企业信息已存在'
        }
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 检验组织机构代码
    verifyCreditCode1 () {
      let region = /(^[A-Z0-9]{9}$)/
      let region1 = /^([0-9A-Z]){8}-[0-9|X]$/
      if (!this.submitData.organizationalCode) {
        this.errorWarning.organizationalCodeError = true
        this.creditCode1Text = '组织机构代码不能为空'
        return true
      }
      if (!region.test(this.submitData.organizationalCode) && !region1.test(this.submitData.organizationalCode)) {
        this.errorWarning.organizationalCodeError = true
        this.creditCode1Text = '组织机构代码9位数字或大写字母加-组成'
        return true
      } else {
        this.errorWarning.organizationalCodeError = false
      }
    },
    // 检验税务登记号
    verifyCreditCode2 () {
      let region = /(^[a-zA-Z0-9]{15,20}$)/
      if (!this.submitData.taxRegistrationCertificate) {
        this.errorWarning.taxRegistrationCertificateError = true
        this.creditCode2Text = '税务登记证号不能为空'
        return true
      }
      if (!region.test(this.submitData.taxRegistrationCertificate)) {
        this.errorWarning.taxRegistrationCertificateError = true
        this.creditCode2Text = '税务登记证号由15位或20位数字或字母组成'
        return true
      } else {
        if (this.submitData.taxRegistrationCertificate.length > 15 && this.submitData.taxRegistrationCertificate.length < 20) {
          this.errorWarning.taxRegistrationCertificateError = true
          this.creditCode2Text = '税务登记证号由15位或20位数字或字母组成'
        } else {
          this.errorWarning.taxRegistrationCertificateError = false
        }
      }
    },
    // 检测管理员姓名
    verifyAdminName () {
      let NameReg = /^[\u4E00-\u9FA5]{2,20}$/
      if (!NameReg.test(this.submitData.legalPersonName)) {
        this.errorWarning.adminNameError = true
        return true
      } else {
        this.errorWarning.adminNameError = false
      }
    },
    // 验证身份证号码
    verifyIdNum () {
      if (!this.submitData.legalPersonIdNumber) {
        this.errorWarning.legalPersonIdNumberError = true
        this.personNumberError = '证件号码不能为空'
        return true
      }
      let status = this.checkTypeCard(this.submitData.legalCertype, this.submitData.legalPersonIdNumber)
      if (status) {
        this.errorWarning.legalPersonIdNumberError = true
        this.personNumberError = status
      } else {
        if (this.submitData.legalCertype === '01020100') this.submitData.legalPersonIdNumber = this.submitData.legalPersonIdNumber.toUpperCase()
        this.errorWarning.legalPersonIdNumberError = false
      }
    },
    // 验证法人手机号
    legalMobileBlur () {
      if (!this.submitData.legalMobile) {
        this.errorWarning.legalMobileError = true
        this.legalMobileText = '手机号不能为空'
        return true
      }
      let status = this.checkPhones(this.submitData.legalMobile)
      if (status) {
        this.errorWarning.legalMobileError = true
        this.legalMobileText = '手机号输入有误'
      } else {
        this.errorWarning.legalMobileError = false
      }
    },
    // 验证联系人手机号
    contactMobileBlur () {
      if (!this.submitData.contactMobile) {
        this.errorWarning.contactMobileError = true
        this.contactMobileText = '手机号不能为空'
        return true
      }
      let status = this.checkPhones(this.submitData.contactMobile)
      if (status) {
        this.errorWarning.contactMobileError = true
        this.contactMobileText = '手机号输入有误'
      } else {
        this.errorWarning.contactMobileError = false
      }
    },
    // 联系人邮箱
    contactEmailBlur () {
      if (!this.submitData.contactEmail) {
        this.errorWarning.contactEmailError = true
        this.contactEmailText = '邮箱不能为空'
        return true
      }
      let status = this.checkEmails(this.submitData.contactEmail)
      if (status) {
        this.errorWarning.contactEmailError = true
        this.contactEmailText = '邮箱输入有误'
      } else {
        this.errorWarning.contactEmailError = false
      }
    },
    // 验证联系电话
    checkRegisteredPhone () {
      let reg = /^[\d-]{1,15}$/
      if (!reg.test(this.submitData.landLinePhone)) {
        this.errorWarning.registeredPhoneError = true
        return true
      } else {
        this.errorWarning.registeredPhoneError = false
      }
    },
    // 检测注册资本
    checkRegisteredCapital () {
      this.submitData.registeredCapital = parseFloat(this.submitData.registeredCapital) || ''
      let registeredCapitalReg = /^\d{1,20}(\.\d{1,6})?$/
      if (!this.submitData.registeredCapital) {
        this.errorWarning.registeredCapitalError = true
        this.registerErrorText = '注册资本不能为空'
        return true
      }
      if (!registeredCapitalReg.test(this.submitData.registeredCapital)) {
        this.errorWarning.registeredCapitalError = true
        this.registerErrorText = '必须为20位以内的整数或6位以内的小数'
      } else {
        this.errorWarning.registeredCapitalError = false
      }
    },
    // 检测营业执照有效日期
    checkLiceneceTime () {
      if (this.checked) {
        this.beginTime ? this.errorWarning.licenceTimeError = false : this.errorWarning.licenceTimeError = true
      } else if (this.beginTime && this.endTime) {
        this.errorWarning.licenceTimeError = false
      } else {
        this.errorWarning.licenceTimeError = true
      }
    },
    // 检测身份证有效日期
    checkIdCardTime () {
      if (this.codeChecked) {
        this.codeTimeStart ? this.errorWarning.idCardTimeError = false : this.errorWarning.idCardTimeError = true
      } else if (this.codeTimeStart && this.codeTimeEnd) {
        this.errorWarning.idCardTimeError = false
      } else {
        this.errorWarning.idCardTimeError = true
      }
    },
    // 处理企业缓存信息
    getEnterpriseInitInfo () {
      let data = JSON.parse(JSON.stringify(this.cacheInfo))
      this.eid = data.eid
      if (!data.creditCode) return
      this.initUpload1 = true
      this.initUpload2 = true
      this.initUpload3 = true
      if (data.isTern) {
        this.licenceType = '三证合一企业'
      } else {
        this.initUpload4 = true
        this.initUpload5 = true
        this.licenceType = '普通营业执照企业'
      }
      for (let key in this.submitData) {
        this.submitData[key] = data[key]
        if (key === 'legalPersonIdFrontAddress' || key === 'legalPersonIdBackAddress' || key === 'businessLicenceAddress' || key === 'organizationalCodeAddress' || key === 'taxRegistrationCertificateAddress') {
          this.submitData[key] = this.submitData[key].fileId
          if (key === 'legalPersonIdFrontAddress') this.getCode(this.submitData[key], 'legalPersonIdFront')
          if (key === 'legalPersonIdBackAddress') this.getCode(this.submitData[key], 'legalPersonIdBack')
          if (key === 'businessLicenceAddress') this.getCode(this.submitData[key], 'businessLicence')
          if (!data.isTern && key === 'organizationalCodeAddress') this.getCode(this.submitData[key], 'organizationalCode')
          if (!data.isTern && key === 'taxRegistrationCertificateAddress') this.getCode(this.submitData[key], 'taxRegistrationCertificate')
        }
      }
      this.beginTime = data.termValidity.split('-')[0]
      this.codeTimeStart = data.legalCertDate.split('-')[0]
      data.termValidity.indexOf('永久') > 0 ? this.checked = true : this.endTime = data.termValidity.split('-')[1]
      data.legalCertDate.indexOf('永久') > 0 ? this.codeChecked = true : this.codeTimeEnd = data.legalCertDate.split('-')[1]
      this.shareholderList = data.shareholderList
      this.naturalPerson.certType = '01020100'
    },
    goNext () {
      if (this.licenceType === '三证合一企业') {
        this.errorWarning.organizationalCodeError = false
        this.errorWarning.taxRegistrationCertificateError = false
      }
      let registeredCapitalReg = /^\d+(\.\d{1,6})?$/
      let canPass = true
      this.checkLiceneceTime()
      this.checkIdCardTime()
      for (let key in this.errorWarning) {
        if (this.errorWarning[key]) canPass = false
      }
      if (!registeredCapitalReg.test(this.submitData.registeredCapital)) {
        canPass = false
        this.errorWarning.registeredCapitalError = true
        setTimeout(() => {
          this.errorWarning.registeredCapitalError = false
        }, 3000)
      }
      if (this.errorWarning.licenceTimeError || this.errorWarning.idCardTimeError) {
        canPass = false
        setTimeout(() => {
          this.errorWarning.licenceTimeError = false
          this.errorWarning.idCardTimeError = false
        }, 5000)
      }
      if (this.checkBusinessScope || this.checkRegisteredAddress || this.checkBusinessAddress) canPass = false
      // 如果有错误就return
      if (!canPass) return
      // 企业信息处理
      if (this.checkStrByte(JSON.stringify(this.shareholderList)) > 3000) {
        this.$message.error('控股股东信息过长，不能超过3000个字节')
        return
      }
      let step3Data = registStep3({
        submitData: this.submitData,
        checked: this.checked,
        beginTime: this.beginTime,
        endTime: this.endTime,
        codeChecked: this.codeChecked,
        codeTimeStart: this.codeTimeStart,
        codeTimeEnd: this.codeTimeEnd,
        shareholderList: this.shareholderList,
        licenceType: this.licenceType
      })
      this.loadingShow = true
      this.fetch(this.enterpriseInfoUrl, 'post', step3Data).then(data => {
        // 修改步骤
        Setitem('perfectState', 3)
        let userData = JSON.parse(Getitem('userData'))
        userData.perfectState = '3'
        Setitem('userData', JSON.stringify(userData))
        this.$router.push({
          path: '/authentication/enterprise-certificate/step5',
          query: {
            backStep: this.$route.query.backStep,
            enterpriseName: this.submitData.name
          }
        })
      }).catch(data => {
        if (data.data.code === -1) {
          // 验证失败状态
          this.showTip = true
        } else if (data.data.code === 1002) {
          this.$message.error('请求参数不合法')
        } else if (data.data.code === 4004) {
          this.showTip = true
        } else {
          this.$message.error(data.data.msg)
        }
      })
    },
    // 身份证正面上传
    legalPersonIdFrontAddress (response, file) {
      this.upLoadSuccess(response, file, 'legalPersonIdFrontAddress')
    },
    // 身份证背面上传
    legalPersonIdBackAddress (response, file) {
      this.upLoadSuccess(response, file, 'legalPersonIdBackAddress')
    },
    // 营业执照上传
    businessLicenceAddress (response, file) {
      this.upLoadSuccess(response, file, 'businessLicenceAddress')
    },
    // 组织机构代码照片上传
    organizationalCodeAddress (response, file) {
      this.upLoadSuccess(response, file, 'organizationalCodeAddress')
    },
    // 税务登记证照片上传
    taxRegistrationCertificateAddress (response, file) {
      this.upLoadSuccess(response, file, 'taxRegistrationCertificateAddress')
    },
    // 上传成功
    upLoadSuccess (response, file, type) {
      if (response.code === 0) {
        this.submitData[type] = response.data.fileId
        // 给file增加type标识
        file.upLoadType = type
        if (type === 'legalPersonIdFrontAddress') {
          this.format = false
          this.hintFrontShow = false
        } else if (type === 'legalPersonIdBackAddress') {
          this.reversFormat = false
          this.hintBackShow = false
        } else if (type === 'businessLicenceAddress') {
          this.LicenceFormat = false
        } else if (type === 'organizationalCodeAddress') {
          this.organize = false
        } else if (type === 'taxRegistrationCertificateAddress') {
          this.certificate = false
        }
      } else {
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    },
    // 文件删除成功
    loanApplyFormRemove (file, fileList, type) {
      this.submitData[file.upLoadType] = ''
    },
    // 上传文件失败触发报错
    loanApplyFormUploadFailed () {
      this.reversFormat = true
      this.hintBackShow = false
    },
    loanApplyFormFrontUploadFailed () {
      this.format = true
      this.hintFrontShow = false
    },
    loanApplyFormLicenceUploadFailed () {
      this.LicenceFormat = true
    },
    loanApplyFormFrontUploadFailed1 () {
      this.organize = true
    },
    loanApplyFormUploadFailed2 () {
      this.certificate = true
    },
    upLoadClick (num) {
    },
    closePopUp (closeBoolean) {
      this.showTip = closeBoolean
    },
    // 获取图片 code方法
    getCode (imgId, type) {
      this.fetch(`${this.downloadCodeUrl}/${imgId}`).then(data => {
        this.setImgHeader(data.data.code, data.data.token, type)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取文件名失败！'
        })
      })
    },
    setImgHeader (code, token, nameImg) {
      this.axios({
        url: this.downloadUrl,
        params: { code: code },
        headers: {
          'FileToken': `Bearer ${token}`
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
          this.$refs[nameImg].src = result
        })
      }).catch(data => {
        this.$message({
          type: 'error',
          message: '获取code失败！'
        })
      })
    },
    closeInitImg (initImg, address) {
      this[initImg] = false
      this.submitData[address] = ''
    }
  },
  computed: {
    // 不满足条件申请按钮不可按
    enterpriseActive () {
      if (this.submitData.legalPersonName && this.submitData.legalPersonIdNumber &&
        this.submitData.registeredAddress && this.submitData.registeredCapital &&
        this.submitData.legalPersonIdFrontAddress && this.submitData.legalPersonIdBackAddress && this.submitData.businessLicenceAddress && this.submitData.landLinePhone &&
        (this.licenceType !== '普通营业执照企业' ? (this.submitData.creditCode && this.submitData.businessLicenceAddress) : (this.submitData.creditCode &&
          this.submitData.businessLicenceAddress && this.submitData.organizationalCode && this.submitData.organizationalCodeAddress && this.submitData.taxRegistrationCertificate &&
          this.submitData.taxRegistrationCertificateAddress)) && this.submitData.businessAddress && this.beginTime && this.codeTimeStart &&
        this.submitData.businessScope && this.submitData.industry && this.shareholderList.length > 0 && this.submitData.legalCertype && this.submitData.legalMobile &&
        this.submitData.contactName && this.submitData.contactMobile && this.submitData.contactEmail && this.submitData.caType) {
        return false
      } else {
        return true
      }
    },
    ziranrenDisabled () {
      if (this.naturalPerson.ratio && this.naturalPerson.custName && this.naturalPerson.certType && this.naturalPerson.certId && this.naturalPerson.shareholderAddr) {
        return false
      } else {
        return true
      }
    },
    checkBusinessScope () {
      if (this.checkStrByte(this.submitData.businessScope) > 1000) {
        return true
      } else {
        return false
      }
    },
    checkRegisteredAddress () {
      if (this.checkStrByte(this.submitData.registeredAddress) > 250) {
        return true
      } else {
        return false
      }
    },
    checkBusinessAddress () {
      if (this.checkStrByte(this.submitData.businessAddress) > 250) {
        return true
      } else {
        return false
      }
    },
    checkEid () {
      if (this.eid) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    activeName (val) {
      if (val !== 'naturalPerson') {
        this.naturalPerson.certType = '企业营业执照'
      } else {
        this.naturalPerson.certType = '01020100'
      }
      this.naturalPerson.ratio = ''
      this.naturalPerson.custName = ''
      this.naturalPerson.certId = ''
      this.naturalPerson.shareholderAddr = ''
    },
    codeChecked (val) {
      if (val) this.codeTimeEnd = ''
    },
    checked (val) {
      if (val) this.endTime = ''
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.reselect-enterorise {
  cursor: pointer;
  margin: 40px 0 30px 245px;
  opacity: 0.5;
}
.enterprise-info-main {
  margin: 0 auto;
  .enterprise-form {
    width: 603px;
    margin: 0 auto;
    padding-right: 160px;
    position: relative;
  }
  .imgContent {
    width: 838px;
    height: 245px;
    padding-left: 55px;
    margin: 0 auto;
    position: relative;
  }
  .unit-price {
    position: absolute;
    top: 15px;
    right: 10px;
    padding: 2px 10px 0 0;
  }
  .error-warning {
    position: absolute;
    left: 403px;
    top: 10px;
    width: 400px;
  }
  .login-error {
    color: #f27072;
    margin-left: 5px;
    font-size: 15px;
    letter-spacing: 1px;
  }
  .error-icon-warning {
    margin-left: 19px;
    font-size: 24px;
    color: #f2706e;
    vertical-align: middle;
  }
  .checkRadio {
    position: absolute;
    right: -60px;
    top: 13px;
  }
  .addShareholder {
    width: 131px;
    height: 45px;
    background-color: #108ee9;
  }
  .shareholderAmind {
    position: absolute;
    left: 136px;
    margin-top: 5px;
    font-size: 13px;
    line-height: 18px;
    // font-family: SimSun;
    color: #b7b7b7;
  }
  .enterprise-info-button {
    margin: 60px 0 0 210px;
    width: 400px;
    height: 45px;
    font-size: 18px;
    border: none;
    background-color: @theme-blue;
    box-shadow: 1px 6px 4px @btn-disabled;
    // box-shadow: 1px 6px 4px var(--mainTableHover);
  }
  .application-upload-button {
    width: 100px;
    border: none;
    background-color: @theme-blue;
  }
  .upload-title {
    cursor: default;
    height: 20px;
    line-height: 20px;
    text-align: left;
    font-size: 16px;
    // font-family: SimSun;
    font-weight: 400;
    color: rgba(87, 87, 87, 1);
    margin-bottom: 12px;
    .code_remind {
      font-size: 13px;
      color: #b3b3b3;
      // font-family: SimSun;
    }
  }
  .addItemCard {
    width: 100%;
    height: 45px;
    line-height: 45px;
    background-color: #f2f9ff;
    font-size: 16px;
    // font-family: SimSun;
    color: #575757;
    border-radius: 5px;
    margin-bottom: 8px;
  }
  .closeAdd {
    float: right;
    line-height: 45px;
    cursor: pointer;
    margin-right: 10px;
  }
  .upload-sample {
    width: 56px;
    height: 20px;
    margin-right: 26px;
    font-size: 14px;
    float: right;
    cursor: pointer;
    text-decoration: underline;
    color: @theme-blue;
  }
  .upload-format {
    font-size: 14px;
    display: inline-block;
    position: relative;
    top: 105px;
    left: 275px;
  }
  .upload-reversformat {
    font-size: 14px;
    display: inline-block;
    position: relative;
    top: 90px;
    left: 275px;
  }
  .file-title-float {
    .down-file-title {
      color: #adadad;
      text-decoration: underline;
      cursor: pointer;
    }
    .down-file-title:hover {
      color: @btn-bg-color;
    }
  }
}
.sample-img {
  width: 433px;
  height: 265px;
  margin: 30px auto;
}
.error-img {
  color: red;
  font-size: 16px;
  width: 200px;
  display: inline-block;
  position: absolute;
  bottom: -24px;
  left: 0;
}
.error-reversFormat {
  color: red;
  font-size: 16px;
  display: inline-block;
  position: relative;
  top: 90px;
  left: 280px;
}
.error-LicenceFormat {
  color: red;
  font-size: 16px;
  display: inline-block;
  position: relative;
  top: 130px;
  left: 280px;
}
.confirm-btn {
  width: 211px;
  height: 50px;
  background-color: #108ee9 !important;
}
.init-img-main {
  position: relative;
  height: 163px;
  width: 300px;
}
.init-img {
  height: 163px;
  width: 260px;
}
.init-img--close {
  position: absolute;
  top: 0;
  right: 27px;
  color: #303133;
  cursor: pointer;
}
.init-img--close:hover {
  color: @theme-blue;
}
.hint {
  font-size: 16px;
  position: absolute;
  top: 13px;
  left: 395px;
  .el-icon-question {
    color: #cccccc;
  }
}
.constraint {
  color: red;
  margin-left: 5px;
  display: inline-block;
  height: 40px;
  font-weight: 600;
  line-height: 40px;
}
.companyType-constraint {
  position: absolute;
  top: 4px;
  right: 2px;
  color: red;
}
.wait-next {
  width: 200px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  margin: -13px 0 10px 213px;
  color: @theme-blue;
  border: 1px solid @theme-blue;
  background-color: @theme-blue-light;
}
.titleText {
  position: absolute;
  left: -54px;
  width: 870px;
  .remindImg {
    font-size: 13px;
    // font-family: SimSun;
    font-weight: 400;
    color: #666666;
  }
  .toTop {
    padding-top: 10px;
  }
  .toLeft {
    margin-left: 44px;
  }
  .remindTop {
    color: #EB3232;
  }
}
.buyTableTitle {
  height: 16px;
  font-size: 16px;
  font-weight: bold;
  color: rgba(101, 101, 101, 1);
  margin: 18px 0 15px;
  padding-left: 9px;
  border-left: 4px solid @theme-blue;
  // border-left: 4px solid var(--mainColor);
}
.dotted {
  border-top: 1px dotted #000;
  width: 100%;
  height: 1px;
  margin-bottom: 44px;
}
.uploadImg {
  width: 260px;
  height: 198px;
  margin-right: 24px;
  float: left;
  position: relative;
}
.changeTab {
  height: 40px;
  margin: 22px 65px 33px;
}
.tabItem {
  float: left;
  overflow: hidden;
  width: 235px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #e1e1e1;
  cursor: pointer;
}
.tabActive {
  height: 39px;
  line-height: 39px;
  color: #108ee9;
  font-weight: bold;
  background-color: #f2f9ff;
  border-bottom: 2px solid #108ee9;
}
.tabForm {
  width: 532px;
  position: relative;
  .rateText {
    position: absolute;
    right: 15px;
    top: 0;
  }
}
.no-business/deep/.el-button--primary.is-disabled,
.no-business/deep/.el-button--primary.is-disabled:hover,
.no-business/deep/.el-button,
.no-business/deep/.el-button:hover {
  background-color: #108ee9;
}
</style>

<style lang="less">
.no-business .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  // line-height: 45px;
}
.enterprise-info-main .el-form-item__content {
  line-height: 12px;
}
.enterprise-info-sample .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}
.select-role {
  margin-left: 325px;
  margin-bottom: 35px;
  .text {
    margin-right: 10px;
    color: #606266;
  }
}
.enterprise-info-sample .el-dialog {
  margin-left: 0 !important;
}
.enterprise-info-main .el-form-item__label,
.enterprise-info-sample .el-form-item__label {
  // font-family: SimSun;
  font-size: 16px;
}
.imgContent .el-upload-list--picture-card .el-upload-list__item {
  width: 263px;
  height: 163px;
  margin-right: 26px;
}
.imgContent .el-upload--picture-card {
  width: 263px;
  height: 165px;
  margin-right: 26px;
}
.imgContent .el-upload-list__item-delete {
  width: 100%;
  height: 42px;
  line-height: 42px;
  background-color: rgba(16, 142, 233, 0.7);
}
.imgContent .el-upload-list--picture-card .el-upload-list__item-actions {
  background-color: transparent;
}
.no-business .el-icon-delete:before {
  font-size: 16px;
  // font-family: SimSun;
  content: '重新上传';
}
</style>
