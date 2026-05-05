const CACHE_NAME = 'biblia-reformada-v3'

const BIBLE_BOOKS = [
  '1corintios','1cronicas','1joao','1pedro','1reis','1samuel',
  '1tessalonicenses','1timoteo','2corintios','2cronicas','2joao',
  '2pedro','2reis','2samuel','2tessalonicenses','2timoteo','3joao',
  'abdias','ageu','all-verses','amos','apocalipse','atos','cantares',
  'colossenses','daniel','deuteronomio','eclesiastes','efesios','esdras',
  'ester','exodo','ezequiel','filemom','filipenses','galatas','genesis',
  'habacuque','hebreus','isaias','jeremias','jo','joao','joel','jonas',
  'josue','judas','juizes','lamentacoes','levitico','lucas','malaquias',
  'marcos','mateus','miqueias','naum','neemias','numeros','oseias',
  'proverbios','romanos','rute','salmos','sofonias','tiago','tito','zacarias'
]

const BIBLE_URLS = BIBLE_BOOKS.map(b => `/bible/${b}.json`)

const STATIC_ASSETS = [
  '/',
  '/bible',
  '/study',
  '/favorites',
  '/profile',
  '/manifest.json',
  '/icons/icon.svg',
]

// Install: pre-cache all Bible JSON files + static pages
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache static pages first (fast)
      cache.addAll(STATIC_ASSETS).catch(() => {})
      // Cache all Bible books (background — don't block install)
      return cache.addAll(BIBLE_URLS)
    })
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch strategy
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)

  // Bible JSON files — cache-first (they never change)
  if (url.pathname.startsWith('/bible/') && url.pathname.endsWith('.json')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
          }
          return res
        }).catch(() =>
          new Response(JSON.stringify({ error: 'Offline' }), {
            headers: { 'Content-Type': 'application/json' }
          })
        )
      })
    )
    return
  }

  // API routes — network only, no cache
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({ error: 'Offline' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    )
    return
  }

  // Google Fonts — cache first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(e.request).then(cached =>
        cached || fetch(e.request).then(res => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
          return res
        })
      )
    )
    return
  }

  // App pages/assets — network first, fallback to cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
        }
        return res
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match('/')))
  )
})
