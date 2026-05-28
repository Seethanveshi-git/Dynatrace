curl -X POST "${DT_ENV_URL}/api/v2/settings/objects" \
-H "Authorization: Api-Token ${DT_API_TOKEN}" \
-H "Content-Type: application/json" \
-d '[
  {
    "schemaId": "builtin:service.key-request",
    "scope": "'"${DT_SERVICE_ID}"'",
    "value": {
      "enabled": true,
      "requestName": "Auth APIs",
      "conditions": [
        {
          "attribute": "REQUEST_NAME",
          "comparisonInfo": {
            "type": "STRING",
            "operator": "STARTS_WITH",
            "value": "/api/auth/"
          }
        }
      ]
    }
  }
]'
