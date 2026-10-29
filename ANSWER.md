# Week 05 Answers

1. In development, Vite's dev server answered the request and served `index.html` via fallback routing. In production, the web server (e.g., Nginx) must be configured with a fallback rule to redirect all unknown routes back to `index.html` so Vue Router can handle client-side routing on reload.

2. No, a student cannot successfully create an event on the server. Although the router guard only prevents UI navigation to `/events/new`, the backend server validates user roles/permissions on incoming requests and will reject unauthorized POST operations with a `403 Forbidden` error.

3. Using `onMounted` alone would fail to fetch new event details when navigating between different event IDs while remaining on the detail page, as the component instance is reused without remounting. A `watch` on the `id` prop with `immediate: true` ensures fetching runs on initial load and every time the `id` route parameter changes.

4. `EventsPage` uses `storeToRefs(store)` so that reactive properties like `events`, `status`, and `error` keep their reactivity when destructured. Destructuring directly with `const { events } = store` extracts plain JS values and breaks reactivity when store properties update.

5. If the second request fails, the created booking remains in `db.json` while the event's `booked` count is left outdated, leaving the data in an inconsistent state. The server should handle both operations atomically within a single API endpoint request or database transaction.
