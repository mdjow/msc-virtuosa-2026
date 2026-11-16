const VERSION = 'msc-guide-v5-full-reference';
const SHELL = `${VERSION}-shell`;
const APP_FILES = ['./', './index.html', './manifest.webmanifest', './vendor/leaflet.css', './vendor/leaflet.js', './assets/buzios-azeda.jpg', './assets/buzios-joao-fernandes.jpg', './assets/buzios-orla-bardot.jpg', './assets/buzios-orla.jpg', './assets/buzios-ossos.jpg', './assets/buzios-pier.jpg', './assets/buzios-rua-pedras.jpg', './assets/icon-192.png', './assets/icon-512.png', './assets/icon.svg', './assets/maceio-bodega.jpg', './assets/maceio-feira.jpg', './assets/maceio-frances.jpg', './assets/maceio-letreiro.jpg', './assets/maceio-marco-corais.jpg', './assets/maceio-marco.jpg', './assets/maceio-pajucara.jpg', './assets/maceio-piscinas.jpg', './assets/maceio-ponta-verde.jpg', './assets/maceio-terminal.jpg', './assets/msc-virtuosa.jpg', './assets/salvador-bahia-news.jpg', './assets/salvador-elevador.jpg', './assets/salvador-farol.jpg', './assets/salvador-mercado.jpg', './assets/salvador-pelourinho-largo.jpg', './assets/salvador-pelourinho.jpg', './assets/salvador-sao-francisco.jpg', './assets/salvador-terreiro.jpg', './assets/santos-concais.jpg'];

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
      caches.open(SHELL).then(cache => cache.put('./index.html', response.clone()));
      return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(saved => saved || fetch(request)));
});
