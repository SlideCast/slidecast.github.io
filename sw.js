const cacheName = 'cache-v1';
const precacheResources = [
  '/',
  'index.html',
  'recorder.html',
  'instructions.html',
  'viewer.html',
  'viewer.js',
  'lib/bootstrap-4.5.3.css',
  'lib/jquery-3.5.1.js',
  'lib/bootstrap-4.5.3.js',
  'lib/jquery-ui.css',
  'lib/jquery-1.12.4.js',
  'lib/jquery-ui.js',
  'jszip/vendor/FileSaver.js',
  'jszip/documentation/css/pygments.css',
  'jszip/documentation/css/main.css',
  'jszip/dist/jszip.js',
  'p5/p5.js',
  'howlerjs/howler.js',
  'pdfjs/pdf.js',
  'pdfjs/pdf.worker.js',
  'player/pdfRender.js',
  'player/getdata.js',
  'player/sketch.js',
  'recorder/pdfRender.js',
  'recorder/audio.js',
  'recorder/sketch.js',
  'recorder/saveData.js',
  'lib/jquery-1.9.1.js'
];

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
});
