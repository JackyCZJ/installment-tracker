<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    @click="handleBackdropClick"
  >
    <div
      class="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full max-w-md"
      @click.stop
    >
      <!-- 模态框头部 -->
      <div class="text-center p-6 border-b border-gray-200">
        <div
          class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          {{ t('welcome.title') }}
        </h2>
        <p class="text-sm sm:text-base text-gray-600">{{ t('welcome.subtitle') }}</p>
      </div>

      <!-- 模态框内容 -->
      <div class="p-6">
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              <svg
                class="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm sm:text-base text-gray-700">
                {{ t('welcome.feature1') }}
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              <svg
                class="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm sm:text-base text-gray-700">{{ t('welcome.feature2') }}</p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            >
              <svg
                class="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm sm:text-base text-gray-700">{{ t('welcome.feature3') }}</p>
            </div>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <svg
                  class="w-4 h-4 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm sm:text-base text-yellow-800 font-medium mb-1">
                  {{ t('welcome.importantNotice') }}
                </p>
                <p class="text-xs sm:text-sm text-yellow-700 mb-2">
                  {{ t('welcome.disclaimer') }}
                </p>
                <p class="text-xs text-yellow-600">
                  {{ t('welcome.licenseNotice') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="mt-6 pt-4 border-t border-gray-200">
          <button
            @click="handleConfirm"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 font-medium text-sm sm:text-base"
          >
            {{ t('welcome.confirmButton') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const handleBackdropClick = () => {
  // 不允许点击背景关闭，必须点击确认按钮
}

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>
