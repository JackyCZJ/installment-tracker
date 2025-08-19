<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
    >
      <span class="text-sm font-medium">{{ currentCurrency.symbol }}</span>
      <svg
        class="w-4 h-4 ml-2 transition-transform duration-200"
        :class="{ 'rotate-180': showDropdown }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 z-50 max-h-96 overflow-y-auto"
      @click="showDropdown = false"
    >
      <div class="py-2">
        <!-- 搜索框 -->
        <div class="px-4 py-2 border-b border-gray-200">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索币种..."
            class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <!-- 币种列表 -->
        <div class="max-h-64 overflow-y-auto">
          <button
            v-for="currency in filteredCurrencies"
            :key="currency.code"
            @click="switchCurrency(currency)"
            class="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 flex items-center"
            :class="{ 'bg-blue-100 text-blue-700': currentCurrency.code === currency.code }"
          >
            <div class="flex-1">
              <div class="font-medium text-gray-800">{{ currency.symbol }} {{ currency.name }}</div>
              <div class="text-sm text-gray-500">{{ currency.nativeName }}</div>
            </div>
            <svg
              v-if="currentCurrency.code === currency.code"
              class="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        
        <!-- 无搜索结果 -->
        <div v-if="filteredCurrencies.length === 0" class="px-4 py-8 text-center text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p class="text-sm">未找到匹配的币种</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SUPPORTED_CURRENCIES, type Currency } from '../config/currencies'

const props = defineProps<{
  modelValue: Currency
}>()

const emit = defineEmits<{
  'update:modelValue': [currency: Currency]
}>()

const showDropdown = ref(false)
const searchQuery = ref('')

const currentCurrency = computed(() => props.modelValue)

const filteredCurrencies = computed(() => {
  if (!searchQuery.value) {
    return SUPPORTED_CURRENCIES
  }
  
  const query = searchQuery.value.toLowerCase()
  return SUPPORTED_CURRENCIES.filter(currency => 
    currency.name.toLowerCase().includes(query) ||
    currency.nativeName.toLowerCase().includes(query) ||
    currency.code.toLowerCase().includes(query) ||
    currency.symbol.toLowerCase().includes(query)
  )
})

const switchCurrency = (currency: Currency) => {
  emit('update:modelValue', currency)
  showDropdown.value = false
  searchQuery.value = ''
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
    searchQuery.value = ''
  }
}

// 监听点击事件
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>
