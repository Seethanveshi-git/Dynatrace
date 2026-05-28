'use strict';

const { axios, getPlatformBaseUrl, resolveBearerToken, fail } = require('../auth');

const DOCUMENT_ID = "a0937ce0-2501-4274-a718-5855a3f9d0bc";
if (!DOCUMENT_ID) fail('Missing DYNATRACE_DOCUMENT_ID in .env');

function getDocumentVersion(payload) {
  if (!payload) return null;
  if (payload.metadata && Number.isInteger(payload.metadata.version)) {
    return payload.metadata.version;
  }
  if (Number.isInteger(payload.version)) {
    return payload.version;
  }
  return null;
}

(async () => {
  try {
    const base = getPlatformBaseUrl();
    const token = await resolveBearerToken();

    const getEndpoint = new URL(`/platform/document/v1/documents/${encodeURIComponent(DOCUMENT_ID)}`, base);
    const getResponse = await axios.get(getEndpoint.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'text',
      timeout: 30000,
      transformResponse: [(data) => data]
    });

    let version = null;
    try {
      const parsed = JSON.parse(getResponse.data);
      version = getDocumentVersion(parsed);
    } catch {
      const metadataMatch = /name="metadata"[\s\S]*?\r\n\r\n([\s\S]*?)\r\n--/m.exec(getResponse.data || '');
      if (metadataMatch && metadataMatch[1]) {
        const metadata = JSON.parse(metadataMatch[1]);
        version = getDocumentVersion({ metadata });
      }
    }

    if (!Number.isInteger(version)) {
      fail('Could not determine dashboard version for optimistic locking.');
    }

    const deleteEndpoint = new URL(`/platform/document/v1/documents/${encodeURIComponent(DOCUMENT_ID)}`, base);
    deleteEndpoint.searchParams.set('optimistic-locking-version', String(version));

    await axios.delete(deleteEndpoint.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      },
      timeout: 30000
    });

    console.log(JSON.stringify({
      status: 'deleted',
      documentId: DOCUMENT_ID,
      optimisticLockingVersionUsed: version
    }, null, 2));
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
