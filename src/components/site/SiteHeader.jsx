import React from 'react';
import Button from '../ui/Button.jsx';

export default function SiteHeader({ currentPath = '/', currentCategory = '', navigate }) {
  const isHome = currentPath === '/';
  const isWritingAll = currentPath === '/writing' && !currentCategory;
  const isWritingStory = currentPath === '/writing' && currentCategory === 'Story';
  const isAbout = currentPath === '/about';

  const handleLinkClick = (e, path, category = '') => {
    e.preventDefault();
    if (navigate) {
      navigate(path, category ? { category } : {});
    }
  };

  return (
    <header className="w-full max-w-[1120px] mx-auto px-5 sm:px-8 pt-8 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6">
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="font-bricolage font-bold text-[26px] tracking-tight text-[#1F2A24] flex items-center select-none"
        >
          abhi<span className="text-[#B88A00]">.</span>writes
        </a>

        {/* Navigation - wraps on narrow screens without hamburger per specification */}
        <nav className="flex flex-wrap items-center gap-x-7 gap-y-3 font-bricolage text-[16px] font-medium text-[#1F2A24]">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className={`transition-colors pb-0.5 hover:text-[#1F2A24] ${
              isHome ? 'border-b-2 border-[#1F2A24]' : 'text-[#4F5B53]'
            }`}
          >
            Home
          </a>

          <a
            href="/writing"
            onClick={(e) => handleLinkClick(e, '/writing')}
            className={`transition-colors pb-0.5 hover:text-[#1F2A24] ${
              isWritingAll ? 'border-b-2 border-[#1F2A24]' : 'text-[#4F5B53]'
            }`}
          >
            Writing
          </a>

          <a
            href="/writing?category=Story"
            onClick={(e) => handleLinkClick(e, '/writing', 'Story')}
            className={`transition-colors pb-0.5 hover:text-[#1F2A24] ${
              isWritingStory ? 'border-b-2 border-[#1F2A24]' : 'text-[#4F5B53]'
            }`}
          >
            Stories
          </a>

          <a
            href="/about"
            onClick={(e) => handleLinkClick(e, '/about')}
            className={`transition-colors pb-0.5 hover:text-[#1F2A24] ${
              isAbout ? 'border-b-2 border-[#1F2A24]' : 'text-[#4F5B53]'
            }`}
          >
            About
          </a>

          <Button
            variant="primary"
            onClick={(e) => handleLinkClick(e, '/subscribe')}
            className="!min-h-[40px] !py-2 !px-5 text-[15px] ml-2"
          >
            Subscribe
          </Button>
        </nav>
      </div>
    </header>
  );
}
