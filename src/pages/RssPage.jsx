import React, { useMemo } from 'react';
import Button from '../components/ui/Button.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import { getPublishedStories, getSettings } from '../lib/storage.js';

export default function RssPage({ navigate }) {
  const { showToast } = useToast();
  const settings = getSettings();
  const stories = getPublishedStories().slice(0, 20);

  const rssXml = useMemo(() => {
    const siteUrl = window.location.origin;
    const items = stories
      .map(
        (s) => `    <item>
      <title><![CDATA[${s.title}]]></title>
      <link>${siteUrl}/writing/${s.slug}</link>
      <guid>${siteUrl}/writing/${s.slug}</guid>
      <pubDate>${new Date(s.published_at || s.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${s.excerpt || ''}]]></description>
      <category>${s.category}</category>
    </item>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${settings.blog_name || 'abhi.writes'}</title>
    <link>${siteUrl}</link>
    <description>${settings.tagline || 'Slow thoughts for a fast internet.'}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
  }, [stories, settings]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(rssXml);
    showToast('RSS XML copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([rssXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rss.xml';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded rss.xml');
  };

  return (
    <div className="flex flex-col gap-6 max-w-[800px] mx-auto text-left py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bricolage text-[36px] font-bold text-[#1F2A24]">
            RSS Feed (/rss.xml)
          </h1>
          <p className="font-bricolage text-[16px] text-[#4F5B53]">
            Standard RSS 2.0 XML feed with the latest 20 published stories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleCopy} className="!min-h-[38px] !py-1.5 !px-4 text-[13px]">
            Copy XML
          </Button>
          <Button variant="primary" onClick={handleDownload} className="!min-h-[38px] !py-1.5 !px-4 text-[13px]">
            Download XML
          </Button>
        </div>
      </div>

      <pre className="bg-[#1F2A24] text-[#EEF1EA] p-6 rounded-[20px] overflow-x-auto text-[13px] font-mono leading-relaxed border border-white/10 max-h-[500px]">
        {rssXml}
      </pre>

      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" onClick={() => navigate('/')} className="!min-h-[38px] !py-1.5 !px-4 text-[13px]">
          ← Back to home
        </Button>
      </div>
    </div>
  );
}
