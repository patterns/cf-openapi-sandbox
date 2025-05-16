GET https://scn-api-playground.hsinih.workers.dev/api/sites
X-API-Key: placeholder
[Query]
page: 1
HTTP 200
[Asserts]
jsonpath "$.success" == true
