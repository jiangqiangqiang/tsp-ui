import Vue from 'vue'
import BankList from '@/pages/bank-management/BankList'

describe('BankList.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(BankList)
    const vm = new Constructor().$mount()
    expect(vm.bankList).to.be.empty
  })
})
