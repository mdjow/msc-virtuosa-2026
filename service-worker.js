const VERSION = 'msc-guide-v3';
const SHELL = `${VERSION}-shell`;
const APP_FILES = [
  './', './index.html', './manifest.webmanifest', './vendor/leaflet.css',
  './vendor/leaflet.js', './assets/icon.svg', './assets/icon-192.png',
  './assets/icon-512.png', './assets/buzios-praia-azeda.jpg',
  './assets/salvador-pelourinho.jpg', './assets/maceio-marco-corais.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('msc-guide-') && key !== SHELL).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(SHELL).then(cache => cache.put('./index.html', copy));
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  event.respondWith(caches.match(request).then(saved => saved || fetch(request)));
});
