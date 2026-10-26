import React, { useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Heading1,
  Heading2,
  Quote,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Minus,
  Upload,
} from 'lucide-react';

export default function TiptapEditor({
  title,
  onTitleChange,
  contentHtml,
  onContentChange,
  font = 'serif',
  onImageUploaded,
}) {
  const fileInputRef = useRef(null);

  const uploadAndInsertImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    try {
      if (!onImageUploaded) throw new Error('Image uploads are not configured.');
      const url = await onImageUploaded(file);
      if (url) editor?.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      alert(error?.message || 'Could not upload image.');
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'underline underline-offset-4 text-[#1F2A24]',
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'rounded-[16px] max-w-full my-6',
        },
      }),
    ],
    content: contentHtml || '',
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: `prose-abhi outline-none min-h-[480px] max-w-[680px] mx-auto text-[19px] leading-[1.65] ${
          font === 'serif' ? 'font-newsreader' : 'font-bricolage'
        }`,
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              const file = items[i].getAsFile();
              if (file) {
                void uploadAndInsertImage(file);
                return true;
              }
            }
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const hasFiles = event.dataTransfer?.files?.length;
        if (hasFiles) {
          const file = event.dataTransfer.files[0];
          if (file && file.type.startsWith('image/')) {
            void uploadAndInsertImage(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  // Keep content in sync if changed externally (e.g., initial load or draft switch)
  useEffect(() => {
    if (editor && contentHtml !== undefined && editor.getHTML() !== contentHtml) {
      if (!editor.isFocused) {
        editor.commands.setContent(contentHtml || '');
      }
    }
  }, [contentHtml, editor]);

  // Keyboard shortcut Ctrl/Cmd+K for link
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setLink();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) void uploadAndInsertImage(file);
    e.target.value = '';
  };

  // Word count computation
  const text = editor?.getText() || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-black/5 flex flex-col gap-6 shadow-xs w-full">
      {/* Large borderless title input (44px, weight 700) */}
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Give your story a title"
        className="w-full font-bricolage text-[32px] sm:text-[44px] font-bold text-[#1F2A24] placeholder:text-[#7E8C80] border-none outline-none bg-transparent leading-[1.1]"
      />

      {/* Formatting toolbar in rounded --bg strip with 44x44 buttons */}
      <div className="bg-[#EEF1EA] rounded-[16px] p-1.5 flex flex-wrap items-center gap-1 w-full border border-black/5">
        <button
          type="button"
          aria-label="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer ${
            editor?.isActive('bold')
              ? 'bg-[#1F2A24] text-[#EEF1EA] shadow-inner'
              : 'text-[#1F2A24] hover:bg-black/5'
          }`}
        >
          <BoldIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer ${
            editor?.isActive('italic')
              ? 'bg-[#1F2A24] text-[#EEF1EA] shadow-inner'
              : 'text-[#1F2A24] hover:bg-black/5'
          }`}
        >
          <ItalicIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Heading 1"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer ${
            editor?.isActive('heading', { level: 1 })
              ? 'bg-[#1F2A24] text-[#EEF1EA] shadow-inner'
              : 'text-[#1F2A24] hover:bg-black/5'
          }`}
        >
          <Heading1 className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Heading 2"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer ${
            editor?.isActive('heading', { level: 2 })
              ? 'bg-[#1F2A24] text-[#EEF1EA] shadow-inner'
              : 'text-[#1F2A24] hover:bg-black/5'
          }`}
        >
          <Heading2 className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Quote"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer ${
            editor?.isActive('blockquote')
              ? 'bg-[#1F2A24] text-[#EEF1EA] shadow-inner'
              : 'text-[#1F2A24] hover:bg-black/5'
          }`}
        >
          <Quote className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Bullet list"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer ${
            editor?.isActive('bulletList')
              ? 'bg-[#1F2A24] text-[#EEF1EA] shadow-inner'
              : 'text-[#1F2A24] hover:bg-black/5'
          }`}
        >
          <List className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Link"
          onClick={setLink}
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer ${
            editor?.isActive('link')
              ? 'bg-[#1F2A24] text-[#EEF1EA] shadow-inner'
              : 'text-[#1F2A24] hover:bg-black/5'
          }`}
        >
          <LinkIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Insert image"
          onClick={() => fileInputRef.current?.click()}
          className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer text-[#1F2A24] hover:bg-black/5"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Code block"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer ${
            editor?.isActive('codeBlock')
              ? 'bg-[#1F2A24] text-[#EEF1EA] shadow-inner'
              : 'text-[#1F2A24] hover:bg-black/5'
          }`}
        >
          <Code className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Divider"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center transition-colors cursor-pointer text-[#1F2A24] hover:bg-black/5"
        >
          <Minus className="w-5 h-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleImageFileChange}
          className="hidden"
        />
      </div>

      {/* Editing area */}
      <div className="tiptap-editor py-4">
        <EditorContent editor={editor} />
      </div>

      {/* Large dashed Drop an image here zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files?.[0]) {
            void uploadAndInsertImage(e.dataTransfer.files[0]);
          }
        }}
        className="w-full border-2 border-dashed border-[#7E8C80] rounded-[18px] p-6 text-center cursor-pointer hover:border-[#1F2A24] bg-stone-50/50 transition-colors flex items-center justify-center gap-3 text-[#4F5B53] font-bricolage text-[15px]"
      >
        <Upload className="w-5 h-5 text-[#1F2A24]" />
        <span>Drop an image here or click to browse</span>
      </div>

      {/* Footer line with live word count and "Autosave on" */}
      <div className="pt-4 border-t border-[#C3CCBE] flex items-center justify-between font-bricolage text-[14px] text-[#7E8C80]">
        <div>{words} {words === 1 ? 'word' : 'words'}</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>Autosave on</span>
        </div>
      </div>
    </div>
  );
}
