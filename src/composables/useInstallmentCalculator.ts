import { ref, computed, watch } from 'vue'
import type { InstallmentInput, PaymentPlan, InstallmentSummary } from '../types/installment'
import { PaymentMethod } from '../types/installment'

export function useInstallmentCalculator() {
  const input = ref<InstallmentInput>({
    totalAmount: 0,
    installments: 12,
    annualRate: 0,
    paidInstallments: 0,
    paidAmount: 0,
    source: '',
    purpose: '', // 账单用途
    paymentMethod: PaymentMethod.EQUAL_PAYMENT, // 默认等额本息
    startDate: undefined,
    autoCalculatePaidInstallments: false,
  })

  // 自动计算已还金额
  const calculatePaidAmount = computed(() => {
    if (
      input.value.totalAmount <= 0 ||
      input.value.installments <= 0 ||
      input.value.paidInstallments <= 0
    ) {
      return 0
    }

    const monthlyRate = input.value.annualRate / 100 / 12
    let totalPaid = 0
    let remainingPrincipal = input.value.totalAmount

    if (input.value.paymentMethod === PaymentMethod.EQUAL_PAYMENT) {
      // 等额本息：每月还款额相同
      const monthlyPayment = calculateEqualPayment(
        input.value.totalAmount,
        monthlyRate,
        input.value.installments,
      )

      for (let i = 1; i <= input.value.paidInstallments; i++) {
        const interestPayment = remainingPrincipal * monthlyRate
        const principalPayment = monthlyPayment - interestPayment

        totalPaid += monthlyPayment
        remainingPrincipal -= principalPayment
      }
    } else {
      // 等本等息：每月本金相同，利息递减
      const monthlyPrincipal = input.value.totalAmount / input.value.installments

      for (let i = 1; i <= input.value.paidInstallments; i++) {
        const interestPayment = remainingPrincipal * monthlyRate
        const principalPayment = monthlyPrincipal
        const monthlyPayment = principalPayment + interestPayment

        totalPaid += monthlyPayment
        remainingPrincipal -= principalPayment
      }
    }

    return totalPaid
  })

  // 监听已还期数变化，自动更新已还金额
  watch(
    () => [
      input.value.paidInstallments,
      input.value.totalAmount,
      input.value.annualRate,
      input.value.installments,
      input.value.paymentMethod,
    ],
    () => {
      if (input.value.paidInstallments > 0) {
        input.value.paidAmount = calculatePaidAmount.value
      }
    },
    { deep: true },
  )

  const summary = computed<InstallmentSummary | null>(() => {
    if (!isValidInput.value) {
      return null
    }

    const monthlyRate = input.value.annualRate / 100 / 12
    const remainingPrincipal = input.value.totalAmount - input.value.paidAmount
    const remainingInstallments = input.value.installments - input.value.paidInstallments

    if (remainingInstallments <= 0) {
      return {
        totalAmount: input.value.totalAmount,
        totalInterest: 0,
        totalPayment: input.value.totalAmount,
        remainingAmount: 0,
        progressPercentage: 100,
        paymentPlans: [],
      }
    }

    const paymentPlans: PaymentPlan[] = []
    let currentPrincipal = remainingPrincipal
    let totalInterest = 0
    let totalPaid = input.value.paidAmount

    if (input.value.paymentMethod === PaymentMethod.EQUAL_PAYMENT) {
      // 等额本息：每月还款额相同
      const monthlyPayment = calculateEqualPayment(
        remainingPrincipal,
        monthlyRate,
        remainingInstallments,
      )

      for (let i = 1; i <= remainingInstallments; i++) {
        const interestPayment = currentPrincipal * monthlyRate
        const principalPayment = monthlyPayment - interestPayment

        totalInterest += interestPayment
        totalPaid += monthlyPayment
        currentPrincipal -= principalPayment

        paymentPlans.push({
          period: input.value.paidInstallments + i,
          remainingPrincipal: Math.max(0, currentPrincipal),
          monthlyPayment,
          principalPayment,
          interestPayment,
          totalPaid,
          remainingAmount: Math.max(0, currentPrincipal),
        })
      }
    } else {
      // 等本等息：每月本金相同，利息递减
      const monthlyPrincipal = remainingPrincipal / remainingInstallments

      for (let i = 1; i <= remainingInstallments; i++) {
        const interestPayment = currentPrincipal * monthlyRate
        const principalPayment = monthlyPrincipal
        const monthlyPayment = principalPayment + interestPayment

        totalInterest += interestPayment
        totalPaid += monthlyPayment
        currentPrincipal -= principalPayment

        paymentPlans.push({
          period: input.value.paidInstallments + i,
          remainingPrincipal: Math.max(0, currentPrincipal),
          monthlyPayment,
          principalPayment,
          interestPayment,
          totalPaid,
          remainingAmount: Math.max(0, currentPrincipal),
        })
      }
    }

    return {
      totalAmount: input.value.totalAmount,
      totalInterest,
      totalPayment: totalPaid,
      remainingAmount: Math.max(0, currentPrincipal),
      progressPercentage: (input.value.paidAmount / input.value.totalAmount) * 100,
      paymentPlans,
    }
  })

  const isValidInput = computed(() => {
    return (
      input.value.totalAmount > 0 &&
      input.value.installments > 0 &&
      input.value.annualRate >= 0 &&
      input.value.paidInstallments >= 0 &&
      input.value.paidAmount >= 0 &&
      input.value.paidInstallments <= input.value.installments &&
      input.value.paidAmount <= input.value.totalAmount
    )
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

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  function formatPercentage(value: number): string {
    return new Intl.NumberFormat('zh-CN', {
      style: 'percent',
      minimumFractionDigits: 2,
    }).format(value / 100)
  }

  // 重置表单
  function resetForm() {
    input.value = {
      totalAmount: 0,
      installments: 12,
      annualRate: 0,
      paidInstallments: 0,
      paidAmount: 0,
      source: '',
      purpose: '', // 账单用途
      paymentMethod: PaymentMethod.EQUAL_PAYMENT,
    }
  }

  // 确认计算
  function confirmCalculation() {
    if (isValidInput.value) {
      // 触发计算更新
      return true
    }
    return false
  }

  return {
    input,
    summary,
    isValidInput,
    calculatePaidAmount,
    formatCurrency,
    formatPercentage,
    resetForm,
    confirmCalculation,
  }
}
