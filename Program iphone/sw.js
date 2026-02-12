// Görsel Not Defterim - Service Worker (Offline Destek)
const CACHE_NAME = 'gorsel-not-defterim-v1';

// Önbelleğe alınacak dosyalar (GitHub Pages için index.html)
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Kurulum - dosyaları önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
      .catch((err) => console.log('Cache hatası:', err))
  );
});

// Aktif olduğunda eski cache'i temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// İstekleri yakala - önce cache, yoksa ağ
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
