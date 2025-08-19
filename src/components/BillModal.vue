<template>
  <div
    v-if="modelValue"
    :key="locale"
    class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-xl p-2 sm:p-4"
    @click="handleBackdropClick"
    style="backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px)"
  >
    <div
      class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
      style="
        border-radius: 1.5rem;
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
      "
      @click.stop
    >
      <div class="overflow-y-auto max-h-full">
        <!-- 模态框头部 -->
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div class="flex items-center">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-lg sm:text-xl font-bold text-gray-800">
                {{ isEditing ? t('billModal.editTitle') : t('billModal.addTitle') }}
              </h2>
              <p class="text-xs sm:text-sm text-gray-600">
                {{ isEditing ? t('billModal.editSubtitle') : t('billModal.addSubtitle') }}
              </p>
            </div>
          </div>
          <button
            @click="$emit('update:modelValue', false)"
            class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- 模态框内容 -->
        <div class="p-4 sm:p-6 pb-6 sm:pb-8">
          <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
            <!-- 账单名称 -->
            <div class="group">
              <label
                for="billName"
                class="block text-sm font-semibold text-gray-700 mb-3 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {{ t('billModal.billName') }}
              </label>
              <input
                id="billName"
                v-model="billName"
                type="text"
                class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                :placeholder="t('billModal.billNamePlaceholder')"
                required
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-400 text-sm">📝</span>
              </div>
            </div>

            <!-- 账单来源 -->
            <div class="group relative">
              <label
                for="billSource"
                class="block text-sm font-semibold text-gray-700 mb-3 flex items-center"
              >
                <svg
                  class="w-5 h-5 mr-2 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {{ t('billModal.source') }}
              </label>
              <input
                id="billSource"
                v-model="input.source"
                type="text"
                class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                :placeholder="t('billModal.sourcePlaceholder')"
                @focus="showSourceSuggestions = true"
                @blur="handleBlur"
                required
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-400 text-sm">🏦</span>
              </div>

              <!-- 来源建议下拉框 -->
              <div
                v-if="showSourceSuggestions && filteredSources.length > 0"
                class="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-48 overflow-y-auto"
              >
                <div
                  v-for="source in filteredSources"
                  :key="source"
                  @click="selectSource(source)"
                  class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {{ source }}
                </div>
              </div>
            </div>

            <!-- 账单用途 -->
            <div class="group relative">
              <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg
                  class="w-5 h-5 mr-2 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {{ t('billModal.purpose') }}
              </label>

              <!-- 显示用途选择器 -->
              <div class="relative">
                <button
                  @click="showPurposeSelector = !showPurposeSelector"
                  type="button"
                  class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800 flex items-center justify-between"
                >
                  <span v-if="selectedPurpose" class="flex items-center">
                    <span class="mr-2">{{ selectedPurpose.icon }}</span>
                    <span>{{ selectedPurpose.name }}</span>
                  </span>
                  <span v-else class="text-gray-400">{{ t('billModal.purposePlaceholder') }}</span>
                  <svg
                    class="w-5 h-5 text-gray-400 transition-transform"
                    :class="{ 'rotate-180': showPurposeSelector }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-400 text-sm">🏷️</span>
                </div>

                <!-- 用途选择下拉框 -->
                <div
                  v-if="showPurposeSelector"
                  class="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-64 overflow-y-auto"
                >
                  <!-- 常用用途 -->
                  <div class="p-2">
                    <h3
                      class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2"
                    >
                      {{ t('billModal.commonPurposes') }}
                    </h3>
                    <div
                      v-for="purpose in visiblePurposes"
                      :key="purpose.id"
                      @click="selectPurpose(purpose)"
                      class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                    >
                      <span class="text-lg mr-3">{{ purpose.icon }}</span>
                      <div class="flex-1">
                        <div class="font-medium text-gray-900">{{ purpose.name }}</div>
                        <div class="text-xs text-gray-500">{{ purpose.description }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- 分隔线 -->
                  <div class="border-t border-gray-200 my-1"></div>

                  <!-- 显示隐藏选项按钮 -->
                  <div class="p-2">
                    <button
                      @click="showHiddenPurposes = !showHiddenPurposes"
                      type="button"
                      class="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span>{{
                        showHiddenPurposes
                          ? t('billModal.hideHiddenPurposes')
                          : t('billModal.showHiddenPurposes')
                      }}</span>
                      <svg
                        class="w-4 h-4 transition-transform"
                        :class="{ 'rotate-180': showHiddenPurposes }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <!-- 隐藏的用途选项 -->
                    <div v-if="showHiddenPurposes" class="mt-2 space-y-1">
                      <div
                        v-for="purpose in hiddenPurposes"
                        :key="purpose.id"
                        @click="selectPurpose(purpose)"
                        class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                      >
                        <span class="text-lg mr-3">{{ purpose.icon }}</span>
                        <div class="flex-1">
                          <div class="font-medium text-gray-900">{{ purpose.name }}</div>
                          <div class="text-xs text-gray-500">{{ purpose.description }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 基本信息和还款方式 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- 账单总金额 -->
              <div class="group">
                <label
                  for="totalAmount"
                  class="block text-sm font-semibold text-gray-700 mb-3 flex items-center"
                >
                  <svg
                    class="w-5 h-5 mr-2 text-green-400"
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
                  {{ t('billModal.totalAmount') }}
                </label>
                <input
                  id="totalAmount"
                  v-model.number="input.totalAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                  :placeholder="t('billModal.totalAmountPlaceholder')"
                  required
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-400 text-sm">¥</span>
                </div>
              </div>

              <!-- 分期数 -->
              <div class="group">
                <label
                  for="installments"
                  class="block text-sm font-semibold text-gray-700 mb-3 flex items-center"
                >
                  <svg
                    class="w-5 h-5 mr-2 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {{ t('billModal.installments') }}
                </label>
                <input
                  id="installments"
                  v-model.number="input.installments"
                  type="number"
                  min="1"
                  max="360"
                  class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                  :placeholder="t('billModal.installmentsPlaceholder')"
                  required
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-400 text-sm">📊</span>
                </div>
              </div>

              <!-- 年利率 -->
              <div class="group">
                <label
                  for="annualRate"
                  class="block text-sm font-semibold text-gray-700 mb-3 flex items-center"
                >
                  <svg
                    class="w-5 h-5 mr-2 text-yellow-400"
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
                  {{ t('billModal.annualRate') }}
                </label>
                <input
                  id="annualRate"
                  v-model.number="input.annualRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                  :placeholder="t('billModal.annualRatePlaceholder')"
                  required
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-400 text-sm">%</span>
                </div>
              </div>
            </div>

            <!-- 还款方式 -->
            <div class="group">
              <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg
                  class="w-5 h-5 mr-2 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                {{ t('billModal.paymentMethod') }}
              </label>
              <div class="flex space-x-6">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="input.paymentMethod"
                    :value="PaymentMethod.EQUAL_PAYMENT"
                    type="radio"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('billModal.equalPayment') }}</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="input.paymentMethod"
                    :value="PaymentMethod.EQUAL_PRINCIPAL"
                    type="radio"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{
                    t('billModal.equalPrincipal')
                  }}</span>
                </label>
              </div>
            </div>

            <!-- 开始日期和自动计算 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 开始日期 -->
              <div class="group">
                <label
                  for="startDate"
                  class="block text-sm font-semibold text-gray-700 mb-3 flex items-center"
                >
                  <svg
                    class="w-5 h-5 mr-2 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {{ t('billModal.startDate') }}
                </label>
                <input
                  id="startDate"
                  v-model="startDateString"
                  type="date"
                  class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800"
                  :max="getCurrentDateString()"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-400 text-sm">📅</span>
                </div>
              </div>

              <!-- 自动计算已还期数 -->
              <div class="group">
                <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <svg
                    class="w-5 h-5 mr-2 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ t('billModal.autoCalculatePaidInstallments') }}
                </label>
                <div class="flex items-center space-x-3">
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="input.autoCalculatePaidInstallments"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{
                      t('billModal.enableAutoCalculate')
                    }}</span>
                  </label>
                  <button
                    v-if="input.autoCalculatePaidInstallments && startDateString"
                    @click="calculateAutoPaidInstallments"
                    type="button"
                    class="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                  >
                    {{ t('billModal.recalculate') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 已还期数和已还金额 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 已还期数 -->
              <div class="group">
                <label
                  for="paidInstallments"
                  class="block text-sm font-semibold text-gray-700 mb-3 flex items-center"
                >
                  <svg
                    class="w-5 h-5 mr-2 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ t('billModal.paidInstallments') }}
                  <span
                    v-if="input.autoCalculatePaidInstallments"
                    class="ml-2 text-xs text-green-600"
                    >{{ t('billModal.autoCalculated') }}</span
                  >
                </label>
                <input
                  id="paidInstallments"
                  v-model.number="input.paidInstallments"
                  type="number"
                  min="0"
                  :max="input.installments"
                  :disabled="input.autoCalculatePaidInstallments"
                  class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  :placeholder="t('billModal.paidInstallmentsPlaceholder')"
                  required
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-400 text-sm">✓</span>
                </div>
              </div>

              <!-- 已还金额 -->
              <div class="group">
                <label
                  for="paidAmount"
                  class="block text-sm font-semibold text-gray-700 mb-3 flex items-center"
                >
                  <svg
                    class="w-5 h-5 mr-2 text-red-400"
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
                  {{ t('billModal.paidAmount') }}
                  <span class="ml-2 text-xs text-gray-500">{{
                    t('billModal.autoCalculated')
                  }}</span>
                </label>
                <div class="relative">
                  <input
                    id="paidAmount"
                    v-model.number="input.paidAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    :max="input.totalAmount"
                    class="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                    :placeholder="t('billModal.paidAmountPlaceholder')"
                    readonly
                  />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 text-sm">¥</span>
                  </div>
                </div>
                <p class="mt-1 text-xs text-gray-500">{{ t('billModal.autoCalculatedDesc') }}</p>
              </div>
            </div>

            <!-- 验证提示 -->
            <div
              v-if="!isValidInput && hasInput"
              class="p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-sm text-red-600">{{ t('billModal.validationError') }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div
              class="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 pb-4 border-t border-gray-200 sticky bottom-0 bg-white/95 backdrop-blur-xl"
              style="
                backdrop-filter: blur(24px);
                -webkit-backdrop-filter: blur(24px);
                border-radius: 0 0 1.5rem 1.5rem;
              "
            >
              <button
                type="button"
                @click="$emit('update:modelValue', false)"
                class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
              >
                {{ t('billModal.cancel') }}
              </button>
              <button
                type="submit"
                :disabled="!isValidInput || !billName.trim() || !selectedPurpose"
                class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {{ isEditing ? t('billModal.saveChanges') : t('billModal.addBill') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInstallmentCalculator } from '../composables/useInstallmentCalculator'
import { useBillManager } from '../composables/useBillManager'
import { PaymentMethod } from '../types/installment'
import { calculatePaidInstallments } from '../utils/dateUtils'
import {
  getVisiblePurposes,
  getHiddenPurposes,
  getPurposeById,
  type Purpose,
} from '../config/purposes'

const props = defineProps<{
  modelValue: boolean
  editingBill?: {
    id: string
    name: string
    input: object
  } | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'bill-added': [bill: object]
  'bill-updated': [bill: object]
}>()

const { t, locale } = useI18n()
const { input, summary, isValidInput, resetForm } = useInstallmentCalculator()
const { billSources } = useBillManager()

const billName = ref('')
const showSourceSuggestions = ref(false)
const startDateString = ref('')

// 用途相关状态
const showPurposeSelector = ref(false)
const showHiddenPurposes = ref(false)
const selectedPurpose = ref<Purpose | null>(null)

// 获取用途选项
const visiblePurposes = getVisiblePurposes()
const hiddenPurposes = getHiddenPurposes()

// 计算属性
const isEditing = computed(() => !!props.editingBill)

// 获取当前日期字符串
const getCurrentDateString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 自动计算已还期数
const calculateAutoPaidInstallments = () => {
  if (!startDateString.value) return

  const startDate = new Date(startDateString.value)
  const paidInstallments = calculatePaidInstallments(startDate, input.value.installments)
  input.value.paidInstallments = paidInstallments
}

// 检查是否有输入
const hasInput = ref(false)
const checkHasInput = () => {
  hasInput.value =
    input.value.totalAmount > 0 ||
    input.value.installments > 0 ||
    input.value.annualRate > 0 ||
    input.value.paidInstallments > 0 ||
    input.value.paidAmount > 0
}

// 监听输入变化
watch(input, checkHasInput, { deep: true })

// 监听语言变化，强制重新渲染
watch(
  locale,
  () => {
    // 语言切换时，强制组件重新渲染
    // 通过更新key来强制重新渲染整个组件
    if (props.modelValue) {
      // 重新初始化表单状态以确保i18n正确应用
      nextTick(() => {
        // 确保DOM更新完成后再进行其他操作
      })
    }
  },
  { flush: 'post' },
)

// 过滤来源建议
const filteredSources = computed(() => {
  if (!input.value.source) return billSources.value
  return billSources.value.filter((source) =>
    source.toLowerCase().includes(input.value.source.toLowerCase()),
  )
})

// 选择来源
const selectSource = (source: string) => {
  input.value.source = source
  showSourceSuggestions.value = false
}

// 处理失焦事件
const handleBlur = () => {
  setTimeout(() => {
    showSourceSuggestions.value = false
  }, 200)
}

// 选择用途
const selectPurpose = (purpose: Purpose) => {
  selectedPurpose.value = purpose
  input.value.purpose = purpose.id
  showPurposeSelector.value = false
  showHiddenPurposes.value = false
}

// 处理背景点击
const handleBackdropClick = (event: Event) => {
  // 确保只有点击背景遮罩时才关闭Modal，不是点击Modal内容
  if (event.target === event.currentTarget) {
    emit('update:modelValue', false)
  }
}

// 监听开始日期变化，自动计算已还期数
watch(startDateString, (newDate) => {
  if (newDate && input.value.autoCalculatePaidInstallments) {
    calculateAutoPaidInstallments()
  }
})

// 监听自动计算开关变化
watch(
  () => input.value.autoCalculatePaidInstallments,
  (enabled) => {
    if (enabled && startDateString.value) {
      calculateAutoPaidInstallments()
    }
  },
)

// 监听编辑模式变化，填充数据
watch(
  () => props.editingBill,
  (bill) => {
    if (bill) {
      // 编辑模式：填充现有数据
      billName.value = bill.name
      input.value = { ...bill.input }
      if (bill.input.startDate) {
        startDateString.value = getCurrentDateString()
      }
      // 设置选中的用途
      if (bill.input.purpose) {
        selectedPurpose.value = getPurposeById(bill.input.purpose) || null
      }
    } else {
      // 添加模式：重置表单
      resetForm()
      billName.value = ''
      startDateString.value = ''
      selectedPurpose.value = null
      showPurposeSelector.value = false
      showHiddenPurposes.value = false
    }
  },
  { immediate: true },
)

// 提交表单
const handleSubmit = () => {
  if (!isValidInput.value || !billName.value.trim() || !summary.value || !selectedPurpose.value) {
    return
  }

  if (isEditing.value && props.editingBill) {
    // 编辑模式：更新账单
    emit('bill-updated', {
      id: props.editingBill.id,
      name: billName.value.trim(),
      input: { ...input.value },
      summary: summary.value,
    })
  } else {
    // 添加模式：添加新账单
    emit('bill-added', {
      name: billName.value.trim(),
      input: { ...input.value },
      summary: summary.value,
    })
  }

  // 关闭模态框
  emit('update:modelValue', false)
}
</script>
