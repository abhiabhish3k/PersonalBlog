import React, { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import Tag from '../components/ui/Tag.jsx';
import Thumb from '../components/ui/Thumb.jsx';
import StoryCard from '../components/site/StoryCard.jsx';
import { getPublishedStories, getSettings, addSubscriber } from '../lib/storage.js';

export default function HomePage({ navigate }) {
  const settings = getSettings();
  const publishedStories = getPublishedStories();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Find featured story or fallback to newest
  const featuredStory = publishedStories.find((s) => s.featured) || publishedStories[0];

  // 3 newest published stories for "Latest writing" grid
  const latestStories = publishedStories.slice(0, 3);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    try {
      await addSubscriber(email);
      navigate('/subscribe', { done: '1', email });
    } catch (error) {
      setEmailError(error?.message || 'Could not subscribe. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-[72px] w-full">
      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left column */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <Tag>Essays · Stories · Notes</Tag>

          <h1 className="font-bricolage text-[44px] sm:text-[60px] lg:text-[72px] font-bold text-[#1F2A24] leading-[1.02] tracking-[-0.03em]">
            Slow thoughts for a fast internet.
          </h1>

          <p className="font-bricolage text-[20px] sm:text-[22px] text-[#4F5B53] leading-relaxed max-w-xl">
            {settings.tagline || 'Slow thoughts for a fast internet.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="primary"
              onClick={() => navigate('/writing')}
            >
              Start reading
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/about')}
            >
              About me
            </Button>
          </div>
        </div>

        {/* Right column: 380px tall thumbnail art block with radius 44px */}
        <div className="lg:col-span-5 w-full">
          <Thumb
            theme={settings.default_theme || 'sage'}
            variant="hero"
            className="shadow-sm w-full"
          />
        </div>
      </section>

      {/* 2. Featured Story */}
      {featuredStory && (
        <section>
          <a
            href={`/writing/${featuredStory.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/writing/${featuredStory.slug}`);
            }}
            className="group block bg-[#1F2A24] text-[#EEF1EA] rounded-[24px] p-8 sm:p-12 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl border border-black/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 flex flex-col gap-4">
                <div>
                  <Tag className="!bg-[#F2C94C] !text-[#1F2A24]">
                    Featured essay
                  </Tag>
                </div>

                <h2 className="font-bricolage text-[30px] sm:text-[40px] font-bold text-[#EEF1EA] leading-[1.1] tracking-tight group-hover:text-white transition-colors">
                  {featuredStory.title}
                </h2>

                {featuredStory.excerpt && (
                  <p className="font-bricolage text-[17px] text-[#C3CCBE] leading-relaxed line-clamp-3">
                    {featuredStory.excerpt}
                  </p>
                )}

                <div className="pt-2">
                  <span className="font-bricolage font-bold text-[18px] text-[#F2C94C] group-hover:underline inline-flex items-center gap-1">
                    Read essay →
                  </span>
                </div>
              </div>

              <div className="md:col-span-5 flex justify-center md:justify-end">
                <Thumb
                  theme={featuredStory.theme || 'sage'}
                  coverUrl={featuredStory.cover_url}
                  alt={featuredStory.title}
                  variant="dark-panel"
                  className="w-full sm:w-[300px] h-[200px]"
                />
              </div>
            </div>
          </a>
        </section>
      )}

      {/* 3. Latest Writing */}
      <section className="flex flex-col gap-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-bricolage text-[36px] font-bold text-[#1F2A24] tracking-[-0.02em]">
            Latest writing
          </h2>
          <a
            href="/writing"
            onClick={(e) => {
              e.preventDefault();
              navigate('/writing');
            }}
            className="font-bricolage font-medium text-[16px] text-[#1F2A24] hover:text-[#B88A00] transition-colors"
          >
            View all →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestStories.map((story) => (
            <StoryCard key={story.id} story={story} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* 4. Newsletter Card */}
      <section>
        <div className="bg-[#F2C94C] rounded-[24px] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="flex flex-col gap-2 max-w-lg text-left">
            <h2 className="font-bricolage text-[36px] font-bold text-[#1F2A24] leading-tight">
              One letter, once a month.
            </h2>
            <p className="font-bricolage text-[18px] text-[#1F2A24]/90 leading-relaxed">
              Essays on software craft, slow design, and intentional living. No spam, ever.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto"
          >
            <div className="flex flex-col">
              <label htmlFor="home-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="home-newsletter-email"
                type="email"
                placeholder="your@email.com"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  setEmailError('');
                }}
                className="h-[48px] px-5 rounded-[14px] bg-white text-[#1F2A24] font-bricolage text-[16px] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#1F2A24] min-w-[260px]"
              />
              {emailError && (
                <span className="font-bricolage text-[13px] text-red-900 font-medium mt-1">
                  {emailError}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="h-[48px] !min-h-[48px] whitespace-nowrap shadow-sm"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
