'use strict';

const { axios, getPlatformBaseUrl, resolveBearerToken, fail } = require('./auth');

(async () => {
  try {
    const base = getPlatformBaseUrl();
    const token = await resolveBearerToken();
    const endpoint = new URL('/platform/storage/query/v1/query:execute', base);
    
    // DQL to look back over the last 24 hours for interactions with your specific dashboard ID
    const dqlQuery = {
      query: `fetch logs, from:now()-24h
              | filter contains(log.source, "audit") or contains(content, "82794780-6d27-4f9e-a6d9-efa12cb37b7e")
              | fields timestamp, content, log.source
              | limit 10`
    };

    console.log("Querying Grail for your dashboard view event today...");

    const response = await axios.post(endpoint.toString(), dqlQuery, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json',
        Accept: 'application/json' 
      },
      timeout: 30000
    });

    const records = response.data.results || [];
    
    console.log('\n======================================================');
    console.log('GRAIL AUDIT LOG VERIFICATION RESULTS:');
    console.log('======================================================');
    console.log(`Found ${records.length} access log entries in the last 24 hours.\n`);

    if (records.length > 0) {
      records.forEach((log, index) => {
        console.log(`[Entry #${index + 1}]`);
        console.log(`  > Time Opened:   ${log.timestamp}`);
        console.log(`  > Action Type:   ${log['event.action']}`);
        console.log(`  > Dashboard:     ${log['document.name']}`);
        console.log(`  > Accessed By:   ${log['request.user_id'] || 'Authenticated User'}`);
        console.log('------------------------------------------------------');
      });
    } else {
      console.log("[!] No view events found in the audit log for this timeframe.");
      console.log("Ensure your OAuth client has the 'storage:logs:read' or 'storage:events:read' permission.");
    }

  } catch (error) {
    if (error.response) {
      console.error("Error Response Data:", error.response.data);
    }
    fail(error.message);
  }
})();