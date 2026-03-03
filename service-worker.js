// service-worker.js

self.addEventListener("install", (event) => {
  console.log("🧩 Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker activo");
});

// ⚠️ IMPORTANTE:
// No interceptamos fetch para no romper Stripe