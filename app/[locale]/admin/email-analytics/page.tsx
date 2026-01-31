/**
 * Admin Email Analytics Page
 *
 * What: Displays email sent/open/click analytics by type and segment
 * Why: Enables admins to monitor email engagement (Phase 1 Email Automation)
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Send, MousePointer, Eye, Loader2 } from 'lucide-react';

interface EmailSummary {
  sent: number;
  opened: number;
  clicked: number;
  totalClicks: number;
  openRatePct: number;
  clickRatePct: number;
}

interface ByTypeRow {
  type: string;
  sent: number;
  opened: number;
  clicked: number;
  clicks: number;
  openRatePct: number;
  clickRatePct: number;
}

interface BySegmentRow {
  segment: string;
  sent: number;
  opened: number;
  clicked: number;
  clicks: number;
  openRatePct: number;
  clickRatePct: number;
}

interface EmailAnalyticsData {
  success: boolean;
  period: { days: number; since: string };
  summary: EmailSummary;
  byType: ByTypeRow[];
  bySegment: BySegmentRow[];
}

export default function AdminEmailAnalyticsPage() {
  const t = useTranslations('admin');
  const [data, setData] = useState<EmailAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/email-analytics?days=${days}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">{t('emailAnalytics')}</h1>
        <p className="text-gray-400">Failed to load email analytics.</p>
      </div>
    );
  }

  const { period, summary, byType, bySegment } = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Mail className="w-7 h-7 text-primary-400" />
          {t('emailAnalytics')}
        </h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        Period: {period.days} days (since {new Date(period.since).toLocaleDateString()}). Completion emails only (tracking added in Phase 1).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Send className="w-4 h-4" />
            Sent
          </div>
          <div className="text-2xl font-bold text-white">{summary.sent}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Eye className="w-4 h-4" />
            Opened
          </div>
          <div className="text-2xl font-bold text-white">{summary.opened}</div>
          <div className="text-sm text-primary-400">{summary.openRatePct}% open rate</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <MousePointer className="w-4 h-4" />
            Clicked
          </div>
          <div className="text-2xl font-bold text-white">{summary.clicked}</div>
          <div className="text-sm text-primary-400">{summary.clickRatePct}% click rate</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">Total clicks</div>
          <div className="text-2xl font-bold text-white">{summary.totalClicks}</div>
        </div>
      </div>

      {byType.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">By email type</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Opened</th>
                  <th className="px-4 py-3">Clicked</th>
                  <th className="px-4 py-3">Clicks</th>
                  <th className="px-4 py-3">Open %</th>
                  <th className="px-4 py-3">Click %</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 text-gray-200">
                {byType.map((row) => (
                  <tr key={row.type} className="border-t border-gray-700">
                    <td className="px-4 py-3">{row.type}</td>
                    <td className="px-4 py-3">{row.sent}</td>
                    <td className="px-4 py-3">{row.opened}</td>
                    <td className="px-4 py-3">{row.clicked}</td>
                    <td className="px-4 py-3">{row.clicks}</td>
                    <td className="px-4 py-3">{row.openRatePct}%</td>
                    <td className="px-4 py-3">{row.clickRatePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {bySegment.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">By segment</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-4 py-3">Segment</th>
                  <th className="px-4 py-3">Sent</th>
                  <th className="px-4 py-3">Opened</th>
                  <th className="px-4 py-3">Clicked</th>
                  <th className="px-4 py-3">Clicks</th>
                  <th className="px-4 py-3">Open %</th>
                  <th className="px-4 py-3">Click %</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 text-gray-200">
                {bySegment.map((row) => (
                  <tr key={row.segment} className="border-t border-gray-700">
                    <td className="px-4 py-3">{row.segment}</td>
                    <td className="px-4 py-3">{row.sent}</td>
                    <td className="px-4 py-3">{row.opened}</td>
                    <td className="px-4 py-3">{row.clicked}</td>
                    <td className="px-4 py-3">{row.clicks}</td>
                    <td className="px-4 py-3">{row.openRatePct}%</td>
                    <td className="px-4 py-3">{row.clickRatePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {summary.sent === 0 && (
        <p className="text-gray-400 text-sm">
          No tracked emails in this period. Completion emails with open/click tracking are recorded when sent.
        </p>
      )}
    </div>
  );
}
