const CACHE_NAME = 'installment-tracker-v5'
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
  self.skipWaiting()
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
  self.clients.claim()
})

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // 仅处理同源的 http/https GET 请求，过滤 chrome-extension 等协议
  const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
  const isGet = request.method === 'GET'
  const isSameOrigin = url.origin === self.location.origin
  if (!isHttp || !isGet || !isSameOrigin || url.protocol === 'chrome-extension:') {
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached
      }
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          const responseToCache = response.clone()
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, responseToCache))
            .catch(() => { })
          return response
        })
        .catch(() => cached || Response.error())
    }),
  )
})
