'use strict';

const { axios, getPlatformBaseUrl, resolveBearerToken, fail } = require('../auth');

const DOCUMENT_ID = "82794780-6d27-4f9e-a6d9-efa12cb37b7e";

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseMultipartBody(rawBody, contentType) {
  const boundaryMatch = /boundary=([^;]+)/i.exec(contentType || '');
  if (!boundaryMatch) return null;

  const boundary = boundaryMatch[1].trim();
  const marker = `--${boundary}`;
  const parts = rawBody.split(marker);
  const result = {};

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || trimmed === '--') continue;

    const sections = part.split('\r\n\r\n');
    if (sections.length < 2) continue;

    const headersBlock = sections[0];
    const bodyBlock = sections.slice(1).join('\r\n\r\n').replace(/\r\n--\s*$/, '').trim();

    const nameMatch = /name="([^"]+)"/i.exec(headersBlock);
    if (!nameMatch) continue;

    const fieldName = nameMatch[1];
    result[fieldName] = safeJsonParse(bodyBlock);
  }

  return result;
}

(async () => {
  try {
    const base = getPlatformBaseUrl();
    const token = await resolveBearerToken();
    const endpoint = new URL(`/platform/document/v1/documents/${encodeURIComponent(DOCUMENT_ID)}`, base);

    const response = await axios.get(endpoint.toString(), {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'text',
      timeout: 30000,
      transformResponse: [(data) => data]
    });

    const contentType = response.headers['content-type'] || '';
    if (contentType.toLowerCase().includes('multipart/form-data')) {
      const parsed = parseMultipartBody(response.data, contentType);
      if (parsed) {
        console.log(JSON.stringify(parsed, null, 2));
        return;
      }
    }

    console.log(JSON.stringify(safeJsonParse(response.data), null, 2));
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
