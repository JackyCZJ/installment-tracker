const CACHE_NAME = 'installment-tracker-v3'
// 动态推导当前 scope 的路径，兼容任意子路径部署
const BASE_PATH = self.registration.scope.replace(/\/$/, '')
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icons/icon-192x192.png`,
  `${BASE_PATH}/icons/icon-512x512.png`,
]

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache opened successfully
      return cache.addAll(urlsToCache)
    }),
  )
})

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            // Deleting old cache
            return caches.delete(cacheName)
          }
          return Promise.resolve()
        }),
      )
    }),
  )
})

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果缓存中有响应，返回缓存的响应
      if (response) {
        return response
      }

      // 否则从网络获取
      return fetch(event.request).then((response) => {
        // 检查是否收到有效响应
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // 克隆响应
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})
