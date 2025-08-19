export interface Currency {
  code: string
  symbol: string
  name: string
  nativeName: string
  flag: string
  decimalPlaces: number
  position: 'before' | 'after'
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    nativeName: '人民币',
    flag: '🇨🇳',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'TWD',
    symbol: 'NT$',
    name: 'Taiwan Dollar',
    nativeName: '新台币',
    flag: '🇭🇰',
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    nativeName: '美元',
    flag: '🇺🇸',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    nativeName: '欧元',
    flag: '🇪🇺',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    nativeName: '英镑',
    flag: '🇬🇧',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    nativeName: '日元',
    flag: '🇯🇵',
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'KRW',
    symbol: '₩',
    name: 'South Korean Won',
    nativeName: '韩元',
    flag: '🇰🇷',
    decimalPlaces: 0,
    position: 'before',
  },
  {
    code: 'HKD',
    symbol: 'HK$',
    name: 'Hong Kong Dollar',
    nativeName: '港币',
    flag: '🇭🇰',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    nativeName: '新加坡元',
    flag: '🇸🇬',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    nativeName: '加拿大元',
    flag: '🇨🇦',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    nativeName: '澳元',
    flag: '🇦🇺',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    nativeName: '瑞士法郎',
    flag: '🇨🇭',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'SEK',
    symbol: 'kr',
    name: 'Swedish Krona',
    nativeName: '瑞典克朗',
    flag: '🇸🇪',
    decimalPlaces: 2,
    position: 'after',
  },
  {
    code: 'NOK',
    symbol: 'kr',
    name: 'Norwegian Krone',
    nativeName: '挪威克朗',
    flag: '🇳🇴',
    decimalPlaces: 2,
    position: 'after',
  },
  {
    code: 'DKK',
    symbol: 'kr',
    name: 'Danish Krone',
    nativeName: '丹麦克朗',
    flag: '🇩🇰',
    decimalPlaces: 2,
    position: 'after',
  },
  {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    nativeName: '印度卢比',
    flag: '🇮🇳',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    nativeName: '巴西雷亚尔',
    flag: '🇧🇷',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    nativeName: '墨西哥比索',
    flag: '🇲🇽',
    decimalPlaces: 2,
    position: 'before',
  },
  {
    code: 'RUB',
    symbol: '₽',
    name: 'Russian Ruble',
    nativeName: '俄罗斯卢布',
    flag: '🇷🇺',
    decimalPlaces: 2,
    position: 'after',
  },
  {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    nativeName: '土耳其里拉',
    flag: '🇹🇷',
    decimalPlaces: 2,
    position: 'before',
  },
]

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return SUPPORTED_CURRENCIES.find((currency) => currency.code === code)
}

export const getDefaultCurrency = (locale: string): Currency => {
  const currencyMap: Record<string, string> = {
    'zh-Hans': 'CNY',
    'zh-Hant': 'TWD',
    en: 'USD',
    ja: 'JPY',
    ko: 'KRW',
    de: 'EUR',
    fr: 'EUR',
    es: 'EUR',
    it: 'EUR',
    pt: 'EUR',
    ru: 'RUB',
    tr: 'TRY',
    sv: 'SEK',
    no: 'NOK',
    da: 'DKK',
    hi: 'INR',
    'pt-BR': 'BRL',
    'es-MX': 'MXN',
  }

  const currencyCode = currencyMap[locale] || 'USD'
  return getCurrencyByCode(currencyCode) || SUPPORTED_CURRENCIES[0]
}

export const formatCurrency = (amount: number, currency: Currency): string => {
  const formattedAmount = amount.toFixed(currency.decimalPlaces)

  if (currency.position === 'before') {
    return `${currency.symbol}${formattedAmount}`
  } else {
    return `${formattedAmount} ${currency.symbol}`
  }
}
