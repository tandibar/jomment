import fs from "fs";
import { parse } from "comment-json";
import generatePreamble from "./generate-preamble.js";

function extractSymbols(jsonWithSymbols) {
  const syms = Object.getOwnPropertySymbols(jsonWithSymbols);

  let symsJson;
  if (syms.length > 0) {
    symsJson = {};
    for (const sym of syms) {
      symsJson[`###SYM###-${sym.toString()}`] = jsonWithSymbols[sym];
    }
  }

  for (const key in jsonWithSymbols) {
    if (jsonWithSymbols[key] instanceof Object) {
      const extracedSymbols = extractSymbols(jsonWithSymbols[key]);
      if (extracedSymbols) {
        symsJson[key] = extracedSymbols;
      }
    }
  }

  return symsJson;
}

export default function (jsonFilePath, jomFilePath, jsonWithCommentsFilePath) {
  const jsonWithComments = parse(
    fs.readFileSync(jsonWithCommentsFilePath, "utf-8")
  );

  console.log("starting to extract symbols...");
  const exportJson = extractSymbols(jsonWithComments);

  console.log(`writing jom file ${jomFilePath}`);
  fs.writeFileSync(
    jomFilePath,
    `${generatePreamble(jsonFilePath)}${JSON.stringify(exportJson, null, 2)}`
  );

  console.log(`writing json file ${jsonFilePath}`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonWithComments, null, 2));
}
