/* Lager-App: Offline-Cache. Bei jeder Änderung an index.html VERSION erhöhen (auch in index.html). */
var VERSION = '1.1.0';
var CACHE = 'lager-app-' + VERSION;
var DATEIEN = ['./', 'index.html', 'icon-180.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(DATEIEN);
  }).then(function () {
    return self.skipWaiting();
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) {
      return k.indexOf('lager-app-') === 0 && k !== CACHE;
    }).map(function (k) {
      return caches.delete(k);
    }));
  }).then(function () {
    return self.clients.claim();
  }));
});

/* Erst aus dem Cache (startet offline sofort), im Hintergrund aus dem Netz auffrischen. */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') { return; }
  if (req.url.indexOf(self.location.origin + '/') !== 0) { return; }
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(req, { ignoreSearch: true }).then(function (treffer) {
      var netz = fetch(req).then(function (res) {
        if (res && res.ok && res.type === 'basic' && res.redirected !== true) { c.put(req, res.clone()); }
        return res;
      });
      if (treffer) {
        netz.catch(function () { /* offline */ });
        return treffer;
      }
      return netz.catch(function () {
        if (req.mode !== 'navigate') { return Response.error(); }
        return c.match('./').then(function (r) { return r || Response.error(); });
      });
    });
  }));
});
