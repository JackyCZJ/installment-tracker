import { ref, computed, watch } from 'vue'
import type {
  BillRecord,
  TotalBillSummary,
  InstallmentInput,
  InstallmentSummary,
  SalaryAnalysis,
} from '../types/installment'
import { PaymentMethod } from '../types/installment'

const STORAGE_KEY = 'payslip_bills'
const SOURCES_KEY = 'payslip_sources'
const SALARY_KEY = 'payslip_salary'

export function useBillManager() {
  const bills = ref<BillRecord[]>([])
  const selectedBillId = ref<string | null>(null)
  const billSources = ref<string[]>([])
  const monthlySalary = ref<number>(0)

  // 从localStorage加载数据
  function loadFromStorage() {
    try {
      const storedBills = localStorage.getItem(STORAGE_KEY)
      if (storedBills) {
        const parsedBills = JSON.parse(storedBills)
        // 转换日期字符串为Date对象
        bills.value = parsedBills.map((bill: any) => ({
          ...bill,
          createdAt: new Date(bill.createdAt),
        }))
      }

      const storedSources = localStorage.getItem(SOURCES_KEY)
      if (storedSources) {
        billSources.value = JSON.parse(storedSources)
      }

      const storedSalary = localStorage.getItem(SALARY_KEY)
      if (storedSalary) {
        monthlySalary.value = JSON.parse(storedSalary)
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error)
    }
  }

  // 保存数据到localStorage
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bills.value))
      localStorage.setItem(SOURCES_KEY, JSON.stringify(billSources.value))
      localStorage.setItem(SALARY_KEY, JSON.stringify(monthlySalary.value))
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
    }
  }

  // 初始化时加载数据
  loadFromStorage()

  // 监听数据变化，自动保存
  watch(bills, saveToStorage, { deep: true })
  watch(billSources, saveToStorage, { deep: true })
  watch(monthlySalary, saveToStorage, { deep: true })

  // 添加新账单
  function addBill(name: string, input: InstallmentInput, summary: InstallmentSummary) {
    const newBill: BillRecord = {
      id: generateId(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      input,
      summary,
    }

    bills.value.push(newBill)
    selectedBillId.value = newBill.id

    // 添加账单来源到历史记录
    if (input.source && !billSources.value.includes(input.source)) {
      billSources.value.push(input.source)
    }

    return newBill
  }

  // 更新账单
  function updateBill(
    id: string,
    name: string,
    input: InstallmentInput,
    summary: InstallmentSummary,
  ) {
    const index = bills.value.findIndex((bill) => bill.id === id)
    if (index > -1) {
      bills.value[index] = {
        ...bills.value[index],
        name,
        input,
        summary,
        updatedAt: new Date(),
      }

      // 添加账单来源到历史记录
      if (input.source && !billSources.value.includes(input.source)) {
        billSources.value.push(input.source)
      }
    }
  }

  // 删除账单
  function removeBill(id: string) {
    const index = bills.value.findIndex((bill) => bill.id === id)
    if (index > -1) {
      bills.value.splice(index, 1)
      if (selectedBillId.value === id) {
        selectedBillId.value = bills.value.length > 0 ? bills.value[0].id : null
      }
    }
  }

  // 选择账单
  function selectBill(id: string) {
    selectedBillId.value = id
  }

  // 获取选中的账单
  const selectedBill = computed(() => {
    return bills.value.find((bill) => bill.id === selectedBillId.value) || null
  })

  // 计算总账单统计
  const totalSummary = computed<TotalBillSummary>(() => {
    if (bills.value.length === 0) {
      return {
        totalBills: 0,
        totalAmount: 0,
        totalInterest: 0,
        totalPayment: 0,
        totalRemaining: 0,
        averageRate: 0,
      }
    }

    const totalAmount = bills.value.reduce((sum, bill) => sum + bill.input.totalAmount, 0)
    const totalInterest = bills.value.reduce((sum, bill) => sum + bill.summary.totalInterest, 0)
    const totalPayment = bills.value.reduce((sum, bill) => sum + bill.summary.totalPayment, 0)
    const totalRemaining = bills.value.reduce((sum, bill) => sum + bill.summary.remainingAmount, 0)
    const averageRate =
      bills.value.reduce((sum, bill) => sum + bill.input.annualRate, 0) / bills.value.length

    return {
      totalBills: bills.value.length,
      totalAmount,
      totalInterest,
      totalPayment,
      totalRemaining,
      averageRate,
    }
  })

  // 计算工资分析
  const salaryAnalysis = computed<SalaryAnalysis | null>(() => {
    if (monthlySalary.value <= 0 || bills.value.length === 0) {
      return null
    }

    // 计算每个账单的月还款额
    const monthlyPayments = bills.value.map((bill) => {
      const remainingPrincipal = bill.input.totalAmount - bill.input.paidAmount
      const remainingInstallments = bill.input.installments - bill.input.paidInstallments

      if (remainingInstallments <= 0) {
        return { billName: bill.name, monthlyPayment: 0 }
      }

      const monthlyRate = bill.input.annualRate / 100 / 12
      let monthlyPayment = 0

      if (bill.input.paymentMethod === PaymentMethod.EQUAL_PAYMENT) {
        // 等额本息：每月还款额相同
        monthlyPayment = calculateEqualPayment(
          remainingPrincipal,
          monthlyRate,
          remainingInstallments,
        )
      } else {
        // 等本等息：每月本金相同，利息递减
        const monthlyPrincipal = remainingPrincipal / remainingInstallments
        const firstMonthInterest = remainingPrincipal * monthlyRate
        monthlyPayment = monthlyPrincipal + firstMonthInterest
      }

      return { billName: bill.name, monthlyPayment }
    })

    const totalMonthlyPayment = monthlyPayments.reduce((sum, item) => sum + item.monthlyPayment, 0)
    const remainingSalary = monthlySalary.value - totalMonthlyPayment
    const paymentRatio = (totalMonthlyPayment / monthlySalary.value) * 100

    return {
      monthlySalary: monthlySalary.value,
      totalMonthlyPayment,
      remainingSalary,
      paymentRatio,
      monthlyPayments,
    }
  })

  // 计算等额本息月还款额
  function calculateEqualPayment(
    principal: number,
    monthlyRate: number,
    installments: number,
  ): number {
    if (monthlyRate === 0) {
      return principal / installments
    }

    const rate = monthlyRate
    const n = installments

    if (rate === 0) return principal / n

    return (principal * (rate * Math.pow(1 + rate, n))) / (Math.pow(1 + rate, n) - 1)
  }

  // 生成唯一ID
  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // 导出为CSV
  function exportToCSV() {
    if (bills.value.length === 0) return

    const headers = [
      '账单名称',
      '账单来源',
      '创建时间',
      '总金额',
      '分期数',
      '年利率',
      '已还期数',
      '已还金额',
      '总利息',
      '总还款',
      '剩余金额',
      '还款进度',
    ]

    const rows = bills.value.map((bill) => [
      bill.name,
      bill.input.source,
      bill.createdAt.toLocaleString('zh-CN'),
      bill.input.totalAmount,
      bill.input.installments,
      bill.input.annualRate,
      bill.input.paidInstallments,
      bill.input.paidAmount,
      bill.summary.totalInterest,
      bill.summary.totalPayment,
      bill.summary.remainingAmount,
      `${bill.summary.progressPercentage.toFixed(2)}%`,
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `分期账单汇总_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // 导出为PDF（简化版，实际项目中可以使用jsPDF等库）
  function exportToPDF() {
    if (bills.value.length === 0) return

    // 创建打印友好的HTML
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>分期账单汇总</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { margin: 20px 0; padding: 15px; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>分期账单汇总报告</h1>
            <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
          </div>
          
          <div class="summary">
            <h2>总体统计</h2>
            <p>账单总数: ${totalSummary.value.totalBills}</p>
            <p>总金额: ¥${totalSummary.value.totalAmount.toLocaleString()}</p>
            <p>总利息: ¥${totalSummary.value.totalInterest.toLocaleString()}</p>
            <p>总还款: ¥${totalSummary.value.totalPayment.toLocaleString()}</p>
            <p>总剩余: ¥${totalSummary.value.totalRemaining.toLocaleString()}</p>
            <p>平均利率: ${totalSummary.value.averageRate.toFixed(2)}%</p>
            ${
              salaryAnalysis.value
                ? `
            <h3>工资分析</h3>
            <p>月工资: ¥${salaryAnalysis.value.monthlySalary.toLocaleString()}</p>
            <p>月还款总额: ¥${salaryAnalysis.value.totalMonthlyPayment.toLocaleString()}</p>
            <p>剩余工资: ¥${salaryAnalysis.value.remainingSalary.toLocaleString()}</p>
            <p>还款占比: ${salaryAnalysis.value.paymentRatio.toFixed(1)}%</p>
            `
                : ''
            }
          </div>

          <table>
            <thead>
              <tr>
                <th>账单名称</th>
                <th>账单来源</th>
                <th>总金额</th>
                <th>分期数</th>
                <th>年利率</th>
                <th>已还期数</th>
                <th>已还金额</th>
                <th>总利息</th>
                <th>总还款</th>
                <th>剩余金额</th>
                <th>还款进度</th>
              </tr>
            </thead>
            <tbody>
              ${bills.value
                .map(
                  (bill) => `
                <tr>
                  <td>${bill.name}</td>
                  <td>${bill.input.source}</td>
                  <td>¥${bill.input.totalAmount.toLocaleString()}</td>
                  <td>${bill.input.installments}</td>
                  <td>${bill.input.annualRate}%</td>
                  <td>${bill.input.paidInstallments}</td>
                  <td>¥${bill.input.paidAmount.toLocaleString()}</td>
                  <td>¥${bill.summary.totalInterest.toLocaleString()}</td>
                  <td>¥${bill.summary.totalPayment.toLocaleString()}</td>
                  <td>¥${bill.summary.remainingAmount.toLocaleString()}</td>
                  <td>${bill.summary.progressPercentage.toFixed(2)}%</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  return {
    bills,
    selectedBillId,
    selectedBill,
    totalSummary,
    billSources,
    monthlySalary,
    salaryAnalysis,
    addBill,
    updateBill,
    removeBill,
    selectBill,
    exportToCSV,
    exportToPDF,
  }
}
