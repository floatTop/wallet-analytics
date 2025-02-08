"use strict";

// src/dune.ts
function dune() {
  const apiKey = "EH6BsEYQOgXobDxQDLMJu76BjwubBjWZ";
  const url = "https://api.dune.com/api/v1/query/3792656/results?limit=1000";
  fetch(url, {
    method: "GET",
    headers: {
      "X-Dune-API-Key": apiKey
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }).then((data) => console.log(data)).catch((error) => console.error("Error fetching data:", error));
}
dune();
