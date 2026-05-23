/**
 * Gmail OAuth helper
 *
 * What: Prints the Gmail authorization URL and exchanges an auth code for a refresh token
 * Why: Gmail API delivery needs a one-time refresh token, and this avoids adding Google SDK dependencies
 */

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;
const redirectUri = process.env.GMAIL_OAUTH_REDIRECT_URI || 'urn:ietf:wg:oauth:2.0:oob';
const scope = 'https://www.googleapis.com/auth/gmail.send';

if (!clientId || !clientSecret) {
  console.error('Missing GMAIL_CLIENT_ID or GMAIL_CLIENT_SECRET.');
  process.exit(1);
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('redirect_uri', redirectUri);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', scope);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

console.log('\nOpen this URL with the Gmail/Workspace sender account:\n');
console.log(authUrl.toString());
console.log('\nAfter approval, paste the authorization code below.\n');

const rl = createInterface({ input, output });
const code = (await rl.question('Authorization code: ')).trim();
rl.close();

if (!code) {
  console.error('No authorization code provided.');
  process.exit(1);
}

const response = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
    grant_type: 'authorization_code',
  }),
});

const payload = await response.json() as {
  refresh_token?: string;
  access_token?: string;
  error?: string;
  error_description?: string;
};

if (!response.ok || !payload.refresh_token) {
  console.error(payload.error_description || payload.error || `Token exchange failed with ${response.status}`);
  process.exit(1);
}

console.log('\nAdd this value to Vercel/local env as GMAIL_REFRESH_TOKEN:\n');
console.log(payload.refresh_token);
