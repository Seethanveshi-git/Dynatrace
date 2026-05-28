'use strict';

const fs = require('fs');
const { axios, getPlatformBaseUrl, resolveBearerToken, fail } = require('../auth');

const DOCUMENT_ID = "82794780-6d27-4f9e-a6d9-efa12cb37b7e";
const PAYLOAD_PATH = process.env.DYNATRACE_DOCUMENT_PAYLOAD_PATH || './update-document-payload.example.json';

if (!DOCUMENT_ID) fail('Missing DYNATRACE_DOCUMENT_ID in .env');
if (!fs.existsSync(PAYLOAD_PATH)) fail(`Payload file not found: ${PAYLOAD_PATH}`);

(async () => {
  try {
    const payload = JSON.parse(fs.readFileSync(PAYLOAD_PATH, 'utf8'));
    const base = getPlatformBaseUrl();
    const token = await resolveBearerToken();
    const endpoint = new URL(`/platform/document/v1/documents/${encodeURIComponent(DOCUMENT_ID)}`, base);

    const response = await axios.put(endpoint.toString(), payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      const details = typeof error.response.data === 'string'
        ? error.response.data
        : JSON.stringify(error.response.data, null, 2);
      fail(`Request failed (${error.response.status} ${error.response.statusText})\n${details}`);
    }

    fail(error.message);
  }
})();
