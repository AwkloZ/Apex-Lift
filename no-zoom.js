// Stops pinch-zoom on phones (the pages are made for one fixed size). Loaded in <head> by every page.
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
document.addEventListener('touchmove', function (e) { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
