/**
 * Data Deletion Policy Page
 * Public page - no authentication required
 */

import Link from 'next/link';

export default async function DataDeletionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Data Deletion Policy</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          Last Updated: January 13, 2025
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Right to Delete Data</h2>
            <p>
              At Amanoba, we respect your right to control your personal data. You can request the deletion 
              of your account and all associated personal information at any time. This page explains how we 
              handle data deletion requests and what data is removed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Data Will Be Deleted</h2>
            <p className="mb-2">When you request account deletion, the following data will be permanently removed:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Email address, display name, SSO identifier</li>
              <li><strong>Profile Data:</strong> Avatar, bio, preferences, settings</li>
              <li><strong>Game Progress:</strong> Scores, achievements, levels, streaks</li>
              <li><strong>Rewards:</strong> Points balance, unlocked rewards, redemption history</li>
              <li><strong>Social Data:</strong> Referral codes, friend connections (if applicable)</li>
              <li><strong>Session History:</strong> Game play sessions and activity logs</li>
              <li><strong>Communications:</strong> Support tickets and correspondence</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Data May Be Retained</h2>
            <p className="mb-2">
              In accordance with legal and business requirements, we may retain certain information for a limited time:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Transaction Records:</strong> Payment history for premium subscriptions (required for tax/accounting purposes)</li>
              <li><strong>Legal Compliance:</strong> Data required to comply with legal obligations or resolve disputes</li>
              <li><strong>Security Logs:</strong> Anonymized security and fraud prevention data</li>
              <li><strong>Aggregated Analytics:</strong> Anonymized, non-identifiable usage statistics</li>
            </ul>
            <p className="mt-4">
              Any retained data will be anonymized and cannot be used to identify you personally.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Request Data Deletion</h2>
            
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Method 1: Email Request (Recommended)</h3>
              <p className="mb-2">Send an email to:</p>
              <p className="text-lg font-semibold text-indigo-600">
                <a href="mailto:info@amanoba.com?subject=Data%20Deletion%20Request" className="hover:underline">
                  info@amanoba.com
                </a>
              </p>
              <p className="mt-2 text-sm">Subject: &quot;Data Deletion Request&quot;</p>
              <p className="mt-2">Include in your email:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Your registered email address</li>
                <li>Your Amanoba username/display name</li>
                <li>Confirmation that you want to permanently delete your account</li>
              </ul>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Method 2: In-App Request (Coming Soon)</h3>
              <p>
                You will soon be able to request account deletion directly from your account settings 
                within the Amanoba platform. This feature is currently in development.
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-400 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Method 3: Revoke SSO Access</h3>
              <p className="mb-2">
                If you signed in using SSO (e.g. Google, Microsoft, or your organisation&apos;s provider), you can revoke Amanoba&apos;s access in your provider&apos;s account settings. That may trigger a data-deletion request depending on the provider.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Deletion Timeline</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-24 font-bold text-indigo-600">Immediate</div>
                  <div className="flex-1">
                    <p className="font-semibold">Account Deactivation</p>
                    <p className="text-sm text-gray-600">Your account is immediately deactivated and you can no longer sign in</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-24 font-bold text-indigo-600">1-7 Days</div>
                  <div className="flex-1">
                    <p className="font-semibold">Grace Period</p>
                    <p className="text-sm text-gray-600">
                      A 7-day grace period during which you can cancel your deletion request. 
                      Contact us at info@amanoba.com to restore your account during this period.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-24 font-bold text-indigo-600">7-30 Days</div>
                  <div className="flex-1">
                    <p className="font-semibold">Permanent Deletion</p>
                    <p className="text-sm text-gray-600">
                      All personal data is permanently deleted from our active systems. 
                      Backups are purged within 30 days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-24 font-bold text-indigo-600">30+ Days</div>
                  <div className="flex-1">
                    <p className="font-semibold">Complete Removal</p>
                    <p className="text-sm text-gray-600">
                      All traces of your personal data are removed from our systems, including backups. 
                      Only anonymized analytics data may remain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="font-bold mr-2">⚠️</span>
                  <span><strong>Irreversible:</strong> Data deletion is permanent and cannot be undone after the 7-day grace period</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">⚠️</span>
                  <span><strong>New Account:</strong> If you sign up again, you will start fresh with no previous data</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">⚠️</span>
                  <span><strong>Premium Subscriptions:</strong> Active subscriptions will be cancelled (no refunds for partial periods)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">⚠️</span>
                  <span><strong>Third-Party Data:</strong> Data shared with SSO or other third-party services must be managed through those platforms</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirmation</h2>
            <p>
              Once your data has been deleted, we will send a confirmation email to your registered email 
              address (if still accessible). This confirms that your request has been processed and your 
              data has been removed from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns</h2>
            <p>
              If you have any questions about our data deletion process or need assistance, please contact us:
            </p>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> <a href="mailto:info@amanoba.com" className="text-indigo-600 hover:underline">info@amanoba.com</a></p>
              <p className="mt-2"><strong>Response Time:</strong> We aim to respond to all deletion requests within 48 hours</p>
              <p className="mt-2"><strong>Amanoba Gaming Platform</strong></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
            <p>
              This Data Deletion Policy is part of our commitment to protecting your privacy. For more 
              information about how we handle your data, please review our:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><Link href={`/${locale}/privacy`} className="text-indigo-600 hover:underline">Privacy Policy</Link></li>
              <li><Link href={`/${locale}/terms`} className="text-indigo-600 hover:underline">Terms of Service</Link></li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            <Link href={`/${locale}`} className="text-indigo-600 hover:underline mr-4">Back to Home</Link>
            <Link href={`/${locale}/privacy`} className="text-indigo-600 hover:underline mr-4">Privacy Policy</Link>
            <Link href={`/${locale}/terms`} className="text-indigo-600 hover:underline">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
