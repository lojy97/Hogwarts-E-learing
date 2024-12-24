importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging.js");
// Static Firebase Configuration
firebase.initializeApp({
  apiKey: "AIzaSyDe9udBO7hEmmRqwGQbQCsjhpLkG9rYUyc",
  authDomain: "hogwarts-c7c45.firebaseapp.com",
  projectId: "hogwarts-c7c45",
  storageBucket: "hogwarts-c7c45.firebasestorage.app",
  messagingSenderId: "230088672401",
  appId: "1:230088672401:web:2307df0163d06d6cc5eb30"
});

const messaging = firebase.messaging();


messaging.onMessage(messaging, (payload) => {
  console.log("Foreground notification received:", payload);

  const { title, body, image } = payload.notification;
  
  // Use Notification API to show notifications in foreground
  new Notification(title, {
    body: body,
    icon: image || "/default-icon.png",
  });
});
// Handle background notification
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload.notification?.title || "Default Title";
  const notificationOptions = {
    body: payload.notification?.body || "Default body",
    icon: payload.notification?.image || "/default-icon.png",
    data: {
      url: payload.data?.openUrl || "/",  // Open URL on click
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click (open URL)
self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data?.url || "/";
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});