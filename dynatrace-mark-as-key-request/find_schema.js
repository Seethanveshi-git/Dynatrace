const axios = require('axios');
require('dotenv').config();

const DT_ENV_URL = process.env.DT_ENV_URL;
const API_TOKEN = process.env.DT_API_TOKEN;

if (!DT_ENV_URL || !API_TOKEN) {
  throw new Error('Missing DT_ENV_URL or DT_API_TOKEN in .env');
}

async function getValidationRules() {
  try {
    const response = await axios.get(
      `${DT_ENV_URL}/api/v2/settings/schemas/builtin:service-detection.full-web-request`,
      { headers: { Authorization: `Api-Token ${API_TOKEN}` } }
    );

    const properties = response.data.properties;
    console.log('--- ALLOWED OPERATORS ---');
    console.log(properties.conditions.items.properties.compareOperationType.enum);
    console.log('\n--- MANDATORY FIELDS ---');
    console.log(response.data.required);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

getValidationRules();
