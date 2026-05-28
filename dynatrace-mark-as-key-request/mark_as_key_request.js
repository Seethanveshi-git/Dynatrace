const axios = require('axios');
require('dotenv').config();

const ENV_URL = process.env.DT_ENV_URL;
const API_TOKEN = process.env.DT_API_TOKEN;

if (!ENV_URL || !API_TOKEN) {
  throw new Error('Missing DT_ENV_URL or DT_API_TOKEN in .env');
}

const services = [
  { serviceName: 'frontend', endpoints: ['/api/auth/login', '/api/auth/signup'] },
  { serviceName: 'ExpenseController', endpoints: ['/api/expense', '/api/expense/1'] },
  { serviceName: 'GroupController', endpoints: ['/api/group', '/api/group/1'] }
];

async function getServiceIdByName(serviceName) {
  const response = await axios.get(`${ENV_URL}/api/v2/entities`, {
    params: {
      entitySelector: `type("SERVICE"),entityName("${serviceName}")`,
      fields: 'firstSeenTms,lastSeenTms,properties'
    },
    headers: { Authorization: `Api-Token ${API_TOKEN}` }
  });

  const entities = response.data.entities || [];
  if (!entities.length) throw new Error(`Service not found: ${serviceName}`);

  entities.sort((a, b) => b.firstSeenTms - a.firstSeenTms);
  return entities[0].entityId;
}

async function createKeyRequests() {
  try {
    const payload = [];

    for (const service of services) {
      const serviceId = await getServiceIdByName(service.serviceName);
      payload.push({
        schemaId: 'builtin:settings.subscriptions.service',
        scope: serviceId,
        value: { keyRequestNames: service.endpoints }
      });
    }

    const response = await axios.post(`${ENV_URL}/api/v2/settings/objects`, payload, {
      headers: {
        Authorization: `Api-Token ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(JSON.stringify(error.response?.data || error.message, null, 2));
  }
}

createKeyRequests();
