  'use strict';

  const { axios, getPlatformBaseUrl, resolveBearerToken, fail } = require('../auth');

  (async () => {
    try {
      const base = getPlatformBaseUrl();
      const token = await resolveBearerToken();
      const endpoint = new URL('/platform/document/v1/documents', base);
      endpoint.searchParams.set('filter', "type='dashboard' and owner='d5d75e3a-b5f4-4b0d-8170-b1182eac1c55'");

      const response = await axios.get(endpoint.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
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

