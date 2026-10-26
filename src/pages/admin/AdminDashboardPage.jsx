import React, { useState, useMemo } from 'react';
import Button from '../../components/ui/Button.jsx';
import Chip from '../../components/ui/Chip.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import {
  getStories,
  deleteStory,
  getSettings,
  getMessages,
  deleteMessage,
} from '../../lib/storage.js';

function formatDisplayDate(dateStr) {
  if (!dateStr) return 'No date';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminDashboardPage({ navigate }) {
  const { showToast } = useToast();
  const settings = getSettings();
  const stories = getStories();
  const messages = getMessages();

  const [searchQuery, setSearchQuery] = useState('');
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Counts for the 3 stat cards
  const stats = useMemo(() => {
    let published = 0;
    let drafts = 0;
    let scheduled = 0;

    stories.forEach((s) => {
      if (s.status === 'published') published++;
      else if (s.status === 'draft') drafts++;
      else if (s.status === 'scheduled') scheduled++;
    });

    return { published, drafts, scheduled };
  }, [stories]);

  // Filtered stories by title
  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return stories;
    const q = searchQuery.toLowerCase();
    return stories.filter((s) => s.title.toLowerCase().includes(q));
  }, [stories, searchQuery]);

  const confirmDeleteStory = async () => {
    if (!storyToDelete) return;
    try {
      await deleteStory(storyToDelete.id);
      showToast('Story deleted');
      setStoryToDelete(null);
    } catch (error) {
      showToast(error?.message || 'Could not delete story');
    }
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      await deleteMessage(messageToDelete.id);
      showToast('Message deleted');
      setMessageToDelete(null);
    } catch (error) {
      showToast(error?.message || 'Could not delete message');
    }
  };

  const handleViewStory = (story) => {
    if (story.status === 'published') {
      window.open(`/writing/${story.slug}`, '_blank');
    } else {
      window.open(`/admin/preview/${story.id}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full text-left">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bricolage text-[36px] sm:text-[44px] font-bold text-[#1F2A24] leading-tight">
            Welcome back, {settings.author_name || 'Abhi'}
          </h1>
          <p className="font-bricolage text-[16px] text-[#4F5B53] mt-1">
            Here's how your blog is doing.
          </p>
        </div>

        <Button
          variant="gold"
          onClick={() => navigate('/admin/editor')}
          className="shadow-xs shrink-0"
        >
          + New story
        </Button>
      </div>

      {/* Three stat cards: Published (sage), Drafts (butter-soft), Scheduled (lavender) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Published (sage) */}
        <div
          className="rounded-[24px] p-6 border border-black/5 flex flex-col gap-2 shadow-xs"
          style={{ backgroundColor: '#CFE0D2' }}
        >
          <span className="font-bricolage text-[15px] font-medium text-[#1F2A24]">
            Published
          </span>
          <span className="font-bricolage text-[48px] font-bold text-[#1F2A24] leading-none">
            {stats.published}
          </span>
        </div>

        {/* Drafts (butter-soft) */}
        <div
          className="rounded-[24px] p-6 border border-black/5 flex flex-col gap-2 shadow-xs"
          style={{ backgroundColor: '#F5E3A8' }}
        >
          <span className="font-bricolage text-[15px] font-medium text-[#1F2A24]">
            Drafts
          </span>
          <span className="font-bricolage text-[48px] font-bold text-[#1F2A24] leading-none">
            {stats.drafts}
          </span>
        </div>

        {/* Scheduled (lavender) */}
        <div
          className="rounded-[24px] p-6 border border-black/5 flex flex-col gap-2 shadow-xs"
          style={{ backgroundColor: '#D8D2EA' }}
        >
          <span className="font-bricolage text-[15px] font-medium text-[#1F2A24]">
            Scheduled
          </span>
          <span className="font-bricolage text-[48px] font-bold text-[#1F2A24] leading-none">
            {stats.scheduled}
          </span>
        </div>
      </div>

      {/* Your stories card (id stories) */}
      <div
        id="stories"
        className="bg-white rounded-[24px] p-6 sm:p-8 border border-black/5 shadow-xs flex flex-col gap-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-bricolage text-[26px] font-bold text-[#1F2A24]">
            Your stories
          </h2>

          <div className="w-full sm:w-72">
            <label htmlFor="search-stories" className="sr-only">
              Search stories
            </label>
            <input
              id="search-stories"
              type="text"
              placeholder="Search stories by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[44px] px-4 rounded-[14px] bg-stone-50 border border-[#7E8C80] font-bricolage text-[15px] text-[#1F2A24] w-full focus:bg-white focus:outline-none focus:border-[#1F2A24]"
            />
          </div>
        </div>

        {filteredStories.length > 0 ? (
          <div className="divide-y divide-[#C3CCBE] flex flex-col">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bricolage font-bold text-[18px] text-[#1F2A24] line-clamp-1">
                      {story.title}
                    </span>
                    <Chip status={story.status} />
                  </div>
                  <div className="font-bricolage text-[14px] text-[#7E8C80]">
                    {story.category || 'Essay'} · {formatDisplayDate(story.published_at || story.created_at)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    onClick={() => handleViewStory(story)}
                    className="!min-h-[38px] !py-1.5 !px-3 text-[13px]"
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/admin/editor', { id: story.id })}
                    className="!min-h-[38px] !py-1.5 !px-3 text-[13px]"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStoryToDelete(story)}
                    className="!min-h-[38px] !py-1.5 !px-3 text-[13px] hover:!border-red-600 hover:!bg-red-600 hover:!text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <p className="font-bricolage text-[18px] text-[#4F5B53]">
              No stories found. Start with New story.
            </p>
            <Button
              variant="gold"
              onClick={() => navigate('/admin/editor')}
              className="mt-2"
            >
              + Create new story
            </Button>
          </div>
        )}
      </div>

      {/* Second card: Messages */}
      <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-black/5 shadow-xs flex flex-col gap-6">
        <h2 className="font-bricolage text-[26px] font-bold text-[#1F2A24]">
          Messages ({messages.length})
        </h2>

        {messages.length > 0 ? (
          <div className="divide-y divide-[#C3CCBE] flex flex-col">
            {messages.map((msg) => (
              <div key={msg.id} className="py-4 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <div className="flex items-center gap-2 font-bricolage font-bold text-[16px] text-[#1F2A24]">
                    <span>{msg.name}</span>
                    <span className="text-[#7E8C80] font-normal text-[14px]">
                      &lt;{msg.email}&gt;
                    </span>
                    <span className="text-[#7E8C80] font-normal text-[13px] ml-2">
                      · {formatDisplayDate(msg.created_at)}
                    </span>
                  </div>
                  <p className="font-bricolage text-[15px] text-[#4F5B53] whitespace-pre-wrap mt-1">
                    {msg.body}
                  </p>
                </div>

                <div className="shrink-0 sm:self-center">
                  <Button
                    variant="ghost"
                    onClick={() => setMessageToDelete(msg)}
                    className="!min-h-[36px] !py-1 !px-3 text-[13px] hover:!border-red-600 hover:!bg-red-600 hover:!text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-bricolage text-[15px] text-[#7E8C80] py-4 text-center">
            No contact messages received yet.
          </p>
        )}
      </div>

      {/* Confirm Story Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(storyToDelete)}
        title="Delete this story?"
        message={`Are you sure you want to permanently delete "${storyToDelete?.title}"?`}
        confirmText="Delete story"
        onConfirm={confirmDeleteStory}
        onCancel={() => setStoryToDelete(null)}
      />

      {/* Confirm Message Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(messageToDelete)}
        title="Delete this message?"
        message={`Are you sure you want to delete the message from ${messageToDelete?.name}?`}
        confirmText="Delete message"
        onConfirm={confirmDeleteMessage}
        onCancel={() => setMessageToDelete(null)}
      />
    </div>
  );
}
