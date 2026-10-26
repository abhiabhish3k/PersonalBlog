import React from 'react';
import Tag from '../ui/Tag.jsx';
import Thumb from '../ui/Thumb.jsx';

// Formats date to "Mon YYYY", e.g. "Oct 2026"
function formatMonthYear(dateStr) {
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function StoryCard({ story, navigate }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (navigate) {
      navigate(`/writing/${story.slug}`);
    }
  };

  return (
    <a
      href={`/writing/${story.slug}`}
      onClick={handleClick}
      className="group flex flex-col gap-3 p-6 bg-white rounded-[24px] border border-black/5 story-card-lift transition-all duration-200 block text-left"
    >
      {/* Thumbnail */}
      <Thumb
        theme={story.theme || 'sage'}
        coverUrl={story.cover_url}
        alt={story.title}
        variant="card"
      />

      {/* Tag */}
      <div className="pt-1">
        <Tag>{story.category || 'Essay'}</Tag>
      </div>

      {/* Title H3 */}
      <h3 className="font-bricolage text-[24px] font-bold text-[#1F2A24] leading-[1.2] group-hover:text-black transition-colors line-clamp-2">
        {story.title}
      </h3>

      {/* Meta text */}
      <div className="font-bricolage text-[15px] text-[#4F5B53] mt-auto pt-1">
        {formatMonthYear(story.published_at || story.created_at)} · {story.read_minutes || 1} min read
      </div>
    </a>
  );
}
