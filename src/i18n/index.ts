import { createI18n } from 'vue-i18n'
import zhHans from './locales/zh-Hans.json'
import zhHant from './locales/zh-Hant.json'
import en from './locales/en.json'
import { getDefaultCurrency } from '../config/currencies'

// 获取浏览器语言
const getBrowserLocale = (): string => {
  const navigatorLocale = navigator.language
  if (navigatorLocale.startsWith('zh')) {
    if (navigatorLocale.includes('TW') || navigatorLocale.includes('HK')) {
      return 'zh-Hant'
    }
    return 'zh-Hans'
  }
  return 'en'
}

// 获取存储的语言设置
const getStoredLocale = (): string => {
  return localStorage.getItem('locale') || getBrowserLocale()
}

// 获取存储的币种设置
const getStoredCurrency = (locale: string) => {
  const storedCurrencyCode = localStorage.getItem('currency')
  if (storedCurrencyCode) {
    return storedCurrencyCode
  }
  // 根据语言自动选择默认币种
  return getDefaultCurrency(locale).code
}

export const SUPPORT_LOCALES = ['zh-Hans', 'zh-Hant', 'en'] as const
export type SupportLocale = (typeof SUPPORT_LOCALES)[number]

export const i18n = createI18n({
  legacy: false,
  locale: getStoredLocale(),
  fallbackLocale: 'zh-Hans',
  messages: {
    'zh-Hans': zhHans,
    'zh-Hant': zhHant,
    en: en,
  },
})

// 切换语言
export const setLocale = (locale: SupportLocale) => {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale

  // 如果用户没有手动设置币种，则根据语言自动切换
  if (!localStorage.getItem('currency')) {
    const defaultCurrency = getDefaultCurrency(locale)
    localStorage.setItem('currency', defaultCurrency.code)
  }
}

// 切换币种
export const setCurrency = (currencyCode: string) => {
  localStorage.setItem('currency', currencyCode)
}

// 获取当前币种代码
export const getCurrentCurrencyCode = (): string => {
  const locale = i18n.global.locale.value
  return getStoredCurrency(locale)
}

export default i18n
