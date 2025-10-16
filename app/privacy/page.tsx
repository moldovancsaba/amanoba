/**
 * Privacy Policy Page
 * Public page - no authentication required
 * Required for Facebook OAuth and platform compliance
 */

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          Last Updated: January 13, 2025
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to Amanoba (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy 
              and ensuring the security of your personal information. This Privacy Policy explains how 
              we collect, use, disclose, and safeguard your information when you use our gaming platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email address) through Facebook OAuth</li>
              <li>Profile information (display name, avatar)</li>
              <li>Game preferences and settings</li>
              <li>Communications with our support team</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">2.2 Information Automatically Collected</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Game play data (scores, achievements, progress)</li>
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (features used, time spent, interactions)</li>
              <li>IP address and general location data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our gaming services</li>
              <li>Personalize your gaming experience</li>
              <li>Track your game progress, achievements, and rewards</li>
              <li>Process premium subscriptions and transactions</li>
              <li>Send you important service updates and notifications</li>
              <li>Analyze and improve our platform performance</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
            <p className="mb-2">We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third-party companies that help us operate our platform (hosting, analytics, payment processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Facebook Login</h2>
            <p>
              When you sign in using Facebook, we receive basic profile information (name, email, profile picture) 
              as permitted by Facebook&apos;s OAuth system. We do not post to your Facebook account without your explicit 
              permission. You can manage Facebook app permissions in your Facebook settings at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Encrypted data transmission (HTTPS/SSL)</li>
              <li>Secure authentication systems</li>
              <li>Regular security audits</li>
              <li>Access controls and monitoring</li>
            </ul>
            <p className="mt-2">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data (see Data Deletion Policy)</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain data processing activities</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at <a href="mailto:info@amanoba.com" className="text-indigo-600 hover:underline">info@amanoba.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
            <p>
              Our platform is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you believe we have collected information from 
              a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies and Tracking</h2>
            <p className="mb-2">
              We use cookies and similar technologies to enhance your experience. You can control cookies 
              through your browser settings. We use:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand platform usage</li>
              <li><strong>Preference Cookies:</strong> Remember your settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to 
              provide services. We will delete or anonymize your data upon account deletion request, 
              except where we are required to retain it for legal or security purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country 
              of residence. We ensure appropriate safeguards are in place to protect your data in accordance 
              with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes 
              by posting the new policy on this page and updating the &quot;Last Updated&quot; date. Your continued use 
              of the platform after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> <a href="mailto:info@amanoba.com" className="text-indigo-600 hover:underline">info@amanoba.com</a></p>
              <p className="mt-2"><strong>Amanoba Gaming Platform</strong></p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            <a href="/" className="text-indigo-600 hover:underline mr-4">Back to Home</a>
            <a href="/terms" className="text-indigo-600 hover:underline mr-4">Terms of Service</a>
            <a href="/data-deletion" className="text-indigo-600 hover:underline">Data Deletion</a>
          </p>
        </div>
      </div>
    </div>
  );
}
