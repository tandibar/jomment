import fs from "fs";
import { parse } from "comment-json";
import generatePreamble from "./generate-preamble.js";
import debug from "debug";

const debugLogger = debug("jomment");

function extractSymbols(jsonWithSymbols) {
  const syms = Object.getOwnPropertySymbols(jsonWithSymbols);

  let symsJson = {};
  if (syms.length > 0) {
    for (const sym of syms) {
      symsJson[`###SYM###-${sym.toString()}`] = jsonWithSymbols[sym];
    }
  }

  for (const key in jsonWithSymbols) {
    debugLogger("analysing ", key);
    if (jsonWithSymbols[key] instanceof Object) {
      const extracedSymbols = extractSymbols(jsonWithSymbols[key]);
      if (extracedSymbols) {
        debugLogger(
          `found symbols in ${key}: ${Object.keys(extracedSymbols).join(", ")}`
        );
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

  debugLogger("starting to extract symbols...");
  const exportJson = extractSymbols(jsonWithComments);

  debugLogger(`writing jom file ${jomFilePath}`);
  fs.writeFileSync(
    jomFilePath,
    `${generatePreamble(jsonFilePath)}${JSON.stringify(exportJson, null, 2)}`
  );

  debugLogger(`writing json file ${jsonFilePath}`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonWithComments, null, 2));
}
