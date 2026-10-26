import React, { useState } from 'react';
import Field from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import { addMessage } from '../lib/storage.js';

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Please enter your name.';
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please enter a valid email.';
    }
    if (!message.trim()) newErrors.message = 'Please enter a message.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await addMessage({ name, email, body: message });
      showToast('Message sent. Thanks for writing!');
      setName('');
      setEmail('');
      setMessage('');
      setErrors({});
    } catch (error) {
      setErrors((prev) => ({ ...prev, message: error?.message || 'Could not send your message. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 w-full">
      <div className="w-full max-w-[640px] flex flex-col gap-8 text-left">
        <div className="flex flex-col gap-2">
          <h1 className="font-bricolage text-[44px] sm:text-[64px] font-bold text-[#1F2A24] leading-[1.05] tracking-[-0.03em]">
            Say hello
          </h1>
          <p className="font-bricolage text-[20px] text-[#4F5B53] leading-relaxed">
            Whether you have a question about an essay, a collaborative proposal, or simply want to introduce yourself, my inbox is always open.
          </p>
        </div>

        {/* White form card (max-width 640px) */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[24px] p-8 sm:p-10 border border-black/5 shadow-xs flex flex-col gap-6"
        >
          <Field
            label="Name"
            id="contact-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="Your name"
            error={errors.name}
            required
          />

          <Field
            label="Email"
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: '' }));
            }}
            placeholder="your@email.com"
            error={errors.email}
            required
          />

          <Field
            label="Message"
            id="contact-message"
            multiline
            rows={5}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setErrors((prev) => ({ ...prev, message: '' }));
            }}
            placeholder="Write your note here..."
            error={errors.message}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Sending...' : 'Send message'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
