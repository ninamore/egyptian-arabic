// Service Worker for Egyptian Arabic App
// This file runs in the background, separate from the React app.
// It's what allows notifications to work even when the app is closed.

const CACHE_NAME = "egyptian-arabic-v1";

// Install event - fires once when the service worker is first registered
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installed");
  self.skipWaiting(); // activate immediately, don't wait for old SW to finish
});

// Activate event - fires when this SW takes control
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated");
  return self.clients.claim(); // take control of all open tabs immediately
});

// Push event - fires when a push notification arrives from the server
// This is the core of the whole feature
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push received");

  let data = { title: "يلا! 🔥", body: "Time to practice your Egyptian Arabic!" };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.error("[Service Worker] Failed to parse push data", e);
  }

  const options = {
    body: data.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    vibrate: [200, 100, 200], // vibration pattern on Android
    tag: "daily-reminder", // replaces previous notification with same tag instead of stacking
    data: { url: data.url || "/" }, // where to go when tapped
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event - fires when user taps the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it instead of opening a new tab
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
