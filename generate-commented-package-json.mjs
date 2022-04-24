import fs from "fs";
import openEditor from "./open-editor-mod.mjs";
import { parse, stringify, assign } from "comment-json";
import { inspect } from "util";

// const packageJson = parse(fs.readFileSync("./package.json", "utf-8"));
const packageJsonExtractedComments = JSON.parse(
  fs.readFileSync("./package.json.comments", "utf-8")
);

const SYM_PREFIX = "###SYM###-";

function createSymbols(jsonWithEncodedSymbols, packageJson) {
  console.log("packageJson", packageJson);
  for (const key in jsonWithEncodedSymbols) {
    if (key.startsWith(SYM_PREFIX)) {
      console.log("found symbol: ", key);
      const symbolString = key.slice(SYM_PREFIX.length);
      // console.log("symbolString", symbolString);
      const match = symbolString.match(/Symbol\((.*?)\)/);
      // console.log("match", match);
      const symbolName = match[1];
      console.log("symbolName", symbolName);
      console.log("symbolValue", jsonWithEncodedSymbols[key]);
      packageJson[Symbol.for(symbolName)] = jsonWithEncodedSymbols[key];
    } else {
      if (jsonWithEncodedSymbols[key] instanceof Object) {
        console.log("start --- search recursive in", key);
        createSymbols(jsonWithEncodedSymbols[key], packageJson[key]);
        console.log("end --- search recursive in", key);
        // console.log("subSymbls", subSymbls);
        // console.log(`symbols[${key}]`);
        // if (subSymbls) {
        //   packageJson[key] = subSymbls;
        // }
      } else {
        console.log("I think this case should never happen!!!!!!!!!!!!!!!");
      }
    }
  }
}

const packageJson = parse(fs.readFileSync("./package.json", "utf-8"));
const commentedPackageJson = createSymbols(
  packageJsonExtractedComments,
  packageJson
);

// const commentedPackageJson = assign(packageJson, onlyComments);
// const commentedPackageJson = merge(packageJson, onlyComments);

// console.log("packageJson", stringify(packageJson, null, 2));

const jsoncFileName = "package.jomment.tmp.jsonc";

fs.writeFileSync(jsoncFileName, stringify(packageJson, null, 2));

openEditor([
  {
    file: jsoncFileName,
  },
], { wait: true }).then(() => {
  console.log("now we can reparse")
});
