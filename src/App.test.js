   // Prevent default pull-to-refresh interactions on mobile browsers
   const preventPullToRefresh = (event) => {
    if (window.scrollY !== 0) return;
    const startY = event.touches[0].pageY;
    const touchMoveHandler = (moveEvent) => {
      const moveY = moveEvent.touches[0].pageY;
      if (moveY > startY) {
        moveEvent.preventDefault();
      }
    };
    window.addEventListener('touchmove', touchMoveHandler, { passive: false });
    window.addEventListener('touchend', () => window.removeEventListener('touchmove', touchMoveHandler), { once: true });
  };
  window.addEventListener('touchstart', preventPullToRefresh, { passive: false });

  return () => {
    window.removeEventListener('touchstart', preventPullToRefresh);
  };