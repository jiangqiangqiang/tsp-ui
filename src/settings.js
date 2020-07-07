let ENV = process.env.BUILD_ENV
const domain = () => {
  let obj = {}
  switch (ENV) {
    // 开发模式
    case 'development':
      obj = {
        // adminDomain: 'http://192.168.1.20:8083',
        // domain: 'http://192.168.1.20:8081',
        // upLoadUrl: 'http://192.168.1.20:8084',
        // adminDomain: 'http://192.168.1.33:8083',
        // domain: 'http://192.168.1.33:8081',
        // upLoadUrl: 'http://192.168.1.33:8084',
        // adminDomain: 'http://47.97.96.248:9093',
        // domain: 'http://47.97.96.248:9091',
        // upLoadUrl: 'http://47.105.114.154:8084',
        // adminDomain: 'http://47.97.96.248:8793',
        // domain: 'http://47.97.96.248:8791',
        // upLoadUrl: 'http://47.105.114.154:8084',
        // adminDomain: 'https://tsp-rest-admin.epuchain.net',
        // domain: 'https://tsp-rest-trading.epuchain.net',
        // upLoadUrl: 'https://tsp-rest-file.epuchain.net',
        adminDomain: 'https://tsp-ui.a.epuchain.com/admin',
        domain: 'https://tsp-ui.a.epuchain.com/trading',
        upLoadUrl: 'https://tsp-ui.a.epuchain.com/file',
        // adminDomain: 'https://tsp-admin.b.epuchain.com',
        // domain: 'https://tsp-trading.b.epuchain.com',
        // upLoadUrl: 'https://tsp-file.b.epuchain.com',
        helpUrl: 'https://helpcenter.a.epuchain.com'
      }
      break
    // 开发调试对接，以及验收测试
    case 'a':
      obj = {
        adminDomain: 'https://tsp-ui.a.epuchain.com/admin',
        domain: 'https://tsp-ui.a.epuchain.com/trading',
        upLoadUrl: 'https://tsp-ui.a.epuchain.com/file',
        helpUrl: 'https://helpcenter.a.epuchain.com'
      }
      break
    // 业务测试
    case 'b':
      obj = {
        adminDomain: 'https://tsp-ui.b.epuchain.com/admin',
        domain: 'https://tsp-ui.b.epuchain.com/trading',
        upLoadUrl: 'https://tsp-ui.b.epuchain.com/file',
        helpUrl: 'https://helpcenter.b.epuchain.com'
      }
      break
    // 生产环境
    case 'prod':
      obj = {
        adminDomain: 'https://tsp-ui.epuchain.com/admin',
        domain: 'https://tsp-ui.epuchain.com/trading',
        upLoadUrl: 'https://tsp-ui.epuchain.com/file',
        helpUrl: 'https://helpcenter.epuchain.com'
      }
  }
  return obj
}
const settings = {
  env: ENV,
  domain: domain(),
  // 文件上传接口
  actionUrl: `${domain().upLoadUrl}/api/file/fileUpload`,
  // 下载接口
  downloadUrl: `${domain().upLoadUrl}/api/file/download`,
  // 文件下载接口
  apiGateway: {
    // **************************************上传下载凭证接口******************************************* //
    // 上传凭证接口
    getUploadCode: '/api/file/code/getUploadCode',
    // 下载凭证接口
    downloadCode: '/api/file/code/getDownloadCode',
    // **************************************登录 初始化接口******************************************* //
    // 登录接口
    loginUrl: '/api/auth/login',
    // 加入企业接口
    joinUrl: '/api/join',
    // 注册接口
    registerUrl: '/api/auth/register',
    // 登录 获取csrfCode接口:用于请求图片验证码
    getCsrfCode: '/api/auth/captcha/csrf',
    // 获取图片验证码接口
    getImgCode: '/api/auth/captcha/imgCode',
    // 重置密码接口
    resetPassword: '/api/auth/password/reset',
    // 重置密码是短信验证码
    resetSmsCode: '/api/sms/reset',
    // 管理员信息初始化
    adminInfo: '/api/account/personal/info',
    // 管理员初始化短信验证码
    adminSmsCode: '/api/sms/send',
    // 注册的短信验证码
    registerSmsCode: '/api/sms/send/code',
    // 短信发送接口加图片验证
    registerSmsSend: '/api/sms/register/send/code',
    // 获取企业信息 企业名和信用代码
    getEnterprise: '/api/account/enterprise/info',
    // 获取用户输入企业信息用于重新修改企业信息
    getEnterpriseInitInfo: '/api/account/enterprise/init/info',
    // 企业信息初始化
    enterpriseInfo: '/api/account/enterprise/info',
    // 检测企业信息是否审核通过
    checkAuditSatus: '/api/account/check/status',
    // 开通链账户
    openChain: '/api/account/open/chain',
    // 开通Ca
    openCa: '/api/public/ca/open',
    // 个人三要素认证
    authUser: '/api/zq/auth/user/info',
    // 企业四要素认证
    authEnterprise: '/api/zq/auth/enterprise/info',
    getAuditStatus: '/api/account/getAuditStatus',
    //  **************************************公共数据接口************************************************ //
    // 获取行业信息
    getIndustry: '/api/user/industry',
    // 获取省市地区
    getArea: '/api/user/area',
    // 获取银行列表
    getBankCodey: '/api/user/bankCode',
    // 获取银行网管code接口
    getBankCode: '/api/user/gate',
    // **************************************充值接口************************************************ //
    // 充值列表接口
    getTopUpList: '/api/deposit/list/',
    // 提交充值接口
    submitTopUp: '/api/deposit/preDeposit',
    // 删除订单接口
    deleteOrder: '/api/deposit/delete/order/',
    // 充值成功/充值失败跳转到第三方接口
    TopUpScueess: '/api/deposit/deposit/',
    // 获取三方信息接口
    getThirdparty: '/api/three/pay/data/',
    // 选择银行
    getSelectBank: '/api/three/pay/select/',
    // 根据金额获取金币接口
    getGoldNum: '/api/deposit/gold/award/num/',
    // 根据充值额度计算折扣后的金额
    getCalcuAmount: '/api/deposit/get/calcuAmount',
    // 检查垫资方资金是否充足
    getAllocatorBalace: '/api/deposit/check/AllocatorBalace/',
    // 充值详情
    getDepositDetail: '/api/deposit/orderDetail/',
    // *************************************收款接口************************************************* //
    // 收款列表接口
    getProceedsList: '/api/payment/receivable/list/',
    // 获取收款公司列表
    getCompany: '/api/relate/enterprise/',
    // 收款提交接口
    submitProceeds: '/api/payment/receivable/application',
    // 保存付款企业信息接口
    savePayerMessage: '/api/relate/enterprise/register',
    // 判断企业名称和信用代码是否为同一公司
    judgeUnify: '/api/public/check/codeAndName/',
    // 获取收款详单
    getReceiveInfo: '/api/payment/receivable/',
    // 收款支付取消申请
    paymentCancel: '/api/payment/cancel/',
    // 收款支付详情
    paymentDetail: '/api/payment/',
    // 根据面值获取提现日期
    getWithdrawTime: '/api/payment/get/withdrawTime',
    // 获取最大提现日期和最大收款金额
    getLimit: '/api/payment/get/limit',
    // 根据提现日期获取最大收款金额
    getMaxAmount: '/api/payment/get/maxAmount',
    // **************************************提现接口************************************************ //
    // 提现列表接口
    getWithdrawList: '/api/public/withdraw/list/',
    // 提现页面信息接口
    getWithdrawDetail: '/api/public/withdraw/getWithdrawDetail',
    // 提现接口 POST
    withdraw: '/api/public/withdraw/cash',
    // 提交审核
    withdrawAudit: '/api/public/withdraw/post',
    // 提现详情
    withdrawInfo: '/api/public/withdraw/withdraw/info',
    // 提现审核接口
    withdrawAuditPost: '/api/public/withdraw/audit',
    // 提现服务费计算接口
    withdrawGetFee: '/api/public/withdraw/getFee',
    // 取消提现申请接口
    withdrawCancel: '/api/public/withdraw/cancelWithdraw',
    // 提现计算返还折扣
    withdrawFeeDetail: '/api/public/withdraw/feeDetail/',
    // 提现详细信息
    withDrawDetalAll: '/api/public/withdraw/withdraw/orderDetail',
    // 垫资方提现
    allocatorWithdraw: '/api/public/withdraw/subsidyWithDaraw',
    // ****************************************往来企业接口******************************************* //
    // 往来企业列表接口
    getCompanies: '/api/relate/enterprise/',
    // 获取我的邀请企业列表接口
    getInvitationList: '/api/relate/invitation/',
    // 提交邀请请求
    submitInvitation: '/api/relate/invite/register',
    // 邀请列表重新发送密码
    postPassword: '/api/relate/resend/random/psd',
    // 邀请注册时校验邀请企业是否存在
    verifyName: '/api/public/check/',
    // 判断公司是否为企业方公司
    judgeIsEnterprise: '/api/payment/verify/payer/information',

    // **************************************消息中心************************************************ //
    getMessage: '/api/public/msg/',
    // **************************************明细账接口************************************************ //
    getItemizedAccount: '/api/public/ledger/list',
    // 来往企业账
    getEnpTrading: '/api/relate/relEnterprises/',
    // **************************************交易详单接口**********************************************//
    getAccountDetail: '/api/public/ledger/detail',
    /* **************************************二级市场 交易令买入方************************************************  */
    // 获取当前登录企业买入订单列表
    getBuyerList: '/api/buyer/list/',
    // 获取订单详情
    getBuyerDetail: '/api/buyer/buyer/orderDetail/',
    // 生成订单
    preBuy: '/api/buyer/preBuy/',
    // 购买令
    buyerBuy: '/api/buyer/buy',
    // 管理员审核接口
    buyerOrderDetail: '/api/buyer/buyer/audit/',
    // 获取第三方充值信息
    buyerTopUp: '/api/buyer/buyer/data/',
    // 检查是否交易成功
    checkSuccess: '/api/buyer/get/status/',
    /* **************************************二级市场 交易令出售方************************************************  */
    // 获取卖方订单列表
    getSellList: '/api/seller/sellOrderList',
    // 获取卖方订单详情
    getSellDetail: '/api/seller/sellOrderDetail',
    // 获取企业可用余额列表
    getAvailableSell: '/api/seller/availableSellList',
    // 根据勾选计算折合现金
    calculateCash: '/api/seller/calculate/cash',
    // 生成出售订单提交审核
    sellerOrder: '/api/seller/order',
    // 获取企业可用金额总额
    getSellTotal: '/api/seller/sellToalBalance',
    // 交易中心上架列表
    getTradingCenterList: '/api/seller/tradingCenterList',
    // 出售支付令订单详情
    getOderDetail: '/api/seller/orderDetail',
    // 卖方订单审批
    sellApproval: '/api/seller/sellApproval',
    // 卖方审核列表
    getOrderApprovalList: '/api/seller/orderApprovalList',
    // 根据截止日期算出服务费
    getTimeFee: '/api/seller/cal/fee',
    // 检查出售是否合格
    checkSellAmount: '/api/seller/checkAmount',
    /* **************************************支付相关************************************************  */
    getPayList: '/api/payment/pay/list/',
    // 支付提交接口
    payConfirm: '/api/payment/audit',
    // 超时支付提交接口
    payConfirmTimeOut: '/api/payment/resubmit',
    toPayDetail: '/api/payment/',
    toPayFeesDetail: '/api/payment/fees',
    // 取消申请的详情页接口
    pamentCancelDetail: '/api/payment/cancel/detail/',
    // 支付短信重新发送
    reSendPayMsg: '/api/psp/resendPaymentMsg/',
    // 支付短信提交
    payMsg: '/api/psp/paymentMsg/',
    // 获取企业联系人电话
    getContractP: '/api/psp/get/contract',
    /* **************************************银行短信接口************************************************  */
    // 提现短信重新发送
    reSendwithdrawMsg: '/api/psp/reSendwithdrawMsg/',
    // 提现短信发送
    withdrawMsg: '/api/psp/withdrawMsg/',
    /* **************************************账号管理************************************************  */
    // 账户信息
    getAccountInfo: '/api/account/getInfo',
    // 管理员信息
    getAdmin: '/api/account/getAdmin',
    // 发送短信验证码
    getSendCode: '/api/account/sendCode',
    // 注册最后发送验证码
    getCaSms: '/api/sms/send/ca/sms',
    // 验证旧手机验证码
    getValidMobile: '/api/account/validMobile',
    // 修改手机
    getModifyMobile: '/api/account/modifyMobile',
    // 修改密码 获取手机号
    // getMobile: '/api/account/password/getMobile',
    getMobile: '/api/user/getMobile',
    // 修改密码
    changePassword: '/api/user/password',
    // 管理员信息
    getAdminMessage: '/api/account/getEnterpriseAdmin',
    // 新增管理员
    addAdmin: '/api/account/addEnterpriseAdmin',
    // 修改管理员信息
    changeAdminMessage: '/api/account/updateEnterpriseAdmin/',
    // 替换新的管理员
    replaceOldAdmin: '/api/account/replaceAdmin/',
    // 获取注册银行信息
    getBankInfo: '/api/account/bank/init/info',
    /* *************************************Y角色账户升级*********************************************  */
    getEnterpriseInfo: '/api/account/enterprise/info',
    upgradeAccount: '/api/upgrader/account/application',
    upgradeGetAgentList: '/api/upgrader/agent/list',
    // 首页消息中心列表
    getMessageList: '/api/public/msg/list/',
    // 点击列表为已读接口
    markReaded: '/api/public/msg/',
    // 用户总金额
    getAccount: '/api/trade/account/getAccount',
    // 垫资方日志
    allocatorLogs: '/api/allocator/home/transaction/list/',
    /* *************************************以下为后台系统接口*********************************************  */
    // 首页 客户数量统计
    getClienteleCount: '/api/public/home/clientele/count',
    // 运营商余额和三方账户余额
    getAdminAccount: '/api/admin/enp/get/account/',
    // 明细账资金总额
    getLedgerTotal: '/api/public/ledger/total',
    // 企业姓名模糊搜索
    getEnpDim: '/api/admin/enp/dim/select/',
    // 企业姓名或信用代码查询
    serchEnp: '/api/admin/enp/select',
    // 获取三方订单信息
    getPspOrders: '/api/psp/orders/',
    // 仪表盘 漏斗数据
    getUserFunnel: '/api/public/home/user/funnel',
    // 仪表盘 交易统计 GET
    getTransCount: '/api/public/home/transaction/count',
    // 仪表盘 新增交易数据 GET
    getTransData: '/api/public/home/transaction/data',
    // 仪表盘 新增交易金额统计 GET
    getTranVolume: '/api/public/home/transaction/volume',
    // 仪表盘 新增交易金额数据 GET
    getTranTrend: '/api/public/home/transaction/trend',
    // 交易笔数统计
    getTrCount: '/api/admin/panel/transaction/count',
    // 获取新增交易数据
    getTrData: '/api/admin/panel/transaction/data',
    // 下载新增交易数据表格
    downloadCount: '/api/excel/export/count',
    // 成交额趋势
    getTrTrend: '/api/admin/panel/transaction/trend',
    // 获取交易额
    getTrVolume: '/api/admin/panel/transaction/volume',
    // 下载新增交易金额表格
    downloadAmount: '/api/excel/export/amount',
    // 分润统计数据
    getBenefitVolum: '/api/admin/panel/share/benefit',
    // 分润表格下载
    downloadBonus: '/api/excel/export/bonus',
    // 分红池统计
    getBonusCount: '/api/admin/panel/bonus/count',
    // 分红池直方图
    getBonusData: '/api/admin/panel/bonus/data',
    // 分红池表格下载
    downloadBenefit: '/api/excel/export/share/benefit',
    // 代理商列表
    getAgentList: '/api/admin/agent/list',
    // 后台代理商交易情况分析累计数据
    gatAgentOverview: '/api/public/agent/overview/',
    // 获取代理商的交易情况分析的概览信息
    getAgentTrend: '/api/public/agent/enterprise/trend/',
    // 后台代理商奖励分析
    getAgetnReward: '/api/public/agent/token/reward/trend/',
    // 获取资金方的交易情况分析的概览信息
    getFundOverview: '/api/trends/fund/overview/',
    // 资金方发行金额分析
    getFundIssue: '/api/trends/fund/issue/',
    // 资金方流通奖励分析
    getFundCurrency: '/api/trends/fund/currency/',
    // 资金方交易分析
    getFundTrade: '/api/trends/fund/trade/',
    // 企业信息审核列表
    auditEnterpriseList: '/api/admin/audit/list',
    // 统计企业方、代理商、资金方待处理个数
    getPendingNum: '/api/admin/audit/pending/num',
    // 企业方的交易情况分析的概览信息
    getEnterpriseOverview: '/api/trends/enp/overview/',
    // 企业金额概况信息
    getEnterpriseBalance: '/api/trends/enp/balance/overview/',
    // 企业金币概况信息
    getEnterpriseGold: '/api/trends/enp/gold/overview/',
    // 企业最近一个月概览
    getEnterpriseMonth: '/api/trends/enp/balance/overview/month/',
    // 企业方发行金额分析
    getEnterpriseIssue: '/api/trends/enp/issue/',
    // 企业方收支金额分析
    getEnterpriseIncome: '/api/trends/enp/income/expenses/',
    // 企业方提现金额分析
    getEnterpriseWithdraw: '/api/trends/enp/withdraw/',
    // 企业方收益分析
    getEnterpriseRebate: '/api/trends/enp/rebate/',
    // 企业方交易笔数分析
    getEnterpriseCount: '/api/trends/enp/tx/count/',
    // 企业信息审核详情
    auditEnterpriseDetail: '/api/admin/audit/enterprise/',
    // 代理商重新发送密码
    agentResendPad: '/api/admin/agent/resend/random/psd',
    // 代理商开户
    agentOpenAccount: '/api/admin/agent/open/account',
    // 代理商充值页面/
    getAgentDeposit: '/api/admin/agent/deposit',
    // 代理商充值/
    agentDeposit: '/api/admin/agent/deposit',
    // 代理商注销申请列表
    getAgentLogoutList: '/api/admin/agent/logout/list',
    // 代理商注销详情
    getAgentLogoutDetail: '/api/admin/agent/logout',
    // 代理商注销
    agentLogout: '/api/admin/agent/logout/audit',
    // 企业客户查询
    enterpriseList: '/api/public/enterprise/manage/',
    // 企业信息审批
    enterpriseAudit: '/api/admin/audit/',
    // 企业邀请次数充值
    depositInvitation: '/api/admin/manage/deposit/invitation',
    // 系统参数获取及设置
    systemConfig: '/api/admin/system/config',
    // ca监控
    CAmonitor: '/api/admin/ca/monitor/',
    // 获取代理商情况概览信息
    getServiceOverview: '/api/admin/service/overview/',
    // 获取代理商分析信息
    getServiceTrend: '/api/admin/service/enterprise/trend/',
    // 服务商奖励分析
    getServiceRewardTrend: '/api/admin/service/reward/trend/',
    // 验证码查询
    getAdminCode: '/api/admin/code/list/',
    // 查看系统修改折扣率记录
    systemLog: '/api/admin/system/log/',
    // 查看企业服务费费率
    getFeeRate: '/api/public/fee/rate/',
    // 修改服务费率
    updateFeeRate: '/api/public/update/rate/',
    // 查看账期和利率
    getTermRate: '/api/admin/get/term/rate',
    /* ************************************************ 代理商接口 ********************************************* */
    // 首页信息接口
    getAgentMessage: '/api/agent/account/home',
    // 代理商首页下拉接口
    getDropMessage: '/api/agent/account/home',
    // 代理商首页金币图标接口
    getChartGold: '/api/agent/account/home/gold/chart',
    // 代理商首页金额图标接口
    getChartMessage: '/api/agent/account/home/token/chart',
    // 代理商邀请列表接口
    getAgentInviteList: '/api/agent/enterprise/invite/list/',
    // 代理商邀请注册接口
    getAgentInviteRegister: '/api/agent/enterprise/invite/register',
    // 代理商升级列表接口
    getUpgradeList: '/api/agent/enterprise/list/',
    // 账户升级详情页-获取升级信息
    getUpgrade: '/api/agent/enterprise/detail/',
    // 账户升级详情页-提交请求
    approveTopUp: '/api/agent/enterprise/update/',
    // 升级页面的邀请余额
    getInviteFee: '/api/agent/enterprise/get/inviteFee',
    // 获取审批开通充值审批列表
    getEnpTopUpList: '/api/agent/enterprise/list/',
    // CA证书详情
    getCAMessage: '/api/public/ca/detail',
    // 申请注销
    applyCancellation: '/api/account/logout/application',
    // 代理商获取初始化数据
    getCommon: '/api/account/getInit',
    // 所有角色获取初始化数据
    getInit: '/api/account/getInit',
    // 代理商下的客户列表
    getEnterpriseAng: '/api/public/enterprise/',
    /* **************************************************** 公共接口部分 ****************************************** */
    // 获取当前用户ca证书信息
    getCAInfo: '/api/public/ca/detail',
    // 资金方联合发令申请
    applyJointToken: '/api/join/token/fund/application',
    // 资金方联合发令列表
    getJointTokenList: '/api/join/token/list/',
    // 申请取消联合发令
    applyCancelToken: '/api/join/token/cancelApplication',
    // 企业方获取订单详情
    orderDetail: '/api/join/token/getDetail/',
    // 审核申请取消
    auditApplyCancel: '/api/join/token/audit/canceled',
    // 跟踪信息
    tokenLog: '/api/join/token/log/',
    // 票据接口
    bile: '/api/bill/',
    // 发令信息
    tokenDetail: '/api/join/token/',
    // 提醒接口
    remind: '/api/join/token/remind',
    // 检测是否有等待审核的业务
    checkTransaction: '/api/public/check/transaction',
    // 获取充值提现最小额度接口
    sysParam: '/api/account/sys/param',
    // 获取联系人手机号
    getContract: '/api/public/contract/info',
    // 垫资方补贴返还直方图
    getBugetCount: '/api/trends/allocator/budget/count',
    // 获取资产总额和折合现金
    getAmount: '/api/account/get/amount',
    /* ********************************************* 企业方联合发令 ******************************************* */
    // 企业方审批联合发令方案  POST
    enterpriseAuditSchema: '/api/join/token/enp/audit/schema',
    // 资金方付款
    fundPayment: '/api/join/token/fund/pay/',
    // 完成背书
    achieveEndorse: '/api/join/token/enp/audit/endorse',
    // 企业方列表
    getEnterpriseList: '/api/join/token/getJointTokenRelate',
    // 资金方申请是判读企业是否存在
    judgeEnterprise: '/api/public/check/enterpriseName/',
    // 判断信用代码是否存在
    judgeEnterpriseCode: '/api/public/check/enterpriseCode/',
    // 判断企业方名称和信用代码是否一致
    judgeConsistency: '/api/public/check/codeAndName/',
    // 资金方首页金额
    getFundAmount: '/api/account/fund/getFundAccount',
    // 资金方完成发令 POST
    confirmToken: '/api/join/token/fund/confirm',
    // 检验票号是否申请
    verifyTicketExist: '/api/public/check/billNo/',
    // 企业方获取开通权限相关信息 GET
    topUpPermissionInfo: '/api/deposit/open/info',
    // 企业方提交申请开通权限
    openDeposit: '/api/deposit/open/deposit',
    // 获取开通费用相关信息 GET
    openDepositFee: '/api/deposit/open/fee/info',
    // 支付开通费用 POST
    payFee: '/api/deposit/open/fee/pay/',
    // 公共邀请接口
    applyInvitation: '/api/invite/register',
    // 公共邀请接口
    getInvitation: '/api/invite/url',
    // 发送邮件邀请
    sendInvite: '/api/invite/send/email',
    // 检查邀请链接是否有效
    checkInvite: '/api/invite/check',
    // 公共充值接口
    commonTopUp: '/api/admin/deposit/invitation/fee',
    // 后台资金方管理列表
    adminFund: '/api/admin/fund/manage/',
    // 后台代理商管理退款接口
    agentRefund: '/api/admin/refund/invitation/fee/',
    // 资金方和企业方获取邀请余额
    getFee: '/api/invite/fee',
    // 分红池首页获取分红池增加收益
    getBonusAddBenefit: '/api/bonus/home/benefit',
    // 分红池分润趋势
    getBonusProfit: '/api/bonus/home/allocation/trend',
    // 分红池累计数据
    getTotalData: '/api/bonus/home/getTotal',
    // 首页获取客户统计
    getBonusClientele: '/api/bonus/home/clientele/count',
    // 获取三方支付订单数据
    getThreePayMessage: '/api/three/parties/pay/',
    // 获取银行账户信息 GET
    getBankList: '/api/banks/list',
    // 增加银行账户 POST
    addBank: '/api/banks/add',
    // 检测是否设置支付密码 GET
    checkIsSetPayPassword: '/api/account/pay/password',
    // 设置支付密码 PUT
    setPayPassword: '/api/account/pay/password',
    // 验证短信 GET
    checkMsg: '/api/sms/verify/',
    // 获取充值订单信息
    getTopUpOrderMessage: '/api/deposit/detail/',
    // 取消交易
    cancelled: '/api/deposit/console/',
    // 删除银行卡功能接口
    deleteBanks: '/api/banks/delete',
    // 修改默认银行卡功能接口
    changeBanksDefault: '/api/banks/setting/default',
    // 检查充值是否交易成功
    checkIsTopUpScueess: '/api/deposit/get/status/',
    // 将订单标记为充值成功
    setTopUpSucceess: '/api/deposit/set/succeed/',
    // 将订单标记为购买成功
    setBuySucceess: '/api/buyer/set/succeed/',
    // 检查支付是否交易成功
    checkIsPaymentScueess: '/api/payment/check/succeed/',
    // 检查提现是否交易成功
    checkIsWithdrawScueess: '/api/public/withdraw/check/succeed/',
    // 获取短信(新) POST enum: [ Login, Register, Payment, Withdrawals, ResetPassword, ValidMobile, ChangeMobile, Receivable, Invite, RandomPassword ]
    // 登录验证码，注册验证码，支付验证码，提现验证码，重置密码验证码，验证手机号，修改手机号，收款验证码，邀请注册验证码, 邀请注册随机密码
    getSmsCode: '/api/sms/send',
    // 获取侧边栏导航上的提示数字
    getNavReminderNumber: '/api/public/counter/handled/values',
    downloadExcel: '/api/excel/export/',
    /* *********************************************** 账户认证接口 *********************************************** */
    getAccountBalance: '/api/account/balance',
    // 获取账户余额和可提现余额
    getAccountBalaceList: '/api/account/balance/list',
    // 获取令列表接口
    getAccountGold: '/api/allocator/home/balance/gold',
    // 获取金币发放提现接口
    getAccountGoldList: '/api/allocator/home/gold/list',
    // 获取金币发放列表接口
    postPersonalMessage: '/api/account/personal/info',
    // 获取可用余额列表接口
    getValibleList: '/api/account/balance/available/list',
    // 获取冻结列表接口
    getFrozenList: '/api/account/balance/frozen/list',
    // 获取对应企业信息
    getEnterpriseMessage: '/api/user/audit/',
    // 完成企业信息
    perfectionEnterprise: '/api/account/enterprise/info',
    // 获取代理商列表
    getAgentMessageList: '/api/account/agent/list',
    // 申请加入企业
    joinEnterprise: '/api/user/audit/',
    // 进入等待审核页面
    waitReview: '/api/account/enterprise/info',
    // 获取用户token及角色等信息
    getToken: '/api/refresh/token',
    // 查看自己的审核状态
    getApplyInfo: '/api/user/audit/apply/info',
    // 修改邮箱
    getModifyEmail: '/api/user/email',
    // 获取签约时间
    getSignTime: '/api/account/getSignTime',
    // 对公银行账户信息
    bankInfo: '/api/account/bankInfo',
    // 改变注册状态为成功接口
    enterpriseSuccess: '/api/account/enterprise/success',
    // 获取当前登录用户信息
    getCurrentUser: '/api/user/getCurrentUser',
    // 企业签约 提交验证码
    accountSign: '/api/account/sign/',
    /* *********************************************** 权限管理 *********************************************** */
    // 获取管理员信息接口
    getEnterpriseAdmin: '/api/user/audit/getEnterpriseAdmin/',
    // 替换管理员接口
    replaceAdmin: '/api/user/audit/replaceAdmin/',
    // 解除绑定
    fireAudit: '/api/user/audit/fire/',
    // 审核申请列表
    auditApplyList: '/api/user/audit/list/',
    // 审核申请详情
    auditApplyDetail: '/api/user/audit/info/',
    // 同意/拒绝审核加入
    auditApply: '/api/user/audit/audit/',
    // 修改手机号
    changePhoneNumber: '/api/account/modifyMobile/',
    // 输入新的手机号判断是否存在
    verifyPhoneNumber: '/api/public/check/userName/',
    // 检查信用代码是否存在接口
    verifyEnterpriseCode: '/api/public/check/enterpriseCode/',
    /* *********************************************** 管理员审核详情 *********************************************** */
    // 邀请记录
    getInviteLis: '/api/invite/invite/log/',
    // 用户列表
    getUserLis: '/api/public/user/list/',
    // 支付审核详情
    getPayDetail: '/api/payment/pay/'
  },
  // 后台系统企业状态
  agentStatusMap: {
    ENABLE: '正常',
    CANCEL: '已注销',
    WAIT_INIT: '待初始化'
  },
  // 后台代理商注销申请状态
  agentLogoutStatusMap: {
    Pending: '待处理',
    Rejected: '已拒绝',
    Succeed: '已注销'
  },
  // 权限管理用户类别
  enterpriseAdminStatusMap: {
    Admin: '管理员',
    Operator: '操作员'
  },
  // 后台企业信息审核状态
  enterpriseApproveStatusMap: {
    Pending: '待处理',
    Rejected: '已拒绝',
    Succeed: '已通过',
    OpenFailed: '开户失败',
    PspPending: '已通过',
    Waiting: '等待开户',
    Modifying: '开户失败',
    Failed: '开户失败'
  },
  apiResponseCode: {
    Succeed: 0,
    Failed: -1,
    ParamNotValid: 303
  },
  respBodyJsonP: {
    code: 'data.code',
    msg: 'data.msg',
    data: 'data.data'
  },
  pageSizes: [10, 20, 30],
  http: {
    status: {
      // 正常响应
      ok: 200,
      created: 201,
      // 未授权
      unauthorized: 401,
      // 禁止访问
      forbidden: 403
    }
  }
}

export default settings
