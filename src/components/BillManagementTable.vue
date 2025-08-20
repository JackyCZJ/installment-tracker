<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBillManager } from '../composables/useBillManager'
import type { BillRecord } from '../types/installment'
import { useCurrency } from '../composables/useCurrency'
import BillModal from './BillModal.vue'
import BillAnalysis from './BillAnalysis.vue'
import { formatDate } from '../utils/dateUtils'
import { getPurposeDisplayNameById } from '../config/purposes'

const { t } = useI18n()

const {
  bills,
  totalSummary,
  salaryAnalysis,
  addBill,
  updateBill,
  removeBill,
  exportToCSV,
  exportToPDF,
} = useBillManager()

const { formatAmount } = useCurrency()

const showAddModal = ref(false)
const showAnalysis = ref(false)
const editingBill = ref<BillRecord | null>(null)

// 编辑账单
const editBill = (bill: BillRecord) => {
  editingBill.value = bill
  showAddModal.value = true
}

// 处理账单添加
const handleBillAdded = (billData: Omit<BillRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
  addBill(billData.name, billData.input, billData.summary)
  editingBill.value = null
}

// 处理账单更新
const handleBillUpdated = (billData: Omit<BillRecord, 'createdAt' | 'updatedAt'>) => {
  updateBill((billData as any).id, billData.name, billData.input, billData.summary)
  editingBill.value = null
}

// 获取用途显示名称
const getPurposeDisplayName = (purpose: string) => {
  return getPurposeDisplayNameById(purpose) || purpose
}
</script>

<template>
  <div
    class="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20"
  >
    <!-- 头部 -->
    <div class="flex items-center justify-between mb-6 sm:mb-8">
      <div class="flex items-center">
        <div
          class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            {{ t('billManagement.title') }}
          </h2>
          <p class="text-xs sm:text-sm lg:text-base text-gray-300">
            {{ t('billManagement.subtitle') }}
          </p>
        </div>
      </div>

      <!-- 添加账单按钮 -->
      <button
        class="flex items-center justify-center px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base"
        @click="showAddModal = true"
      >
        <svg
          class="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1.5 sm:mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        {{ t('billManagement.addBill') }}
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <div
        class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-300">{{ t('billManagement.totalBills') }}</p>
            <p class="text-lg sm:text-xl lg:text-2xl font-bold text-white">{{ bills.length }}</p>
          </div>
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-300">总金额</p>
            <p class="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {{ formatAmount(totalSummary.totalAmount) }}
            </p>
          </div>
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500/20 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-300">总利息</p>
            <p class="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {{ formatAmount(totalSummary.totalInterest) }}
            </p>
          </div>
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs sm:text-sm text-gray-300">剩余金额</p>
            <p class="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {{ formatAmount(totalSummary.totalRemaining) }}
            </p>
          </div>
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-500/20 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 账单表格 -->
    <div class="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
      <!-- 移动端卡片视图 -->
      <div class="block lg:hidden">
        <div
          v-for="bill in bills"
          :key="bill.id"
          class="p-4 border-b border-white/10 last:border-b-0"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <div
                class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-white">{{ bill.name }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(bill.createdAt) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                class="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                :title="t('billManagement.edit')"
                @click="editBill(bill)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                class="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                :title="t('billManagement.delete')"
                @click="removeBill(bill.id)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p class="text-gray-400">{{ t('billManagement.source') }}</p>
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800"
              >
                {{ bill.input.source }}
              </span>
            </div>
            <div>
              <p class="text-gray-400">{{ t('billManagement.purpose') }}</p>
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {{ getPurposeDisplayName(bill.input.purpose) }}
              </span>
            </div>
            <div>
              <p class="text-gray-400">{{ t('billManagement.totalAmount') }}</p>
              <p class="text-white font-medium">{{ formatAmount(bill.input.totalAmount) }}</p>
            </div>
            <div>
              <p class="text-gray-400">{{ t('billManagement.installments') }}</p>
              <p class="text-white">{{ bill.input.installments }}</p>
            </div>
            <div>
              <p class="text-gray-400">{{ t('billManagement.annualRate') }}</p>
              <p class="text-white">{{ bill.input.annualRate }}%</p>
            </div>
            <div>
              <p class="text-gray-400">{{ t('billManagement.paidInstallments') }}</p>
              <p class="text-white">{{ bill.input.paidInstallments }}</p>
            </div>
            <div>
              <p class="text-gray-400">{{ t('billManagement.remainingAmount') }}</p>
              <p class="text-white font-medium">{{ formatAmount(bill.summary.remainingAmount) }}</p>
            </div>
          </div>

          <div class="mt-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-400">{{ t('billManagement.progress') }}</span>
              <span class="text-xs text-gray-300"
                >{{ bill.summary.progressPercentage.toFixed(1) }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full"
                :style="{ width: `${bill.summary.progressPercentage}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 桌面端表格视图 -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/10">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                {{ t('billManagement.billName') }}
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                {{ t('billManagement.source') }}
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                {{ t('billManagement.purpose') }}
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                {{ t('billManagement.totalAmount') }}
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                {{ t('billManagement.installments') }}
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                {{ t('billManagement.annualRate') }}
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                {{ t('billManagement.paidInstallments') }}
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                {{ t('billManagement.remainingAmount') }}
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                {{ t('billManagement.progress') }}
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-200">
                {{ t('billManagement.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="bill in bills" :key="bill.id" class="hover:bg-white/5 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3"
                  >
                    <svg
                      class="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">{{ bill.name }}</p>
                    <p class="text-xs text-gray-400">{{ formatDate(bill.createdAt) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800"
                >
                  {{ bill.input.source }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {{ getPurposeDisplayName(bill.input.purpose) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-white">
                {{ formatAmount(bill.input.totalAmount) }}
              </td>
              <td class="px-6 py-4 text-sm text-white">{{ bill.input.installments }}</td>
              <td class="px-6 py-4 text-sm text-white">{{ bill.input.annualRate }}%</td>
              <td class="px-6 py-4 text-sm text-white">{{ bill.input.paidInstallments }}</td>
              <td class="px-6 py-4 text-sm text-white">
                {{ formatAmount(bill.summary.remainingAmount) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      class="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full"
                      :style="{ width: `${bill.summary.progressPercentage}%` }"
                    />
                  </div>
                  <span class="text-xs text-gray-300"
                    >{{ bill.summary.progressPercentage.toFixed(1) }}%</span
                  >
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button
                    class="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                    :title="t('billManagement.edit')"
                    @click="editBill(bill)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    class="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    :title="t('billManagement.delete')"
                    @click="removeBill(bill.id)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-if="bills.length === 0" class="text-center py-8 sm:py-12">
        <div
          class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
        >
          <svg
            class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 class="text-base sm:text-lg font-medium text-gray-300 mb-2">
          {{ t('billManagement.emptyTitle') }}
        </h3>
        <p class="text-sm sm:text-base text-gray-400">{{ t('billManagement.emptyDesc') }}</p>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div
      v-if="bills.length > 0"
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-4"
    >
      <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <button
          class="flex items-center justify-center w-full sm:w-auto px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          @click="exportToCSV"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {{ t('billManagement.exportCSV') }}
        </button>
        <button
          class="flex items-center justify-center w-full sm:w-auto px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          @click="exportToPDF"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          {{ t('billManagement.exportPDF') }}
        </button>
      </div>

      <button
        class="flex items-center justify-center w-full sm:w-auto px-4 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
        @click="showAnalysis = true"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        {{ t('billManagement.dataAnalysis') }}
      </button>
    </div>

    <!-- 账单模态框 -->
    <BillModal
      v-model="showAddModal"
      :editing-bill="editingBill"
      @bill-added="handleBillAdded"
      @bill-updated="handleBillUpdated"
    />

    <!-- 分析模态框 -->
    <BillAnalysis
      v-if="showAnalysis"
      :bills="bills"
      :total-summary="totalSummary"
      :salary-analysis="salaryAnalysis || undefined"
      @close="showAnalysis = false"
    />
  </div>
</template>
