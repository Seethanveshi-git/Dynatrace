const axios = require("axios");
require("dotenv").config();

const ENV_URL = process.env.DT_ENV_URL;
const API_TOKEN = process.env.DT_API_TOKEN;
const SERVICE_ID_1 = process.env.DT_SERVICE_ID_1;
const SERVICE_ID_2 = process.env.DT_SERVICE_ID_2;
const SERVICE_ID_3 = process.env.DT_SERVICE_ID_3;

if (!ENV_URL || !API_TOKEN || !SERVICE_ID_1 || !SERVICE_ID_2 || !SERVICE_ID_3) {
  throw new Error("Missing DT_ENV_URL, DT_API_TOKEN, or DT_SERVICE_ID_1/2/3 in .env");
}

const services = [
  {
    serviceId: SERVICE_ID_1,
    endpoints: ["/api/auth/login", "/api/auth/signup"]
  },
  {
    serviceId: SERVICE_ID_2,
    endpoints: ["/api/expense", "/api/expense/1"]
  },
  {
    serviceId: SERVICE_ID_3,
    endpoints: ["/api/group", "/api/group/1"]
  }
];

async function createKeyRequests() {
  const payload = services.flatMap((service) =>
    service.endpoints.map((endpoint) => ({
      schemaId: "builtin:settings.subscriptions.service",
      scope: service.serviceId,
      value: {
        keyRequestNames: [endpoint]
      }
    }))
  );

  const response = await axios.post(`${ENV_URL}/api/v2/settings/objects`, payload, {
    headers: {
      Authorization: `Api-Token ${API_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  console.log(JSON.stringify(response.data, null, 2));
}

createKeyRequests().catch((error) => {
  console.error(JSON.stringify(error.response?.data || error.message, null, 2));
});
