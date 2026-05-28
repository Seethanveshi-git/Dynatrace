const axios = require('axios');
require('dotenv').config();

const ENV_URL = process.env.DT_ENV_URL;
const API_TOKEN = process.env.DT_API_TOKEN;

if (!ENV_URL || !API_TOKEN) {
  throw new Error('Missing DT_ENV_URL or DT_API_TOKEN in .env');
}

async function getClusterVersion() {
  try {
    const response = await axios.get(`${ENV_URL}/api/v1/config/clusterversion`, {
      headers: {
        Authorization: `Api-Token ${API_TOKEN}`,
        Accept: 'application/json'
      }
    });

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error fetching cluster version:', error.response?.data || error.message);
  }
}

getClusterVersion();
