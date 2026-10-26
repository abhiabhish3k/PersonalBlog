import React, { useState, useEffect } from 'react';
import SiteHeader from './components/site/SiteHeader.jsx';
import SiteFooter from './components/site/SiteFooter.jsx';
import AdminSidebar from './components/admin/AdminSidebar.jsx';
import ToastProvider from './components/ui/Toast.jsx';

import HomePage from './pages/HomePage.jsx';
import WritingPage from './pages/WritingPage.jsx';
import StoryPage from './pages/StoryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import SubscribePage from './pages/SubscribePage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import RssPage from './pages/RssPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminForgotPage from './pages/admin/AdminForgotPage.jsx';
import AdminResetPage from './pages/admin/AdminResetPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminEditorPage from './pages/admin/AdminEditorPage.jsx';
import AdminMediaPage from './pages/admin/AdminMediaPage.jsx';
import AdminThemesPage from './pages/admin/AdminThemesPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';

import { getAdminAuth, subscribeStorage, getStoryById, initializeStorage } from './lib/storage.js';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(window.location.search).entries())
  );
  const [hash, setHash] = useState(window.location.hash || '');
  const [adminUser, setAdminUser] = useState(getAdminAuth());
  const [, setStorageTick] = useState(0);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState('');

  // Load the Supabase-backed store before rendering pages.
  useEffect(() => {
    const unsubscribe = subscribeStorage(() => {
      setAdminUser(getAdminAuth());
      setStorageTick((t) => t + 1);
    });
    initializeStorage()
      .then(() => setStorageError(''))
      .catch((error) => setStorageError(error.message || 'Could not connect to Supabase.'))
      .finally(() => setStorageReady(true));
    return unsubscribe;
  }, []);

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(Object.fromEntries(new URLSearchParams(window.location.search).entries()));
      setHash(window.location.hash);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation function that updates browser URL and state
  const navigate = (path, params = {}) => {
    let url = path;
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.set(k, v);
    });
    const queryString = query.toString();
    if (queryString) {
      url += '?' + queryString;
    }

    window.history.pushState({}, '', url);
    setCurrentPath(path.split('#')[0]);
    setSearchParams(params);
    setHash(path.includes('#') ? '#' + path.split('#')[1] : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine current route matching
  const isAdminRoute = currentPath.startsWith('/admin');
  const isAdminAuthRoute =
    currentPath === '/admin/login' ||
    currentPath === '/admin/forgot' ||
    currentPath === '/admin/reset';

  // Admin protection middleware check:
  // Redirect every /admin/* route except login & forgot to /admin/login when no valid session
  useEffect(() => {
    if (storageReady && isAdminRoute && !isAdminAuthRoute && !adminUser) {
      navigate('/admin/login');
    }
  }, [currentPath, adminUser, isAdminRoute, isAdminAuthRoute, storageReady]);

  if (!storageReady) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EEF1EA] p-6 text-[#1F2A24]">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-2">Connecting to your blog…</h1>
          <p className="text-sm text-[#4F5B53]">Loading posts and settings from Supabase.</p>
        </div>
      </main>
    );
  }

  if (storageError) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#EEF1EA] p-6 text-[#1F2A24]">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl w-full">
          <h1 className="text-2xl font-bold mb-3">Supabase setup needs attention</h1>
          <p className="text-sm mb-4">{storageError}</p>
          <p className="text-sm text-[#4F5B53]">Confirm that .env.local contains VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, run the SQL migration in supabase/migrations/0001_init.sql, then restart npm run dev.</p>
        </div>
      </main>
    );
  }

  // Render Page Content
  const renderContent = () => {
    // 1. Public Routes
    if (currentPath === '/') {
      return <HomePage navigate={navigate} />;
    }

    if (currentPath === '/writing') {
      return (
        <WritingPage
          categoryFilter={searchParams.category || ''}
          navigate={navigate}
        />
      );
    }

    if (currentPath.startsWith('/writing/')) {
      const slug = currentPath.replace('/writing/', '');
      return <StoryPage slug={slug} navigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    if (currentPath === '/subscribe') {
      return <SubscribePage searchParams={searchParams} navigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/rss.xml') {
      return <RssPage navigate={navigate} />;
    }

    // 2. Admin Auth Routes
    if (currentPath === '/admin/login') {
      return <AdminLoginPage navigate={navigate} />;
    }

    if (currentPath === '/admin/forgot') {
      return <AdminForgotPage navigate={navigate} />;
    }

    if (currentPath === '/admin/reset') {
      return <AdminResetPage navigate={navigate} />;
    }

    // 3. Admin Protected Routes
    if (isAdminRoute) {
      if (!adminUser) {
        return <AdminLoginPage navigate={navigate} />;
      }

      // Preview route: /admin/preview/:id
      if (currentPath.startsWith('/admin/preview/')) {
        const id = currentPath.replace('/admin/preview/', '');
        const story = getStoryById(id);
        return <StoryPage previewMode previewStory={story} navigate={navigate} />;
      }

      if (currentPath === '/admin/editor') {
        return <AdminEditorPage storyId={searchParams.id} navigate={navigate} />;
      }

      if (currentPath === '/admin/media') {
        return <AdminMediaPage />;
      }

      if (currentPath === '/admin/themes') {
        return <AdminThemesPage />;
      }

      if (currentPath === '/admin/settings') {
        return <AdminSettingsPage />;
      }

      // Default admin is Dashboard (/admin and /admin#stories)
      return <AdminDashboardPage navigate={navigate} />;
    }

    // 4. Custom 404
    return <NotFoundPage navigate={navigate} />;
  };

  // If viewing admin auth (login, forgot, reset) or admin preview, render standalone
  if (isAdminAuthRoute || currentPath.startsWith('/admin/preview/')) {
    return (
      <ToastProvider>
        <main className="min-h-screen">{renderContent()}</main>
      </ToastProvider>
    );
  }

  // If inside protected Admin Panel: render two columns on desktop, stacked on mobile
  if (isAdminRoute && adminUser) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#EEF1EA] text-[#1F2A24] p-4 sm:p-8">
          <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row gap-8 items-start">
            <AdminSidebar currentPath={currentPath + (hash ? hash : '')} navigate={navigate} />
            <main className="flex-1 w-full min-w-0">{renderContent()}</main>
          </div>
        </div>
      </ToastProvider>
    );
  }

  // Public Layout
  const isStoryPage = currentPath.startsWith('/writing/') && currentPath !== '/writing';

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#EEF1EA] text-[#1F2A24]">
        <SiteHeader
          currentPath={currentPath}
          currentCategory={searchParams.category || ''}
          navigate={navigate}
        />

        <main
          className={`flex-1 w-full ${
            isStoryPage ? '' : 'max-w-[1120px] mx-auto px-5 sm:px-8 pt-4 pb-12'
          }`}
        >
          {renderContent()}
        </main>

        <SiteFooter navigate={navigate} />
      </div>
    </ToastProvider>
  );
}
