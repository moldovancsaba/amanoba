/**
 * Authentication Error Page
 * 
 * What: Displays authentication errors with user-friendly messages
 * Why: Handle OAuth failures and provide clear guidance to users
 */

import Link from 'next/link';

/**
 * Error messages mapping
 * 
 * Why: Provide user-friendly error descriptions
 */
const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please contact support if you believe this is an error.',
  },
  Verification: {
    title: 'Verification Failed',
    description: 'The sign in link is no longer valid. It may have expired or already been used.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Failed',
    description: 'Error occurred while trying to connect with Facebook. Please try again.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'Error occurred during the Facebook authentication process. Please try again.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Failed',
    description: 'Could not create your account. Please try again or contact support.',
  },
  EmailCreateAccount: {
    title: 'Email Account Creation Failed',
    description: 'Could not create your email account. Please try again.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'Error occurred during the sign in process. Please try again.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Already Exists',
    description: 'An account with this email already exists. Please sign in with your original method.',
  },
  EmailSignin: {
    title: 'Email Sign In Error',
    description: 'Could not send sign in email. Please check your email address and try again.',
  },
  CredentialsSignin: {
    title: 'Sign In Failed',
    description: 'The credentials you provided are incorrect. Please try again.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You must be signed in to access this page.',
  },
  default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred. Please try signing in again.',
  },
};

/**
 * Authentication Error Page Component
 * 
 * Why: Provide clear error feedback and recovery options
 */
export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorType = params.error || 'default';
  const errorInfo = errorMessages[errorType] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Error Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {errorInfo.title}
            </h1>
            <p className="text-gray-600">
              {errorInfo.description}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
            >
              Go to Homepage
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Need help?{' '}
              <a
                href="mailto:csaba@doneisbetter.com"
                className="text-indigo-600 hover:text-indigo-700 underline"
              >
                Contact Support
              </a>
            </p>
          </div>

          {/* Debug Info (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-mono text-gray-600">
                Error Type: {errorType}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
