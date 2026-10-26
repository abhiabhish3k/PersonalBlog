import React, { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { updateAdminPassword } from '../../lib/storage.js';

export default function AdminResetPage({ navigate }) {
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsSaving(true);
    try {
      await updateAdminPassword(password);
      showToast('Password updated successfully');
      navigate('/admin/login');
    } catch (err) {
      setError(err?.message || 'Could not update the password. Open the reset link from your email and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EEF1EA] flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute -top-16 -left-16 w-72 h-72 rounded-full pointer-events-none select-none opacity-80"
        style={{ backgroundColor: '#CFE0D2' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full pointer-events-none select-none opacity-80"
        style={{ backgroundColor: '#F2C94C' }}
        aria-hidden="true"
      />

      <div className="relative z-10 bg-white rounded-[24px] p-8 sm:p-10 max-w-[440px] w-full border border-black/5 shadow-lg flex flex-col gap-6 text-left">
        <div className="font-bricolage font-bold text-[26px] tracking-tight text-[#1F2A24]">
          abhi<span className="text-[#B88A00]">.</span>admin
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-bricolage text-[36px] font-bold text-[#1F2A24] leading-tight">
            Set new password
          </h1>
          <p className="font-bricolage text-[16px] text-[#4F5B53]">
            Choose a strong new password for your administrator account.
          </p>
        </div>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <Field
            label="New password"
            id="reset-pass"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
          />

          <Field
            label="Confirm password"
            id="reset-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="font-bricolage text-[14px] text-red-600 bg-red-50 p-2.5 rounded-[10px] border border-red-200">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" disabled={isSaving} className="w-full mt-2 !h-[48px]">
            {isSaving ? 'Saving…' : 'Save password'}
          </Button>
        </form>

        <div className="pt-2 border-t border-[#C3CCBE] text-center font-bricolage text-[14px]">
          <a
            href="/admin/login"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin/login');
            }}
            className="text-[#1F2A24] hover:underline font-medium"
          >
            ← Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
}
