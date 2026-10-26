import React, { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { sendAdminPasswordReset } from '../../lib/storage.js';

export default function AdminForgotPage({ navigate }) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendReset = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsSending(true);
    try {
      await sendAdminPasswordReset(email);
      showToast('If the account exists, a reset email has been sent.');
      setSent(true);
    } catch (err) {
      setError(err?.message || 'Could not send the reset email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EEF1EA] flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative circles */}
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
            Reset your password
          </h1>
          <p className="font-bricolage text-[16px] text-[#4F5B53]">
            Enter your registered email address and we'll send you instructions to set a new password.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSendReset} className="flex flex-col gap-4">
            <Field
              label="Email address"
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" variant="primary" disabled={isSending} className="w-full mt-2 !h-[48px]">
              {isSending ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        ) : (
          <div className="bg-stone-50 p-4 rounded-[16px] border border-[#C3CCBE]">
            <p className="font-bricolage text-[15px] text-[#1F2A24]">
              Check the inbox for <strong>{email}</strong> and open the password reset link. The link will return you here to set a new password. Also check spam and confirm that the /admin/reset URL is allowlisted in Supabase Authentication URL Configuration.
            </p>
          </div>
        )}

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
