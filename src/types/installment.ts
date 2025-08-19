// 还款方式枚举
export enum PaymentMethod {
  EQUAL_PAYMENT = 'equal_payment', // 等额本息
  EQUAL_PRINCIPAL = 'equal_principal', // 等本等息
}

export interface InstallmentInput {
  totalAmount: number // 账单总金额
  installments: number // 分期数
  annualRate: number // 年利率
  paidInstallments: number // 已还分期数
  paidAmount: number // 已还金额
  source: string // 账单来源
  purpose: string // 账单用途
  paymentMethod: PaymentMethod // 还款方式
  startDate?: Date // 开始日期（可选）
  autoCalculatePaidInstallments?: boolean // 是否自动计算已还期数
}

export interface PaymentPlan {
  period: number // 期数
  remainingPrincipal: number // 剩余本金
  monthlyPayment: number // 月还款额
  principalPayment: number // 本金部分
  interestPayment: number // 利息部分
  totalPaid: number // 累计已还
  remainingAmount: number // 剩余金额
}

export interface InstallmentSummary {
  totalAmount: number
  totalInterest: number
  totalPayment: number
  remainingAmount: number
  progressPercentage: number
  paymentPlans: PaymentPlan[]
}

// 新增：账单记录类型
export interface BillRecord {
  id: string // 唯一标识
  name: string // 账单名称
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
  input: InstallmentInput // 输入数据
  summary: InstallmentSummary // 计算结果
}

// 新增：总账单统计
export interface TotalBillSummary {
  totalBills: number // 账单总数
  totalAmount: number // 总金额
  totalInterest: number // 总利息
  totalPayment: number // 总还款
  totalRemaining: number // 总剩余
  averageRate: number // 平均利率
}

// 新增：图表数据类型
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

// 新增：工资分析类型
export interface SalaryAnalysis {
  monthlySalary: number // 月工资
  totalMonthlyPayment: number // 总月还款额
  remainingSalary: number // 剩余工资
  paymentRatio: number // 还款占比
  monthlyPayments: {
    billName: string
    monthlyPayment: number
  }[]
}
