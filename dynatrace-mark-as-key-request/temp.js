const axios = require("axios");
require("dotenv").config();

const ENV_URL = process.env.DT_ENV_URL;
const API_TOKEN = process.env.DT_API_TOKEN;

if (!ENV_URL || !API_TOKEN) {
  throw new Error("Missing DT_ENV_URL or DT_API_TOKEN in .env");
}

async function debugServicesByName(serviceName) {
  const response = await axios.get(`${ENV_URL}/api/v2/entities`, {
    params: {
      entitySelector: `type("SERVICE"),entityName("${serviceName}")`,
      fields: "firstSeenTms,lastSeenTms,properties"
    },
    headers: {
      Authorization: `Api-Token ${API_TOKEN}`
    }
  });

  const entities = response.data.entities || [];

  entities.forEach((entity) => {
    console.log(`Service name: ${serviceName}`);
    console.log(`ID: ${entity.entityId}`);
    console.log(`First Seen: ${new Date(entity.firstSeenTms).toLocaleString()}`);
    console.log(`Last Seen: ${new Date(entity.lastSeenTms).toLocaleString()}`);
    console.log("---");
  });
}

debugServicesByName("frontend").catch((error) => {
  console.error(JSON.stringify(error.response?.data || error.message, null, 2));
});
