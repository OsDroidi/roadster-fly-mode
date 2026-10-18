// Roadster: Fly Mode service worker: keeps the game and its fonts on the device so it plays offline.
// Bump VERSION when the icons or manifest change; the page itself refreshes from the network whenever it can.
const VERSION = 'v1';
const SHELL = 'flymode-shell-' + VERSION, FONTS = 'flymode-fonts-' + VERSION;
const FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/apple-touch-icon.png'];
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400..800&family=Montserrat:wght@400..800&display=swap';

// fetches the font stylesheet and the Arabic and Latin font files it points to
async function cacheFonts() {
  const cache = await caches.open(FONTS), res = await fetch(FONT_CSS, { mode: 'cors' });
  if (!res.ok) return;
  const css = await res.clone().text();
  await cache.put(FONT_CSS, res);
  const urls = [];
  for (const m of css.matchAll(/\/\* ([a-z-]+) \*\/[^}]*?url\(([^)]+)\)/g)) if (['arabic', 'latin', 'latin-ext'].includes(m[1])) urls.push(m[2].replace(/["']/g, ''));
  await Promise.all(urls.map(u => fetch(u, { mode: 'cors' }).then(r => r.ok && cache.put(u, r)).catch(() => {})));
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    await (await caches.open(SHELL)).addAll(FILES);
    await cacheFonts().catch(() => {});
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('flymode-') && k !== SHELL && k !== FONTS) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // the page: the network first so updates arrive, the saved copy when offline
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put('./', copy)); }
        return res;
      } catch (err) {
        return (await caches.match(req, { ignoreSearch: true })) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }
  // Google Fonts: from the cache when there, saved as they arrive otherwise
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith((async () => {
      const cache = await caches.open(FONTS), hit = await cache.match(req.url, { ignoreVary: true });
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') cache.put(req.url, res.clone());
      return res;
    })());
    return;
  }
  // the game's own files: the cache first, then the network
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      const hit = await caches.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); }
      return res;
    })());
  }
});
