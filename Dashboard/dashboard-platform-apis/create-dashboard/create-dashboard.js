'use strict';

const fs = require('fs');
const { axios, getPlatformBaseUrl, resolveBearerToken, fail } = require('../auth');

const PAYLOAD_PATH = process.env.DYNATRACE_DOCUMENT_PAYLOAD_PATH || './create-document-payload.json';
if (!fs.existsSync(PAYLOAD_PATH)) fail(`Payload file not found: ${PAYLOAD_PATH}`);

(async () => {
  try {
    const payload = JSON.parse(fs.readFileSync(PAYLOAD_PATH, 'utf8'));
    const base = getPlatformBaseUrl();
    const token = await resolveBearerToken();
    const endpoint = new URL('/platform/document/v1/documents', base);

    const response = await axios.post(endpoint.toString(), payload, {
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
