import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../../components/ui/Button.jsx';
import Chip from '../../components/ui/Chip.jsx';
import ThemeSwatch from '../../components/ui/ThemeSwatch.jsx';
import TiptapEditor from '../../components/admin/TiptapEditor.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import {
  getStoryById,
  saveStory,
  getSettings,
  getStories,
  uploadMediaFile,
} from '../../lib/storage.js';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function stripHtml(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function AdminEditorPage({ storyId, navigate }) {
  const { showToast } = useToast();
  const settings = getSettings();
  const existingStory = storyId ? getStoryById(storyId) : null;

  // Form State
  const [id, setId] = useState(existingStory?.id || null);
  const [title, setTitle] = useState(existingStory?.title || '');
  const [bodyHtml, setBodyHtml] = useState(existingStory?.body_html || '');
  const [coverUrl, setCoverUrl] = useState(existingStory?.cover_url || '');
  const [theme, setTheme] = useState(existingStory?.theme || settings.default_theme || 'sage');
  const [readingFont, setReadingFont] = useState(existingStory?.reading_font || 'serif');
  const [category, setCategory] = useState(existingStory?.category || 'Essay');
  const [tagsInput, setTagsInput] = useState(existingStory?.tags?.join(', ') || '');
  const [slug, setSlug] = useState(existingStory?.slug || '');
  const [visibility, setVisibility] = useState(
    existingStory?.status === 'unlisted'
      ? 'Unlisted'
      : existingStory?.status === 'scheduled'
      ? 'Scheduled'
      : 'Public'
  );
  const [scheduledAt, setScheduledAt] = useState(
    existingStory?.published_at ? existingStory.published_at.slice(0, 16) : ''
  );
  const [status, setStatus] = useState(existingStory?.status || 'draft');
  const [savedTimeLabel, setSavedTimeLabel] = useState(existingStory ? 'Saved' : 'Not saved yet');
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});

  const coverInputRef = useRef(null);

  // Auto-generate slug while typing title if creating new or if slug was not manually customized
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    setIsDirty(true);
    if (!existingStory && (!slug || slug === slugify(title))) {
      setSlug(slugify(newTitle));
    }
  };

  const handleBodyChange = (html) => {
    setBodyHtml(html);
    setIsDirty(true);
  };

  // Perform Save
  const performSave = useCallback(
    async (forcedStatus = null) => {
      if (!title.trim() && !bodyHtml.trim()) return null;

      const rawText = stripHtml(bodyHtml);
      const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
      const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
      const excerpt = rawText.slice(0, 110).trim();

      const finalStatus = forcedStatus || status;
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const storyPayload = {
        id,
        title: title.trim() || 'Untitled',
        slug: slug.trim() || slugify(title) || 'story-' + Date.now(),
        body_html: bodyHtml,
        cover_url: coverUrl,
        theme,
        reading_font: readingFont,
        category,
        featured: existingStory?.featured ?? false,
        tags,
        excerpt,
        read_minutes: readMinutes,
        status: finalStatus,
        published_at:
          finalStatus === 'scheduled'
            ? scheduledAt
              ? new Date(scheduledAt).toISOString()
              : new Date().toISOString()
            : finalStatus === 'published'
            ? existingStory?.published_at || new Date().toISOString()
            : null,
      };

      try {
        const saved = await saveStory(storyPayload);
        if (saved?.id && !id) setId(saved.id);
        setIsDirty(false);
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSavedTimeLabel(`Saved ${timeStr}`);
        return saved;
      } catch (error) {
        showToast(error?.message || 'Could not save this story');
        return null;
      }
    },
    [id, title, bodyHtml, coverUrl, theme, readingFont, category, tagsInput, slug, status, scheduledAt, existingStory, showToast]
  );

  // Autosave every 20 seconds and when the tab loses focus
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty && (title.trim() || bodyHtml.trim())) {
        performSave();
      }
    }, 20000);

    const handleBlur = () => {
      if (isDirty && (title.trim() || bodyHtml.trim())) {
        performSave();
      }
    };

    window.addEventListener('blur', handleBlur);
    return () => {
      clearInterval(timer);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isDirty, title, bodyHtml, performSave]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Save as draft button
  const handleSaveDraft = async () => {
    setStatus('draft');
    const saved = await performSave('draft');
    if (saved) showToast('Draft saved');
  };

  // Preview button: saves then opens /admin/preview/[id] in new tab
  const handlePreview = async () => {
    const saved = await performSave();
    const targetId = saved?.id || id;
    if (targetId) {
      window.open(`/admin/preview/${targetId}`, '_blank');
    } else {
      showToast('Please add a title or body to preview');
    }
  };

  // Publish button: validates, sets status from Visibility, navigates to /admin
  const handlePublish = async () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!bodyHtml.trim()) newErrors.body = 'Body is required';
    if (!slug.trim()) newErrors.slug = 'Slug is required';

    // Validate unique slug
    const allStories = getStories();
    const slugConflict = allStories.find((s) => s.slug === slug.trim() && s.id !== id);
    if (slugConflict) {
      newErrors.slug = 'Slug is already in use. Please pick a unique slug.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors before publishing');
      return;
    }

    let targetStatus = 'published';
    if (visibility === 'Unlisted') targetStatus = 'unlisted';
    if (visibility === 'Scheduled') targetStatus = 'scheduled';

    setStatus(targetStatus);
    const saved = await performSave(targetStatus);
    if (!saved) return;

    if (targetStatus === 'published') {
      showToast('Published');
    } else {
      showToast(`Saved as ${targetStatus}`);
    }

    navigate('/admin');
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const item = await uploadMediaFile(file);
        setCoverUrl(item.url);
        setIsDirty(true);
      } catch (error) {
        alert(error?.message || 'Could not upload the cover image.');
      }
    }
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Top Bar */}
      <div className="bg-white rounded-[20px] p-4 sm:p-5 border border-black/5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              if (isDirty && !window.confirm('You have unsaved changes. Leave anyway?')) return;
              navigate('/admin');
            }}
            className="font-bricolage text-[15px] font-semibold text-[#1F2A24] hover:text-[#B88A00] transition-colors"
          >
            ← Stories
          </a>

          <Chip status={status} />

          <span className="font-bricolage text-[14px] text-[#7E8C80] hidden sm:inline">
            {savedTimeLabel}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handlePreview}
            className="!min-h-[40px] !py-2 !px-4 text-[14px]"
          >
            Preview
          </Button>

          <Button
            variant="ghost"
            onClick={handleSaveDraft}
            className="!min-h-[40px] !py-2 !px-4 text-[14px]"
          >
            Save draft
          </Button>

          <Button
            variant="gold"
            onClick={handlePublish}
            className="!min-h-[40px] !py-2 !px-5 text-[14px] font-bold shadow-xs"
          >
            Publish
          </Button>
        </div>
      </div>

      {errors.title && (
        <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded-[12px] font-bricolage text-[14px] border border-red-200">
          {errors.title}
        </div>
      )}

      {/* Main Two Columns: Writing Card & 320px Settings Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Writing Card */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <TiptapEditor
            title={title}
            onTitleChange={handleTitleChange}
            contentHtml={bodyHtml}
            onContentChange={handleBodyChange}
            font={readingFont}
            onImageUploaded={async (file) => {
              const item = await uploadMediaFile(file);
              return item.url;
            }}
          />
        </div>

        {/* Right Column: Settings Sidebar (three white cards) */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full lg:max-w-[320px]">
          {/* Card 1: Cover image */}
          <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-xs flex flex-col gap-4">
            <h3 className="font-bricolage text-[18px] font-bold text-[#1F2A24]">
              Cover image
            </h3>

            {coverUrl ? (
              <div className="relative rounded-[16px] overflow-hidden h-[160px] bg-stone-100 group">
                <img src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setCoverUrl('');
                    setIsDirty(true);
                  }}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-[12px] px-2.5 py-1 rounded-full font-bricolage cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="border-2 border-dashed border-[#7E8C80] rounded-[16px] h-[140px] flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-[#1F2A24] bg-stone-50 transition-colors"
              >
                <span className="font-bricolage text-[13px] text-[#4F5B53]">
                  Upload cover · 1600 × 900
                </span>
                <span className="font-bricolage text-[11px] text-[#7E8C80] mt-1">
                  PNG, JPG up to 5MB
                </span>
              </div>
            )}

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />

            <Button
              variant="ghost"
              onClick={() => coverInputRef.current?.click()}
              className="!min-h-[38px] !py-1.5 text-[14px] w-full"
            >
              Upload image
            </Button>
          </div>

          {/* Card 2: Page theme */}
          <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-xs flex flex-col gap-4">
            <h3 className="font-bricolage text-[18px] font-bold text-[#1F2A24]">
              Page theme
            </h3>
            <p className="font-bricolage text-[14px] text-[#4F5B53] -mt-2">
              Sets the mood of this story's page.
            </p>

            <div className="flex items-center justify-between py-1">
              {['sage', 'butter', 'lavender', 'peach', 'midnight'].map((th) => (
                <ThemeSwatch
                  key={th}
                  themeKey={th}
                  selected={theme === th}
                  onSelect={(k) => {
                    setTheme(k);
                    setIsDirty(true);
                  }}
                />
              ))}
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#C3CCBE]">
              <label htmlFor="reading-font-select" className="font-bricolage text-[14px] font-medium text-[#1F2A24]">
                Reading font
              </label>
              <select
                id="reading-font-select"
                value={readingFont}
                onChange={(e) => {
                  setReadingFont(e.target.value);
                  setIsDirty(true);
                }}
                className="h-[44px] px-3 rounded-[14px] bg-stone-50 border border-[#7E8C80] font-bricolage text-[15px] text-[#1F2A24] focus:bg-white focus:outline-none"
              >
                <option value="serif">Serif · Newsreader</option>
                <option value="sans">Sans · Bricolage</option>
              </select>
            </div>
          </div>

          {/* Card 3: Details */}
          <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-xs flex flex-col gap-4">
            <h3 className="font-bricolage text-[18px] font-bold text-[#1F2A24]">
              Details
            </h3>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="story-category-select" className="font-bricolage text-[14px] font-medium text-[#1F2A24]">
                Category
              </label>
              <select
                id="story-category-select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setIsDirty(true);
                }}
                className="h-[44px] px-3 rounded-[14px] bg-stone-50 border border-[#7E8C80] font-bricolage text-[15px] text-[#1F2A24] focus:bg-white focus:outline-none"
              >
                <option value="Essay">Essay</option>
                <option value="Story">Story</option>
                <option value="Note">Note</option>
              </select>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="story-tags-input" className="font-bricolage text-[14px] font-medium text-[#1F2A24]">
                Tags (comma separated)
              </label>
              <input
                id="story-tags-input"
                type="text"
                value={tagsInput}
                onChange={(e) => {
                  setTagsInput(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="creativity, craft, focus"
                className="h-[44px] px-3 rounded-[14px] bg-stone-50 border border-[#7E8C80] font-bricolage text-[15px] text-[#1F2A24] focus:bg-white focus:outline-none"
              />
            </div>

            {/* URL slug */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="story-slug-input" className="font-bricolage text-[14px] font-medium text-[#1F2A24]">
                URL slug
              </label>
              <input
                id="story-slug-input"
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsDirty(true);
                  setErrors((prev) => ({ ...prev, slug: '' }));
                }}
                placeholder="my-story-title"
                className={`h-[44px] px-3 rounded-[14px] bg-stone-50 border font-bricolage text-[15px] text-[#1F2A24] focus:bg-white focus:outline-none ${
                  errors.slug ? 'border-red-500' : 'border-[#7E8C80]'
                }`}
              />
              {errors.slug && (
                <span className="text-[12px] text-red-600 font-bricolage">
                  {errors.slug}
                </span>
              )}
            </div>

            {/* Visibility */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="story-visibility-select" className="font-bricolage text-[14px] font-medium text-[#1F2A24]">
                Visibility
              </label>
              <select
                id="story-visibility-select"
                value={visibility}
                onChange={(e) => {
                  setVisibility(e.target.value);
                  setIsDirty(true);
                }}
                className="h-[44px] px-3 rounded-[14px] bg-stone-50 border border-[#7E8C80] font-bricolage text-[15px] text-[#1F2A24] focus:bg-white focus:outline-none"
              >
                <option value="Public">Public</option>
                <option value="Unlisted">Unlisted</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>

            {/* Date & Time if Scheduled */}
            {visibility === 'Scheduled' && (
              <div className="flex flex-col gap-1.5 animate-in fade-in">
                <label htmlFor="story-scheduled-input" className="font-bricolage text-[14px] font-medium text-[#1F2A24]">
                  Publish date & time
                </label>
                <input
                  id="story-scheduled-input"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => {
                    setScheduledAt(e.target.value);
                    setIsDirty(true);
                  }}
                  className="h-[44px] px-3 rounded-[14px] bg-stone-50 border border-[#7E8C80] font-bricolage text-[14px] text-[#1F2A24] focus:bg-white focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
