<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import BillManagementTable from './components/BillManagementTable.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import CurrencySwitcher from './components/CurrencySwitcher.vue'
import WelcomeModal from './components/WelcomeModal.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import { useCurrency } from './composables/useCurrency'

const { t } = useI18n()
const { currentCurrency, switchCurrency } = useCurrency()

// 欢迎模态框状态
const showWelcomeModal = ref(false)

// 检查是否首次访问
onMounted(() => {
  const hasVisited = localStorage.getItem('installment-tracker-visited')
  if (!hasVisited) {
    showWelcomeModal.value = true
  }
})

// 处理欢迎模态框确认
const handleWelcomeConfirm = () => {
  localStorage.setItem('installment-tracker-visited', 'true')
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0">
      <div
        class="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"
      />
      <div
        class="absolute top-0 right-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"
        style="animation-delay: 1s"
      />
      <div
        class="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"
        style="animation-delay: 2s"
      />
    </div>

    <!-- 主要内容 -->
    <div class="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <!-- 页面标题和设置切换器 - 仅在桌面端显示 -->
      <div class="hidden lg:block text-center mb-8 sm:mb-12 animate-fade-in">
        <div class="flex justify-end mb-4 sm:mb-6 gap-2 sm:gap-3">
          <CurrencySwitcher :model-value="currentCurrency" @update:model-value="switchCurrency" />
          <LanguageSwitcher />
        </div>
        <div
          class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl mb-4 sm:mb-6 shadow-2xl"
        >
          <svg
            class="w-8 h-8 sm:w-10 sm:h-10 text-white"
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
        <h1
          class="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-3 sm:mb-4"
        >
          {{ t('app.title') }}
        </h1>
        <p
          class="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4"
        >
          {{ t('app.description') }}
        </p>
      </div>

      <!-- 移动端设置切换器 -->
      <div class="lg:hidden flex justify-end mb-4 gap-2 animate-fade-in">
        <CurrencySwitcher :model-value="currentCurrency" @update:model-value="switchCurrency" />
        <LanguageSwitcher />
      </div>

      <!-- 账单管理表 -->
      <div class="animate-slide-up">
        <BillManagementTable />
      </div>
    </div>

    <!-- 欢迎模态框 -->
    <WelcomeModal v-model="showWelcomeModal" @confirm="handleWelcomeConfirm" />

    <!-- PWA 安装提示 -->
    <PWAInstallPrompt />
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
