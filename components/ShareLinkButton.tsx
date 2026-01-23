"use client";

import { useState } from 'react';

interface ShareLinkButtonProps {
  shareUrl: string;
}

export default function ShareLinkButton({ shareUrl }: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      await navigator.clipboard.writeText(`${origin}${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-300 hover:text-indigo-200"
    >
      {copied ? 'Copied to clipboard' : 'Copy verification link'}
    </button>
  );
}
