import React from 'react';
import { signOutAdmin } from '../../lib/storage.js';

export default function AdminSidebar({ currentPath = '/admin', navigate }) {
  const handleNav = (e, path) => {
    e.preventDefault();
    if (navigate) navigate(path);
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOutAdmin();
      if (navigate) navigate('/admin/login');
    } catch (error) {
      window.alert(error?.message || 'Could not sign out.');
    }
  };

  const links = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Stories', path: '/admin#stories' },
    { label: 'Media library', path: '/admin/media' },
    { label: 'Page themes', path: '/admin/themes' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-full md:w-[232px] shrink-0">
      <div className="bg-white rounded-[24px] p-6 border border-black/5 flex flex-col gap-6 shadow-xs sticky top-8">
        {/* Logo */}
        <a
          href="/admin"
          onClick={(e) => handleNav(e, '/admin')}
          className="font-bricolage font-bold text-[22px] tracking-tight text-[#1F2A24] flex items-center select-none"
        >
          abhi<span className="text-[#B88A00]">.</span>admin
        </a>

        {/* Links */}
        <nav className="flex flex-col gap-1 font-bricolage text-[15px] font-medium">
          {links.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path === '/admin' && currentPath === '/admin' && !window.location.hash) ||
              (link.path === '/admin#stories' && (currentPath === '/admin#stories' || (currentPath === '/admin' && window.location.hash === '#stories')));

            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNav(e, link.path)}
                className={`px-4 py-2.5 rounded-[14px] transition-colors ${
                  isActive
                    ? 'bg-[#1F2A24] text-[#EEF1EA]'
                    : 'text-[#1F2A24] hover:bg-stone-100'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-[#C3CCBE] flex flex-col gap-2 font-bricolage text-[14px]">
          <a
            href="/"
            onClick={(e) => handleNav(e, '/')}
            className="text-[#1F2A24] hover:text-black font-medium transition-colors px-2 py-1"
          >
            ← View site
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-left text-[#7E8C80] hover:text-[#1F2A24] transition-colors px-2 py-1 cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
