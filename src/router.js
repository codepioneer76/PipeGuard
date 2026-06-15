let currentCleanup = null;

const routes = {};

export function registerRoute(hash, renderFn, cleanupFn) {
  routes[hash] = { render: renderFn, cleanup: cleanupFn || null };
}

export function navigateTo(hash) {
  window.location.hash = hash;
}

export function getCurrentRoute() {
  return window.location.hash || '#/login';
}

export function initRouter(appContainer) {
  const handleRoute = () => {
    // Cleanup previous page
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }

    const hash = window.location.hash || '#/login';
    const route = routes[hash];

    if (route) {
      appContainer.innerHTML = '';
      route.render(appContainer);
      currentCleanup = route.cleanup || null;
    } else {
      appContainer.innerHTML = `
        <div class="flex items-center justify-center h-screen">
          <div class="text-center">
            <h1 class="text-6xl font-bold text-cyan-400 mb-4">404</h1>
            <p class="text-gray-400 text-lg">Page not found</p>
            <a href="#/dashboard" class="mt-6 inline-block px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">Go to Dashboard</a>
          </div>
        </div>
      `;
    }
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Initial route
}
