export interface Purpose {
  id: string
  name: string
  icon: string
  color: string
  hidden?: boolean // 是否为隐藏选项
  description?: string
}

export const BILL_PURPOSES: Purpose[] = [
  // 日常生活类
  {
    id: 'daily_food',
    name: '日常饮食',
    icon: '🍽️',
    color: 'bg-orange-100 text-orange-800',
    description: '日常餐饮、外卖、聚餐等',
  },
  {
    id: 'commute',
    name: '通勤交通',
    icon: '🚗',
    color: 'bg-blue-100 text-blue-800',
    description: '上下班交通、油费、停车费等',
  },
  {
    id: 'shopping',
    name: '购物消费',
    icon: '🛍️',
    color: 'bg-pink-100 text-pink-800',
    description: '服装、日用品、电子产品等',
  },
  {
    id: 'entertainment',
    name: '娱乐休闲',
    icon: '🎮',
    color: 'bg-purple-100 text-purple-800',
    description: '电影、游戏、健身、娱乐等',
  },
  {
    id: 'education',
    name: '教育培训',
    icon: '📚',
    color: 'bg-green-100 text-green-800',
    description: '学费、培训费、书籍等',
  },
  {
    id: 'medical',
    name: '医疗健康',
    icon: '🏥',
    color: 'bg-red-100 text-red-800',
    description: '医疗费用、保健品、体检等',
  },

  // 大额消费类
  {
    id: 'travel',
    name: '旅游度假',
    icon: '✈️',
    color: 'bg-cyan-100 text-cyan-800',
    description: '旅游、度假、机票、酒店等',
  },
  {
    id: 'home_improvement',
    name: '家装家具',
    icon: '🏠',
    color: 'bg-yellow-100 text-yellow-800',
    description: '装修、家具、家电等',
  },
  {
    id: 'car_purchase',
    name: '买车',
    icon: '🚙',
    color: 'bg-indigo-100 text-indigo-800',
    description: '购买汽车及相关费用',
  },

  // 隐藏的大额选项
  {
    id: 'house_purchase',
    name: '买房',
    icon: '🏘️',
    color: 'bg-emerald-100 text-emerald-800',
    description: '购房贷款、首付等',
    hidden: true,
  },
  {
    id: 'business',
    name: '投资创业',
    icon: '💼',
    color: 'bg-slate-100 text-slate-800',
    description: '投资、创业资金等',
    hidden: true,
  },
  {
    id: 'emergency',
    name: '紧急支出',
    icon: '🚨',
    color: 'bg-rose-100 text-rose-800',
    description: '紧急情况、意外支出等',
    hidden: true,
  },

  // 其他
  {
    id: 'other',
    name: '其他',
    icon: '📝',
    color: 'bg-gray-100 text-gray-800',
    description: '其他用途',
  },
]

export const getVisiblePurposes = (): Purpose[] => {
  return BILL_PURPOSES.filter((purpose) => !purpose.hidden)
}

export const getHiddenPurposes = (): Purpose[] => {
  return BILL_PURPOSES.filter((purpose) => purpose.hidden)
}

export const getAllPurposes = (): Purpose[] => {
  return BILL_PURPOSES
}

export const getPurposeById = (id: string): Purpose | undefined => {
  return BILL_PURPOSES.find((purpose) => purpose.id === id)
}

export const getPurposeByName = (name: string): Purpose | undefined => {
  return BILL_PURPOSES.find((purpose) => purpose.name === name)
}

// 获取用途的显示名称（包含图标）
export const getPurposeDisplayName = (purpose: Purpose): string => {
  return `${purpose.icon} ${purpose.name}`
}

// 根据用途 ID 获取显示名称
export const getPurposeDisplayNameById = (id: string): string => {
  const purpose = getPurposeById(id)
  return purpose ? getPurposeDisplayName(purpose) : id
}
