import { ref, computed, watch, readonly } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  SUPPORTED_CURRENCIES, 
  getCurrencyByCode, 
  getDefaultCurrency, 
  formatCurrency,
  type Currency 
} from '../config/currencies'
import { getCurrentCurrencyCode, setCurrency } from '../i18n'

export function useCurrency() {
  const { locale } = useI18n()
  
  // 初始化当前币种
  const getInitialCurrency = (): Currency => {
    const currencyCode = getCurrentCurrencyCode()
    return getCurrencyByCode(currencyCode) || getDefaultCurrency(locale.value)
  }
  
  // 当前币种
  const currentCurrency = ref<Currency>(getInitialCurrency())

  // 监听语言变化，自动更新币种
  watch(locale, () => {
    const currencyCode = getCurrentCurrencyCode()
    const currency = getCurrencyByCode(currencyCode)
    if (currency) {
      currentCurrency.value = currency
    }
  })

  // 切换币种
  const switchCurrency = (currency: Currency) => {
    currentCurrency.value = currency
    setCurrency(currency.code)
  }

  // 格式化金额
  const formatAmount = (amount: number): string => {
    return formatCurrency(amount, currentCurrency.value)
  }

  // 获取所有支持的币种
  const supportedCurrencies = computed(() => SUPPORTED_CURRENCIES)

  // 根据代码获取币种
  const getCurrency = (code: string): Currency | undefined => {
    return getCurrencyByCode(code)
  }

  // 获取默认币种
  const getDefault = (): Currency => {
    return getDefaultCurrency(locale.value)
  }

  return {
    currentCurrency: readonly(currentCurrency),
    switchCurrency,
    formatAmount,
    supportedCurrencies,
    getCurrency,
    getDefault
  }
}
