import React, { useEffect } from 'react';
import Tag from '../components/ui/Tag.jsx';
import Thumb from '../components/ui/Thumb.jsx';
import Button from '../components/ui/Button.jsx';
import StoryCard from '../components/site/StoryCard.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import { getStoryBySlug, getPublishedStories, getSettings } from '../lib/storage.js';
import { THEME_COLORS } from '../lib/constants.js';

function formatFullDate(dateStr) {
  if (!dateStr) return 'Recently published';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function StoryPage({ slug, navigate, previewMode = false, previewStory = null }) {
  const { showToast } = useToast();
  const settings = getSettings();
  const story = previewStory || getStoryBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!story) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 gap-6">
        <h1 className="font-bricolage text-[56px] font-bold text-[#1F2A24]">
          404
        </h1>
        <p className="font-bricolage text-[20px] text-[#4F5B53] max-w-md">
          This story could not be found or may have been unlisted.
        </p>
        <Button variant="primary" onClick={() => navigate('/writing')}>
          Browse writing
        </Button>
      </div>
    );
  }

  const themeKey = story.theme || 'sage';
  const themeInfo = THEME_COLORS[themeKey] || THEME_COLORS.sage;
  const isDark = themeInfo.isDark;

  const textColor = isDark ? '#EEF1EA' : '#1F2A24';
  const mutedColor = isDark ? '#C3CCBE' : '#4F5B53';

  // Keep reading stories: 2 most recent other published stories
  const keepReadingStories = getPublishedStories()
    .filter((s) => s.id !== story.id)
    .slice(0, 2);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied');
  };

  const handleShareX = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`"${story.title}" by ${settings.author_name || 'Abhi'}`);
    window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="w-full min-h-screen transition-colors duration-300 pb-16 -mt-8 pt-8 -mx-5 sm:-mx-8 px-5 sm:px-8"
      style={{ backgroundColor: themeInfo.bg }}
    >
      <div className="max-w-[1120px] mx-auto flex flex-col gap-10">
        {/* Preview banner if in admin preview mode */}
        {previewMode && (
          <div className="bg-[#1F2A24] text-[#EEF1EA] px-6 py-3 rounded-full flex items-center justify-between font-bricolage text-[14px] mx-auto w-full max-w-xl shadow-lg border border-white/20">
            <span>Preview Mode · Status: <strong>{story.status}</strong></span>
            <button
              onClick={() => navigate('/admin/editor', { id: story.id })}
              className="text-[#F2C94C] font-semibold underline hover:text-white"
            >
              ← Back to editor
            </button>
          </div>
        )}

        {/* Top: Category Tag, H1 Title, Meta Row */}
        <div className="max-w-[700px] mx-auto w-full flex flex-col gap-5 text-left pt-6">
          <div>
            <Tag>{story.category || 'Essay'}</Tag>
          </div>

          <h1
            className="font-bricolage text-[38px] sm:text-[56px] font-bold leading-[1.05] tracking-tight"
            style={{ color: textColor }}
          >
            {story.title}
          </h1>

          <div className="flex items-center gap-3 font-bricolage text-[15px] sm:text-[16px] pt-1" style={{ color: mutedColor }}>
            {/* Round butter avatar */}
            <div className="w-8 h-8 rounded-full bg-[#F2C94C] flex items-center justify-center text-[#1F2A24] font-bold text-[14px] shrink-0 border border-black/10">
              {(settings.author_name || 'Abhi')[0]}
            </div>
            <span className="font-semibold" style={{ color: textColor }}>
              {settings.author_name || 'Abhi'}
            </span>
            <span>·</span>
            <span>{formatFullDate(story.published_at || story.created_at)}</span>
            <span>·</span>
            <span>{story.read_minutes || 1} min read</span>
          </div>
        </div>

        {/* Cover: uploaded cover image (radius 32px, 340px high) or Thumb art */}
        <div className="max-w-[900px] mx-auto w-full">
          <Thumb
            theme={themeKey}
            coverUrl={story.cover_url}
            alt={story.title}
            variant="cover"
            className="shadow-md"
          />
        </div>

        {/* Story Body: rendered rich text in 700px column */}
        <article
          className={`max-w-[700px] mx-auto w-full prose-abhi pt-4 text-left ${
            story.reading_font === 'serif' ? 'font-newsreader' : 'font-bricolage text-[18px]'
          }`}
          style={{ color: textColor }}
          dangerouslySetInnerHTML={{ __html: story.body_html || '<p>No content written yet.</p>' }}
        />

        {/* Action Row: ghost pills Copy link, Share on X, Back to top */}
        <div className="max-w-[700px] mx-auto w-full pt-8 pb-4 border-t border-black/10 flex flex-wrap items-center gap-3">
          <Button
            variant={isDark ? 'light-ghost' : 'ghost'}
            onClick={handleCopyLink}
            className="!min-h-[40px] !py-2 !px-4 text-[14px]"
          >
            Copy link
          </Button>

          <Button
            variant={isDark ? 'light-ghost' : 'ghost'}
            onClick={handleShareX}
            className="!min-h-[40px] !py-2 !px-4 text-[14px]"
          >
            Share on X
          </Button>

          <Button
            variant={isDark ? 'light-ghost' : 'ghost'}
            onClick={handleBackToTop}
            className="!min-h-[40px] !py-2 !px-4 text-[14px] ml-auto"
          >
            Back to top ↑
          </Button>
        </div>

        {/* Keep Reading Section */}
        {keepReadingStories.length > 0 && (
          <section className="max-w-[900px] mx-auto w-full pt-12 border-t border-black/10 flex flex-col gap-6">
            <h2
              className="font-bricolage text-[30px] font-bold text-left"
              style={{ color: textColor }}
            >
              Keep reading
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {keepReadingStories.map((item) => (
                <StoryCard key={item.id} story={item} navigate={navigate} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
