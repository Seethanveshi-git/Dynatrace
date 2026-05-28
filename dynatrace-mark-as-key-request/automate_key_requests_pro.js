const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const ENV_URL = process.env.DT_ENV_URL;
const API_TOKEN = process.env.DT_API_TOKEN;
const NAMESPACE = process.env.DT_NAMESPACE || "my-namespace";
const CSV_FILE = process.env.CSV_FILE || "./services.csv";

if (!ENV_URL || !API_TOKEN) {
    throw new Error("Missing DT_ENV_URL or DT_API_TOKEN in .env");
}


function parseCSV(csvFilePath) {
    try {
        const fileContent = fs.readFileSync(path.resolve(csvFilePath), "utf-8");
        const lines = fileContent.split(/\r?\n/);

        if (lines.length < 2) return [];
        const headers = lines[0].split(",").map(header => header.trim());
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(",").map(val => val.trim());
            const rowObject = {};

            headers.forEach((header, index) => {
                rowObject[header] = values[index] || "";
            });

            rows.push(rowObject);
        }

        return rows;
    } catch (error) {
        console.error("Failed to parse CSV:", error.message);
        process.exit(1);
    }
}

async function getServiceId(workloadName, targetNamespace) {
    try {

        const workloadResponse = await axios.get(`${ENV_URL}/api/v2/entities`, {
            params: {
                entitySelector: `type("CLOUD_APPLICATION"),entityName("${workloadName}")`,
                fields: "properties"
            },
            headers: { Authorization: `Api-Token ${API_TOKEN}` }
        });

        const workloads = workloadResponse.data.entities || [];
        // console.log(workloads);

        const correctWorkload = workloads.find(w => w.properties?.namespaceName === targetNamespace);
        if (!correctWorkload) {
            throw new Error(`Deployment '${workloadName}' not found in namespace '${targetNamespace}'`);
        }

        const workloadId = correctWorkload.entityId;

        const serviceResponse = await axios.get(`${ENV_URL}/api/v2/entities`, {
            params: {
                entitySelector: `type("SERVICE"),fromRelationships.isServiceOf(entityId("${workloadId}"))`,
                from: "now-24h"
            },
            headers: { Authorization: `Api-Token ${API_TOKEN}` }
        });

        let entities = serviceResponse.data.entities || [];

        entities = entities.filter(e => !e.displayName.includes("background threads"));

        if (entities.length === 0) {
            throw new Error(`No monitored service found running on workload '${workloadName}'`);
        }

        const bestMatch = entities[0];
        console.log(`\n ${workloadName} (${targetNamespace}) -> Service ID: ${bestMatch.entityId} \n`);
        return bestMatch.entityId;

    } catch (error) {
        console.error(`Error for ${workloadName}:`, error.message);
        return null;
    }
}


async function createKeyRequests() {
    try {
        console.log(`Loading services from: ${CSV_FILE}...`);
        const rawRows = parseCSV(CSV_FILE);

        if (rawRows.length === 0) {
            console.log("CSV file is empty or has no data.");
            return;
        }

        const workloadMap = {};
        rawRows.forEach(row => {
            if (!workloadMap[row.workloadName]) {
                workloadMap[row.workloadName] = [];
            }
            if (row.endpoint) {
                workloadMap[row.workloadName].push(row.endpoint);
            }
        });

        const payload = [];
        for (const workloadName of Object.keys(workloadMap)) {
            console.log(`\nProcessing workload: ${workloadName}...`);

            const serviceId = await getServiceId(workloadName, NAMESPACE);

            if (serviceId) {
                payload.push({
                    schemaId: "builtin:settings.subscriptions.service",
                    scope: serviceId,
                    value: {
                        keyRequestNames: workloadMap[workloadName]
                    }
                });
            }
        }

        if (payload.length === 0) {
            console.log("\n No valid Service IDs found. Payload generation skipped.");
            return;
        }

        const response = await axios.post(
            `${ENV_URL}/api/v2/settings/objects`,
            payload,
            {
                headers: {
                    Authorization: `Api-Token ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("\nFINAL SUCCESS: Key Requests created in Dynatrace");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error(
            "\nFINAL ERROR:",
            JSON.stringify(error.response?.data || error.message, null, 2)
        );
    }
}

createKeyRequests();

