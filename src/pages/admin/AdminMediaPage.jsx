import React, { useState, useRef } from 'react';
import Button from '../../components/ui/Button.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { getMedia, uploadMediaFile, deleteMediaItem } from '../../lib/storage.js';

export default function AdminMediaPage() {
  const { showToast } = useToast();
  const mediaItems = getMedia();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = async (e) => {
    setErrorMessage('');
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const acceptedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

    for (const file of files) {
      if (!acceptedTypes.includes(file.type)) {
        setErrorMessage(`Rejected "${file.name}": only PNG, JPG, WebP, and GIF files are accepted.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`Rejected "${file.name}": file exceeds the 5MB size limit.`);
        continue;
      }
      try {
        await uploadMediaFile(file);
        showToast(`Uploaded ${file.name}`);
      } catch (error) {
        setErrorMessage(error?.message || `Could not upload "${file.name}".`);
      }
    }
    e.target.value = '';
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMediaItem(itemToDelete.id);
      showToast('Image removed from media library');
      setItemToDelete(null);
    } catch (error) {
      setErrorMessage(error?.message || 'Could not delete the image.');
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard?.writeText(url);
    showToast('Image URL copied');
  };

  return (
    <div className="flex flex-col gap-8 w-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bricolage text-[36px] sm:text-[44px] font-bold text-[#1F2A24] leading-tight">
            Media library
          </h1>
          <p className="font-bricolage text-[16px] text-[#4F5B53] mt-1">
            Images you've uploaded for your stories.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleFiles}
            className="hidden"
          />
          <Button
            variant="gold"
            onClick={() => fileInputRef.current?.click()}
            className="shadow-xs"
          >
            Upload images
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-[14px] font-bricolage text-[14px] border border-red-200">
          {errorMessage}
        </div>
      )}

      {/* Grid of media cards */}
      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[20px] p-3 border border-black/5 shadow-xs flex flex-col gap-3 group"
            >
              <div className="relative rounded-[14px] overflow-hidden aspect-4/3 bg-stone-100 flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.name || 'Media asset'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-1 px-1">
                <span className="font-bricolage text-[13px] font-medium text-[#1F2A24] truncate">
                  {item.name || 'Image asset'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => copyUrl(item.url)}
                  className="text-[12px] font-bricolage text-[#4F5B53] hover:text-[#1F2A24] underline cursor-pointer"
                >
                  Copy URL
                </button>
                <Button
                  variant="ghost"
                  onClick={() => setItemToDelete(item)}
                  className="!min-h-[32px] !py-1 !px-2.5 !text-[12px] hover:!border-red-600 hover:!bg-red-600 hover:!text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[24px] p-12 text-center border border-black/5 flex flex-col items-center gap-3">
          <p className="font-bricolage text-[18px] text-[#4F5B53]">
            No images yet. Upload your first one.
          </p>
          <Button
            variant="gold"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2"
          >
            Upload image
          </Button>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Delete this image?"
        message="This image will be removed from your media library."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
