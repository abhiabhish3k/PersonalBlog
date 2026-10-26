import React, { useState, useRef } from 'react';
import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { getSettings, updateSettings, exportAllData, uploadMediaFile, updateAdminPassword } from '../../lib/storage.js';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const settings = getSettings();

  const [form, setForm] = useState({
    blog_name: settings.blog_name || 'abhi.writes',
    tagline: settings.tagline || '',
    author_name: settings.author_name || 'Abhi',
    contact_email: settings.contact_email || '',
    bio: settings.bio || '',
    currently: settings.currently || '',
    writes_about: settings.writes_about || '',
    github_url: settings.github_url || '',
    x_url: settings.x_url || '',
    linkedin_url: settings.linkedin_url || '',
    portrait_url: settings.portrait_url || '',
  });

  const [passwordState, setPasswordState] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [accountError, setAccountError] = useState('');

  const portraitInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(form);
      showToast('Settings saved');
    } catch (error) {
      showToast(error?.message || 'Could not save settings');
    }
  };

  const handlePortraitUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const item = await uploadMediaFile(file);
        setForm((prev) => ({ ...prev, portrait_url: item.url }));
        showToast('Portrait uploaded');
      } catch (error) {
        showToast(error?.message || 'Could not upload portrait');
      }
    }
    e.target.value = '';
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setAccountError('');
    if (passwordState.newPass.length < 8) {
      setAccountError('Password must be at least 8 characters.');
      return;
    }
    if (passwordState.newPass !== passwordState.confirm) {
      setAccountError('New passwords do not match.');
      return;
    }
    try {
      await updateAdminPassword(passwordState.newPass);
      showToast('Password updated');
      setPasswordState({ current: '', newPass: '', confirm: '' });
    } catch (error) {
      setAccountError(error?.message || 'Could not update the password.');
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[800px] text-left">
      <div>
        <h1 className="font-bricolage text-[36px] sm:text-[44px] font-bold text-[#1F2A24] leading-tight">
          Settings
        </h1>
        <p className="font-bricolage text-[16px] text-[#4F5B53] mt-1">
          Customize your author profile, blog metadata, and external social links.
        </p>
      </div>

      {/* Card 1: Main Settings Form Card */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-white rounded-[24px] p-6 sm:p-10 border border-black/5 shadow-xs flex flex-col gap-6"
      >
        <h2 className="font-bricolage text-[24px] font-bold text-[#1F2A24]">
          Blog & Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label="Blog name"
            name="blog_name"
            value={form.blog_name}
            onChange={handleChange}
            placeholder="abhi.writes"
            required
          />

          <Field
            label="Author name"
            name="author_name"
            value={form.author_name}
            onChange={handleChange}
            placeholder="Abhi"
            required
          />
        </div>

        <Field
          label="Tagline"
          name="tagline"
          value={form.tagline}
          onChange={handleChange}
          placeholder="Slow thoughts for a fast internet."
        />

        <Field
          label="Contact email"
          name="contact_email"
          type="email"
          value={form.contact_email}
          onChange={handleChange}
          placeholder="abhi@example.com"
        />

        {/* Portrait Upload */}
        <div className="flex flex-col gap-2">
          <span className="font-bricolage text-[14px] font-medium text-[#1F2A24]">
            Portrait image
          </span>
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-24 rounded-[20px] bg-stone-100 border border-black/10 overflow-hidden flex items-center justify-center shrink-0"
              style={{ borderRadius: '40px 40px 14px 14px' }}
            >
              {form.portrait_url ? (
                <img src={form.portrait_url} alt="Portrait preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[12px] font-bricolage text-[#7E8C80] text-center px-1">
                  No image
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <input
                ref={portraitInputRef}
                type="file"
                accept="image/*"
                onChange={handlePortraitUpload}
                className="hidden"
              />
              <Button
                variant="ghost"
                onClick={() => portraitInputRef.current?.click()}
                className="!min-h-[38px] !py-1.5 !px-4 text-[13px]"
              >
                Upload portrait
              </Button>
              {form.portrait_url && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, portrait_url: '' }))}
                  className="text-left text-[12px] text-red-600 underline cursor-pointer"
                >
                  Remove portrait
                </button>
              )}
            </div>
          </div>
        </div>

        <Field
          label="Bio"
          name="bio"
          multiline
          rows={4}
          value={form.bio}
          onChange={handleChange}
          placeholder="A paragraph or two describing your philosophy, interests, and writing focus..."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label="Currently"
            name="currently"
            multiline
            rows={3}
            value={form.currently}
            onChange={handleChange}
            placeholder="What you are working on, reading, or experimenting with..."
          />

          <Field
            label="I write about"
            name="writes_about"
            multiline
            rows={3}
            value={form.writes_about}
            onChange={handleChange}
            placeholder="Themes and topics featured across your essays..."
          />
        </div>

        <div className="border-t border-[#C3CCBE] pt-6 flex flex-col gap-5">
          <h3 className="font-bricolage text-[18px] font-bold text-[#1F2A24]">
            Social & External Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field
              label="GitHub URL"
              name="github_url"
              value={form.github_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />

            <Field
              label="X URL"
              name="x_url"
              value={form.x_url}
              onChange={handleChange}
              placeholder="https://x.com/..."
            />

            <Field
              label="LinkedIn URL"
              name="linkedin_url"
              value={form.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" variant="gold" className="!h-[48px] px-8 shadow-xs">
            Save changes
          </Button>
        </div>
      </form>

      {/* Card 2: Account (Password Change) */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-white rounded-[24px] p-6 sm:p-10 border border-black/5 shadow-xs flex flex-col gap-5"
      >
        <h2 className="font-bricolage text-[24px] font-bold text-[#1F2A24]">
          Account
        </h2>
        <p className="font-bricolage text-[15px] text-[#4F5B53] -mt-2">
          Update the password used to access this admin panel.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label="New password"
            type="password"
            value={passwordState.newPass}
            onChange={(e) => setPasswordState((p) => ({ ...p, newPass: e.target.value }))}
            placeholder="••••••••"
          />

          <Field
            label="Confirm new password"
            type="password"
            value={passwordState.confirm}
            onChange={(e) => setPasswordState((p) => ({ ...p, confirm: e.target.value }))}
            placeholder="••••••••"
          />
        </div>

        {accountError && (
          <span className="text-[13px] text-red-600 font-bricolage">
            {accountError}
          </span>
        )}

        <div className="pt-1">
          <Button type="submit" variant="primary" className="!min-h-[42px] !py-2 text-[14px]">
            Update password
          </Button>
        </div>
      </form>

      {/* Card 3: Export data */}
      <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-black/5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bricolage text-[24px] font-bold text-[#1F2A24]">
            Export data
          </h2>
          <p className="font-bricolage text-[15px] text-[#4F5B53] mt-1">
            Download a full JSON backup of all published and draft stories, subscribers, and settings.
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={exportAllData}
          className="shrink-0"
        >
          Download all stories (JSON)
        </Button>
      </div>
    </div>
  );
}
