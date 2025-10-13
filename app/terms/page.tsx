/**
 * Terms of Service Page
 * Public page - no authentication required
 * Legal terms governing use of the platform
 */

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          Last Updated: January 13, 2025
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              Welcome to Amanoba ("we," "our," or "us"). By accessing or using our gaming platform 
              (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do 
              not agree to these Terms, please do not use the Service.
            </p>
            <p className="mt-2">
              These Terms constitute a legally binding agreement between you and Amanoba. We reserve 
              the right to update these Terms at any time. Your continued use of the Service after 
              changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
            <p className="mb-2">To use the Service, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 13 years of age (or the minimum age required in your jurisdiction)</li>
              <li>Have the legal capacity to enter into a binding agreement</li>
              <li>Not be prohibited from using the Service under applicable laws</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
            <p className="mt-4">
              If you are under 18, you represent that you have obtained consent from your parent or 
              legal guardian to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            <p>
              To access certain features, you must create an account. You may register using:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Facebook OAuth authentication</li>
              <li>Other authentication methods we may provide in the future</li>
            </ul>
            <p className="mt-4">You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
            <p className="mb-2">You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Upload or transmit viruses, malware, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use bots, scripts, or automated tools to access the Service</li>
              <li>Cheat, exploit bugs, or manipulate game mechanics unfairly</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate any person or entity</li>
              <li>Collect or harvest user data without permission</li>
              <li>Engage in any commercial use without our written consent</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Create derivative works based on our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Games and Services</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 Free Games</h3>
            <p>
              We offer free games that are available to all registered users. Free games may have 
              limited features, hints, or rewards compared to premium offerings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.2 Premium Games and Features</h3>
            <p>
              Premium games and features require a paid subscription. Premium benefits may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access to exclusive games (e.g., Madoku)</li>
              <li>Unlimited hints and assistance</li>
              <li>Ad-free experience</li>
              <li>Priority support</li>
              <li>Exclusive achievements and rewards</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.3 Gamification Features</h3>
            <p>
              Our platform includes gamification elements such as points, achievements, levels, 
              leaderboards, and rewards. These features:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Have no real-world monetary value</li>
              <li>Cannot be transferred, sold, or exchanged for cash</li>
              <li>May be modified or discontinued at our discretion</li>
              <li>Are subject to our terms and policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment and Subscriptions</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">6.1 Premium Subscriptions</h3>
            <p>
              Premium subscriptions are billed on a recurring basis (monthly, annually, etc.) 
              until cancelled. You authorize us to charge your payment method automatically.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">6.2 Billing</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Charges are made in advance for each billing period</li>
              <li>No refunds for partial periods or unused features</li>
              <li>Prices may change with 30 days' notice</li>
              <li>Failed payments may result in service suspension</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">6.3 Cancellation</h3>
            <p>
              You may cancel your subscription at any time. Cancellation takes effect at the end 
              of the current billing period. You will retain access until that date.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">6.4 Refund Policy</h3>
            <p>
              Generally, all payments are non-refundable. Exceptions may be made at our sole 
              discretion for extraordinary circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Service, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Software code and architecture</li>
              <li>Game designs, mechanics, and rules</li>
              <li>Graphics, images, and visual elements</li>
              <li>Text, audio, and video content</li>
              <li>Trademarks, logos, and branding</li>
            </ul>
            <p className="mt-4">
              Are owned by Amanoba or our licensors and are protected by copyright, trademark, and 
              other intellectual property laws. You may not copy, modify, distribute, sell, or 
              create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. User Content</h2>
            <p>
              You may be able to submit content such as profile information, messages, or feedback. 
              By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Use, reproduce, and display your content</li>
              <li>Modify and adapt content for technical requirements</li>
              <li>Store and process content in our systems</li>
            </ul>
            <p className="mt-4">
              You represent that you own or have rights to any content you submit and that it does 
              not violate any third-party rights or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection and use of personal information is 
              governed by our <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>, 
              which is incorporated into these Terms by reference.
            </p>
            <p className="mt-2">
              By using the Service, you consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimers</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6">
              <p className="font-semibold mb-2">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</p>
              <p className="mt-2">We disclaim all warranties, express or implied, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties of non-infringement</li>
                <li>Warranties regarding accuracy, reliability, or availability</li>
                <li>Warranties that the Service will be uninterrupted or error-free</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <div className="bg-red-50 border-l-4 border-red-600 p-6">
              <p className="font-semibold mb-2">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, AMANOBA SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, use, or other intangible losses</li>
                <li>Damages resulting from unauthorized access to your account</li>
                <li>Damages from interruptions or errors in the Service</li>
                <li>Damages from third-party content or conduct</li>
              </ul>
              <p className="mt-4">
                Our total liability shall not exceed the amount you paid us in the 12 months 
                preceding the claim, or $100, whichever is greater.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Amanoba, its affiliates, and their respective 
              officers, directors, employees, and agents from any claims, liabilities, damages, losses, 
              and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your content or conduct</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>
            <p className="mb-2">
              We may suspend or terminate your access to the Service at any time, with or without 
              notice, for any reason, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violation of these Terms</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Prolonged inactivity</li>
              <li>At your request</li>
            </ul>
            <p className="mt-4">
              Upon termination, your right to use the Service immediately ceases. Provisions that 
              should survive termination (including disclaimers, limitations of liability, and 
              indemnification) will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or your use of the Service shall be resolved through:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mt-2">
              <li><strong>Informal Resolution:</strong> Contact us at info@amanoba.com to resolve disputes informally</li>
              <li><strong>Binding Arbitration:</strong> If informal resolution fails, disputes shall be resolved by binding arbitration</li>
              <li><strong>Class Action Waiver:</strong> You agree to bring claims individually, not as part of a class action</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the 
              jurisdiction in which Amanoba operates, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material 
              changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Posting the updated Terms on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification (for significant changes)</li>
            </ul>
            <p className="mt-4">
              Your continued use of the Service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. General Provisions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Amanoba</li>
              <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in effect</li>
              <li><strong>Waiver:</strong> Our failure to enforce any right does not waive that right</li>
              <li><strong>Assignment:</strong> We may assign our rights and obligations; you may not without our consent</li>
              <li><strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our control</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Contact Information</h2>
            <p>
              If you have questions about these Terms of Service, please contact us:
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
            <a href="/privacy" className="text-indigo-600 hover:underline mr-4">Privacy Policy</a>
            <a href="/data-deletion" className="text-indigo-600 hover:underline">Data Deletion</a>
          </p>
        </div>
      </div>
    </div>
  );
}
