import React from 'react';
import Tag from '../components/ui/Tag.jsx';
import Button from '../components/ui/Button.jsx';
import Thumb from '../components/ui/Thumb.jsx';
import { getSettings, getAdminAuth } from '../lib/storage.js';

export default function AboutPage({ navigate }) {
  const settings = getSettings();
  const adminAuth = getAdminAuth();

  const authorName = settings.author_name || 'Abhi';
  const hasEmptyFields = !settings.bio || !settings.currently || !settings.writes_about;

  return (
    <div className="flex flex-col gap-12 w-full max-w-[1000px] mx-auto text-left">
      {/* Friendly prompt when admin is signed in and fields are empty (page 16 requirement) */}
      {adminAuth && hasEmptyFields && (
        <div className="bg-[#F5E3A8] border border-[#B88A00]/40 rounded-[20px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="font-bricolage text-[15px] text-[#1F2A24]">
            <strong>Welcome back!</strong> Your bio, currently, and "I write about" fields are waiting to be filled in from Settings.
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/settings')}
            className="!min-h-[38px] !py-1.5 !px-4 text-[14px] shrink-0"
          >
            Edit Settings →
          </Button>
        </div>
      )}

      {/* Two columns: Left arch portrait, Right bio & buttons */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left: tall arch-shaped portrait block (radius 200px 200px 40px 40px, 440px high) */}
        <div className="md:col-span-5 flex justify-center">
          <div
            className="w-full max-w-[320px] h-[440px] overflow-hidden shadow-md flex items-center justify-center bg-stone-200"
            style={{ borderRadius: '200px 200px 40px 40px' }}
          >
            {settings.portrait_url ? (
              <img
                src={settings.portrait_url}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Thumb
                theme={settings.default_theme || 'sage'}
                variant="custom"
                className="w-full h-full"
                style={{ borderRadius: '200px 200px 40px 40px' }}
              />
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-7 flex flex-col items-start gap-5">
          <Tag>About</Tag>

          <h1 className="font-bricolage text-[44px] sm:text-[56px] font-bold text-[#1F2A24] leading-[1.05] tracking-tight">
            Hi, I'm {authorName}.
          </h1>

          <div className="font-newsreader text-[20px] text-[#4F5B53] leading-relaxed flex flex-col gap-4">
            {settings.bio ? (
              settings.bio.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <p className="italic text-[#7E8C80]">
                I write about thoughtful software engineering, slow media, and the intentional pursuit of depth in an age of frantic online noise.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Button
              variant="primary"
              onClick={() => navigate('/contact')}
            >
              Say hello
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/writing')}
            >
              Read the blog
            </Button>
          </div>
        </div>
      </section>

      {/* Below: Three cards in a row: Currently (white), I write about (butter-soft), Find me (lavender) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Card 1: Currently (white) */}
        <div className="bg-white rounded-[24px] p-6 border border-black/5 flex flex-col gap-3 shadow-xs">
          <h3 className="font-bricolage text-[20px] font-bold text-[#1F2A24]">
            Currently
          </h3>
          <p className="font-bricolage text-[15px] text-[#4F5B53] leading-relaxed">
            {settings.currently || 'Building independent web software, testing minimal blogging engines, and taking long walks without headphones.'}
          </p>
        </div>

        {/* Card 2: I write about (butter-soft) */}
        <div className="bg-[#F5E3A8] rounded-[24px] p-6 border border-black/5 flex flex-col gap-3 shadow-xs">
          <h3 className="font-bricolage text-[20px] font-bold text-[#1F2A24]">
            I write about
          </h3>
          <p className="font-bricolage text-[15px] text-[#1F2A24] leading-relaxed">
            {settings.writes_about || 'Slow craftsmanship, reading offline, building tools that respect people’s attention, and resisting artificial urgency.'}
          </p>
        </div>

        {/* Card 3: Find me (lavender) with links */}
        <div className="bg-[#D8D2EA] rounded-[24px] p-6 border border-black/5 flex flex-col gap-3 shadow-xs">
          <h3 className="font-bricolage text-[20px] font-bold text-[#1F2A24]">
            Find me
          </h3>
          <div className="flex flex-col gap-2 font-bricolage text-[15px] text-[#1F2A24]">
            {settings.github_url && (
              <a
                href={settings.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
              >
                GitHub →
              </a>
            )}
            {settings.x_url && (
              <a
                href={settings.x_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
              >
                X / Twitter →
              </a>
            )}
            {settings.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
              >
                LinkedIn →
              </a>
            )}
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                navigate('/contact');
              }}
              className="underline underline-offset-2 hover:opacity-80"
            >
              Direct contact form →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
