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
    console.log("analysing ", key);
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
  // const packageJson = parse(fs.readFileSync("./package.json", "utf-8"));
  const jsonWithComments = parse(
    fs.readFileSync(jsonWithCommentsFilePath, "utf-8")
  );

  // const obj = assign(packageJson, jsonWithComments);

  // console.log(inspect(jsonWithComments, { showHidden: true }));

  // const syms = Object.getOwnPropertySymbols(jsonWithComments.scripts);

  // for (sym of syms) {
  //   console.log(
  //     "jsonWithComments.scripts[sym]",
  //     jsonWithComments.scripts[sym]
  //   );
  // }
  console.log("\n\nstarting to extract symbols... \n");
  const exportJson = extractSymbols(jsonWithComments);
  // console.log("exportJson", exportJson);

  console.log(`writing file ${jomFilePath}`);
  fs.writeFileSync(
    jomFilePath,
    `${generatePreamble(jsonFilePath)}${JSON.stringify(exportJson, null, 2)}`
  );

  console.log(`writing file ${jsonFilePath}`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonWithComments, null, 2));
}
