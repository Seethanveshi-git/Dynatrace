const axios = require('axios');
require('dotenv').config();

const ENV_URL = process.env.DT_ENV_URL;
const API_TOKEN = process.env.DT_API_TOKEN;

if (!ENV_URL || !API_TOKEN) {
  throw new Error('Missing DT_ENV_URL or DT_API_TOKEN in .env');
}

async function getServices() {
  try {
    const response = await axios.get(`${ENV_URL}/api/v2/entities`, {
      headers: {
        Authorization: `Api-Token ${API_TOKEN}`,
        Accept: 'application/json'
      },
      params: {
        entitySelector: 'type(SERVICE)'
      }
    });

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Request Error:', error.message);
    }
  }
}

getServices();
