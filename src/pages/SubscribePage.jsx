import React, { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import { addSubscriber } from '../lib/storage.js';

export default function SubscribePage({ searchParams = {}, navigate }) {
  const isDoneFromParam = searchParams.done === '1';
  const initialEmail = searchParams.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [submittedEmail, setSubmittedEmail] = useState(isDoneFromParam ? initialEmail || 'your email' : '');
  const [isSuccess, setIsSuccess] = useState(isDoneFromParam);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      await addSubscriber(cleanEmail);
      setSubmittedEmail(cleanEmail);
      setIsSuccess(true);
    } catch (err) {
      setError(err?.message || 'Could not subscribe. Please try again.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 w-full">
      <div className="bg-[#F2C94C] rounded-[24px] p-8 sm:p-12 max-w-[640px] w-full text-center flex flex-col items-center gap-6 shadow-sm border border-black/5">
        {!isSuccess ? (
          <>
            <h1 className="font-bricolage text-[38px] sm:text-[48px] font-bold text-[#1F2A24] leading-[1.1] tracking-tight">
              One letter, once a month.
            </h1>

            <p className="font-bricolage text-[18px] sm:text-[20px] text-[#1F2A24]/90 leading-relaxed max-w-md">
              A single monthly reflection on craft, deep focus, and creating lasting work in a distracted world.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-3 text-left">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="subscribe-email-field"
                  className="font-bricolage text-[14px] font-medium text-[#1F2A24]"
                >
                  Email address
                </label>
                <input
                  id="subscribe-email-field"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="name@example.com"
                  className="h-[48px] px-4 rounded-[14px] bg-white border-[1.5px] border-[#7E8C80] focus:border-[#1F2A24] outline-none font-bricolage text-[16px] text-[#1F2A24]"
                />
                {error && (
                  <span className="font-bricolage text-[13px] text-red-900 font-semibold mt-1">
                    {error}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
              >
                Subscribe
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-5 py-4 animate-in fade-in">
            <h1 className="font-bricolage text-[44px] font-bold text-[#1F2A24]">
              Thank you!
            </h1>

            <p className="font-bricolage text-[20px] text-[#1F2A24]/90 max-w-md leading-relaxed">
              Your next letter will arrive at <span className="font-bold underline">{submittedEmail}</span>.
            </p>

            <Button
              variant="primary"
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Back home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
