'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const axios = require('axios');

const TOKEN_URL = process.env.DYNATRACE_OAUTH_TOKEN_URL;
const CLIENT_ID = process.env.DYNATRACE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.DYNATRACE_OAUTH_CLIENT_SECRET;
const RESOURCE = process.env.DYNATRACE_OAUTH_RESOURCE;
const SCOPE = process.env.DYNATRACE_ACCOUNT_AUDIT_SCOPE || 'account-audit-logs-read';

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!TOKEN_URL || !CLIENT_ID || !CLIENT_SECRET || !RESOURCE) {
  fail('Missing OAuth settings. Required: DYNATRACE_OAUTH_TOKEN_URL, DYNATRACE_OAUTH_CLIENT_ID, DYNATRACE_OAUTH_CLIENT_SECRET, DYNATRACE_OAUTH_RESOURCE');
}

function getAccountUuidFromResource(resource) {
  const m = /^urn:dtaccount:([a-f0-9-]+)$/i.exec((resource || '').trim());
  if (!m) {
    fail('DYNATRACE_OAUTH_RESOURCE must look like urn:dtaccount:<account-uuid>');
  }
  return m[1];
}

async function getBearerToken() {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    resource: RESOURCE,
    scope: SCOPE
  });

  const tokenResponse = await axios.post(TOKEN_URL, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 30000
  });

  if (!tokenResponse.data?.access_token) {
    fail('OAuth token response missing access_token');
  }

  return tokenResponse.data.access_token;
}

(async () => {
  try {
    const accountUuid = getAccountUuidFromResource(RESOURCE);
    const token = await getBearerToken();
    const endpoint = `https://api.dynatrace.com/audit/v1/accounts/${accountUuid}`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      },
      timeout: 30000
    });

    const data = response.data || {};
    const logs = Array.isArray(data.audits) ? data.audits : (Array.isArray(data.auditLogs) ? data.auditLogs : []);
    const first = logs[0] || null;

    console.log(JSON.stringify({
      endpoint,
      requestedScope: SCOPE,
      topLevelKeys: Object.keys(data),
      totalCount: data.totalCount ?? null,
      nextPageKey: data.nextPageKey ?? null,
      recordsInThisResponse: logs.length,
      firstRecordKeys: first ? Object.keys(first) : [],
      firstRecordSample: first
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
