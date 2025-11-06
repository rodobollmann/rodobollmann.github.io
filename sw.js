self.addEventListener('push', event => {
    let data = {}; try { data = event.data ? event.data.json() : {}; } catch (e) { }
    const title = data.title || 'Notificación';
    const opts = {
        body: data.body || '', icon: data.iconUrl, image: data.imageUrl,
        data: { url: data.clickUrl || '/' }, actions: data.actions || []
    };
    event.waitUntil(self.registration.showNotification(title, opts));
});
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
    event.waitUntil((async () => {
        const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
        const win = all.find(c => c.url.includes(url));
        if (win) return win.focus();
        return clients.openWindow(url);
    })());
});