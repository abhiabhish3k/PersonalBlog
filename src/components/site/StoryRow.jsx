import React from 'react';
import Tag from '../ui/Tag.jsx';
import Thumb from '../ui/Thumb.jsx';

function formatMonthYear(dateStr) {
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function StoryRow({ story, navigate }) {
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
      className="group flex flex-col md:flex-row items-start md:items-center gap-5 p-5 sm:p-6 bg-white rounded-[24px] border border-black/5 story-card-lift transition-all duration-200 block text-left w-full"
    >
      {/* Left Thumbnail: 160x110 */}
      <div className="shrink-0 w-full sm:w-[160px]">
        <Thumb
          theme={story.theme || 'sage'}
          coverUrl={story.cover_url}
          alt={story.title}
          variant="row"
          className="!w-full sm:!w-[160px] !h-[110px]"
        />
      </div>

      {/* Middle: Tag, Title, Excerpt */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div>
          <Tag>{story.category || 'Essay'}</Tag>
        </div>

        <h3 className="font-bricolage text-[22px] sm:text-[24px] font-bold text-[#1F2A24] leading-[1.2] group-hover:text-black transition-colors line-clamp-1">
          {story.title}
        </h3>

        {story.excerpt && (
          <p className="font-bricolage text-[15px] text-[#4F5B53] line-clamp-2 leading-relaxed">
            {story.excerpt}
          </p>
        )}
      </div>

      {/* Right: Date and read time (wraps on small screens) */}
      <div className="md:shrink-0 md:text-right font-bricolage text-[15px] text-[#4F5B53] whitespace-nowrap pt-2 md:pt-0">
        <div>{formatMonthYear(story.published_at || story.created_at)}</div>
        <div className="text-[14px] text-[#7E8C80]">{story.read_minutes || 1} min read</div>
      </div>
    </a>
  );
}
