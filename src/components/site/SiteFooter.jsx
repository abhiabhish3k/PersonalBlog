import React from 'react';
import { getSettings } from '../../lib/storage.js';

export default function SiteFooter({ navigate }) {
  const settings = getSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-[1120px] mx-auto px-5 sm:px-8 mt-[96px] pb-12">
      <div className="border-t border-[#C3CCBE] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-bricolage text-[15px] text-[#4F5B53]">
        <div className="select-none">
          © {currentYear} {settings.blog_name || 'abhi.writes'}
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <a
            href="/rss.xml"
            onClick={(e) => {
              e.preventDefault();
              navigate('/rss.xml');
            }}
            className="hover:text-[#1F2A24] transition-colors"
          >
            RSS
          </a>

          {settings.github_url && (
            <a
              href={settings.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1F2A24] transition-colors"
            >
              GitHub
            </a>
          )}

          {settings.x_url && (
            <a
              href={settings.x_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1F2A24] transition-colors"
            >
              X
            </a>
          )}

          <a
            href="/admin/login"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin/login');
            }}
            className="hover:text-[#1F2A24] transition-colors font-medium text-[#1F2A24]"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
