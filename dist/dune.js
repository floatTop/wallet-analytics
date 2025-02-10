"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/dune.ts
var import_fs = __toESM(require("fs"));
var apiKey = "EH6BsEYQOgXobDxQDLMJu76BjwubBjWZ";
async function dune() {
  const data = await fetchDuneData({
    queryId: 4147755,
    limit: 2e3,
    sort_by: "wins_2x desc"
  });
  debugger;
  import_fs.default.writeFileSync(
    `output/dune.json`,
    JSON.stringify(data.map((item) => item.wallet), null, 2)
  );
}
async function fetchDuneData(config) {
  const queryParams = new URLSearchParams({
    limit: "1000"
    // sort_by: config.sort_by,
  });
  const url = `https://api.dune.com/api/v1/query/${config.queryId}/results?${queryParams}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Dune-API-Key": apiKey
    }
  }).then((response2) => {
    if (!response2.ok) {
      throw new Error(`HTTP error! Status: ${response2.status}`);
    }
    return response2.json();
  });
  const data = response.result.rows;
  return data;
}
dune();
