'use strict';

const { axios, getPlatformBaseUrl, resolveBearerToken, fail } = require('./auth');

(async () => {
  try {
    const base = getPlatformBaseUrl();
    const token = await resolveBearerToken();
    const endpoint = new URL('/platform/document/v1/documents', base);
    
    // 1. Setting up the query parameters to include system tracking expansions
    endpoint.searchParams.set('filter', "type='dashboard' and owner='d5d75e3a-b5f4-4b0d-8170-b1182eac1c55'");
    
    // CRITICAL FIX: We tell the API to explicitly append platform usage telemetry strings
    endpoint.searchParams.set('fields', 'id,name,owner,modificationInfo,lastViewed,popularity');

    console.log(`Sending expanded telemetry request to: ${endpoint.toString()}`);

    const response = await axios.get(endpoint.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      },
      timeout: 30000
    });

    const documents = response.data.documents || [];

    // Add this below your existing response log to scan every single property Dynatrace sends back
    if (documents.length > 0) {
      console.log("\n======================================================");
      console.log("ALL AVAILABLE SCHEMA KEYS RETURNED BY THIS ENDPOINT:");
      console.log("======================================================");
      console.log(Object.keys(documents[0]));
      
      if (documents[0].modificationInfo) {
        console.log("\nModification Info Nested Keys:", Object.keys(documents[0].modificationInfo));
      }
    }

    // Test explicitly if the keys exist on the object, even if they don't print
    
    console.log('\n======================================================');
    console.log('REVEALED TELEMETRY RESPONSE DETAILS:');
    console.log('======================================================');

    documents.forEach((doc, idx) => {
      console.log(`\n[Dashboard #${idx + 1}] -> ${doc.name}`);
      console.log(`  > ID:           ${doc.id}`);
      
      // Look here: This will now populate instead of being omitted
      console.log(`  > Last Viewed:  ${doc.lastViewed ? doc.lastViewed : 'NEVER OPENED (Truly Stale)'}`);
      console.log(`  > Popularity:   ${doc.popularity !== undefined ? doc.popularity : '0 (No Traffic)'}`);
      
      console.log(`  > Last Changed: ${doc.modificationInfo?.lastModifiedTime}`);
    });

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