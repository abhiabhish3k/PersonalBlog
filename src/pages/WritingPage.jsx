import React, { useState, useMemo } from 'react';
import Button from '../components/ui/Button.jsx';
import StoryRow from '../components/site/StoryRow.jsx';
import { getPublishedStories } from '../lib/storage.js';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Essays', value: 'Essay' },
  { label: 'Stories', value: 'Story' },
  { label: 'Notes', value: 'Note' },
];

export default function WritingPage({ categoryFilter = '', navigate }) {
  const allPublished = getPublishedStories();
  const [displayCount, setDisplayCount] = useState(12);

  // Filter stories by category if specified
  const filteredStories = useMemo(() => {
    if (!categoryFilter) return allPublished;
    return allPublished.filter((s) => s.category?.toLowerCase() === categoryFilter.toLowerCase());
  }, [allPublished, categoryFilter]);

  const visibleStories = filteredStories.slice(0, displayCount);
  const hasMore = displayCount < filteredStories.length;

  const handleCategorySelect = (catValue) => {
    setDisplayCount(12);
    if (catValue) {
      navigate('/writing', { category: catValue });
    } else {
      navigate('/writing', {});
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full max-w-[1000px] mx-auto text-left">
      {/* Title & Intro */}
      <div className="flex flex-col gap-3">
        <h1 className="font-bricolage text-[44px] sm:text-[64px] font-bold text-[#1F2A24] leading-[1.05] tracking-[-0.03em]">
          Writing
        </h1>
        <p className="font-bricolage text-[20px] text-[#4F5B53] leading-relaxed max-w-2xl">
          Essays, narratives, and unpolished field notes exploring craftsmanship, systems, and creative endurance.
        </p>
      </div>

      {/* Filter pills: All, Essays, Stories, Notes */}
      <div className="flex flex-wrap items-center gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = (!categoryFilter && cat.value === '') || (categoryFilter.toLowerCase() === cat.value.toLowerCase());
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => handleCategorySelect(cat.value)}
              className={`font-bricolage font-medium text-[15px] min-h-[40px] px-5 py-2 rounded-full transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1F2A24] text-[#EEF1EA]'
                  : 'bg-transparent border-2 border-[#1F2A24] text-[#1F2A24] hover:bg-[#1F2A24] hover:text-[#EEF1EA]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Stories Vertical List */}
      {visibleStories.length > 0 ? (
        <div className="flex flex-col gap-4">
          {visibleStories.map((story) => (
            <StoryRow key={story.id} story={story} navigate={navigate} />
          ))}

          {hasMore && (
            <div className="flex justify-center pt-8">
              <Button
                variant="ghost"
                onClick={() => setDisplayCount((prev) => prev + 12)}
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-[24px] p-12 text-center border border-black/5 flex flex-col items-center gap-4 my-8">
          <p className="font-bricolage text-[22px] font-semibold text-[#1F2A24]">
            Nothing here yet.
          </p>
          <p className="font-bricolage text-[16px] text-[#4F5B53] max-w-sm">
            Check back soon or subscribe to receive new posts directly in your inbox.
          </p>
          <Button
            variant="gold"
            onClick={() => navigate('/subscribe')}
            className="mt-2"
          >
            Subscribe for updates
          </Button>
        </div>
      )}
    </div>
  );
}
