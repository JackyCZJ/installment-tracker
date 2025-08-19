<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-white"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span class="text-sm font-medium">{{ currentLanguageLabel }}</span>
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
      class="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 z-50"
      @click="showDropdown = false"
    >
      <div class="py-2">
        <button
          v-for="language in languages"
          :key="language.code"
          @click="switchLanguage(language.code)"
          class="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl flex items-center"
          :class="{ 'bg-blue-100 text-blue-700': currentLocale === language.code }"
        >
          <span class="text-2xl mr-3">{{ language.flag }}</span>
          <div>
            <div class="font-medium text-gray-800">{{ language.name }}</div>
            <div class="text-sm text-gray-500">{{ language.nativeName }}</div>
          </div>
          <svg
            v-if="currentLocale === language.code"
            class="w-5 h-5 ml-auto text-blue-600"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, type SupportLocale } from '../i18n'

const { locale } = useI18n()
const showDropdown = ref(false)

const languages = [
  {
    code: 'zh-Hans' as SupportLocale,
    name: 'Simplified Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳',
  },
  {
    code: 'zh-Hant' as SupportLocale,
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    flag: '🇭🇰',
  },
  {
    code: 'en' as SupportLocale,
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
]

const currentLocale = computed(() => locale.value)

const currentLanguageLabel = computed(() => {
  const current = languages.find((lang) => lang.code === currentLocale.value)
  return current?.nativeName || 'Language'
})

const switchLanguage = (langCode: SupportLocale) => {
  setLocale(langCode)
  showDropdown.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

// 监听点击事件
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>
