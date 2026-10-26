import React, { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Field from '../../components/ui/Field.jsx';
import { signInAdmin } from '../../lib/storage.js';

export default function AdminLoginPage({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signInAdmin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err?.message || 'Email or password is incorrect.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EEF1EA] flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative circles bleeding off edges per prompt specification */}
      <div
        className="absolute -top-16 -left-16 w-72 h-72 rounded-full pointer-events-none select-none opacity-80"
        style={{ backgroundColor: '#CFE0D2' }} // sage circle off top-left
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full pointer-events-none select-none opacity-80"
        style={{ backgroundColor: '#F2C94C' }} // butter circle bleeding off bottom-right
        aria-hidden="true"
      />

      {/* Centred white card, 440px wide */}
      <div className="relative z-10 bg-white rounded-[24px] p-8 sm:p-10 max-w-[440px] w-full border border-black/5 shadow-lg flex flex-col gap-6 text-left">
        {/* Logo */}
        <div className="font-bricolage font-bold text-[26px] tracking-tight text-[#1F2A24]">
          abhi<span className="text-[#B88A00]">.</span>admin
        </div>

        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="font-bricolage text-[36px] font-bold text-[#1F2A24] leading-tight">
            Welcome back.
          </h1>
          <p className="font-newsreader text-[18px] text-[#4F5B53] italic">
            Sign in to write, edit and publish your stories.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Field
            label="Email"
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <Field
            label="Password"
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <div className="flex justify-end text-[14px] font-bricolage pt-1">
            <a
              href="/admin/forgot"
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin/forgot');
              }}
              className="text-[#1F2A24] hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {error && (
            <div className="font-bricolage text-[14px] text-red-600 bg-red-50 p-2.5 rounded-[10px] border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full mt-2 !h-[48px]"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        {/* Footer text */}
        <div className="pt-2 border-t border-[#C3CCBE] text-center font-bricolage text-[14px] text-[#4F5B53]">
          <span>Admin access only · </span>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="text-[#1F2A24] underline font-medium hover:text-black"
          >
            Back to blog
          </a>
        </div>
      </div>
    </div>
  );
}
