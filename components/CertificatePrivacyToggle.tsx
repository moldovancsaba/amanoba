"use client";

import { useState } from 'react';
import { Lock, LockOpen } from 'lucide-react';

interface CertificatePrivacyToggleProps {
  slug: string;
  initialPublic: boolean;
}

export function CertificatePrivacyToggle({ slug, initialPublic }: CertificatePrivacyToggleProps) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/certificates/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to update visibility');
      }

      setIsPublic(Boolean(data.data?.isPublic));
      setMessage(isPublic ? 'Certificate is now private.' : 'Certificate is now public.');
    } catch (err: any) {
      setError(err?.message || 'Failed to update certificate visibility');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-1 text-sm">
      <button
        type="button"
        onClick={toggle}
        disabled={saving}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/30 bg-black/40 text-white text-xs font-semibold tracking-wide hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40"
      >
        {isPublic ? <LockOpen className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        {isPublic ? 'Make private' : 'Share publicly'}
      </button>
      {message && <p className="text-xs text-emerald-300">{message}</p>}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
