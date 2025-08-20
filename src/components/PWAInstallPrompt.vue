<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const showInstallPrompt = ref(false)
let deferredPrompt: BeforeInstallPromptEvent | null = null

onMounted(() => {
  // 检查是否已经安装
  const isInstalled = localStorage.getItem('pwa-installed') === 'true'
  if (isInstalled) return

  // 监听 beforeinstallprompt 事件
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent

    // 延迟显示安装提示
    setTimeout(() => {
      showInstallPrompt.value = true
    }, 3000)
  })

  // 监听 appinstalled 事件
  window.addEventListener('appinstalled', () => {
    localStorage.setItem('pwa-installed', 'true')
    showInstallPrompt.value = false
    deferredPrompt = null
  })
})

const installApp = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  if (outcome === 'accepted') {
    localStorage.setItem('pwa-installed', 'true')
    showInstallPrompt.value = false
  }

  deferredPrompt = null
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', 'true')
}
</script>

<template>
  <div
    v-if="showInstallPrompt"
    class="fixed bottom-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 animate-slide-up"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div
          class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-800">安装应用</h3>
          <p class="text-xs text-gray-600">将 InstallmentTracker 添加到主屏幕，获得更好的体验</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300"
          @click="installApp"
        >
          安装
        </button>
        <button
          class="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          @click="dismissPrompt"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
