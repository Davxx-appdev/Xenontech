import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './pages/sharedStyles.css';

function App() {
  const headerRef = useRef(null);
  const [paddingTop, setPaddingTop] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const isHeaderHiddenPage = location.pathname === '/' || location.pathname === '/login';
  const isBookmarksOrToDoListPage = location.pathname === '/bookmarks' || location.pathname === '/todolist' || location.pathname === '/feedback';
  const isDetailsPage = location.pathname.startsWith('/schools/') || location.pathname.startsWith('/staff/');
  const isSchoolOrStaffDetails = location.pathname.startsWith('/schools/') || location.pathname.startsWith('/staff/');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
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
  }, [isDetailsPage, searchTerm]);

  useLayoutEffect(() => {
    function updatePadding() {
      if (isHeaderHiddenPage || isBookmarksOrToDoListPage) {
        setPaddingTop(0);
        return;
      }

      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        let totalHeaderHeight = headerHeight;
        if (!isDetailsPage) {
          const searchBoxHeight = document.querySelector('.search-input')?.offsetHeight || 0;
          totalHeaderHeight += searchBoxHeight;
        }
        const additionalPadding = !isDetailsPage ? 40 : 10;
        setPaddingTop(totalHeaderHeight + additionalPadding);
      }
    }

    updatePadding();
    window.addEventListener('resize', updatePadding);

    const observer = new MutationObserver(updatePadding);
    if (headerRef.current) {
      observer.observe(headerRef.current, { attributes: true, childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('resize', updatePadding);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isHeaderHiddenPage, isDetailsPage, isBookmarksOrToDoListPage]);

  return (
    <div className={`App ${!isHeaderHiddenPage ? "show-header" : ""}`} style={{ paddingTop: isHeaderHiddenPage ? 0 : paddingTop }}>
      {!isHeaderHiddenPage && (
        <div ref={headerRef} className={`header ${isSchoolOrStaffDetails ? "custom-details-header" : ""}`}>
          {!isDetailsPage && !isBookmarksOrToDoListPage && (
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchTerm}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default App;